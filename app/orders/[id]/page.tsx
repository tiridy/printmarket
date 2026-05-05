'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../utils/supabase'

type OrderStatus = 'pending' | 'confirmed' | 'in_progress' | 'shipped' | 'delivered' | 'cancelled'

interface Order {
  id: string
  total_price: number
  created_at: string
  status: OrderStatus
  metadata?: Record<string, unknown>
  producer: { company_name: string; location: string }
  customer: { full_name: string; email: string }
  request?: { title: string; category: string }
}

const STATUS_STEPS: { key: OrderStatus; label: string; desc: string; icon: string }[] = [
  { key: 'pending',     label: 'Sipariş Alındı',   desc: 'Üretici onayı bekleniyor',         icon: '📋' },
  { key: 'confirmed',   label: 'Onaylandı',         desc: 'Üretici siparişi kabul etti',      icon: '✅' },
  { key: 'in_progress', label: 'Üretimde',          desc: 'Parçanız üretiliyor',              icon: '⚙️' },
  { key: 'shipped',     label: 'Kargoya Verildi',   desc: 'Paketiniz yolda',                 icon: '📦' },
  { key: 'delivered',   label: 'Teslim Edildi',     desc: 'Siparişiniz tamamlandı',          icon: '🎉' },
]

const STATUS_ORDER: OrderStatus[] = ['pending', 'confirmed', 'in_progress', 'shipped', 'delivered']

function getStepIndex(status: OrderStatus) {
  return STATUS_ORDER.indexOf(status)
}

export default function OrderTrackingPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params?.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase
        .from('orders')
        .select(`
          *,
          producer:producer_profiles(company_name, location),
          customer:users(full_name, email),
          request:requests(title, category)
        `)
        .eq('id', orderId)
        .single()

      if (!data) { setNotFound(true); setLoading(false); return }
      setOrder(data as Order)
      setLoading(false)
    }
    load()
  }, [orderId, router])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-orange-500" />
    </div>
  )

  if (notFound) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 text-center px-6">
      <p className="text-4xl">📭</p>
      <h1 className="text-xl font-bold text-gray-900">Sipariş Bulunamadı</h1>
      <p className="text-sm text-gray-500">Bu sipariş mevcut değil veya erişim izniniz yok.</p>
      <Link href="/dashboard/customer" className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-400">
        Panele Dön
      </Link>
    </div>
  )

  const currentStepIdx = order ? getStepIndex(order.status) : -1
  const isCancelled = order?.status === 'cancelled'

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-black text-orange-500">TİRİDY</Link>
          <Link href="/dashboard/customer" className="text-sm text-gray-400 hover:text-gray-600">← Panele Dön</Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10 space-y-6">

        {/* Order header */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Sipariş #{order?.id.slice(0, 8).toUpperCase()}</p>
              <h1 className="text-xl font-black text-gray-900">
                {(order?.request?.title) || 'Sipariş Detayı'}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {order?.producer?.company_name} • {new Date(order?.created_at ?? '').toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-orange-500">₺{order?.total_price?.toLocaleString('tr-TR')}</p>
              {isCancelled ? (
                <span className="inline-block mt-1 rounded-full bg-red-100 px-3 py-0.5 text-xs font-semibold text-red-600">İptal Edildi</span>
              ) : (
                <span className="inline-block mt-1 rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-700">Aktif</span>
              )}
            </div>
          </div>
        </div>

        {/* Status tracker */}
        {!isCancelled && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="mb-8 text-sm font-bold text-gray-700 uppercase tracking-wider">Sipariş Durumu</h2>

            <div className="relative">
              {/* Progress line */}
              <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-100" />
              {currentStepIdx >= 0 && (
                <div
                  className="absolute left-5 top-5 w-0.5 bg-orange-400 transition-all duration-700"
                  style={{ height: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
                />
              )}

              <div className="space-y-8">
                {STATUS_STEPS.map((step, idx) => {
                  const done    = idx < currentStepIdx
                  const current = idx === currentStepIdx
                  const future  = idx > currentStepIdx

                  return (
                    <div key={step.key} className="relative flex items-start gap-6 pl-14">
                      {/* Circle */}
                      <div className={`absolute left-0 flex h-10 w-10 items-center justify-center rounded-full text-lg border-2 transition-all ${
                        done    ? 'border-orange-500 bg-orange-500 text-white' :
                        current ? 'border-orange-500 bg-white text-orange-500 ring-4 ring-orange-100' :
                                  'border-gray-200 bg-white text-gray-300'
                      }`}>
                        {done ? (
                          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span>{step.icon}</span>
                        )}
                      </div>

                      <div className={`pb-2 ${future ? 'opacity-40' : ''}`}>
                        <p className={`font-semibold ${current ? 'text-orange-600' : done ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step.label}
                          {current && <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-600">Şu an burada</span>}
                        </p>
                        <p className="mt-0.5 text-sm text-gray-400">{step.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Details + Actions */}
        <div className="grid gap-5 md:grid-cols-2">

          {/* Order info */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Sipariş Bilgileri</h2>
            <div className="space-y-3">
              {[
                ['Üretici', order?.producer?.company_name],
                ['Konum', order?.producer?.location || '—'],
                ['Malzeme', order?.request?.category || '—'],
                ['Toplam Tutar', `₺${order?.total_price?.toLocaleString('tr-TR')}`],
                ['Sipariş Tarihi', new Date(order?.created_at ?? '').toLocaleDateString('tr-TR')],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1.5 border-b border-gray-50 text-sm">
                  <span className="text-gray-400">{k}</span>
                  <span className="font-medium text-gray-700">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col gap-3">
            <h2 className="mb-1 text-sm font-bold text-gray-700 uppercase tracking-wider">İşlemler</h2>

            <Link
              href={`/chat/${order?.id}`}
              className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-orange-300 hover:bg-orange-50"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 text-orange-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Üreticiyle Mesajlaş
            </Link>

            <Link
              href={`/producers/${order?.id}`}
              className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              Üretici Profilini Gör
            </Link>

            {order?.status === 'delivered' && (
              <button className="flex items-center gap-3 rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                Değerlendirme Bırak
              </button>
            )}

            {order?.status === 'pending' && (
              <button className="flex items-center gap-3 rounded-xl border border-red-200 px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Siparişi İptal Et
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
