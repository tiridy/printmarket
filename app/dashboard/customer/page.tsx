'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../utils/supabase'
import { User } from '@supabase/supabase-js'

interface PrintRequest {
  id: string
  title: string
  description: string
  category: string
  budget: number
  deadline: string
  status: 'open' | 'closed' | 'completed'
  created_at: string
}

interface Offer {
  id: string
  price: number
  description: string
  estimated_time: number
  status: 'pending' | 'accepted' | 'rejected'
  producer: { company_name: string }
  request: { title: string }
}

interface Order {
  id: string
  total_price: number
  status: 'pending' | 'confirmed' | 'in_progress' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
  producer: { company_name: string }
}

type Tab = 'requests' | 'offers' | 'orders'

const STATUS_REQUEST: Record<string, { label: string; cls: string }> = {
  open:      { label: 'Açık',      cls: 'bg-green-500/15 text-green-400' },
  closed:    { label: 'Kapalı',    cls: 'bg-slate-500/15 text-slate-400' },
  completed: { label: 'Tamamlandı', cls: 'bg-blue-500/15 text-blue-400' },
}

const STATUS_ORDER: Record<string, { label: string; cls: string }> = {
  pending:     { label: 'Bekliyor',       cls: 'bg-yellow-500/15 text-yellow-400' },
  confirmed:   { label: 'Onaylandı',      cls: 'bg-blue-500/15 text-blue-400' },
  in_progress: { label: 'Üretimde',       cls: 'bg-orange-500/15 text-orange-400' },
  shipped:     { label: 'Kargoda',        cls: 'bg-purple-500/15 text-purple-400' },
  delivered:   { label: 'Teslim Edildi',  cls: 'bg-green-500/15 text-green-400' },
  cancelled:   { label: 'İptal Edildi',   cls: 'bg-red-500/15 text-red-400' },
}

function initials(email: string) {
  return email.slice(0, 2).toUpperCase()
}

function Badge({ status, map }: { status: string; map: Record<string, { label: string; cls: string }> }) {
  const s = map[status] ?? { label: status, cls: 'bg-slate-500/15 text-slate-400' }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${s.cls}`}>
      {s.label}
    </span>
  )
}

export default function CustomerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [requests, setRequests] = useState<PrintRequest[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('requests')

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: userData } = await supabase
        .from('users').select('role').eq('id', user.id).single()

      if (userData?.role !== 'customer') { router.push('/dashboard'); return }

      setUser(user)

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

  const openRequests = requests.filter(r => r.status === 'open').length
  const pendingOffers = offers.filter(o => o.status === 'pending').length
  const activeOrders = orders.filter(o => ['confirmed', 'in_progress', 'shipped'].includes(o.status)).length

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'requests', label: 'Taleplerim', count: requests.length },
    { key: 'offers',   label: 'Teklifler',  count: offers.length },
    { key: 'orders',   label: 'Siparişler', count: orders.length },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <span className="text-xl font-bold tracking-tight text-orange-400">TİRİDY</span>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-200">{user?.email}</p>
              <p className="text-xs text-slate-500">Müşteri</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/20 text-sm font-bold text-orange-400">
              {user?.email ? initials(user.email) : '?'}
            </div>
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
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold">Müşteri Paneli</h1>
          <p className="mt-1 text-slate-400">Taleplerinizi, tekliflerinizi ve siparişlerinizi buradan yönetin.</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Açık Talep', value: openRequests,   icon: '📋', color: 'text-blue-400' },
            { label: 'Bekleyen Teklif', value: pendingOffers, icon: '💬', color: 'text-yellow-400' },
            { label: 'Aktif Sipariş', value: activeOrders,  icon: '📦', color: 'text-orange-400' },
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

        {/* CTA */}
        <div className="flex flex-wrap gap-3">
          <button className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-orange-400 transition-colors">
            + Yeni Talep Oluştur
          </button>
          <button className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm text-slate-300 hover:border-slate-500 hover:text-white transition-colors">
            Ürünlere Göz At
          </button>
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

          {/* Requests */}
          {tab === 'requests' && (
            <div className="mt-6 space-y-3">
              {requests.length === 0 ? (
                <EmptyState
                  icon="📋"
                  title="Henüz talep oluşturmadınız"
                  description="İlk 3D baskı talebinizi oluşturun, üreticilerden teklif alın."
                  action="Yeni Talep Oluştur"
                />
              ) : requests.map(r => (
                <div key={r.id} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-slate-100">{r.title}</h3>
                        <Badge status={r.status} map={STATUS_REQUEST} />
                      </div>
                      <p className="mt-1.5 text-sm text-slate-400 line-clamp-2">{r.description}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span>🏷 {r.category}</span>
                        <span>💰 ₺{r.budget.toLocaleString('tr-TR')}</span>
                        <span>📅 {new Date(r.deadline).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>
                    <button className="shrink-0 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:border-slate-500 transition-colors">
                      Detay
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Offers */}
          {tab === 'offers' && (
            <div className="mt-6 space-y-3">
              {offers.length === 0 ? (
                <EmptyState
                  icon="💬"
                  title="Henüz teklif almadınız"
                  description="Bir talep oluşturduktan sonra üreticiler size teklif gönderecektir."
                />
              ) : offers.map(o => (
                <div key={o.id} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-slate-100">{o.producer.company_name}</h3>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          o.status === 'pending'  ? 'bg-yellow-500/15 text-yellow-400' :
                          o.status === 'accepted' ? 'bg-green-500/15 text-green-400' :
                                                    'bg-red-500/15 text-red-400'
                        }`}>
                          {o.status === 'pending' ? 'Bekliyor' : o.status === 'accepted' ? 'Kabul Edildi' : 'Reddedildi'}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">Talep: {o.request.title}</p>
                      <p className="mt-2 text-sm text-slate-400">{o.description}</p>
                      <div className="mt-3 flex gap-4 text-xs text-slate-500">
                        <span>💰 ₺{o.price.toLocaleString('tr-TR')}</span>
                        <span>⏱ {o.estimated_time} gün</span>
                      </div>
                    </div>
                    {o.status === 'pending' && (
                      <div className="flex shrink-0 flex-col gap-2">
                        <button className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium hover:bg-green-500 transition-colors">
                          Kabul Et
                        </button>
                        <button className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs hover:bg-red-900/50 hover:text-red-400 transition-colors">
                          Reddet
                        </button>
                      </div>
                    )}
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
                  icon="📦"
                  title="Henüz siparişiniz yok"
                  description="Bir teklifi kabul ettiğinizde sipariş buraya gelecektir."
                />
              ) : orders.map(o => (
                <div key={o.id} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-slate-100">{o.producer.company_name}</h3>
                        <Badge status={o.status} map={STATUS_ORDER} />
                      </div>
                      <div className="mt-2 flex gap-4 text-xs text-slate-500">
                        <span>💰 ₺{o.total_price.toLocaleString('tr-TR')}</span>
                        <span>📅 {new Date(o.created_at).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>
                    <button className="shrink-0 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:border-slate-500 transition-colors">
                      Detay
                    </button>
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

function EmptyState({ icon, title, description, action }: {
  icon: string
  title: string
  description: string
  action?: string
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
