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
  business_type: 'sahis' | 'tuzel' | 'freelancer' | ''
  tckn: string; vkn: string; vergi_dairesi: string; ticaret_unvani: string
  iban: string
  verification_status: string; verification_note: string; vergi_levhasi_url: string; kimlik_url: string
}

type VerifStatus = 'unverified' | 'pending' | 'approved' | 'rejected'

const VERIF_UI: Record<VerifStatus, { label: string; icon: string; cls: string }> = {
  unverified: { label: 'Doğrulama bekleniyor', icon: '⏳', cls: 'bg-gray-50 text-gray-600 border-gray-200' },
  pending:    { label: 'İnceleniyor...',        icon: '🔍', cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  approved:   { label: 'Hesap doğrulandı',      icon: '✅', cls: 'bg-green-50 text-green-700 border-green-200' },
  rejected:   { label: 'Doğrulama başarısız',   icon: '❌', cls: 'bg-red-50 text-red-700 border-red-200' },
}

const inputCls = "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition"
const disabledCls = "w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 text-gray-400 text-sm cursor-not-allowed"

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-orange-500 text-xs">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  )
}

function SectionCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100 bg-gray-50/60">
        <span>{icon}</span>
        <h2 className="text-sm font-semibold text-gray-700 tracking-wide">{title}</h2>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </section>
  )
}

