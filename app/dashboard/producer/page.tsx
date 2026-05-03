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

interface Product {
  id: string
  name: string
  price: number
  stock_quantity: number
  created_at: string
}

interface Offer {
  id: string
  request_id: string
  price: number
  status: string
  created_at: string
}

interface Order {
  id: string
  total_price: number
  status: string
  created_at: string
}

export default function ProducerDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
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

      if (profile?.role !== 'producer') {
        router.push('/dashboard/customer')
        return
      }

      setUser(profile)

      // Get producer profile
      const { data: producerProfile } = await supabase
        .from('producer_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!producerProfile) {
        // Redirect to create profile
        router.push('/create-profile')
        return
      }

      // Get producer's products
      const { data: userProducts } = await supabase
        .from('products')
        .select('*')
        .eq('producer_id', producerProfile.id)
        .order('created_at', { ascending: false })

      setProducts(userProducts || [])

      // Get producer's offers
      const { data: userOffers } = await supabase
        .from('offers')
        .select('*')
        .eq('producer_id', producerProfile.id)
        .order('created_at', { ascending: false })

      setOffers(userOffers || [])

      // Get producer's orders
      const { data: userOrders } = await supabase
        .from('orders')
        .select('*')
        .eq('producer_id', producerProfile.id)
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
            <h1 className="text-2xl font-bold text-gray-900">Üretici Paneli</h1>
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
              href="/create-product"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Yeni Ürün Ekle
            </Link>
            <Link
              href="/browse-requests"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Taleplere Göz At
            </Link>
          </div>
        </div>

        {/* My Products */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Ürünlerim</h2>
          <div className="bg-white shadow rounded-lg">
            {products.length === 0 ? (
              <p className="p-6 text-gray-500">Henüz ürün eklemediniz.</p>
            ) : (
              <div className="divide-y divide-gray-200">
                {products.map((product) => (
                  <div key={product.id} className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium">{product.name}</h3>
                        <p className="text-sm text-gray-500">
                          Stok: {product.stock_quantity} | Oluşturulma: {new Date(product.created_at).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">${product.price}</p>
                        <Link
                          href={`/edit-product/${product.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Düzenle
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* My Offers */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Tekliflerim</h2>
          <div className="bg-white shadow rounded-lg">
            {offers.length === 0 ? (
              <p className="p-6 text-gray-500">Henüz teklif vermediniz.</p>
            ) : (
              <div className="divide-y divide-gray-200">
                {offers.map((offer) => (
                  <div key={offer.id} className="p-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-medium">Teklif #{offer.id.slice(-8)}</p>
                        <p className="text-sm text-gray-500">
                          Talep ID: {offer.request_id.slice(-8)} | {new Date(offer.created_at).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">${offer.price}</p>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          offer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          offer.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {offer.status === 'pending' ? 'Bekliyor' :
                           offer.status === 'accepted' ? 'Kabul Edildi' : 'Reddedildi'}
                        </span>
                      </div>
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
              <p className="p-6 text-gray-500">Henüz sipariş almadınız.</p>
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