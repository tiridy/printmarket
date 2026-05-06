'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../utils/supabase'
import { User } from '@supabase/supabase-js'
import { EmptyState, StatusBadge, Avatar } from '../../components/ui'

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

  if (verificationStatus !== 'approved') {
    const isPending  = verificationStatus === 'pending'
    const isRejected = verificationStatus === 'rejected'

    return (
      <div className="flex items-start justify-center pt-10">
        <div className="card w-full max-w-md p-10 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl text-4xl"
            style={{ background: isPending ? 'var(--color-warning-light)' : isRejected ? 'var(--color-danger-light)' : 'var(--color-neutral-100)' }}>
            {isPending ? '🔍' : isRejected ? '❌' : '🔒'}
          </div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-neutral-900)' }}>
            {isPending  ? 'Belgeniz İnceleniyor' :
             isRejected ? 'Doğrulama Başarısız' :
                          'Hesabınızı Doğrulayın'}
          </h2>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--color-neutral-500)' }}>
            {isPending
              ? 'Vergi levhanız yapay zeka tarafından inceleniyor. Tamamlandığında panele erişiminiz açılacak.'
              : isRejected
              ? 'Belge doğrulaması başarısız. Bilgilerinizi kontrol edip belgeyi yeniden yükleyin.'
              : 'Üretici paneline erişmek için profil doğrulaması yapmanız gerekiyor.'}
          </p>
          {isRejected && profile?.verification_note && (
            <div className="mt-4 rounded-xl p-4 text-left" style={{ background: 'var(--color-danger-light)', border: '1px solid var(--color-danger)' }}>
              <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-danger)' }}>Red Sebebi</p>
              <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{profile.verification_note}</p>
            </div>
          )}
          {isPending && (
            <div className="mt-5 flex items-center justify-center gap-2 text-sm" style={{ color: 'var(--color-warning)' }}>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-yellow-200 border-t-yellow-500" />
              İnceleme devam ediyor...
            </div>
          )}
          <button onClick={() => router.push('/dashboard/profile')}
            className={`btn mt-7 px-8 ${isRejected ? 'btn-danger' : 'btn-primary'}`}>
            {isRejected ? 'Belgeyi Yeniden Yükle' : 'Profili Tamamla'}
          </button>
        </div>
      </div>
    )
  }

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

      {/* Welcome */}
      <div className="card p-6 flex items-center gap-4">
        <Avatar initials={initials} size="lg" />
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold" style={{ color: 'var(--color-neutral-900)' }}>
            Merhaba, <span style={{ color: 'var(--color-brand-500)' }}>{profile?.company_name ?? user?.email}</span> 👋
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-neutral-500)' }}>TİRİDY Üretici Panelinize hoş geldiniz.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link href="/order/new" className="btn btn-primary btn-sm hidden sm:inline-flex">+ Ürün Ekle</Link>
          <Link href="/explore" className="btn btn-secondary btn-sm hidden sm:inline-flex">Talepleri İncele</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Bekleyen Teklif', value: pendingOffers, icon: '💬', valueColor: 'var(--color-warning)', bg: 'var(--color-warning-light)' },
          { label: 'Aktif Sipariş',   value: activeOrders,  icon: '🔧', valueColor: 'var(--color-brand-500)', bg: 'var(--color-brand-100)' },
          { label: 'Toplam Gelir',    value: `₺${totalRevenue.toLocaleString('tr-TR')}`, icon: '💰', valueColor: 'var(--color-success)', bg: 'var(--color-success-light)' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium" style={{ color: 'var(--color-neutral-500)' }}>{s.label}</p>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl text-lg" style={{ background: s.bg }}>{s.icon}</div>
            </div>
            <p className="text-3xl font-black" style={{ color: s.valueColor }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="card overflow-hidden">
        <div className="tab-bar">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`tab-item ${tab === t.key ? 'tab-item-active' : ''}`}>
              {t.label}
              <span className={`tab-count ${tab === t.key ? 'tab-count-active' : 'tab-count-idle'}`}>{t.count}</span>
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* Products */}
          {tab === 'products' && (
            products.length === 0
              ? <EmptyState icon="📦" title="Henüz ürün eklemediniz" desc="İlk ürününüzü ekleyin, müşteriler kataloğunuzu görsün." />
              : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map(p => (
                    <div key={p.id} className="rounded-xl border p-4 transition hover:shadow-sm"
                      style={{ borderColor: 'var(--color-neutral-200)', background: 'var(--color-neutral-50)' }}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-semibold text-sm" style={{ color: 'var(--color-neutral-900)' }}>{p.name}</h3>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--color-neutral-400)' }}>{p.category}</p>
                        </div>
                        <span className="shrink-0 badge" style={p.stock_quantity > 0
                          ? { background: 'var(--color-success-light)', color: 'var(--color-success)' }
                          : { background: 'var(--color-danger-light)', color: 'var(--color-danger)' }}>
                          {p.stock_quantity > 0 ? `${p.stock_quantity} stok` : 'Tükendi'}
                        </span>
                      </div>
                      <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--color-neutral-500)' }}>{p.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold" style={{ color: 'var(--color-brand-500)' }}>₺{p.price.toLocaleString('tr-TR')}</span>
                        <div className="flex gap-1.5">
                          <button className="btn btn-secondary btn-xs">Düzenle</button>
                          <button className="btn btn-danger btn-xs">Sil</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
          )}

          {/* Offers */}
          {tab === 'offers' && (
            offers.length === 0
              ? <EmptyState icon="💬" title="Henüz teklif vermediniz" desc="Müşteri taleplerini inceleyip teklif gönderebilirsiniz." />
              : <div className="space-y-3">
                  {offers.map(o => (
                    <div key={o.id} className="rounded-xl border p-4"
                      style={{ borderColor: 'var(--color-neutral-200)', background: 'var(--color-neutral-50)' }}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-semibold text-sm" style={{ color: 'var(--color-neutral-900)' }}>{o.request.title}</h3>
                            <StatusBadge status={o.status} />
                          </div>
                          <p className="text-sm mb-2" style={{ color: 'var(--color-neutral-500)' }}>{o.description}</p>
                          <div className="flex gap-4 text-xs" style={{ color: 'var(--color-neutral-400)' }}>
                            <span>₺{o.price.toLocaleString('tr-TR')}</span>
                            <span>{o.estimated_time} gün</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
          )}

          {/* Orders */}
          {tab === 'orders' && (
            orders.length === 0
              ? <EmptyState icon="🛒" title="Henüz sipariş yok" desc="Teklifiniz kabul edildiğinde siparişler burada görünecek." />
              : <div className="space-y-3">
                  {orders.map(o => (
                    <div key={o.id} className="rounded-xl border p-4"
                      style={{ borderColor: 'var(--color-neutral-200)', background: 'var(--color-neutral-50)' }}>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-semibold text-sm" style={{ color: 'var(--color-neutral-900)' }}>{o.customer.email}</h3>
                            <StatusBadge status={o.status} />
                          </div>
                          <div className="flex gap-4 text-xs" style={{ color: 'var(--color-neutral-400)' }}>
                            <span>₺{o.total_price.toLocaleString('tr-TR')}</span>
                            <span>{new Date(o.created_at).toLocaleDateString('tr-TR')}</span>
                          </div>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          {o.status === 'pending' && (
                            <button className="btn btn-sm" style={{ background: 'var(--color-success)', color: '#fff', borderRadius: 'var(--radius-lg)' }}>Onayla</button>
                          )}
                          {o.status === 'confirmed' && (
                            <button className="btn btn-primary btn-sm">Üretime Al</button>
                          )}
                          {o.status === 'in_progress' && (
                            <button className="btn btn-sm" style={{ background: '#a855f7', color: '#fff', borderRadius: 'var(--radius-lg)' }}>Kargoya Ver</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
          )}
        </div>
      </div>
    </div>
  )
}
