'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../utils/supabase'

export default function LandingNav() {
  const [role, setRole] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data } = await supabase.from('users').select('role').eq('id', user.id).single()
        setRole(data?.role ?? 'customer')
      }
      setLoaded(true)
    })
  }, [])

  const dashHref = role === 'producer' ? '/dashboard/producer' : '/dashboard/customer'

  return (
    <header className="sticky top-0 z-30 glass-dark" style={{ borderBottom: '1px solid var(--color-surface-overlay)' }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="text-2xl font-black tracking-tight select-none" style={{ color: 'var(--color-brand-500)' }}>
          TİRİDY
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {[['Keşfet', '/explore'], ['Sipariş Ver', '/order/new'], ['Özellikler', '#features'], ['Nasıl', '#how']].map(([label, href]) => (
            <Link key={label} href={href} className="text-sm font-medium transition hover:text-white" style={{ color: 'var(--color-neutral-400)' }}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Yüklenmeden önce boş göster (layout kaymasını önlemek için) */}
          {!loaded ? (
            <div className="h-8 w-32" />
          ) : role ? (
            <Link href={dashHref} className="btn btn-primary btn-sm">Panele Git</Link>
          ) : (
            <>
              <Link href="/login" className="btn btn-outline-dark btn-sm hidden sm:inline-flex">Giriş Yap</Link>
              <Link href="/register" className="btn btn-primary btn-sm">Ücretsiz Başla</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
