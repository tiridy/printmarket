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
  verification_status: 'unverified' | 'pending' | 'approved' | 'rejected'
  verification_note: string | null
}

interface Product {
  id: string; name: string; description: string
  price: number; category: string; stock_quantity: number; created_at: string
}

interface Offer {
  id: string; price: number; description: string; estimated_time: number
  status: 'pending' | 'accepted' | 'rejected'
  request: { title: string; customer_id: string }
}

interface Order {
  id: string; total_price: number; created_at: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'shipped' | 'delivered' | 'cancelled'
  customer: { email: string }
}

type Tab = 'products' | 'offers' | 'orders'

const STATUS_ORDER: Record<string, { label: string; cls: string }> = {
  pending:     { label: 'Bekliyor',       cls: 'bg-yellow-100 text-yellow-700' },
  confirmed:   { label: 'Onaylandı',      cls: 'bg-blue-100 text-blue-700' },
  in_progress: { label: 'Üretimde',       cls: 'bg-orange-100 text-orange-700' },
  shipped:     { label: 'Kargoda',        cls: 'bg-purple-100 text-purple-700' },
  delivered:   { label: 'Teslim Edildi',  cls: 'bg-green-100 text-green-700' },
  cancelled:   { label: 'İptal Edildi',   cls: 'bg-red-100 text-red-700' },
}

