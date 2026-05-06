'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../utils/supabase'
import { User } from '@supabase/supabase-js'

interface UserData { role: string; full_name: string; avatar_url?: string | null }

const NAV: Record<string, { href: string; label: string; icon: ReactNode }[]> = {
  producer: [
    { href: '/dashboard/producer', label: 'Ana Sayfa',    icon: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg> },
    { href: '/dashboard/producer', label: 'Siparişlerim', icon: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/></svg> },
    { href: '/dashboard/producer', label: 'Tekliflerim',  icon: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd"/></svg> },
    { href: '/dashboard/producer', label: 'Ürünlerim',    icon: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/></svg> },
    { href: '/explore',            label: 'Pazaryeri',    icon: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/></svg> },
  ],
  customer: [
    { href: '/dashboard/customer', label: 'Ana Sayfa',    icon: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg> },
    { href: '/dashboard/customer', label: 'Siparişlerim', icon: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/></svg> },
    { href: '/dashboard/customer', label: 'Taleplerim',   icon: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/></svg> },
    { href: '/dashboard/customer', label: 'Teklifler',    icon: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd"/></svg> },
    { href: '/explore',            label: 'Üreticiler',   icon: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/></svg> },
  ],
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [user,     setUser]     = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    // İlk yüklemede mevcut session'ı kontrol et (ağ isteği YOK — localStorage'dan okur)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.push('/login')
        return
      }
      setUser(session.user)
      await loadUserData(session.user.id, session.user)
      setLoading(false)
    })

    // Oturum değişikliklerini dinle (sekme değişimi, token yenileme vb.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/login')
        return
      }
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(session.user)
        await loadUserData(session.user.id, session.user)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const loadUserData = async (userId: string, authUser: User) => {
    const { data } = await supabase
      .from('users')
      .select('role, full_name, avatar_url')
      .eq('id', userId)
      .single()

    // Google/OAuth ile giriş yapıldıysa avatar_url'yi otomatik kaydet
    const googleAvatar = authUser.user_metadata?.avatar_url ?? authUser.user_metadata?.picture ?? null
    const avatarUrl = data?.avatar_url ?? googleAvatar ?? null

    if (googleAvatar && !data?.avatar_url) {
      await supabase.from('users').update({ avatar_url: googleAvatar }).eq('id', userId)
    }

    setUserData({
      role:       data?.role ?? '',
      full_name:  data?.full_name ?? '',
      avatar_url: avatarUrl,
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--color-neutral-50)' }}>
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-orange-500" />
    </div>
  )

  const role       = userData?.role ?? ''
  const navItems   = NAV[role] ?? NAV.customer
  const isProducer = role === 'producer'
  const avatarUrl  = userData?.avatar_url ?? null
  const initials   = userData?.full_name
    ? userData.full_name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : (user?.email?.[0] ?? '?').toUpperCase()
  const displayName = userData?.full_name || user?.email || ''

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-neutral-50)' }}>

      {/* Navbar */}
      <header className="sticky top-0 z-20 glass-light" style={{ borderBottom: '1px solid var(--color-neutral-200)' }}>
        <div className="flex items-center justify-between h-14 px-6 max-w-screen-xl mx-auto">
          <Link href={isProducer ? '/dashboard/producer' : '/dashboard/customer'}
            className="text-xl font-black select-none" style={{ color: 'var(--color-brand-500)' }}>
            TİRİDY
          </Link>

          <div className="flex items-center gap-1">
            {/* Messages */}
            <Link href="#" className="p-2 rounded-lg transition hover:bg-gray-100" style={{ color: 'var(--color-neutral-400)' }} title="Mesajlar">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </Link>

            {/* New order (customers only) */}
            {!isProducer && (
              <Link href="/order/new" className="btn btn-primary btn-sm mx-2">
                + Sipariş Ver
              </Link>
            )}

            {/* User */}
            <button onClick={() => router.push('/dashboard/profile')}
              className="flex items-center gap-2 ml-1 pl-3 pr-2 py-1.5 rounded-xl transition hover:bg-gray-100"
              style={{ borderLeft: '1px solid var(--color-neutral-200)' }}>
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt={initials} referrerPolicy="no-referrer"
                  className="h-7 w-7 rounded-full object-cover shrink-0" />
              ) : (
                <div className="avatar avatar-sm" style={{ background: 'var(--color-brand-500)' }}>{initials}</div>
              )}
              <span className="text-sm font-medium hidden sm:block max-w-[140px] truncate" style={{ color: 'var(--color-neutral-700)' }}>
                {displayName}
              </span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--color-neutral-400)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex max-w-screen-xl mx-auto">

        {/* Sidebar */}
        <aside className="w-52 shrink-0 sticky top-14 h-[calc(100vh-56px)] overflow-y-auto flex flex-col py-4"
          style={{ background: 'var(--color-neutral-0)', borderRight: '1px solid var(--color-neutral-200)' }}>
          <nav className="flex-1 px-3 space-y-0.5">
            {navItems.map((item, idx) => {
              const isActive = pathname === item.href && idx === 0
              return (
                <Link key={idx} href={item.href}
                  className={`nav-item ${isActive ? 'nav-item-active' : ''}`}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Bottom */}
          <div className="px-3 pt-3 space-y-0.5" style={{ borderTop: '1px solid var(--color-neutral-100)' }}>
            <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-neutral-400)' }}>
              {isProducer ? 'ÜRETİCİ' : 'MÜŞTERİ'}
            </p>
            <Link href="/dashboard/profile"
              className={`nav-item ${pathname === '/dashboard/profile' ? 'nav-item-active' : ''}`}>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
              </svg>
              <span>Profil Ayarları</span>
            </Link>
            <button onClick={handleLogout}
              className="nav-item w-full text-left transition hover:!bg-red-50 hover:!text-red-600">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
              </svg>
              <span>Çıkış Yap</span>
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 px-8 py-6">{children}</main>
      </div>
    </div>
  )
}
