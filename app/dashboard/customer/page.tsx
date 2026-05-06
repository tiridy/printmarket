'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../utils/supabase'
import { User } from '@supabase/supabase-js'
import { EmptyState, StatusBadge, Avatar } from '../../components/ui'

interface PrintRequest {
  id: string; title: string; description: string; category: string
  budget: number; deadline: string; status: 'open'|'closed'|'completed'; created_at: string
}
interface Offer {
  id: string; price: number; description: string; estimated_time: number
  status: 'pending'|'accepted'|'rejected'
  producer: { company_name: string }; request: { title: string }
}
interface Order {
  id: string; total_price: number; created_at: string
  status: 'pending'|'confirmed'|'in_progress'|'shipped'|'delivered'|'cancelled'
  producer: { company_name: string }
}
type Tab = 'requests'|'offers'|'orders'

const POPULAR = ['Kartvizit','Broşür','Afiş','Katalog','Etiket','Ambalaj']

export default function CustomerDashboard() {
  const router = useRouter()
  const [user,     setUser]     = useState<User | null>(null)
  const [fullName, setFullName] = useState('')
  const [requests, setRequests] = useState<PrintRequest[]>([])
  const [offers,   setOffers]   = useState<Offer[]>([])
  const [orders,   setOrders]   = useState<Order[]>([])
  const [loading,  setLoading]  = useState(true)
  const [tab,      setTab]      = useState<Tab>('requests')
  const [search,   setSearch]   = useState('')

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: userData } = await supabase.from('users').select('role, full_name').eq('id', user.id).single()
      if (userData?.role !== 'customer') { router.push('/dashboard'); return }
      setUser(user); setFullName(userData?.full_name ?? '')

      const [{ data: req }, { data: off }, { data: ord }] = await Promise.all([
        supabase.from('requests').select('*').eq('customer_id', user.id).order('created_at', { ascending: false }),
        supabase.from('offers').select('*, producer:producer_profiles(company_name), request:requests(title)').eq('request.customer_id', user.id).order('created_at', { ascending: false }),
        supabase.from('orders').select('*, producer:producer_profiles(company_name)').eq('customer_id', user.id).order('created_at', { ascending: false }),
      ])
      setRequests(req ?? []); setOffers(off ?? []); setOrders(ord ?? [])
      setLoading(false)
    }
    init()
  }, [router])

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-orange-500" />
    </div>
  )

  const openRequests  = requests.filter(r => r.status === 'open').length
  const pendingOffers = offers.filter(o => o.status === 'pending').length
  const activeOrders  = orders.filter(o => ['confirmed','in_progress','shipped'].includes(o.status)).length
  const firstName     = fullName.split(' ')[0] || user?.email?.split('@')[0] || ''
  const initials      = fullName
    ? fullName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : (user?.email?.[0] ?? '?').toUpperCase()

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'requests', label: 'Taleplerim', count: requests.length },
    { key: 'offers',   label: 'Teklifler',  count: offers.length },
    { key: 'orders',   label: 'Siparişler', count: orders.length },
  ]

  return (
    <div className="space-y-5">

      {/* Welcome */}
      <div className="card p-6 flex items-center gap-4">
        <Avatar initials={initials} size="lg" />
        <div className="flex-1">
          <h1 className="text-lg font-bold" style={{ color: 'var(--color-neutral-900)' }}>
            Merhaba, <span style={{ color: 'var(--color-brand-500)' }}>{firstName}</span> 👋
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-neutral-500)' }}>TİRİDY&apos;ye tekrar hoş geldiniz!</p>
        </div>
        <Link href="/order/new" className="btn btn-primary btn-sm hidden sm:inline-flex">+ Yeni Sipariş</Link>
      </div>

      {/* Search */}
      <div className="card p-6 space-y-4">
        <div className="flex gap-2">
          <div className="input-icon-wrapper flex-1">
            <span className="input-icon">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Neye ihtiyacınız var?" className="input" />
          </div>
          <button className="btn btn-primary">Ara</button>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-medium py-1" style={{ color: 'var(--color-neutral-400)' }}>Popüler:</span>
          {POPULAR.map(p => (
            <button key={p} onClick={() => setSearch(p)}
              className="rounded-full border px-3 py-1 text-xs transition hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50"
              style={{ borderColor: 'var(--color-neutral-200)', color: 'var(--color-neutral-600)' }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Açık Talep',      value: openRequests,  icon: '📋', valueColor: 'var(--color-info)',    bg: 'var(--color-info-light)' },
          { label: 'Bekleyen Teklif', value: pendingOffers, icon: '💬', valueColor: 'var(--color-warning)', bg: 'var(--color-warning-light)' },
          { label: 'Aktif Sipariş',   value: activeOrders,  icon: '📦', valueColor: 'var(--color-brand-500)', bg: 'var(--color-brand-100)' },
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

      {/* CTA cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: '📋', title: 'Baskı Talebi Oluştur', desc: 'İhtiyacınızı belirtin, üreticilerden teklif alın.', action: 'Talep Oluştur', href: '/order/new', btnCls: 'btn-primary' },
          { icon: '🏭', title: 'Üretici Bul',          desc: 'Doğrulanmış üreticiler arasından en uygununu seçin.', action: 'Üreticileri Gör', href: '/explore',    btnCls: 'btn-secondary' },
          { icon: '🔍', title: 'Siparişleri Takip Et', desc: 'Mevcut siparişlerinizin durumunu anlık görün.', action: 'Siparişlere Git', href: '/dashboard/customer', btnCls: 'btn-secondary' },
        ].map(card => (
          <div key={card.title} className="card p-6 flex flex-col">
            <span className="text-3xl mb-3">{card.icon}</span>
            <h3 className="font-semibold mb-1" style={{ color: 'var(--color-neutral-900)' }}>{card.title}</h3>
            <p className="text-sm mb-5 flex-1" style={{ color: 'var(--color-neutral-500)' }}>{card.desc}</p>
            <Link href={card.href} className={`btn ${card.btnCls} btn-sm justify-center`}>{card.action}</Link>
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
          {/* Requests */}
          {tab === 'requests' && (
            requests.length === 0
              ? <EmptyState icon="📋" title="Henüz talep oluşturmadınız" desc="İlk baskı talebinizi oluşturun, üreticilerden teklif alın." action="Yeni Talep Oluştur" onAction={() => router.push('/order/new')} />
              : <div className="space-y-3">
                  {requests.map(r => (
                    <div key={r.id} className="rounded-xl border p-4 transition hover:shadow-sm" style={{ borderColor: 'var(--color-neutral-200)', background: 'var(--color-neutral-50)' }}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-semibold text-sm" style={{ color: 'var(--color-neutral-900)' }}>{r.title}</h3>
                            <StatusBadge status={r.status} />
                          </div>
                          <p className="text-sm truncate-2 mb-2" style={{ color: 'var(--color-neutral-500)' }}>{r.description}</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: 'var(--color-neutral-400)' }}>
                            <span>{r.category}</span>
                            <span>₺{r.budget.toLocaleString('tr-TR')}</span>
                            <span>{new Date(r.deadline).toLocaleDateString('tr-TR')}</span>
                          </div>
                        </div>
                        <button className="btn btn-secondary btn-xs shrink-0">Detay</button>
                      </div>
                    </div>
                  ))}
                </div>
          )}

          {/* Offers */}
          {tab === 'offers' && (
            offers.length === 0
              ? <EmptyState icon="💬" title="Henüz teklif almadınız" desc="Talep oluşturduktan sonra üreticiler size teklif gönderecek." />
              : <div className="space-y-3">
                  {offers.map(o => (
                    <div key={o.id} className="rounded-xl border p-4" style={{ borderColor: 'var(--color-neutral-200)', background: 'var(--color-neutral-50)' }}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <h3 className="font-semibold text-sm" style={{ color: 'var(--color-neutral-900)' }}>{o.producer.company_name}</h3>
                            <StatusBadge status={o.status} />
                          </div>
                          <p className="text-xs mb-1.5" style={{ color: 'var(--color-neutral-400)' }}>Talep: {o.request.title}</p>
                          <p className="text-sm mb-2" style={{ color: 'var(--color-neutral-500)' }}>{o.description}</p>
                          <div className="flex gap-4 text-xs" style={{ color: 'var(--color-neutral-400)' }}>
                            <span>₺{o.price.toLocaleString('tr-TR')}</span>
                            <span>{o.estimated_time} gün</span>
                          </div>
                        </div>
                        {o.status === 'pending' && (
                          <div className="flex shrink-0 flex-col gap-1.5">
                            <button className="btn btn-sm" style={{ background: 'var(--color-success)', color: '#fff', borderRadius: 'var(--radius-lg)' }}>Kabul Et</button>
                            <button className="btn btn-danger btn-xs">Reddet</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
          )}

          {/* Orders */}
          {tab === 'orders' && (
            orders.length === 0
              ? <EmptyState icon="📦" title="Henüz siparişiniz yok" desc="Bir teklifi kabul ettiğinizde sipariş buraya gelecek." />
              : <div className="space-y-3">
                  {orders.map(o => (
                    <div key={o.id} className="rounded-xl border p-4" style={{ borderColor: 'var(--color-neutral-200)', background: 'var(--color-neutral-50)' }}>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-semibold text-sm" style={{ color: 'var(--color-neutral-900)' }}>{o.producer.company_name}</h3>
                            <StatusBadge status={o.status} />
                          </div>
                          <div className="flex gap-4 text-xs" style={{ color: 'var(--color-neutral-400)' }}>
                            <span>₺{o.total_price.toLocaleString('tr-TR')}</span>
                            <span>{new Date(o.created_at).toLocaleDateString('tr-TR')}</span>
                          </div>
                        </div>
                        <Link href={`/orders/${o.id}`} className="btn btn-secondary btn-xs shrink-0">Takip Et</Link>
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