function Badge({ status, map }: { status: string; map: Record<string, { label: string; cls: string }> }) {
  const s = map[status] ?? { label: status, cls: 'bg-gray-100 text-gray-600' }
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${s.cls}`}>{s.label}</span>
}

function EmptyState({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-14 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-2xl">{icon}</div>
      <h3 className="font-semibold text-gray-700">{title}</h3>
      <p className="mt-1 text-sm text-gray-400">{desc}</p>
    </div>
  )
}

export default function ProducerDashboard() {
  const router = useRouter()
  const [user,     setUser]     = useState<User | null>(null)
  const [profile,  setProfile]  = useState<ProducerProfile | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [offers,   setOffers]   = useState<Offer[]>([])
  const [orders,   setOrders]   = useState<Order[]>([])
  const [loading,  setLoading]  = useState(true)
  const [tab,      setTab]      = useState<Tab>('products')

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: userData } = await supabase.from('users').select('role, full_name').eq('id', user.id).single()
      if (userData?.role !== 'producer') { router.push('/dashboard'); return }
      setUser(user)

      const { data: profileData } = await supabase.from('producer_profiles').select('*').eq('user_id', user.id).single()
      setProfile(profileData)

      if (profileData?.verification_status === 'approved') {
        const [{ data: prod }, { data: off }, { data: ord }] = await Promise.all([
          supabase.from('products').select('*').eq('producer_id', profileData.id).order('created_at', { ascending: false }),
          supabase.from('offers').select('*, request:requests(title, customer_id)').eq('producer_id', profileData.id).order('created_at', { ascending: false }),
          supabase.from('orders').select('*, customer:users(email)').eq('producer_id', user.id).order('created_at', { ascending: false }),
        ])
        setProducts(prod ?? [])
        setOffers(off ?? [])
        setOrders(ord ?? [])
      }
      setLoading(false)
    }
    init()
  }, [router])

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-orange-500" />
    </div>
  )

  const verificationStatus = profile?.verification_status ?? 'unverified'

  // ── Lock screen (card within content) ──────────────────────────
  if (verificationStatus !== 'approved') {
    const isPending  = verificationStatus === 'pending'
    const isRejected = verificationStatus === 'rejected'

    return (
      <div className="flex items-start justify-center pt-10">
        <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center">
          <div className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl text-4xl ${
            isPending ? 'bg-yellow-50' : isRejected ? 'bg-red-50' : 'bg-gray-100'
          }`}>
            {isPending ? '🔍' : isRejected ? '❌' : '🔒'}
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            {isPending  ? 'Belgeniz İnceleniyor' :
             isRejected ? 'Doğrulama Başarısız' :
                          'Hesabınızı Doğrulayın'}
          </h2>
          <p className="mt-3 text-sm text-gray-500 leading-relaxed">
            {isPending
              ? 'Vergi levhanız yapay zeka tarafından inceleniyor. Tamamlandığında panele erişiminiz açılacak.'
              : isRejected
              ? 'Belge doğrulaması başarısız. Bilgilerinizi kontrol edip belgeyi yeniden yükleyin.'
              : 'Üretici paneline erişmek için profil doğrulaması yapmanız gerekiyor.'}
          </p>
          {isRejected && profile?.verification_note && (
            <div className="mt-4 rounded-xl bg-red-50 border border-red-100 p-4 text-left">
              <p className="text-xs font-semibold text-red-600 mb-1">Red Sebebi</p>
              <p className="text-sm text-red-700">{profile.verification_note}</p>
            </div>
          )}
          {isPending && (
            <div className="mt-5 flex items-center justify-center gap-2 text-yellow-600 text-sm">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-yellow-200 border-t-yellow-500" />
              İnceleme devam ediyor...
            </div>
          )}
          <button
            onClick={() => router.push('/dashboard/profile')}
            className={`mt-7 rounded-xl px-8 py-2.5 text-sm font-semibold transition-colors ${
              isRejected
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            {isRejected ? 'Belgeyi Yeniden Yükle' : 'Profili Tamamla'}
          </button>
        </div>
      </div>
    )
  }

  // ── Stats ──────────────────────────────────────────────────────
  const pendingOffers = offers.filter(o => o.status === 'pending').length
  const activeOrders  = orders.filter(o => ['confirmed', 'in_progress'].includes(o.status)).length
  const totalRevenue  = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total_price, 0)

  const initials = profile?.company_name
    ? profile.company_name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : (user?.email?.[0] ?? '?').toUpperCase()

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'products', label: 'Ürünlerim',   count: products.length },
    { key: 'offers',   label: 'Tekliflerim', count: offers.length },
    { key: 'orders',   label: 'Siparişler',  count: orders.length },
  ]

  return (
    <div className="space-y-5">

      {/* Welcome card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center gap-4">
        <div className="h-14 w-14 shrink-0 rounded-2xl bg-orange-500 flex items-center justify-center text-xl font-bold text-white shadow-sm shadow-orange-200">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-gray-900">
            Merhaba, <span className="text-orange-500">{profile?.company_name ?? user?.email}</span> 👋
          </h1>
          <p className="text-sm text-gray-500">TİRİDY Üretici Panelinize hoş geldiniz.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200">
            + Ürün Ekle
          </button>
          <button className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors">
            Talepleri İncele
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Bekleyen Teklif', value: pendingOffers, icon: '💬', color: 'text-yellow-500', bg: 'bg-yellow-50' },
          { label: 'Aktif Sipariş',   value: activeOrders,  icon: '🔧', color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'Toplam Gelir',    value: `₺${totalRevenue.toLocaleString('tr-TR')}`, icon: '💰', color: 'text-green-600', bg: 'bg-green-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-500">{s.label}</p>
              <div className={`h-9 w-9 rounded-xl ${s.bg} flex items-center justify-center text-lg`}>{s.icon}</div>
            </div>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-6 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? 'border-orange-500 text-orange-600 bg-orange-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {t.label}
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                tab === t.key ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'
              }`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* Products */}
          {tab === 'products' && (
            products.length === 0 ? (
              <EmptyState icon="📦" title="Henüz ürün eklemediniz" desc="İlk ürününüzü ekleyin, müşteriler kataloğunuzu görsün." />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map(p => (
                  <div key={p.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold text-gray-900 text-sm">{p.name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{p.category}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.stock_quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                      }`}>
                        {p.stock_quantity > 0 ? `${p.stock_quantity} stok` : 'Tükendi'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{p.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-orange-500">₺{p.price.toLocaleString('tr-TR')}</span>
                      <div className="flex gap-1.5">
                        <button className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:bg-white hover:border-gray-300 transition-colors">Düzenle</button>
                        <button className="rounded-lg border border-red-200 px-2.5 py-1 text-xs text-red-500 hover:bg-red-50 transition-colors">Sil</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Offers */}
          {tab === 'offers' && (
            offers.length === 0 ? (
              <EmptyState icon="💬" title="Henüz teklif vermediniz" desc="Müşteri taleplerini inceleyip teklif gönderebilirsiniz." />
            ) : (
              <div className="space-y-3">
                {offers.map(o => (
                  <div key={o.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold text-gray-900 text-sm">{o.request.title}</h3>
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            o.status === 'pending'  ? 'bg-yellow-100 text-yellow-700' :
                            o.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                                      'bg-red-100 text-red-600'
                          }`}>
                            {o.status === 'pending' ? 'Bekliyor' : o.status === 'accepted' ? 'Kabul Edildi' : 'Reddedildi'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{o.description}</p>
                        <div className="mt-2 flex gap-4 text-xs text-gray-400">
                          <span>₺{o.price.toLocaleString('tr-TR')}</span>
                          <span>{o.estimated_time} gün</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Orders */}
          {tab === 'orders' && (
            orders.length === 0 ? (
              <EmptyState icon="🛒" title="Henüz sipariş yok" desc="Teklifiniz kabul edildiğinde siparişler burada görünecek." />
            ) : (
              <div className="space-y-3">
                {orders.map(o => (
                  <div key={o.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold text-gray-900 text-sm">{o.customer.email}</h3>
                          <Badge status={o.status} map={STATUS_ORDER} />
                        </div>
                        <div className="flex gap-4 text-xs text-gray-400">
                          <span>₺{o.total_price.toLocaleString('tr-TR')}</span>
                          <span>{new Date(o.created_at).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        {o.status === 'pending' && (
                          <button className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-600 transition-colors">Onayla</button>
                        )}
                        {o.status === 'confirmed' && (
                          <button className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-600 transition-colors">Üretime Al</button>
                        )}
                        {o.status === 'in_progress' && (
                          <button className="rounded-lg bg-purple-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-600 transition-colors">Kargoya Ver</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
