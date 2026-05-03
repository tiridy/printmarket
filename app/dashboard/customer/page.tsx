'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../utils/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface User {
  id: string
  email: string
  role: string
}

interface Request {
  id: string
  title: string
  description: string
  status: string
  created_at: string
}

interface Order {
  id: string
  total_price: number
  status: string
  created_at: string
}

export default function CustomerDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [requests, setRequests] = useState<Request[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Get user profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'customer') {
        router.push('/dashboard/producer')
        return
      }

      setUser(profile)

      // Get user's requests
      const { data: userRequests } = await supabase
        .from('requests')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false })

      setRequests(userRequests || [])

      // Get user's orders
      const { data: userOrders } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false })

      setOrders(userOrders || [])
    }

    getUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (!user) return <div>Yükleniyor...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Müşteri Paneli</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user.email}</span>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800"
              >
                Çıkış
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Hızlı İşlemler</h2>
          <div className="flex space-x-4">
            <Link
              href="/create-request"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Yeni Talep Oluştur
            </Link>
            <Link
              href="/browse-products"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Ürünlere Göz At
            </Link>
          </div>
        </div>

        {/* My Requests */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Taleplerim</h2>
          <div className="bg-white shadow rounded-lg">
            {requests.length === 0 ? (
              <p className="p-6 text-gray-500">Henüz talep oluşturmadınız.</p>
            ) : (
              <div className="divide-y divide-gray-200">
                {requests.map((request) => (
                  <div key={request.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">{request.title}</h3>
                        <p className="text-gray-600 mt-1">{request.description}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Oluşturulma: {new Date(request.created_at).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        request.status === 'open' ? 'bg-green-100 text-green-800' :
                        request.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {request.status === 'open' ? 'Açık' :
                         request.status === 'closed' ? 'Kapalı' : 'Tamamlandı'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* My Orders */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Siparişlerim</h2>
          <div className="bg-white shadow rounded-lg">
            {orders.length === 0 ? (
              <p className="p-6 text-gray-500">Henüz sipariş vermediniz.</p>
            ) : (
              <div className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <div key={order.id} className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-medium">Sipariş #{order.id.slice(-8)}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">${order.total_price}</p>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status === 'pending' ? 'Bekliyor' :
                           order.status === 'confirmed' ? 'Onaylandı' :
                           order.status === 'in_progress' ? 'Üretimde' :
                           order.status === 'shipped' ? 'Gönderildi' :
                           order.status === 'delivered' ? 'Teslim Edildi' : 'İptal'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}