'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../utils/supabase'
import { User } from '@supabase/supabase-js'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Kullanıcı rolünü kontrol et
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()

        if (userData?.role === 'customer') {
          router.push('/dashboard/customer')
        } else if (userData?.role === 'producer') {
          router.push('/dashboard/producer')
        } else {
          // Kullanıcı henüz rol seçmemiş veya rol bilgisi eksik, rol seçme sayfasına yönlendir
          router.push('/role-selection')
        }
      } else {
        // Kullanıcı giriş yapmamış, login sayfasına yönlendir
        router.push('/login')
      }

      setLoading(false)
    }

    getUser()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-white">Yükleniyor...</div>
      </div>
    )
  }

  return null
}