export default function ProfilePage() {
  const router  = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [user,         setUser]         = useState<User | null>(null)
  const [role,         setRole]         = useState('')
  const [loading,      setLoading]      = useState(true)
  const [saving,       setSaving]       = useState(false)
  const [verifying,    setVerifying]    = useState(false)
  const [success,      setSuccess]      = useState(false)
  const [error,        setError]        = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [userProfile, setUserProfile] = useState<UserProfile>({ full_name: '', phone: '', role: '' })
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
        <div className="h-12 w-12 shrink-0 rounded-2xl bg-orange-500 flex items-center justify-center text-lg font-bold text-white shadow-sm shadow-orange-200">
          {initials}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Profil Ayarları</h1>
          <p className="text-sm text-gray-400">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">

        {/* Hesap */}
        <SectionCard title="Hesap Bilgileri" icon="🔐">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="E-posta">
              <input type="text" value={user?.email ?? ''} disabled className={disabledCls} />
            </Field>
            <Field label="Rol">
              <input type="text" value={role === 'customer' ? 'Müşteri' : 'Üretici'} disabled className={disabledCls} />
            </Field>
          </div>
        </SectionCard>

        {/* Kişisel */}
        <SectionCard title="Kişisel Bilgiler" icon="👤">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ad Soyad" required>
              <input type="text" value={userProfile.full_name} placeholder="Adınız ve soyadınız"
                onChange={e => setUserProfile(p => ({ ...p, full_name: e.target.value }))} className={inputCls} />
            </Field>
            <Field label="Telefon" required hint="Türkiye operatörüne ait numara zorunludur.">
              <input type="tel" value={userProfile.phone} placeholder="+90 5xx xxx xx xx"
                onChange={e => setUserProfile(p => ({ ...p, phone: e.target.value }))} className={inputCls} />
            </Field>
          </div>
        </SectionCard>

        {/* Üretici bölümü */}
        {role === 'producer' && (
          <>
            {/* Doğrulama durumu — freelancer için gösterme */}
            {!isFreelancer && pp.business_type && (
              <div className={`rounded-2xl border px-5 py-4 flex items-start gap-3 ${verifUI.cls}`}>
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
                      className={`relative rounded-xl border p-4 text-left transition-all ${
                        active ? 'border-orange-400 bg-orange-50 ring-1 ring-orange-300/50' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}>
                      {active && (
                        <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500">
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </span>
                      )}
                      <span className="text-2xl mb-2 block">{opt.icon}</span>
                      <p className="font-semibold text-sm text-gray-900">{opt.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                      {opt.badge && (
                        <span className="inline-block mt-2 rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-[10px] font-semibold">
                          {opt.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Freelancer → IBAN */}
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
                      className={`${inputCls} font-mono tracking-widest`} />
                  </Field>
                </div>
              )}

              {/* Şahıs → TCKN */}
              {pp.business_type === 'sahis' && (
                <Field label="T.C. Kimlik Numarası (TCKN)" required>
                  <input type="text" inputMode="numeric" maxLength={11} value={pp.tckn}
                    onChange={e => setPp(p => ({ ...p, tckn: e.target.value.replace(/\D/g, '') }))}
                    placeholder="11 haneli TCKN" className={inputCls} />
                  {pp.tckn && pp.tckn.length !== 11 && <p className="mt-1 text-xs text-red-500">{pp.tckn.length}/11 hane</p>}
                </Field>
              )}

              {/* Tüzel → VKN + Ünvan */}
              {pp.business_type === 'tuzel' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Vergi Kimlik Numarası (VKN)" required>
                    <input type="text" inputMode="numeric" maxLength={10} value={pp.vkn}
                      onChange={e => setPp(p => ({ ...p, vkn: e.target.value.replace(/\D/g, '') }))}
                      placeholder="10 haneli VKN" className={inputCls} />
                    {pp.vkn && pp.vkn.length !== 10 && <p className="mt-1 text-xs text-red-500">{pp.vkn.length}/10 hane</p>}
                  </Field>
                  <Field label="Ticaret Ünvanı" required>
                    <input type="text" value={pp.ticaret_unvani}
                      onChange={e => setPp(p => ({ ...p, ticaret_unvani: e.target.value }))}
                      placeholder="Örn: Tiridy Teknoloji A.Ş." className={inputCls} />
                  </Field>
                </div>
              )}

              {(pp.business_type === 'sahis' || pp.business_type === 'tuzel') && (
                <Field label="Vergi Dairesi" required>
                  <input type="text" value={pp.vergi_dairesi}
                    onChange={e => setPp(p => ({ ...p, vergi_dairesi: e.target.value }))}
                    placeholder="Örn: Kadıköy Vergi Dairesi" className={inputCls} />
                </Field>
              )}
            </SectionCard>

            {/* Vergi Levhası — sadece şahıs/tüzel */}
            {(pp.business_type === 'sahis' || pp.business_type === 'tuzel') && (
              <SectionCard title="Vergi Levhası" icon="📄">
                <div
                  onClick={() => fileRef.current?.click()}
                  className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                    selectedFile ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden"
                    onChange={e => setSelectedFile(e.target.files?.[0] ?? null)} />
                  {selectedFile ? (
                    <>
                      <p className="text-sm font-medium text-orange-600">📎 {selectedFile.name}</p>
                      <p className="mt-1 text-xs text-gray-400">{(selectedFile.size / 1024).toFixed(0)} KB — değiştirmek için tıkla</p>
                    </>
                  ) : pp.vergi_levhasi_url ? (
                    <>
                      <p className="text-sm text-gray-600">✓ Belge yüklü</p>
                      <p className="mt-1 text-xs text-gray-400">Değiştirmek için tıkla (isteğe bağlı)</p>
                    </>
                  ) : (
                    <>
                      <p className="text-3xl mb-2">📄</p>
                      <p className="text-sm font-medium text-gray-700">Vergi levhasını yükle</p>
                      <p className="mt-1 text-xs text-gray-400">PDF, JPG, PNG, WEBP — maks. 10 MB</p>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  Belge AI tarafından doğrulanır. Girdiğiniz {pp.business_type === 'sahis' ? 'TCKN' : 'VKN'} ile belgede yazan numara karşılaştırılır.
                </p>
              </SectionCard>
            )}

            {/* Firma Bilgileri — sadece şahıs/tüzel */}
            {(pp.business_type === 'sahis' || pp.business_type === 'tuzel') && (
              <SectionCard title="Firma Bilgileri" icon="🏢">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Firma / Marka Adı" required>
                    <input type="text" value={pp.company_name} placeholder="Görünen firma adı"
                      onChange={e => setPp(p => ({ ...p, company_name: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field label="Konum">
                    <input type="text" value={pp.location} placeholder="İstanbul, Türkiye"
                      onChange={e => setPp(p => ({ ...p, location: e.target.value }))} className={inputCls} />
                  </Field>
                  <Field label="İletişim Telefonu">
                    <input type="tel" value={pp.contact_info.phone ?? ''} placeholder="+90 2xx xxx xx xx"
                      onChange={e => setPp(p => ({ ...p, contact_info: { ...p.contact_info, phone: e.target.value } }))} className={inputCls} />
                  </Field>
                  <Field label="Web Sitesi">
                    <input type="url" value={pp.contact_info.website ?? ''} placeholder="https://firmaniz.com"
                      onChange={e => setPp(p => ({ ...p, contact_info: { ...p.contact_info, website: e.target.value } }))} className={inputCls} />
                  </Field>
                </div>
                <Field label="Firma Açıklaması">
                  <textarea rows={4} value={pp.description}
                    onChange={e => setPp(p => ({ ...p, description: e.target.value }))}
                    placeholder="Firmanız ve uzmanlık alanlarınız hakkında kısa bilgi..."
                    className={`${inputCls} resize-none`} />
                </Field>
              </SectionCard>
            )}
          </>
        )}

        {/* Durum mesajları */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
            <span className="text-red-500 shrink-0">⚠️</span>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        {success && (
          <div className="flex items-start gap-3 rounded-xl bg-green-50 border border-green-200 px-4 py-3">
            <span className="shrink-0">✅</span>
            <p className="text-sm text-green-700">Profil başarıyla kaydedildi ve doğrulandı!</p>
          </div>
        )}
        {verifying && (
          <div className="flex items-center gap-3 rounded-xl bg-yellow-50 border border-yellow-200 px-4 py-3">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-yellow-200 border-t-yellow-500 shrink-0" />
            <p className="text-sm text-yellow-700">AI belgenizi inceliyor, lütfen bekleyin...</p>
          </div>
        )}

        {/* Butonlar */}
        <div className="flex items-center justify-between pt-1 pb-6">
          <button type="button"
            onClick={() => router.push(role === 'producer' ? '/dashboard/producer' : '/dashboard/customer')}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors">
            İptal
          </button>
          <button type="submit" disabled={saving || verifying}
            className="rounded-xl bg-orange-500 px-7 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50 transition-colors shadow-sm shadow-orange-200">
            {saving ? 'Kaydediliyor...' : verifying ? 'Doğrulanıyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  )
}
