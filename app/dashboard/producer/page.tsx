'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../utils/supabase'
import { User } from '@supabase/supabase-js'

interface ProducerProfile {
  id: string
  company_name: string
  description: string
  location: string
  rating: number
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock_quantity: number
  created_at: string
}

interface Offer {
  id: string
  price: number
  description: string
  estimated_time: number
  status: string
  request: {
    title: string
    customer_id: string
  }
}

interface Order {
  id: string
  total_price: number
  status: string
  created_at: string
  customer: {
    email: string
  }
}

export default function ProducerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<ProducerProfile | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('products')

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (!user) {
        router.push('/login')
        return
      }

      // Kullanıcı rolünü kontrol et
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (userData?.role !== 'producer') {
        router.push('/dashboard')
        return
      }

      // Üretici profilini yükle
      const { data: profileData } = await supabase
        .from('producer_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      setProfile(profileData)

      // Ürünleri yükle
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('producer_id', profileData?.id)
        .order('created_at', { ascending: false })

      setProducts(productsData || [])

      // Teklifleri yükle
      const { data: offersData } = await supabase
        .from('offers')
        .select(`
          *,
          request:requests(title, customer_id)
        `)
        .eq('producer_id', profileData?.id)
        .order('created_at', { ascending: false })

      setOffers(offersData || [])

      // Siparişleri yükle
      const { data: ordersData } = await supabase
        .from('orders')
        .select(`
          *,
          customer:users(email)
        `)
        .eq('producer_id', user.id)
        .order('created_at', { ascending: false })

      setOrders(ordersData || [])

      setLoading(false)
    }

    getUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-white">Yükleniyor...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/95">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-orange-400">TİRİDY - Üretici Paneli</h1>
            <div className="flex items-center gap-4">
              <span className="text-slate-300">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Profile Info */}
        {profile && (
          <div className="mb-8 rounded-lg border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">{profile.company_name}</h2>
                <p className="mt-2 text-slate-400">{profile.description}</p>
                <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                  <span>Konum: {profile.location}</span>
                  <span>Rating: ⭐ {profile.rating.toFixed(1)}</span>
                </div>
              </div>
              <button className="rounded-lg bg-slate-800 px-4 py-2 text-sm hover:bg-slate-700">
                Profili Düzenle
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8 rounded-lg border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">Hızlı İşlemler</h2>
          <div className="flex flex-wrap gap-4">
            <button className="rounded-lg bg-orange-500 px-6 py-3 text-sm hover:bg-orange-600">
              Ürün Ekle
            </button>
            <button className="rounded-lg bg-slate-800 px-6 py-3 text-sm hover:bg-slate-700">
              Talepleri İncele
            </button>
            <button className="rounded-lg bg-slate-800 px-6 py-3 text-sm hover:bg-slate-700">
              Tekliflerim
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex space-x-1 rounded-lg bg-slate-800 p-1">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'products'
                ? 'bg-orange-500 text-white'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Ürünlerim ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'offers'
                ? 'bg-orange-500 text-white'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Tekliflerim ({offers.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'orders'
                ? 'bg-orange-500 text-white'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Siparişler ({orders.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Ürünlerim</h2>
              <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm hover:bg-orange-600">
                Yeni Ürün Ekle
              </button>
            </div>

            {products.length === 0 ? (
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-8 text-center">
                <p className="text-slate-400">Henüz hiç ürün eklemediniz.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <div key={product.id} className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                    <div className="flex flex-col">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="mt-2 text-slate-400 text-sm">{product.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-lg font-bold text-orange-400">₺{product.price}</span>
                        <span className="text-sm text-slate-500">Stok: {product.stock_quantity}</span>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button className="flex-1 rounded bg-slate-800 py-2 text-xs hover:bg-slate-700">
                          Düzenle
                        </button>
                        <button className="flex-1 rounded bg-red-600 py-2 text-xs hover:bg-red-700">
                          Sil
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'offers' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Verdiğim Teklifler</h2>

            {offers.length === 0 ? (
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-8 text-center">
                <p className="text-slate-400">Henüz hiç teklif vermediniz.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {offers.map((offer) => (
                  <div key={offer.id} className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{offer.request.title}</h3>
                        <p className="mt-2 text-slate-300">{offer.description}</p>
                        <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                          <span>Fiyat: ₺{offer.price}</span>
                          <span>Teslim Süresi: {offer.estimated_time} gün</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                          offer.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : offer.status === 'accepted'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
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
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Siparişlerim</h2>

            {orders.length === 0 ? (
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-8 text-center">
                <p className="text-slate-400">Henüz hiç siparişiniz yok.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {orders.map((order) => (
                  <div key={order.id} className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{order.customer.email}</h3>
                        <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                          <span>Toplam: ₺{order.total_price}</span>
                          <span>Tarih: {new Date(order.created_at).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                          order.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : order.status === 'confirmed'
                            ? 'bg-blue-500/20 text-blue-400'
                            : order.status === 'in_progress'
                            ? 'bg-orange-500/20 text-orange-400'
                            : order.status === 'shipped'
                            ? 'bg-purple-500/20 text-purple-400'
                            : order.status === 'delivered'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {order.status === 'pending' ? 'Bekliyor' :
                           order.status === 'confirmed' ? 'Onaylandı' :
                           order.status === 'in_progress' ? 'Üretimde' :
                           order.status === 'shipped' ? 'Kargoda' :
                           order.status === 'delivered' ? 'Teslim Edildi' : 'İptal Edildi'}
                        </span>
                        {order.status === 'pending' && (
                          <button className="rounded bg-green-600 px-3 py-1 text-xs hover:bg-green-700">
                            Onayla
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}