'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../utils/supabase'

export default function RoleSelection() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [selectedRole, setSelectedRole] = useState<'customer' | 'producer'>('customer')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setUserEmail(user.email || '')

      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role) {
        router.push('/dashboard')
        return
      }

      setLoading(false)
    }

    checkUser()
  }, [router])

  const handleRoleSelect = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { error } = await supabase.from('users').upsert({
      id: user.id,
      email: user.email,
      role: selectedRole,
    })

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-white">Rol bilgisi yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-xl px-6 py-16">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-10 shadow-xl shadow-slate-950/20">
          <h1 className="text-3xl font-semibold text-orange-400">Rolünü seç</h1>
          <p className="mt-3 text-slate-300">
            Hoş geldiniz {userEmail}. TİRİDY platformunda nasıl çalışmak istediğinizi seçin.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <button
              onClick={() => setSelectedRole('customer')}
              className={`rounded-3xl border p-6 text-left transition ${
                selectedRole === 'customer'
                  ? 'border-orange-500 bg-orange-500/10 text-white'
                  : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-orange-500'
              }`}
            >
              <h2 className="text-xl font-semibold">Müşteri</h2>
              <p className="mt-2 text-slate-400">3D baskı talepleri oluşturun, teklifler alın ve siparişlerinizi yönetin.</p>
            </button>

            <button
              onClick={() => setSelectedRole('producer')}
              className={`rounded-3xl border p-6 text-left transition ${
                selectedRole === 'producer'
                  ? 'border-orange-500 bg-orange-500/10 text-white'
                  : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-orange-500'
              }`}
            >
              <h2 className="text-xl font-semibold">Üretici</h2>
              <p className="mt-2 text-slate-400">Ürünlerinizi listeleyin, teklifler verin ve siparişleri yönetin.</p>
            </button>
          </div>

          <button
            onClick={handleRoleSelect}
            className="mt-10 w-full rounded-3xl bg-orange-500 px-6 py-4 text-base font-semibold text-slate-950 transition hover:bg-orange-400"
          >
            Seçimi Kaydet ve Devam Et
          </button>
        </div>
      </div>
    </div>
  )
}
