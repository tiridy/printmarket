'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../utils/supabase'
import { User } from '@supabase/supabase-js'

interface UserData { role: string; full_name: string }

const NAV: Record<string, { href: string; label: string; icon: string }[]> = {
  producer: [
    { href: '/dashboard/producer',  label: 'Ana Sayfa',       icon: '🏠' },
    { href: '/dashboard/producer',  label: 'Siparişlerim',    icon: '🛒' },
    { href: '/dashboard/producer',  label: 'Tekliflerim',     icon: '💬' },
    { href: '/dashboard/producer',  label: 'Ürünlerim',       icon: '📦' },
    { href: '/explore',             label: 'Pazaryeri',       icon: '🔍' },
  ],
  customer: [
    { href: '/dashboard/customer',  label: 'Ana Sayfa',       icon: '🏠' },
    { href: '/dashboard/customer',  label: 'Siparişlerim',    icon: '📦' },
    { href: '/dashboard/customer',  label: 'Taleplerim',      icon: '📋' },
    { href: '/dashboard/customer',  label: 'Teklifler',       icon: '💬' },
    { href: '/explore',             label: 'Üreticiler',      icon: '🏭' },
  ],
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [user,     setUser]     = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data } = await supabase.from('users').select('role, full_name').eq('id', user.id).single()
      setUserData({ role: data?.role ?? '', full_name: data?.full_name ?? '' })
      setLoading(false)
    }
    init()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex items-center gap-2 text-gray-400">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-orange-500" />
        <span className="text-sm">Yükleniyor...</span>
      </div>
    </div>
  )

  const role      = userData?.role ?? ''
  const navItems  = NAV[role] ?? NAV.customer
  const isProducer = role === 'producer'
  const initials  = userData?.full_name
    ? userData.full_name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : (user?.email?.[0] ?? '?').toUpperCase()
  const displayName = userData?.full_name || user?.email || ''

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ─── Top Navbar ─── */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between h-14 px-6 max-w-screen-xl mx-auto">

          {/* Logo */}
          <Link
            href={isProducer ? '/dashboard/producer' : '/dashboard/customer'}
            className="text-xl font-black tracking-tight text-orange-500 select-none"
          >
            TİRİDY
          </Link>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            <button
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              title="Mesajlar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
            <button
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              title="Bildirimler"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            {/* User */}
            <button
              onClick={() => router.push('/dashboard/profile')}
              className="flex items-center gap-2 ml-2 pl-3 pr-2 py-1.5 rounded-xl hover:bg-gray-100 transition-colors border-l border-gray-200"
            >
              <div className="h-7 w-7 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                {initials}
              </div>
              <span className="text-sm font-medium text-gray-700 max-w-[140px] truncate hidden sm:block">
                {displayName}
              </span>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ─── Body: Sidebar + Content ─── */}
      <div className="flex max-w-screen-xl mx-auto">

        {/* Sidebar */}
        <aside className="w-52 shrink-0 sticky top-14 h-[calc(100vh-56px)] overflow-y-auto bg-white border-r border-gray-200 py-4 flex flex-col">
          <nav className="flex-1 px-3 space-y-0.5">
            {navItems.map((item, idx) => {
              const isActive = idx === 0 && (pathname === item.href)
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Bottom section */}
          <div className="px-3 pt-3 border-t border-gray-100 space-y-0.5">
            <p className="px-3 mb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {isProducer ? 'ÜRETİCİ' : 'MÜŞTERİ'}
            </p>
            <Link
              href="/dashboard/profile"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/dashboard/profile'
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-base">⚙️</span>
              <span>Profil Ayarları</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <span className="text-base">🚪</span>
              <span>Çıkış Yap</span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  )
}
