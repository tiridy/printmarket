'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../utils/supabase'
import { User } from '@supabase/supabase-js'
import { Avatar, Field, SectionCard } from '../../components/ui'

interface UserProfile { full_name: string; phone: string; role: string; avatar_url?: string | null }

interface ProducerProfile {
  id?: string
  company_name: string; description: string; location: string
  contact_info: { website?: string; phone?: string }
  business_type: 'sahis' | 'tuzel' | 'freelancer' | ''
  tckn: string; vkn: string; vergi_dairesi: string; ticaret_unvani: string
  iban: string
  verification_status: string; verification_note: string; vergi_levhasi_url: string; kimlik_url: string
}

type VerifStatus = 'unverified' | 'pending' | 'approved' | 'rejected'

const VERIF_UI: Record<VerifStatus, { label: string; icon: string; bg: string; border: string; color: string }> = {
  unverified: { label: 'Doğrulama bekleniyor', icon: '⏳', bg: 'var(--color-neutral-50)',      border: 'var(--color-neutral-200)', color: 'var(--color-neutral-600)' },
  pending:    { label: 'İnceleniyor...',        icon: '🔍', bg: 'var(--color-warning-light)',   border: 'var(--color-warning)',     color: 'var(--color-warning)' },
  approved:   { label: 'Hesap doğrulandı',      icon: '✅', bg: 'var(--color-success-light)',   border: 'var(--color-success)',     color: 'var(--color-success)' },
  rejected:   { label: 'Doğrulama başarısız',   icon: '❌', bg: 'var(--color-danger-light)',    border: 'var(--color-danger)',      color: 'var(--color-danger)' },
}

