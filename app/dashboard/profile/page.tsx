'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../utils/supabase'
import { User } from '@supabase/supabase-js'

interface UserProfile { full_name: string; phone: string; role: string }

interface ProducerProfile {
  id?: string
  company_name: string; description: string; location: string
  contact_info: { website?: string; phone?: string }
  business_type: 'sahis' | 'tuzel' | ''
  tckn: string; vkn: string; vergi_dairesi: string; ticaret_unvani: string
  verification_status: string; verification_note: string; vergi_levhasi_url: string
}

type VerifStatus = 'unverified' | 'pending' | 'approved' | 'rejected'

const VERIF_UI: Record<VerifStatus, { label: string; icon: string; cls: string }> = {
  unverified: { label: 'Doğrulama bekleniyor',    icon: '⏳', cls: 'bg-slate-700/50 text-slate-300 border-slate-600' },
  pending:    { label: 'İnceleniyor...',           icon: '🔍', cls: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
  approved:   { label: 'Doğrulandı ✓',            icon: '✅', cls: 'bg-green-500/10 text-green-400 border-green-500/30' },
  rejected:   { label: 'Doğrulama başarısız',      icon: '❌', cls: 'bg-red-500/10 text-red-400 border-red-500/30' },
}

function InputField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1.5">
        {label} {required && <span className="text-orange-400">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = "w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition"
const disabledCls = "w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-slate-400 text-sm cursor-not-allowed"

export default function ProfilePage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [userProfile, setUserProfile] = useState<UserProfile>({ full_name: '', phone: '', role: '' })
  const [pp, setPp] = useState<ProducerProfile>({
    company_name: '', description: '', location: '',
    contact_info: { website: '', phone: '' },
    business_type: '', tckn: '', vkn: '', vergi_dairesi: '', ticaret_unvani: '',
    verification_status: 'unverified', verification_note: '', vergi_levhasi_url: '',
  })

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      const { data: profile } = await supabase.from('users').select('full_name, phone, role').eq('id', user.id).single()
      if (profile) {
        setRole(profile.role ?? '')
        setUserProfile({ full_name: profile.full_name ?? '', phone: profile.phone ?? '', role: profile.role ?? '' })
      }

      if (profile?.role === 'producer') {
        const { data } = await supabase.from('producer_profiles').select('*').eq('user_id', user.id).single()
        if (data) {
          setPp({
            id: data.id,
            company_name: data.company_name ?? '',
            description: data.description ?? '',
            location: data.location ?? '',
            contact_info: { website: data.contact_info?.website ?? '', phone: data.contact_info?.phone ?? '' },
            business_type: data.business_type ?? '',
            tckn: data.tckn ?? '',
            vkn: data.vkn ?? '',
            vergi_dairesi: data.vergi_dairesi ?? '',
            ticaret_unvani: data.ticaret_unvani ?? '',
            verification_status: data.verification_status ?? 'unverified',
            verification_note: data.verification_note ?? '',
            vergi_levhasi_url: data.vergi_levhasi_url ?? '',
          })
        }
      }
      setLoading(false)
    }
    init()
  }, [router])

  const validate = (): string | null => {
    if (role !== 'producer') return null
    if (!pp.business_type) return 'Lütfen işletme türünü seçin.'
    if (pp.business_type === 'sahis') {
      if (!pp.tckn) return 'TCKN zorunludur.'
      if (!/^\d{11}$/.test(pp.tckn)) return 'TCKN 11 haneli rakamlardan oluşmalıdır.'
    }
    if (pp.business_type === 'tuzel') {
      if (!pp.vkn) return 'Vergi Kimlik Numarası zorunludur.'
      if (!/^\d{10}$/.test(pp.vkn)) return 'VKN 10 haneli rakamlardan oluşmalıdır.'
      if (!pp.ticaret_unvani) return 'Ticaret ünvanı zorunludur.'
    }
    if (!pp.vergi_dairesi) return 'Vergi dairesi zorunludur.'
    if (!pp.company_name) return 'Firma adı zorunludur.'
    if (!selectedFile && !pp.vergi_levhasi_url) return 'Vergi levhası belgesi yüklenmesi zorunludur.'
    return null
  }

  const handleSave = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    const validErr = validate()
    if (validErr) { setError(validErr); return }

    setSaving(true); setError(null); setSuccess(false)

    // 1. Kullanıcı profili kaydet
    const { error: userErr } = await supabase.from('users')
      .update({ full_name: userProfile.full_name, phone: userProfile.phone, updated_at: new Date().toISOString() })
      .eq('id', user!.id)

    if (userErr) { setError(`Profil kaydedilemedi: ${userErr.message}`); setSaving(false); return }

    // 2. Vergi levhası yükle (yeni dosya seçildiyse)
    let levhaUrl = pp.vergi_levhasi_url
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop()
      const path = `${user!.id}/vergi-levhasi-${Date.now()}.${ext}`
      const { error: uploadErr } = await supabase.storage.from('documents').upload(path, selectedFile, { upsert: true })
      if (uploadErr) { setError(`Dosya yüklenemedi: ${uploadErr.message}`); setSaving(false); return }
      const { data: urlData } = supabase.storage.from('documents').getPublicUrl(path)
      levhaUrl = urlData.publicUrl
    }

    // 3. Üretici profili kaydet
    const payload = {
      user_id: user!.id,
      company_name: pp.company_name, description: pp.description, location: pp.location,
      contact_info: pp.contact_info,
      business_type: pp.business_type,
      tckn: pp.business_type === 'sahis' ? pp.tckn : null,
      vkn: pp.business_type === 'tuzel' ? pp.vkn : null,
      vergi_dairesi: pp.vergi_dairesi,
      ticaret_unvani: pp.business_type === 'tuzel' ? pp.ticaret_unvani : null,
      vergi_levhasi_url: levhaUrl,
      verification_status: 'pending',
    }

    const { data: savedPp, error: ppErr } = pp.id
      ? await supabase.from('producer_profiles').update(payload).eq('id', pp.id).select().single()
      : await supabase.from('producer_profiles').insert(payload).select().single()

    if (ppErr) { setError(`Firma profili kaydedilemedi: ${ppErr.message}`); setSaving(false); return }

    setPp(prev => ({ ...prev, id: savedPp.id, vergi_levhasi_url: levhaUrl, verification_status: 'pending' }))
    setSelectedFile(null)
    setSaving(false)

    // 4. AI doğrulama başlat
    setVerifying(true)
    try {
      const res = await fetch('/api/verify-producer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ producer_id: savedPp.id }),
      })
      const result = await res.json()
      setPp(prev => ({
        ...prev,
        verification_status: result.status ?? 'rejected',
        verification_note: result.note ?? '',
      }))
      setSuccess(result.status === 'approved')
    } catch {
      setPp(prev => ({ ...prev, verification_status: 'rejected', verification_note: 'Bağlantı hatası.' }))
    } finally {
      setVerifying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-600 border-t-orange-400" />
          Yükleniyor...
        </div>
      </div>
    )
  }

  const verifStatus = (pp.verification_status as VerifStatus) || 'unverified'
  const verifUI = VERIF_UI[verifStatus] ?? VERIF_UI.unverified

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/dashboard')} className="text-slate-400 hover:text-white transition-colors">← Geri</button>
            <span className="text-slate-600">|</span>
            <span className="text-xl font-bold tracking-tight text-orange-400">TİRİDY</span>
          </div>
          <span className="text-sm text-slate-400">Profil Ayarları</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Profil Ayarları</h1>
          <p className="mt-1 text-slate-400">Kişisel ve hesap bilgilerinizi düzenleyin.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Hesap */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Hesap Bilgileri</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">E-posta</label>
                <input type="text" value={user?.email ?? ''} disabled className={disabledCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Rol</label>
                <input type="text" value={role === 'customer' ? 'Müşteri' : 'Üretici'} disabled className={disabledCls} />
              </div>
            </div>
          </section>

          {/* Kişisel */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Kişisel Bilgiler</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField label="Ad Soyad">
                <input type="text" value={userProfile.full_name} placeholder="Adınız ve soyadınız"
                  onChange={e => setUserProfile(p => ({ ...p, full_name: e.target.value }))} className={inputCls} />
              </InputField>
              <InputField label="Telefon">
                <input type="tel" value={userProfile.phone} placeholder="+90 5xx xxx xx xx"
                  onChange={e => setUserProfile(p => ({ ...p, phone: e.target.value }))} className={inputCls} />
              </InputField>
            </div>
          </section>

          {/* Üretici bölümü */}
          {role === 'producer' && (
            <>
              {/* Doğrulama durumu */}
              <div className={`rounded-2xl border px-5 py-4 flex items-start gap-3 ${verifUI.cls}`}>
                <span className="text-xl mt-0.5">{verifUI.icon}</span>
                <div>
                  <p className="font-semibold text-sm">{verifUI.label}</p>
                  {pp.verification_note && (
                    <p className="mt-0.5 text-xs opacity-80">{pp.verification_note}</p>
                  )}
                  {verifStatus === 'unverified' && (
                    <p className="mt-0.5 text-xs opacity-70">Vergi levhanızı yükleyin ve profili kaydedin.</p>
                  )}
                  {verifStatus === 'pending' && (
                    <p className="mt-0.5 text-xs opacity-70">AI belgenizi inceliyor, lütfen bekleyin...</p>
                  )}
                  {verifStatus === 'approved' && (
                    <p className="mt-0.5 text-xs opacity-70">Paneliniz aktif. Tüm özelliklere erişebilirsiniz.</p>
                  )}
                  {verifStatus === 'rejected' && (
                    <p className="mt-0.5 text-xs opacity-70">Bilgileri düzeltin ve belgeyi yeniden yükleyin.</p>
                  )}
                </div>
              </div>

              {/* İşletme türü */}
              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">İşletme Türü</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { value: 'sahis', label: 'Şahıs Şirketi', desc: 'Gerçek kişi — TCKN ile', icon: '👤' },
                    { value: 'tuzel', label: 'Tüzel Kişi',    desc: 'Ltd., A.Ş. vb. — VKN ile', icon: '🏢' },
                  ].map(opt => (
                    <button key={opt.value} type="button"
                      onClick={() => setPp(p => ({ ...p, business_type: opt.value as 'sahis' | 'tuzel' }))}
                      className={`rounded-xl border p-4 text-left transition-all ${pp.business_type === opt.value ? 'border-orange-500 bg-orange-500/10 ring-1 ring-orange-500/40' : 'border-slate-700 hover:border-slate-500'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{opt.icon}</span>
                        <span className="font-semibold text-sm">{opt.label}</span>
                        {pp.business_type === opt.value && (
                          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-orange-500">
                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{opt.desc}</p>
                    </button>
                  ))}
                </div>

                {pp.business_type === 'sahis' && (
                  <InputField label="T.C. Kimlik Numarası (TCKN)" required>
                    <input type="text" inputMode="numeric" maxLength={11} value={pp.tckn}
                      onChange={e => setPp(p => ({ ...p, tckn: e.target.value.replace(/\D/g, '') }))}
                      placeholder="11 haneli TCKN" className={inputCls} />
                    {pp.tckn && pp.tckn.length !== 11 && <p className="mt-1 text-xs text-red-400">TCKN 11 hane olmalıdır ({pp.tckn.length}/11)</p>}
                  </InputField>
                )}

                {pp.business_type === 'tuzel' && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InputField label="Vergi Kimlik Numarası (VKN)" required>
                      <input type="text" inputMode="numeric" maxLength={10} value={pp.vkn}
                        onChange={e => setPp(p => ({ ...p, vkn: e.target.value.replace(/\D/g, '') }))}
                        placeholder="10 haneli VKN" className={inputCls} />
                      {pp.vkn && pp.vkn.length !== 10 && <p className="mt-1 text-xs text-red-400">VKN 10 hane olmalıdır ({pp.vkn.length}/10)</p>}
                    </InputField>
                    <InputField label="Ticaret Ünvanı" required>
                      <input type="text" value={pp.ticaret_unvani}
                        onChange={e => setPp(p => ({ ...p, ticaret_unvani: e.target.value }))}
                        placeholder="Örn: Tiridy Teknoloji A.Ş." className={inputCls} />
                    </InputField>
                  </div>
                )}

                {pp.business_type && (
                  <InputField label="Vergi Dairesi" required>
                    <input type="text" value={pp.vergi_dairesi}
                      onChange={e => setPp(p => ({ ...p, vergi_dairesi: e.target.value }))}
                      placeholder="Örn: Kadıköy Vergi Dairesi" className={inputCls} />
                  </InputField>
                )}
              </section>

              {/* Vergi levhası yükleme */}
              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Vergi Levhası <span className="text-orange-400">*</span></h2>
                  {pp.vergi_levhasi_url && verifStatus === 'approved' && (
                    <span className="text-xs text-green-400">✓ Mevcut belge onaylı</span>
                  )}
                </div>

                <div
                  onClick={() => fileRef.current?.click()}
                  className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${selectedFile ? 'border-orange-500 bg-orange-500/5' : 'border-slate-700 hover:border-slate-500'}`}
                >
                  <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden"
                    onChange={e => setSelectedFile(e.target.files?.[0] ?? null)} />
                  {selectedFile ? (
                    <div>
                      <p className="text-sm font-medium text-orange-400">📎 {selectedFile.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(0)} KB — değiştirmek için tıkla</p>
                    </div>
                  ) : pp.vergi_levhasi_url ? (
                    <div>
                      <p className="text-sm text-slate-400">Mevcut belge yüklü.</p>
                      <p className="mt-1 text-xs text-slate-500">Yeni belge yüklemek için tıkla (isteğe bağlı)</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-2xl mb-2">📄</p>
                      <p className="text-sm font-medium text-slate-300">Vergi levhasını buraya yükle</p>
                      <p className="mt-1 text-xs text-slate-500">PDF, JPG, PNG, WEBP — maks. 10 MB</p>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Belge yüklendikten sonra AI tarafından otomatik olarak doğrulanacaktır.
                  Girdiğiniz {pp.business_type === 'sahis' ? 'TCKN' : 'VKN'} ile belgede yazan numara karşılaştırılır.
                </p>
              </section>

              {/* Firma bilgileri */}
              <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Firma Bilgileri</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField label="Firma / Marka Adı" required>
                    <input type="text" value={pp.company_name} placeholder="Görünen firma adı"
                      onChange={e => setPp(p => ({ ...p, company_name: e.target.value }))} className={inputCls} />
                  </InputField>
                  <InputField label="Konum">
                    <input type="text" value={pp.location} placeholder="İstanbul, Türkiye"
                      onChange={e => setPp(p => ({ ...p, location: e.target.value }))} className={inputCls} />
                  </InputField>
                  <InputField label="İletişim Telefonu">
                    <input type="tel" value={pp.contact_info.phone ?? ''} placeholder="+90 2xx xxx xx xx"
                      onChange={e => setPp(p => ({ ...p, contact_info: { ...p.contact_info, phone: e.target.value } }))} className={inputCls} />
                  </InputField>
                  <InputField label="Web Sitesi">
                    <input type="url" value={pp.contact_info.website ?? ''} placeholder="https://firmaniz.com"
                      onChange={e => setPp(p => ({ ...p, contact_info: { ...p.contact_info, website: e.target.value } }))} className={inputCls} />
                  </InputField>
                </div>
                <InputField label="Firma Açıklaması">
                  <textarea rows={4} value={pp.description}
                    onChange={e => setPp(p => ({ ...p, description: e.target.value }))}
                    placeholder="Firmanız, uzmanlık alanlarınız ve sunduğunuz hizmetler hakkında kısa bilgi..."
                    className={`${inputCls} resize-none`} />
                </InputField>
              </section>
            </>
          )}

          {error && <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>}
          {success && <p className="rounded-xl bg-green-500/10 px-4 py-3 text-sm text-green-400">✓ Profil doğrulandı ve kaydedildi!</p>}
          {verifying && (
            <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/20 px-4 py-3 flex items-center gap-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-yellow-500/30 border-t-yellow-400" />
              <p className="text-sm text-yellow-400">AI belgenizi inceliyor, lütfen bekleyin...</p>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={() => router.push('/dashboard')}
              className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm text-slate-400 hover:border-slate-500 hover:text-white transition-colors">
              İptal
            </button>
            <button type="submit" disabled={saving || verifying}
              className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-slate-950 hover:bg-orange-400 disabled:opacity-60 transition-colors">
              {saving ? 'Kaydediliyor...' : verifying ? 'Doğrulanıyor...' : 'Kaydet ve Doğrula'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
