'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../utils/supabase'
import { User } from '@supabase/supabase-js'

interface UserProfile {
  full_name: string
  phone: string
  role: string
}

interface ProducerProfile {
  id?: string
  company_name: string
  description: string
  location: string
  contact_info: { website?: string; phone?: string }
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [userProfile, setUserProfile] = useState<UserProfile>({
    full_name: '',
    phone: '',
    role: '',
  })

  const [producerProfile, setProducerProfile] = useState<ProducerProfile>({
    company_name: '',
    description: '',
    location: '',
    contact_info: { website: '', phone: '' },
  })

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      const { data: profile } = await supabase
        .from('users')
        .select('full_name, phone, role')
        .eq('id', user.id)
        .single()

      if (profile) {
        setRole(profile.role ?? '')
        setUserProfile({
          full_name: profile.full_name ?? '',
          phone: profile.phone ?? '',
          role: profile.role ?? '',
        })
      }

      if (profile?.role === 'producer') {
        const { data: pp } = await supabase
          .from('producer_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (pp) {
          setProducerProfile({
            id: pp.id,
            company_name: pp.company_name ?? '',
            description: pp.description ?? '',
            location: pp.location ?? '',
            contact_info: {
              website: pp.contact_info?.website ?? '',
              phone: pp.contact_info?.phone ?? '',
            },
          })
        }
      }

      setLoading(false)
    }
    init()
  }, [router])

  const handleSave = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    // Save to users table
    const { error: userErr } = await supabase
      .from('users')
      .update({
        full_name: userProfile.full_name,
        phone: userProfile.phone,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user!.id)

    if (userErr) {
      setError(`Profil kaydedilemedi: ${userErr.message}`)
      setSaving(false)
      return
    }

    // If producer, save producer profile
    if (role === 'producer') {
      const payload = {
        user_id: user!.id,
        company_name: producerProfile.company_name,
        description: producerProfile.description,
        location: producerProfile.location,
        contact_info: producerProfile.contact_info,
      }

      const { error: ppErr } = producerProfile.id
        ? await supabase.from('producer_profiles').update(payload).eq('id', producerProfile.id)
        : await supabase.from('producer_profiles').insert(payload)

      if (ppErr) {
        setError(`Firma profili kaydedilemedi: ${ppErr.message}`)
        setSaving(false)
        return
      }
    }

    setSuccess(true)
    setSaving(false)
    setTimeout(() => setSuccess(false), 3000)
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

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ← Geri
            </button>
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
          {/* Account info (read-only) */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Hesap Bilgileri</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">E-posta</label>
                <input
                  type="text"
                  value={user?.email ?? ''}
                  disabled
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-slate-400 text-sm cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Rol</label>
                <input
                  type="text"
                  value={role === 'customer' ? 'Müşteri' : role === 'producer' ? 'Üretici' : ''}
                  disabled
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-slate-400 text-sm cursor-not-allowed"
                />
              </div>
            </div>
          </section>

          {/* Personal info */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Kişisel Bilgiler</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Ad Soyad</label>
                <input
                  type="text"
                  value={userProfile.full_name}
                  onChange={e => setUserProfile(p => ({ ...p, full_name: e.target.value }))}
                  placeholder="Adınız ve soyadınız"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Telefon</label>
                <input
                  type="tel"
                  value={userProfile.phone}
                  onChange={e => setUserProfile(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+90 5xx xxx xx xx"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition"
                />
              </div>
            </div>
          </section>

          {/* Producer-only section */}
          {role === 'producer' && (
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Firma Bilgileri</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Firma Adı <span className="text-orange-400">*</span></label>
                  <input
                    type="text"
                    required
                    value={producerProfile.company_name}
                    onChange={e => setProducerProfile(p => ({ ...p, company_name: e.target.value }))}
                    placeholder="Firma adınız"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Konum</label>
                  <input
                    type="text"
                    value={producerProfile.location}
                    onChange={e => setProducerProfile(p => ({ ...p, location: e.target.value }))}
                    placeholder="İstanbul, Türkiye"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">İletişim Telefonu</label>
                  <input
                    type="tel"
                    value={producerProfile.contact_info.phone ?? ''}
                    onChange={e => setProducerProfile(p => ({ ...p, contact_info: { ...p.contact_info, phone: e.target.value } }))}
                    placeholder="+90 2xx xxx xx xx"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Web Sitesi</label>
                  <input
                    type="url"
                    value={producerProfile.contact_info.website ?? ''}
                    onChange={e => setProducerProfile(p => ({ ...p, contact_info: { ...p.contact_info, website: e.target.value } }))}
                    placeholder="https://firmaniz.com"
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Firma Açıklaması</label>
                <textarea
                  rows={4}
                  value={producerProfile.description}
                  onChange={e => setProducerProfile(p => ({ ...p, description: e.target.value }))}
                  placeholder="Firmanız, uzmanlık alanlarınız ve sunduğunuz hizmetler hakkında kısa bilgi..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition resize-none"
                />
              </div>
            </section>
          )}

          {/* Feedback */}
          {error && (
            <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>
          )}
          {success && (
            <p className="rounded-xl bg-green-500/10 px-4 py-3 text-sm text-green-400">
              ✓ Profil başarıyla kaydedildi.
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm text-slate-400 hover:border-slate-500 hover:text-white transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-slate-950 hover:bg-orange-400 disabled:opacity-60 transition-colors"
            >
              {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
