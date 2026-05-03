'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../utils/supabase'
import { User } from '@supabase/supabase-js'

interface Request {
  id: string
  title: string
  description: string
  category: string
  budget: number
  deadline: string
  status: string
  created_at: string
}

interface Offer {
  id: string
  price: number
  description: string
  estimated_time: number
  status: string
  producer: {
    company_name: string
  }
  request: {
    title: string
  }
}

interface Order {
  id: string
  total_price: number
  status: string
  created_at: string
  producer: {
    company_name: string
  }
}

export default function CustomerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [requests, setRequests] = useState<Request[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('requests')

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

      if (userData?.role !== 'customer') {
        router.push('/dashboard')
        return
      }

      // Talepleri yükle
      const { data: requestsData } = await supabase
        .from('requests')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false })

      setRequests(requestsData || [])

      // Teklifleri yükle
      const { data: offersData } = await supabase
        .from('offers')
        .select(`
          *,
          producer:producer_profiles(company_name),
          request:requests(title)
        `)
        .eq('request.customer_id', user.id)
        .order('created_at', { ascending: false })

      setOffers(offersData || [])

      // Siparişleri yükle
      const { data: ordersData } = await supabase
        .from('orders')
        .select(`
          *,
          producer:producer_profiles(company_name)
        `)
        .eq('customer_id', user.id)
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
            <h1 className="text-2xl font-bold text-orange-400">TİRİDY - Müşteri Paneli</h1>
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
        {/* Quick Actions */}
        <div className="mb-8 rounded-lg border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-4 text-xl font-semibold">Hızlı İşlemler</h2>
          <div className="flex flex-wrap gap-4">
            <button className="rounded-lg bg-orange-500 px-6 py-3 text-sm hover:bg-orange-600">
              Yeni Talep Oluştur
            </button>
            <button className="rounded-lg bg-slate-800 px-6 py-3 text-sm hover:bg-slate-700">
              Ürünlere Göz At
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex space-x-1 rounded-lg bg-slate-800 p-1">
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'requests'
                ? 'bg-orange-500 text-white'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Taleplerim ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'offers'
                ? 'bg-orange-500 text-white'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Teklifler ({offers.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'orders'
                ? 'bg-orange-500 text-white'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Siparişlerim ({orders.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Taleplerim</h2>
              <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm hover:bg-orange-600">
                Yeni Talep Oluştur
              </button>
            </div>

            {requests.length === 0 ? (
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-8 text-center">
                <p className="text-slate-400">Henüz hiç talep oluşturmadınız.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {requests.map((request) => (
                  <div key={request.id} className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{request.title}</h3>
                        <p className="mt-2 text-slate-400">{request.description}</p>
                        <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                          <span>Kategori: {request.category}</span>
                          <span>Bütçe: ₺{request.budget}</span>
                          <span>Son Tarih: {new Date(request.deadline).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                          request.status === 'open'
                            ? 'bg-green-500/20 text-green-400'
                            : request.status === 'closed'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {request.status === 'open' ? 'Açık' :
                           request.status === 'closed' ? 'Kapalı' : 'Tamamlandı'}
                        </span>
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
            <h2 className="text-xl font-semibold">Gelen Teklifler</h2>

            {offers.length === 0 ? (
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-8 text-center">
                <p className="text-slate-400">Henüz hiç teklif almadınız.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {offers.map((offer) => (
                  <div key={offer.id} className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{offer.producer.company_name}</h3>
                        <p className="text-slate-400">{offer.request.title}</p>
                        <p className="mt-2 text-slate-300">{offer.description}</p>
                        <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                          <span>Fiyat: ₺{offer.price}</span>
                          <span>Teslim Süresi: {offer.estimated_time} gün</span>
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col gap-2">
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
                        {offer.status === 'pending' && (
                          <div className="flex gap-2">
                            <button className="rounded bg-green-600 px-3 py-1 text-xs hover:bg-green-700">
                              Kabul Et
                            </button>
                            <button className="rounded bg-red-600 px-3 py-1 text-xs hover:bg-red-700">
                              Reddet
                            </button>
                          </div>
                        )}
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
                        <h3 className="text-lg font-semibold">{order.producer.company_name}</h3>
                        <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                          <span>Toplam: ₺{order.total_price}</span>
                          <span>Tarih: {new Date(order.created_at).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </div>
                      <div className="ml-4">
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