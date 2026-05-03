'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../utils/supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Register() {
  const router = useRouter()
  const [redirectTo, setRedirectTo] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRedirectTo(`${window.location.origin}/dashboard`)
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.push('/dashboard')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            TİRİDY'ye Kayıt Ol
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Zaten hesabınız var mı?{' '}
            <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Giriş yapın
            </a>
          </p>
        </div>
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {redirectTo ? (
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              view="sign_up"
              providers={['google', 'apple']}
              redirectTo={redirectTo}
              onlyThirdPartyProviders={false}
              localization={{
                variables: {
                  sign_up: {
                    email_label: 'E-posta adresi',
                    password_label: 'Şifre',
                    button_label: 'Kayıt Ol',
                    loading_button_label: 'Kayıt olunuyor...',
                    social_provider_text: '{{provider}} ile kayıt ol',
                    link_text: 'Zaten hesabınız var mı? Giriş yapın',
                  },
                },
              }}
            />
          ) : (
            <div className="py-10 text-center text-slate-500">Yönlendirme hazırlanıyor...</div>
          )}
        </div>
      </div>
    </div>
  )
}
