'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../utils/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState('Oturum oluşturuluyor...')

  useEffect(() => {
    const redirectByRole = async (userId: string) => {
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()

      console.log('[auth/callback] Rol kontrolü:', { userId, role: profile?.role ?? 'yok' })

      if (profile?.role) {
        console.log('[auth/callback] Rol mevcut → /dashboard')
        router.push('/dashboard')
      } else {
        console.log('[auth/callback] Rol yok → /role-selection')
        router.push('/role-selection')
      }
    }

    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      const oauthError = params.get('error')
      const oauthErrorDesc = params.get('error_description')

      console.log('[auth/callback] Sayfa yüklendi')
      console.log('[auth/callback] URL:', window.location.href)
      console.log('[auth/callback] code:', code ? 'mevcut' : 'yok')

      if (oauthError) {
        console.error('[auth/callback] OAuth hatası:', oauthError, oauthErrorDesc)
        router.push(`/login?error=${oauthError}`)
        return
      }

      if (code) {
        console.log('[auth/callback] Code bulundu, session oluşturuluyor...')
        setStatus('Kimlik doğrulanıyor...')

        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        console.log('[auth/callback] Exchange sonucu:', {
          user: data.session?.user?.email ?? 'yok',
          error: error?.message ?? 'yok',
        })

        if (error) {
          console.error('[auth/callback] Exchange hatası:', error.message)
          router.push('/login?error=exchange_failed')
          return
        }

        if (data.session) {
          await redirectByRole(data.session.user.id)
          return
        }
      }

      // Fallback: mevcut session kontrolü
      const { data: { session } } = await supabase.auth.getSession()
      console.log('[auth/callback] Mevcut session:', session?.user?.email ?? 'yok')

      if (session) {
        await redirectByRole(session.user.id)
        return
      }

      console.log('[auth/callback] Session bulunamadı, login sayfasına dönülüyor')
      setStatus('Oturum bulunamadı, yönlendiriliyorsunuz...')
      setTimeout(() => router.push('/login?error=no_session'), 2000)
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-600 text-sm">{status}</p>
      </div>
    </div>
  )
}
