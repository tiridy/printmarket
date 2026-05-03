'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../utils/supabase'

type Role = 'customer' | 'producer'

export default function RoleSelection() {
  const router = useRouter()
  const [selected, setSelected] = useState<Role>('customer')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role) { router.push('/dashboard'); return }

      setEmail(user.email ?? '')
      setLoading(false)
    }
    init()
  }, [router])

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error } = await supabase.from('users').upsert({
      id: user.id,
      email: user.email,
      role: selected,
    })

    if (error) {
      setError('Rol kaydedilemedi. Lütfen tekrar deneyin.')
      setSaving(false)
      return
    }

    router.push('/dashboard')
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
      {/* Top bar */}
      <div className="border-b border-slate-800 bg-slate-900/60 px-6 py-4">
        <span className="text-lg font-bold tracking-tight text-orange-400">TİRİDY</span>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/15 text-2xl">
            👋
          </div>
          <h1 className="text-3xl font-bold">Hoş geldiniz!</h1>
          <p className="mt-2 text-slate-400">
            <span className="text-slate-300">{email}</span> olarak giriş yaptınız.
            <br />Platformda nasıl yer almak istediğinizi seçin.
          </p>
        </div>

        {/* Role cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Customer */}
          <button
            onClick={() => setSelected('customer')}
            className={`group relative rounded-2xl border p-6 text-left transition-all duration-200 ${
              selected === 'customer'
                ? 'border-orange-500 bg-orange-500/10 ring-1 ring-orange-500/50'
                : 'border-slate-700 bg-slate-900 hover:border-slate-500'
            }`}
          >
            {selected === 'customer' && (
              <span className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
            )}
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15 text-2xl">
              🛍️
            </div>
            <h2 className="text-lg font-semibold">Müşteri</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              3D baskı talepleri oluşturun, üreticilerden teklif alın ve siparişlerinizi takip edin.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-slate-500">
              <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Talep yayınla</li>
              <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Teklifleri karşılaştır</li>
              <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Sipariş takibi</li>
            </ul>
          </button>

          {/* Producer */}
          <button
            onClick={() => setSelected('producer')}
            className={`group relative rounded-2xl border p-6 text-left transition-all duration-200 ${
              selected === 'producer'
                ? 'border-orange-500 bg-orange-500/10 ring-1 ring-orange-500/50'
                : 'border-slate-700 bg-slate-900 hover:border-slate-500'
            }`}
          >
            {selected === 'producer' && (
              <span className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
            )}
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/15 text-2xl">
              🏭
            </div>
            <h2 className="text-lg font-semibold">Üretici</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Ürünlerinizi listeleyin, müşteri taleplerine teklif verin ve siparişleri yönetin.
            </p>
            <ul className="mt-4 space-y-1.5 text-xs text-slate-500">
              <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Ürün kataloğu</li>
              <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Taleplere teklif ver</li>
              <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Sipariş yönetimi</li>
            </ul>
          </button>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-8 w-full rounded-2xl bg-orange-500 py-4 text-base font-semibold text-slate-950 transition hover:bg-orange-400 disabled:opacity-60"
        >
          {saving ? 'Kaydediliyor...' : `${selected === 'customer' ? 'Müşteri' : 'Üretici'} olarak devam et →`}
        </button>

        <p className="mt-4 text-center text-xs text-slate-600">
          Bu seçim daha sonra profil ayarlarından değiştirilebilir.
        </p>
      </div>
    </div>
  )
}
