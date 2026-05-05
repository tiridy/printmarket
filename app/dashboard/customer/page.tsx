'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../utils/supabase'
import { User } from '@supabase/supabase-js'

interface PrintRequest {
  id: string; title: string; description: string
  category: string; budget: number; deadline: string
  status: 'open' | 'closed' | 'completed'; created_at: string
}

interface Offer {
  id: string; price: number; description: string; estimated_time: number
  status: 'pending' | 'accepted' | 'rejected'
  producer: { company_name: string }
  request: { title: string }
}

interface Order {
  id: string; total_price: number; created_at: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'shipped' | 'delivered' | 'cancelled'
  producer: { company_name: string }
}

type Tab = 'requests' | 'offers' | 'orders'

const STATUS_REQUEST: Record<string, { label: string; cls: string }> = {
  open:      { label: 'Açık',       cls: 'bg-green-100 text-green-700' },
  closed:    { label: 'Kapalı',     cls: 'bg-gray-100 text-gray-600' },
  completed: { label: 'Tamamlandı', cls: 'bg-blue-100 text-blue-700' },
}

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
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${s.cls}`}>{s.label}</span>
}

function EmptyState({ icon, title, desc, action, onAction }: {
  icon: string; title: string; desc: string; action?: string; onAction?: () => void
}) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-14 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-2xl">{icon}</div>
      <h3 className="font-semibold text-gray-700">{title}</h3>
      <p className="mt-1 text-sm text-gray-400">{desc}</p>
      {action && (
        <button onClick={onAction} className="mt-4 rounded-xl bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors">
          {action}
        </button>
      )}
    </div>
  )
}

const POPULAR = ['Kartvizit', 'Broşür', 'Afiş', 'Katalog', 'Etiket', 'Ambalaj']

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
      setUser(user)
      setFullName(userData?.full_name ?? '')

      const [{ data: req }, { data: off }, { data: ord }] = await Promise.all([
        supabase.from('requests').select('*').eq('customer_id', user.id).order('created_at', { ascending: false }),
        supabase.from('offers').select('*, producer:producer_profiles(company_name), request:requests(title)').eq('request.customer_id', user.id).order('created_at', { ascending: false }),
        supabase.from('orders').select('*, producer:producer_profiles(company_name)').eq('customer_id', user.id).order('created_at', { ascending: false }),
      ])
      setRequests(req ?? [])
      setOffers(off ?? [])
      setOrders(ord ?? [])
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
  const activeOrders  = orders.filter(o => ['confirmed', 'in_progress', 'shipped'].includes(o.status)).length

  const firstName = fullName.split(' ')[0] || user?.email?.split('@')[0] || ''
  const initials  = fullName
    ? fullName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : (user?.email?.[0] ?? '?').toUpperCase()

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'requests', label: 'Taleplerim', count: requests.length },
    { key: 'offers',   label: 'Teklifler',  count: offers.length },
    { key: 'orders',   label: 'Siparişler', count: orders.length },
  ]

  return (
    <div className="space-y-5">

      {/* Welcome card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center gap-4">
        <div className="h-14 w-14 shrink-0 rounded-2xl bg-orange-500 flex items-center justify-center text-xl font-bold text-white shadow-sm shadow-orange-200">
          {initials}
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">
            Merhaba, <span className="text-orange-500">{firstName}</span> 👋
          </h1>
          <p className="text-sm text-gray-500">TİRİDY&apos;ye tekrar hoş geldiniz!</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Neye ihtiyacınız var?"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition"
            />
          </div>
          <button className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200">
            Ara
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-400 font-medium py-1">Popüler:</span>
          {POPULAR.map(p => (
            <button
              key={p}
              onClick={() => setSearch(p)}
              className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Açık Talep',      value: openRequests,  icon: '📋', color: 'text-blue-500',   bg: 'bg-blue-50' },
          { label: 'Bekleyen Teklif', value: pendingOffers, icon: '💬', color: 'text-yellow-500', bg: 'bg-yellow-50' },
          { label: 'Aktif Sipariş',   value: activeOrders,  icon: '📦', color: 'text-orange-500', bg: 'bg-orange-50' },
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

      {/* CTA cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: '📋',
            title: 'Baskı Talebi Oluştur',
            desc: 'İhtiyacınızı belirtin, üreticilerden teklif alın.',
            action: 'Talep Oluştur',
            bg: 'bg-orange-50',
            border: 'border-orange-100',
            btnCls: 'bg-orange-500 text-white hover:bg-orange-600 shadow-sm shadow-orange-200',
          },
          {
            icon: '🏭',
            title: 'Üretici Bul',
            desc: 'Doğrulanmış üreticiler arasından en uygununu seçin.',
            action: 'Üreticileri Gör',
            bg: 'bg-blue-50',
            border: 'border-blue-100',
            btnCls: 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm shadow-blue-200',
          },
          {
            icon: '🔍',
            title: 'Siparişlerimi Takip Et',
            desc: 'Mevcut siparişlerinizin durumunu anlık görün.',
            action: 'Siparişlere Git',
            bg: 'bg-green-50',
            border: 'border-green-100',
            btnCls: 'bg-green-500 text-white hover:bg-green-600 shadow-sm shadow-green-200',
          },
        ].map(card => (
          <div key={card.title} className={`rounded-2xl border ${card.border} ${card.bg} p-6 flex flex-col`}>
            <span className="text-3xl mb-3">{card.icon}</span>
            <h3 className="font-semibold text-gray-900 mb-1">{card.title}</h3>
            <p className="text-sm text-gray-500 mb-5 flex-1">{card.desc}</p>
            <button className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${card.btnCls}`}>
              {card.action}
            </button>
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
          {/* Requests */}
          {tab === 'requests' && (
            requests.length === 0 ? (
              <EmptyState icon="📋" title="Henüz talep oluşturmadınız" desc="İlk baskı talebinizi oluşturun, üreticilerden teklif alın." action="Yeni Talep Oluştur" />
            ) : (
              <div className="space-y-3">
                {requests.map(r => (
                  <div key={r.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold text-gray-900 text-sm">{r.title}</h3>
                          <Badge status={r.status} map={STATUS_REQUEST} />
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-2">{r.description}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                          <span>{r.category}</span>
                          <span>₺{r.budget.toLocaleString('tr-TR')}</span>
                          <span>{new Date(r.deadline).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </div>
                      <button className="shrink-0 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 hover:bg-white hover:border-gray-300 transition-colors">
                        Detay
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Offers */}
          {tab === 'offers' && (
            offers.length === 0 ? (
              <EmptyState icon="💬" title="Henüz teklif almadınız" desc="Talep oluşturduktan sonra üreticiler size teklif gönderecek." />
            ) : (
              <div className="space-y-3">
                {offers.map(o => (
                  <div key={o.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <h3 className="font-semibold text-gray-900 text-sm">{o.producer.company_name}</h3>
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            o.status === 'pending'  ? 'bg-yellow-100 text-yellow-700' :
                            o.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                                      'bg-red-100 text-red-600'
                          }`}>
                            {o.status === 'pending' ? 'Bekliyor' : o.status === 'accepted' ? 'Kabul Edildi' : 'Reddedildi'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-1.5">Talep: {o.request.title}</p>
                        <p className="text-sm text-gray-500 mb-2">{o.description}</p>
                        <div className="flex gap-4 text-xs text-gray-400">
                          <span>₺{o.price.toLocaleString('tr-TR')}</span>
                          <span>{o.estimated_time} gün</span>
                        </div>
                      </div>
                      {o.status === 'pending' && (
                        <div className="flex shrink-0 flex-col gap-1.5">
                          <button className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-600 transition-colors">Kabul Et</button>
                          <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors">Reddet</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Orders */}
          {tab === 'orders' && (
            orders.length === 0 ? (
              <EmptyState icon="📦" title="Henüz siparişiniz yok" desc="Bir teklifi kabul ettiğinizde sipariş buraya gelecek." />
            ) : (
              <div className="space-y-3">
                {orders.map(o => (
                  <div key={o.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold text-gray-900 text-sm">{o.producer.company_name}</h3>
                          <Badge status={o.status} map={STATUS_ORDER} />
                        </div>
                        <div className="flex gap-4 text-xs text-gray-400">
                          <span>₺{o.total_price.toLocaleString('tr-TR')}</span>
                          <span>{new Date(o.created_at).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </div>
                      <button className="shrink-0 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 hover:bg-white hover:border-gray-300 transition-colors">
                        Detay
                      </button>
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
