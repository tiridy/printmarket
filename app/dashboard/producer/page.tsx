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
  status: 'pending' | 'accepted' | 'rejected'
  request: { title: string; customer_id: string }
}

interface Order {
  id: string
  total_price: number
  status: 'pending' | 'confirmed' | 'in_progress' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
  customer: { email: string }
}

type Tab = 'products' | 'offers' | 'orders'

const STATUS_ORDER: Record<string, { label: string; cls: string }> = {
  pending:     { label: 'Bekliyor',       cls: 'bg-yellow-500/15 text-yellow-400' },
  confirmed:   { label: 'Onaylandı',      cls: 'bg-blue-500/15 text-blue-400' },
  in_progress: { label: 'Üretimde',       cls: 'bg-orange-500/15 text-orange-400' },
  shipped:     { label: 'Kargoda',        cls: 'bg-purple-500/15 text-purple-400' },
  delivered:   { label: 'Teslim Edildi',  cls: 'bg-green-500/15 text-green-400' },
  cancelled:   { label: 'İptal Edildi',   cls: 'bg-red-500/15 text-red-400' },
}

function Badge({ status, map }: { status: string; map: Record<string, { label: string; cls: string }> }) {
  const s = map[status] ?? { label: status, cls: 'bg-slate-500/15 text-slate-400' }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${s.cls}`}>
      {s.label}
    </span>
  )
}

function initials(email: string) {
  return email.slice(0, 2).toUpperCase()
}

function EmptyState({ icon, title, description, action }: {
  icon: string; title: string; description: string; action?: string
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/50 p-12 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-2xl">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-300">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      {action && (
        <button className="mt-4 rounded-xl bg-orange-500 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-orange-400 transition-colors">
          {action}
        </button>
      )}
    </div>
  )
}

export default function ProducerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<ProducerProfile | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('products')

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: userData } = await supabase
        .from('users').select('role').eq('id', user.id).single()

      if (userData?.role !== 'producer') { router.push('/dashboard'); return }

      setUser(user)

      const { data: profileData } = await supabase
        .from('producer_profiles').select('*').eq('user_id', user.id).single()

      setProfile(profileData)

      const [{ data: prod }, { data: off }, { data: ord }] = await Promise.all([
        supabase.from('products').select('*').eq('producer_id', profileData?.id).order('created_at', { ascending: false }),
        supabase.from('offers').select('*, request:requests(title, customer_id)').eq('producer_id', profileData?.id).order('created_at', { ascending: false }),
        supabase.from('orders').select('*, customer:users(email)').eq('producer_id', user.id).order('created_at', { ascending: false }),
      ])

      setProducts(prod ?? [])
      setOffers(off ?? [])
      setOrders(ord ?? [])
      setLoading(false)
    }
    init()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-600 border-t-orange-400" />
          Yükleniyor...
        </div>
      </div>
    )
  }

  const pendingOffers = offers.filter(o => o.status === 'pending').length
  const activeOrders = orders.filter(o => ['confirmed', 'in_progress'].includes(o.status)).length
  const totalRevenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.total_price, 0)

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'products', label: 'Ürünlerim',  count: products.length },
    { key: 'offers',   label: 'Tekliflerim', count: offers.length },
    { key: 'orders',   label: 'Siparişler',  count: orders.length },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <span className="text-xl font-bold tracking-tight text-orange-400">TİRİDY</span>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-200">{profile?.company_name ?? user?.email}</p>
              <p className="text-xs text-slate-500">Üretici</p>
            </div>
            <button
              onClick={() => router.push('/dashboard/profile')}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/20 text-sm font-bold text-orange-400 hover:bg-orange-500/30 transition-colors"
              title="Profil Ayarları"
            >
              {user?.email ? initials(user.email) : '?'}
            </button>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:border-slate-500 hover:text-slate-200 transition-colors"
            >
              Çıkış
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* Welcome + Profile */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Üretici Paneli</h1>
            {profile ? (
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-400">
                <span>🏭 {profile.company_name}</span>
                {profile.location && <span>📍 {profile.location}</span>}
                {profile.rating > 0 && <span>⭐ {profile.rating.toFixed(1)}</span>}
              </div>
            ) : (
              <p className="mt-1 text-sm text-yellow-400">Henüz profil oluşturulmadı.</p>
            )}
          </div>
          <div className="flex gap-3">
            <button className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-orange-400 transition-colors">
              + Ürün Ekle
            </button>
            <button className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-slate-500 transition-colors">
              Talepleri İncele
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Bekleyen Teklif', value: pendingOffers,                          icon: '💬', color: 'text-yellow-400' },
            { label: 'Aktif Sipariş',   value: activeOrders,                            icon: '🔧', color: 'text-orange-400' },
            { label: 'Toplam Gelir',    value: `₺${totalRevenue.toLocaleString('tr-TR')}`, icon: '💰', color: 'text-green-400' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">{s.label}</p>
                <span className="text-xl">{s.icon}</span>
              </div>
              <p className={`mt-2 text-3xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div>
          <div className="flex gap-1 rounded-xl bg-slate-900 p-1 w-fit">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  tab === t.key
                    ? 'bg-orange-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
                <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                  tab === t.key ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-slate-500'
                }`}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {/* Products */}
          {tab === 'products' && (
            <div className="mt-6">
              {products.length === 0 ? (
                <EmptyState
                  icon="📦"
                  title="Henüz ürün eklemediniz"
                  description="İlk ürününüzü ekleyin, müşteriler kataloğunuzu görsün."
                  action="+ Ürün Ekle"
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map(p => (
                    <div key={p.id} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-semibold text-slate-100">{p.name}</h3>
                          <p className="mt-1 text-xs text-slate-500">{p.category}</p>
                        </div>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
                          p.stock_quantity > 0 ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
                        }`}>
                          {p.stock_quantity > 0 ? `${p.stock_quantity} stok` : 'Tükendi'}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-slate-400 line-clamp-2">{p.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-lg font-bold text-orange-400">₺{p.price.toLocaleString('tr-TR')}</span>
                        <div className="flex gap-2">
                          <button className="rounded-lg border border-slate-700 px-2.5 py-1 text-xs hover:border-slate-500 transition-colors">
                            Düzenle
                          </button>
                          <button className="rounded-lg border border-red-900/50 px-2.5 py-1 text-xs text-red-400 hover:bg-red-900/20 transition-colors">
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

          {/* Offers */}
          {tab === 'offers' && (
            <div className="mt-6 space-y-3">
              {offers.length === 0 ? (
                <EmptyState
                  icon="💬"
                  title="Henüz teklif vermediniz"
                  description="Müşteri taleplerini inceleyip teklif gönderebilirsiniz."
                  action="Talepleri İncele"
                />
              ) : offers.map(o => (
                <div key={o.id} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-slate-100">{o.request.title}</h3>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          o.status === 'pending'  ? 'bg-yellow-500/15 text-yellow-400' :
                          o.status === 'accepted' ? 'bg-green-500/15 text-green-400' :
                                                    'bg-red-500/15 text-red-400'
                        }`}>
                          {o.status === 'pending' ? 'Bekliyor' : o.status === 'accepted' ? 'Kabul Edildi' : 'Reddedildi'}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-400">{o.description}</p>
                      <div className="mt-3 flex gap-4 text-xs text-slate-500">
                        <span>💰 ₺{o.price.toLocaleString('tr-TR')}</span>
                        <span>⏱ {o.estimated_time} gün</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Orders */}
          {tab === 'orders' && (
            <div className="mt-6 space-y-3">
              {orders.length === 0 ? (
                <EmptyState
                  icon="🔧"
                  title="Henüz sipariş yok"
                  description="Teklifiniz kabul edildiğinde siparişler burada görünecektir."
                />
              ) : orders.map(o => (
                <div key={o.id} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-slate-100">{o.customer.email}</h3>
                        <Badge status={o.status} map={STATUS_ORDER} />
                      </div>
                      <div className="mt-2 flex gap-4 text-xs text-slate-500">
                        <span>💰 ₺{o.total_price.toLocaleString('tr-TR')}</span>
                        <span>📅 {new Date(o.created_at).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2">
                      {o.status === 'pending' && (
                        <button className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium hover:bg-green-500 transition-colors">
                          Onayla
                        </button>
                      )}
                      {o.status === 'confirmed' && (
                        <button className="rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-medium hover:bg-orange-500 transition-colors">
                          Üretime Al
                        </button>
                      )}
                      {o.status === 'in_progress' && (
                        <button className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-medium hover:bg-purple-500 transition-colors">
                          Kargoya Ver
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