export default function ProfilePage() {
  const router  = useRouter()
  const fileRef       = useRef<HTMLInputElement>(null)
  const avatarFileRef = useRef<HTMLInputElement>(null)
  const [user,            setUser]            = useState<User | null>(null)
  const [role,            setRole]            = useState('')
  const [loading,         setLoading]         = useState(true)
  const [saving,          setSaving]          = useState(false)
  const [verifying,       setVerifying]       = useState(false)
  const [success,         setSuccess]         = useState(false)
  const [error,           setError]           = useState<string | null>(null)
  const [selectedFile,    setSelectedFile]    = useState<File | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarPreview,   setAvatarPreview]   = useState<string | null>(null)

  const [userProfile, setUserProfile] = useState<UserProfile>({ full_name: '', phone: '', role: '', avatar_url: null })
  const [pp, setPp] = useState<ProducerProfile>({
    company_name: '', description: '', location: '',
    contact_info: { website: '', phone: '' },
    business_type: '', tckn: '', vkn: '', vergi_dairesi: '', ticaret_unvani: '', iban: '',
    verification_status: 'unverified', verification_note: '', vergi_levhasi_url: '', kimlik_url: '',
  })

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      const { data: profile } = await supabase.from('users').select('full_name, phone, role, avatar_url').eq('id', user.id).single()
      if (profile) {
        setRole(profile.role ?? '')
        const googleAvatar = user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null
        const avatarUrl = profile.avatar_url ?? googleAvatar ?? null
        setUserProfile({ full_name: profile.full_name ?? '', phone: profile.phone ?? '', role: profile.role ?? '', avatar_url: avatarUrl })
        setAvatarPreview(avatarUrl)
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
            iban: data.iban ?? '',
            verification_status: data.verification_status ?? 'unverified',
            verification_note: data.verification_note ?? '',
            vergi_levhasi_url: data.vergi_levhasi_url ?? '',
            kimlik_url: data.kimlik_url ?? '',
          })
        }
      }
      setLoading(false)
    }
    init()
  }, [router])

  const validate = (): string | null => {
    if (!userProfile.full_name.trim()) return 'Ad Soyad zorunludur.'
    if (!userProfile.phone.trim()) return 'Telefon numarası zorunludur.'
    if (role !== 'producer') return null
    if (!pp.business_type) return 'Lütfen işletme türünü seçin.'
    if (pp.business_type === 'freelancer') {
      if (!pp.iban) return 'IBAN zorunludur.'
      if (!/^TR\d{24}$/.test(pp.iban.replace(/\s/g, '').toUpperCase())) return "Geçerli bir Türk IBAN'ı girin (TR ile başlayan 26 karakter)."
    }
    if (pp.business_type === 'sahis') {
      if (!pp.tckn) return 'TCKN zorunludur.'
      if (!/^\d{11}$/.test(pp.tckn)) return 'TCKN 11 haneli olmalıdır.'
      if (!pp.vergi_dairesi) return 'Vergi dairesi zorunludur.'
      if (!pp.company_name) return 'Firma adı zorunludur.'
      if (!selectedFile && !pp.vergi_levhasi_url) return 'Vergi levhası belgesi zorunludur.'
    }
    if (pp.business_type === 'tuzel') {
      if (!pp.vkn) return 'Vergi Kimlik Numarası zorunludur.'
      if (!/^\d{10}$/.test(pp.vkn)) return 'VKN 10 haneli olmalıdır.'
      if (!pp.ticaret_unvani) return 'Ticaret ünvanı zorunludur.'
      if (!pp.vergi_dairesi) return 'Vergi dairesi zorunludur.'
      if (!pp.company_name) return 'Firma adı zorunludur.'
      if (!selectedFile && !pp.vergi_levhasi_url) return 'Vergi levhası belgesi zorunludur.'
    }
    return null
  }

  const handleAvatarChange = async (file: File) => {
    if (!user) return
    setAvatarUploading(true)
    // Anlık önizleme
    const localUrl = URL.createObjectURL(file)
    setAvatarPreview(localUrl)

    const ext  = file.name.split('.').pop()
    const path = `avatars/${user.id}.${ext}`
    const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (upErr) { setError(`Fotoğraf yüklenemedi: ${upErr.message}`); setAvatarUploading(false); return }

    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
    const publicUrl = urlData.publicUrl + `?t=${Date.now()}` // cache bust
    await supabase.from('users').update({ avatar_url: publicUrl }).eq('id', user.id)
    setUserProfile(p => ({ ...p, avatar_url: publicUrl }))
    setAvatarPreview(publicUrl)
    setAvatarUploading(false)
  }

  const handleSave = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    const validErr = validate()
    if (validErr) { setError(validErr); return }

    setSaving(true); setError(null); setSuccess(false)

    const { error: userErr } = await supabase.from('users')
      .update({ full_name: userProfile.full_name, phone: userProfile.phone, updated_at: new Date().toISOString() })
      .eq('id', user!.id)
    if (userErr) { setError(`Profil kaydedilemedi: ${userErr.message}`); setSaving(false); return }

    const isFreelancer = pp.business_type === 'freelancer'

    let levhaUrl = pp.vergi_levhasi_url
    if (!isFreelancer && selectedFile) {
      const ext  = selectedFile.name.split('.').pop()
      const path = `${user!.id}/vergi-levhasi-${Date.now()}.${ext}`
      const { error: uploadErr } = await supabase.storage.from('documents').upload(path, selectedFile, { upsert: true })
      if (uploadErr) { setError(`Dosya yüklenemedi: ${uploadErr.message}`); setSaving(false); return }
      const { data: urlData } = supabase.storage.from('documents').getPublicUrl(path)
      levhaUrl = urlData.publicUrl
    }

    const ibanClean = pp.iban.replace(/\s/g, '').toUpperCase()
    const payload = {
      user_id: user!.id,
      company_name: isFreelancer ? (userProfile.full_name || pp.company_name) : pp.company_name,
      description: pp.description,
      location: pp.location,
      contact_info: pp.contact_info,
      business_type: pp.business_type,
      tckn: pp.business_type === 'sahis' ? pp.tckn : null,
      vkn: pp.business_type === 'tuzel' ? pp.vkn : null,
      vergi_dairesi: !isFreelancer ? pp.vergi_dairesi : null,
      ticaret_unvani: pp.business_type === 'tuzel' ? pp.ticaret_unvani : null,
      iban: isFreelancer ? ibanClean : null,
      vergi_levhasi_url: !isFreelancer ? levhaUrl : null,
      kimlik_url: null,
      verification_status: isFreelancer ? 'approved' : 'pending',
      verified_at: isFreelancer ? new Date().toISOString() : null,
    }

    const { data: savedPp, error: ppErr } = pp.id
      ? await supabase.from('producer_profiles').update(payload).eq('id', pp.id).select().single()
      : await supabase.from('producer_profiles').insert(payload).select().single()

    if (ppErr) { setError(`Firma profili kaydedilemedi: ${ppErr.message}`); setSaving(false); return }

    if (isFreelancer) {
      setPp(prev => ({ ...prev, id: savedPp.id, verification_status: 'approved' }))
      setSelectedFile(null); setSaving(false); setSuccess(true)
      return
    }

    setPp(prev => ({ ...prev, id: savedPp.id, vergi_levhasi_url: levhaUrl, verification_status: 'pending' }))
    setSelectedFile(null); setSaving(false)

    setVerifying(true)
    try {
      const res    = await fetch('/api/verify-producer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ producer_id: savedPp.id }) })
      const result = await res.json()
      setPp(prev => ({ ...prev, verification_status: result.status ?? 'rejected', verification_note: result.note ?? '' }))
      setSuccess(result.status === 'approved')
    } catch {
      setPp(prev => ({ ...prev, verification_status: 'rejected', verification_note: 'Bağlantı hatası.' }))
    } finally {
      setVerifying(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-orange-500" />
    </div>
  )

  const verifStatus = (pp.verification_status as VerifStatus) || 'unverified'
  const verifUI     = VERIF_UI[verifStatus] ?? VERIF_UI.unverified
  const isFreelancer = pp.business_type === 'freelancer'

  const initials = userProfile.full_name
    ? userProfile.full_name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : (user?.email?.[0] ?? '?').toUpperCase()

  return (
    <div className="max-w-2xl space-y-5">

      {/* Page title */}
      <div className="flex items-center gap-4">
        {/* Tıklanabilir avatar */}
        <div className="relative shrink-0 group cursor-pointer" onClick={() => avatarFileRef.current?.click()}>
          <Avatar initials={initials} src={avatarPreview} size="lg" />
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            {avatarUploading
              ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              : <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
            }
          </div>
          <input ref={avatarFileRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleAvatarChange(f) }} />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-neutral-900)' }}>Profil Ayarları</h1>
          <p className="text-sm" style={{ color: 'var(--color-neutral-400)' }}>{user?.email}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-neutral-400)' }}>Fotoğrafı değiştirmek için tıkla</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">

        {/* Hesap */}
        <SectionCard title="Hesap Bilgileri" icon="🔐">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="E-posta">
              <input type="text" value={user?.email ?? ''} disabled className="input" style={{ opacity: 0.5, cursor: 'not-allowed' }} />
            </Field>
            <Field label="Rol">
              <input type="text" value={role === 'customer' ? 'Müşteri' : 'Üretici'} disabled className="input" style={{ opacity: 0.5, cursor: 'not-allowed' }} />
            </Field>
          </div>
        </SectionCard>

        {/* Kişisel */}
        <SectionCard title="Kişisel Bilgiler" icon="👤">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ad Soyad" required>
              <input type="text" value={userProfile.full_name} placeholder="Adınız ve soyadınız"
                onChange={e => setUserProfile(p => ({ ...p, full_name: e.target.value }))} className="input" />
            </Field>
            <Field label="Telefon" required hint="Türkiye operatörüne ait numara zorunludur.">
              <input type="tel" value={userProfile.phone} placeholder="+90 5xx xxx xx xx"
                onChange={e => setUserProfile(p => ({ ...p, phone: e.target.value }))} className="input" />
            </Field>
          </div>
        </SectionCard>

        {/* Üretici bölümü */}
        {role === 'producer' && (
          <>
            {/* Doğrulama durumu */}
            {!isFreelancer && pp.business_type && (
              <div className="rounded-2xl border px-5 py-4 flex items-start gap-3"
                style={{ background: verifUI.bg, borderColor: verifUI.border, color: verifUI.color }}>
                <span className="text-xl shrink-0 mt-0.5">{verifUI.icon}</span>
                <div>
                  <p className="font-semibold text-sm">{verifUI.label}</p>
                  {pp.verification_note && <p className="mt-0.5 text-xs opacity-80">{pp.verification_note}</p>}
                  {verifStatus === 'unverified' && <p className="mt-0.5 text-xs opacity-60">Vergi levhanızı yükleyin ve profili kaydedin.</p>}
                  {verifStatus === 'pending'    && <p className="mt-0.5 text-xs opacity-60">AI belgenizi inceliyor, lütfen bekleyin...</p>}
                  {verifStatus === 'approved'   && <p className="mt-0.5 text-xs opacity-60">Paneliniz aktif. Tüm özelliklere erişebilirsiniz.</p>}
                  {verifStatus === 'rejected'   && <p className="mt-0.5 text-xs opacity-60">Bilgileri düzeltin ve belgeyi yeniden yükleyin.</p>}
                </div>
              </div>
            )}

            {/* İşletme Türü */}
            <SectionCard title="İşletme Türü" icon="🏷️">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { value: 'freelancer', label: 'Freelancer',    desc: 'Bireysel — IBAN ile',      icon: '🎨', badge: 'Hızlı onay' },
                  { value: 'sahis',      label: 'Şahıs Şirketi', desc: 'Gerçek kişi — TCKN ile',  icon: '👤', badge: null },
                  { value: 'tuzel',      label: 'Tüzel Kişi',    desc: 'Ltd., A.Ş. vb.',          icon: '🏢', badge: null },
                ].map(opt => {
                  const active = pp.business_type === opt.value
                  return (
                    <button key={opt.value} type="button"
                      onClick={() => setPp(p => ({ ...p, business_type: opt.value as 'freelancer' | 'sahis' | 'tuzel' }))}
                      className="relative rounded-xl border p-4 text-left transition-all"
                      style={active
                        ? { borderColor: 'var(--color-brand-400)', background: 'var(--color-brand-50)', boxShadow: '0 0 0 1px var(--color-brand-300)' }
                        : { borderColor: 'var(--color-neutral-200)', background: 'var(--color-neutral-0)' }}>
                      {active && (
                        <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full" style={{ background: 'var(--color-brand-500)' }}>
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </span>
                      )}
                      <span className="text-2xl mb-2 block">{opt.icon}</span>
                      <p className="font-semibold text-sm" style={{ color: 'var(--color-neutral-900)' }}>{opt.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--color-neutral-500)' }}>{opt.desc}</p>
                      {opt.badge && (
                        <span className="badge mt-2" style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
                          {opt.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {pp.business_type === 'freelancer' && (
                <div className="space-y-3 pt-1">
                  <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 flex gap-3">
                    <span className="text-blue-500 shrink-0">ℹ️</span>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Türkiye operatörüne ait telefon ve Türk bankasına kayıtlı IBAN yeterlidir. Hesabınız anında onaylanır.
                    </p>
                  </div>
                  <Field label="IBAN" required hint="TR ile başlayan 26 karakterli Türk IBAN'ı girin.">
                    <input type="text" value={pp.iban} maxLength={32}
                      onChange={e => setPp(p => ({ ...p, iban: e.target.value.toUpperCase() }))}
                      placeholder="TR00 0000 0000 0000 0000 0000 00"
                      className="input font-mono tracking-widest" />
                  </Field>
                </div>
              )}

              {pp.business_type === 'sahis' && (
                <Field label="T.C. Kimlik Numarası (TCKN)" required>
                  <input type="text" inputMode="numeric" maxLength={11} value={pp.tckn}
                    onChange={e => setPp(p => ({ ...p, tckn: e.target.value.replace(/\D/g, '') }))}
                    placeholder="11 haneli TCKN" className="input" />
                  {pp.tckn && pp.tckn.length !== 11 && <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>{pp.tckn.length}/11 hane</p>}
                </Field>
              )}

              {pp.business_type === 'tuzel' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Vergi Kimlik Numarası (VKN)" required>
                    <input type="text" inputMode="numeric" maxLength={10} value={pp.vkn}
                      onChange={e => setPp(p => ({ ...p, vkn: e.target.value.replace(/\D/g, '') }))}
                      placeholder="10 haneli VKN" className="input" />
                    {pp.vkn && pp.vkn.length !== 10 && <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>{pp.vkn.length}/10 hane</p>}
                  </Field>
                  <Field label="Ticaret Ünvanı" required>
                    <input type="text" value={pp.ticaret_unvani}
                      onChange={e => setPp(p => ({ ...p, ticaret_unvani: e.target.value }))}
                      placeholder="Örn: Tiridy Teknoloji A.Ş." className="input" />
                  </Field>
                </div>
              )}

              {(pp.business_type === 'sahis' || pp.business_type === 'tuzel') && (
                <Field label="Vergi Dairesi" required>
                  <input type="text" value={pp.vergi_dairesi}
                    onChange={e => setPp(p => ({ ...p, vergi_dairesi: e.target.value }))}
                    placeholder="Örn: Kadıköy Vergi Dairesi" className="input" />
                </Field>
              )}
            </SectionCard>

            {/* Vergi Levhası */}
            {(pp.business_type === 'sahis' || pp.business_type === 'tuzel') && (
              <SectionCard title="Vergi Levhası" icon="📄">
                <div onClick={() => fileRef.current?.click()}
                  className={`dropzone cursor-pointer ${selectedFile ? 'dropzone-success' : ''}`}>
                  <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden"
                    onChange={e => setSelectedFile(e.target.files?.[0] ?? null)} />
                  {selectedFile ? (
                    <>
                      <p className="text-sm font-medium" style={{ color: 'var(--color-brand-500)' }}>📎 {selectedFile.name}</p>
                      <p className="mt-1 text-xs" style={{ color: 'var(--color-neutral-400)' }}>{(selectedFile.size / 1024).toFixed(0)} KB — değiştirmek için tıkla</p>
                    </>
                  ) : pp.vergi_levhasi_url ? (
                    <>
                      <p className="text-sm" style={{ color: 'var(--color-neutral-600)' }}>✓ Belge yüklü</p>
                      <p className="mt-1 text-xs" style={{ color: 'var(--color-neutral-400)' }}>Değiştirmek için tıkla (isteğe bağlı)</p>
                    </>
                  ) : (
                    <>
                      <p className="text-3xl mb-2">📄</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>Vergi levhasını yükle</p>
                      <p className="mt-1 text-xs" style={{ color: 'var(--color-neutral-400)' }}>PDF, JPG, PNG, WEBP — maks. 10 MB</p>
                    </>
                  )}
                </div>
                <p className="text-xs" style={{ color: 'var(--color-neutral-400)' }}>
                  Belge AI tarafından doğrulanır. Girdiğiniz {pp.business_type === 'sahis' ? 'TCKN' : 'VKN'} ile belgede yazan numara karşılaştırılır.
                </p>
              </SectionCard>
            )}

            {/* Firma Bilgileri */}
            {(pp.business_type === 'sahis' || pp.business_type === 'tuzel') && (
              <SectionCard title="Firma Bilgileri" icon="🏢">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Firma / Marka Adı" required>
                    <input type="text" value={pp.company_name} placeholder="Görünen firma adı"
                      onChange={e => setPp(p => ({ ...p, company_name: e.target.value }))} className="input" />
                  </Field>
                  <Field label="Konum">
                    <input type="text" value={pp.location} placeholder="İstanbul, Türkiye"
                      onChange={e => setPp(p => ({ ...p, location: e.target.value }))} className="input" />
                  </Field>
                  <Field label="İletişim Telefonu">
                    <input type="tel" value={pp.contact_info.phone ?? ''} placeholder="+90 2xx xxx xx xx"
                      onChange={e => setPp(p => ({ ...p, contact_info: { ...p.contact_info, phone: e.target.value } }))} className="input" />
                  </Field>
                  <Field label="Web Sitesi">
                    <input type="url" value={pp.contact_info.website ?? ''} placeholder="https://firmaniz.com"
                      onChange={e => setPp(p => ({ ...p, contact_info: { ...p.contact_info, website: e.target.value } }))} className="input" />
                  </Field>
                </div>
                <Field label="Firma Açıklaması">
                  <textarea rows={4} value={pp.description}
                    onChange={e => setPp(p => ({ ...p, description: e.target.value }))}
                    placeholder="Firmanız ve uzmanlık alanlarınız hakkında kısa bilgi..."
                    className="input resize-none" />
                </Field>
              </SectionCard>
            )}
          </>
        )}

        {/* Durum mesajları */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border px-4 py-3"
            style={{ background: 'var(--color-danger-light)', borderColor: 'var(--color-danger)' }}>
            <span className="shrink-0" style={{ color: 'var(--color-danger)' }}>⚠️</span>
            <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{error}</p>
          </div>
        )}
        {success && (
          <div className="flex items-start gap-3 rounded-xl border px-4 py-3"
            style={{ background: 'var(--color-success-light)', borderColor: 'var(--color-success)' }}>
            <span className="shrink-0">✅</span>
            <p className="text-sm" style={{ color: 'var(--color-success)' }}>Profil başarıyla kaydedildi ve doğrulandı!</p>
          </div>
        )}
        {verifying && (
          <div className="flex items-center gap-3 rounded-xl border px-4 py-3"
            style={{ background: 'var(--color-warning-light)', borderColor: 'var(--color-warning)' }}>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-yellow-200 border-t-yellow-500 shrink-0" />
            <p className="text-sm" style={{ color: 'var(--color-warning)' }}>AI belgenizi inceliyor, lütfen bekleyin...</p>
          </div>
        )}

        {/* Butonlar */}
        <div className="flex items-center justify-between pt-1 pb-6">
          <button type="button" onClick={() => router.push(role === 'producer' ? '/dashboard/producer' : '/dashboard/customer')}
            className="btn btn-secondary">
            İptal
          </button>
          <button type="submit" disabled={saving || verifying} className="btn btn-primary disabled:opacity-50">
            {saving ? 'Kaydediliyor...' : verifying ? 'Doğrulanıyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  )
}
