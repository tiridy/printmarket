import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { producer_id } = await request.json()
    if (!producer_id) return NextResponse.json({ error: 'producer_id gerekli' }, { status: 400 })

    // Service role client — RLS bypass ile storage'a erişim
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Profili çek
    const { data: profile, error: profileErr } = await supabase
      .from('producer_profiles')
      .select('*')
      .eq('id', producer_id)
      .single()

    if (profileErr || !profile) {
      return NextResponse.json({ error: 'Profil bulunamadı' }, { status: 404 })
    }

    if (!profile.vergi_levhasi_url) {
      return NextResponse.json({ error: 'Vergi levhası yüklenmemiş' }, { status: 400 })
    }

    // Status → pending (inceleme başladı)
    await supabase
      .from('producer_profiles')
      .update({ verification_status: 'pending' })
      .eq('id', producer_id)

    // Storage'dan dosyayı indir
    const filePath = profile.vergi_levhasi_url.split('/documents/')[1]
    const { data: fileData, error: fileErr } = await supabase.storage
      .from('documents')
      .download(filePath)

    if (fileErr || !fileData) {
      await supabase.from('producer_profiles').update({
        verification_status: 'rejected',
        verification_note: 'Belge indirilemedi. Lütfen tekrar yükleyin.',
      }).eq('id', producer_id)
      return NextResponse.json({ error: 'Dosya indirilemedi' }, { status: 500 })
    }

    // Base64'e çevir
    const buffer = await fileData.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const fileName = filePath.split('/').pop() ?? ''
    const isPdf = fileName.toLowerCase().endsWith('.pdf')
    const mediaType = isPdf ? 'application/pdf' : 'image/jpeg'

    const isSahis = profile.business_type === 'sahis'
    const identityLabel = isSahis ? 'TCKN (T.C. Kimlik Numarası, 11 hane)' : 'VKN (Vergi Kimlik Numarası, 10 hane)'
    const identityValue = isSahis ? profile.tckn : profile.vkn

    // Claude ile analiz
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: [
            isPdf
              ? { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } }
              : { type: 'image', source: { type: 'base64', media_type: mediaType as 'image/jpeg', data: base64 } },
            {
              type: 'text',
              text: `Bu belge bir Türk vergi levhasıdır. Aşağıdaki bilgileri belgeden bul ve karşılaştır.

Kullanıcının girdiği bilgiler:
- İşletme türü: ${isSahis ? 'Şahıs Şirketi' : 'Tüzel Kişi'}
- ${identityLabel}: ${identityValue}
- Vergi Dairesi: ${profile.vergi_dairesi}

Görevin:
1. Belgeden ${identityLabel} numarasını bul.
2. Belgeden vergi dairesini bul.
3. Kullanıcının girdiği numara ile belgede yazanı karşılaştır (büyük/küçük harf ve boşluk farkı yok say).

Yanıtını SADECE aşağıdaki JSON formatında ver, başka hiçbir şey yazma:
{
  "number_in_doc": "belgede bulunan numara veya null",
  "vergi_dairesi_in_doc": "belgede bulunan vergi dairesi veya null",
  "number_match": true/false,
  "is_valid_tax_doc": true/false,
  "reason": "kısa Türkçe açıklama"
}`,
            },
          ],
        },
      ],
    })

    // Yanıtı parse et
    const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : ''
    console.log('[verify-producer] Claude yanıtı:', raw)

    let parsed: {
      number_match: boolean
      is_valid_tax_doc: boolean
      reason: string
      number_in_doc?: string
      vergi_dairesi_in_doc?: string
    }

    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw)
    } catch {
      await supabase.from('producer_profiles').update({
        verification_status: 'rejected',
        verification_note: 'Belge okunamadı. Lütfen daha net bir görsel yükleyin.',
      }).eq('id', producer_id)
      return NextResponse.json({ error: 'Belge analiz edilemedi' }, { status: 422 })
    }

    const approved = parsed.is_valid_tax_doc && parsed.number_match

    await supabase.from('producer_profiles').update({
      verification_status: approved ? 'approved' : 'rejected',
      verification_note: parsed.reason,
      verified_at: approved ? new Date().toISOString() : null,
    }).eq('id', producer_id)

    return NextResponse.json({
      status: approved ? 'approved' : 'rejected',
      note: parsed.reason,
    })
  } catch (err) {
    console.error('[verify-producer] hata:', err)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
