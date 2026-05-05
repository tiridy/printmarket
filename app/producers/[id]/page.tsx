'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../utils/supabase'

interface ProducerProfile {
  id: string
  company_name: string
  description: string
  location: string
  rating: number
  contact_info: { website?: string; phone?: string }
  materials?: string[]
}

interface Review {
  id: string
  rating: number
  comment: string
  created_at: string
  customer: { full_name: string }
}

/* ─── Static demo data (fallback when not found in DB) ─── */
const DEMO_PROFILES: Record<string, Partial<ProducerProfile> & {
  score: number; jobs: number; reviews_count: number; avg_rating: number;
  badge: string; badgeColor: string; initials: string; avatarColor: string;
  delivery: string; priceFrom: number; materials: string[];
  portfolio: { title: string; material: string; color: string }[];
  scoreBreakdown: { label: string; value: number; color: string }[];
  demoReviews: { name: string; initials: string; rating: number; text: string; date: string }[];
}> = {
  '1': {
    company_name: 'ProPrint İstanbul', location: 'İstanbul, Türkiye',
    description: 'İstanbul\'un en büyük FDM baskı atölyesi. ISO 9001 belgeli, 12 makine kapasitesi ile prototipten seri üretime kadar geniş hizmet yelpazesi.',
    score: 98, jobs: 847, reviews_count: 312, avg_rating: 4.97,
    badge: 'Süper Üretici', badgeColor: 'bg-orange-100 text-orange-700',
    initials: 'PI', avatarColor: 'bg-orange-500', delivery: '2–3 gün', priceFrom: 45,
    materials: ['PLA', 'ABS', 'PETG', 'Nylon'],
    contact_info: { website: 'https://proprint.com.tr', phone: '+90 212 000 0000' },
    portfolio: [
      { title: 'Endüstriyel Braketi', material: 'ABS', color: 'from-blue-500/20 to-blue-900' },
      { title: 'Drone Gövdesi', material: 'PETG', color: 'from-green-500/20 to-green-900' },
      { title: 'Mimari Model', material: 'PLA', color: 'from-purple-500/20 to-purple-900' },
      { title: 'Robot Kolu', material: 'Nylon', color: 'from-orange-500/20 to-orange-900' },
      { title: 'Kalıp Prototipi', material: 'ABS', color: 'from-red-500/20 to-red-900' },
      { title: 'Saat Kasası', material: 'PETG', color: 'from-teal-500/20 to-teal-900' },
    ],
    scoreBreakdown: [
      { label: 'Teslimat Hızı', value: 99, color: 'bg-green-500' },
      { label: 'Kalite', value: 98, color: 'bg-blue-500' },
      { label: 'İletişim', value: 97, color: 'bg-purple-500' },
      { label: 'Zamanında Teslimat', value: 99, color: 'bg-orange-500' },
    ],
    demoReviews: [
      { name: 'Ayşe K.', initials: 'AK', rating: 5, text: 'Mükemmel kalite ve süper hızlı teslimat! Drone gövdesi için sipariş verdim, 2 günde elime ulaştı.', date: '12 Nisan 2026' },
      { name: 'Mehmet D.', initials: 'MD', rating: 5, text: 'Çok profesyonel bir ekip. Revizyon isteklerime anında yanıt verdiler. Kesinlikle tavsiye ederim.', date: '8 Nisan 2026' },
      { name: 'Can Y.', initials: 'CY', rating: 5, text: 'Fiyat/performans açısından şu ana kadar çalıştığım en iyi üretici. Bir daha tercih edeceğim.', date: '2 Nisan 2026' },
    ],
  },
  '2': {
    company_name: 'Resin Masters Ankara', location: 'Ankara, Türkiye',
    description: 'Yüksek çözünürlüklü SLA/DLP reçine baskı uzmanı. Dental protezler, mücevher kalıpları ve sanat heykelleri konusunda özel uzmanlık.',
    score: 95, jobs: 512, reviews_count: 198, avg_rating: 4.94,
    badge: 'Hızlı Teslimat', badgeColor: 'bg-blue-100 text-blue-700',
    initials: 'RM', avatarColor: 'bg-blue-500', delivery: '1–2 gün', priceFrom: 65,
    materials: ['Resin', 'PLA'],
    contact_info: { website: 'https://resinmasters.com.tr' },
    portfolio: [
      { title: 'Dental Model', material: 'Resin', color: 'from-blue-500/20 to-blue-900' },
      { title: 'Mücevher Kalıbı', material: 'Resin', color: 'from-yellow-500/20 to-yellow-900' },
      { title: 'Heykel', material: 'Resin', color: 'from-purple-500/20 to-purple-900' },
      { title: 'Mimari Detay', material: 'Resin', color: 'from-teal-500/20 to-teal-900' },
    ],
    scoreBreakdown: [
      { label: 'Teslimat Hızı', value: 98, color: 'bg-green-500' },
      { label: 'Kalite', value: 96, color: 'bg-blue-500' },
      { label: 'İletişim', value: 94, color: 'bg-purple-500' },
      { label: 'Zamanında Teslimat', value: 97, color: 'bg-orange-500' },
    ],
    demoReviews: [
      { name: 'Zeynep A.', initials: 'ZA', rating: 5, text: 'Dental modellerim için mükemmel hassasiyet. Reçine kalitesi gerçekten üst düzey.', date: '15 Nisan 2026' },
      { name: 'Bora S.', initials: 'BS', rating: 5, text: 'Mücevher kalıplarım için daha önce farklı yerler denedim ama bu kalite eşsiz.', date: '5 Nisan 2026' },
    ],
  },
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-sm font-bold text-gray-900">{value}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100">
        <div className={`h-2 rounded-full ${color} transition-all duration-700`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function Stars({ rating, large }: { rating: number; large?: boolean }) {
  const size = large ? 'w-5 h-5' : 'w-4 h-4'
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} viewBox="0 0 20 20" fill={i <= Math.round(rating) ? '#f97316' : '#e5e7eb'} className={size}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function ProducerProfilePage() {
  const params = useParams()
  const producerId = params?.id as string

  const [profile,  setProfile]  = useState<typeof DEMO_PROFILES[string] | null>(null)
  const [reviews,  setReviews]  = useState<Review[]>([])
  const [loading,  setLoading]  = useState(true)
  const [activeTab, setActiveTab] = useState<'portfolio' | 'reviews' | 'score'>('portfolio')

  useEffect(() => {
    const load = async () => {
      /* Try DB first */
      const { data } = await supabase
        .from('producer_profiles')
        .select('*')
        .eq('id', producerId)
        .single()

      const { data: revData } = await supabase
        .from('reviews')
        .select('*, customer:users(full_name)')
        .eq('producer_id', producerId)
        .order('created_at', { ascending: false })
        .limit(10)

      if (data) {
        setProfile({ ...DEMO_PROFILES['1'], ...data, company_name: data.company_name, location: data.location, description: data.description })
      } else {
        /* Fall back to demo data */
        setProfile(DEMO_PROFILES[producerId] ?? DEMO_PROFILES['1'])
      }

      setReviews(revData ?? [])
      setLoading(false)
    }
    load()
  }, [producerId])

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-orange-500" />
    </div>
  )

  if (!profile) return null

  const p = profile
  const scoreColor = (p.score ?? 0) >= 95 ? 'text-orange-500 border-orange-400'
    : (p.score ?? 0) >= 90 ? 'text-blue-500 border-blue-400' : 'text-green-500 border-green-400'

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-black text-orange-500">TİRİDY</Link>
          <Link href="/explore" className="text-sm text-gray-400 hover:text-gray-600">← Üreticilere Dön</Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 space-y-6">

        {/* Profile hero */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-start gap-6">
            <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl ${p.avatarColor} text-2xl font-black text-white shadow-md`}>
              {p.initials}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl font-black text-gray-900">{p.company_name}</h1>
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-blue-500 shrink-0">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${p.badgeColor}`}>{p.badge}</span>
              </div>

              <p className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {p.location}
              </p>

              <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">{p.description}</p>

              <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center gap-1.5">
                  <Stars rating={p.avg_rating ?? 4.9} />
                  <span className="text-sm font-bold text-gray-900">{p.avg_rating}</span>
                  <span className="text-xs text-gray-400">({p.reviews_count} yorum)</span>
                </div>
                <span className="text-gray-200">|</span>
                <span className="text-sm text-gray-500"><strong className="text-gray-900">{p.jobs}</strong> tamamlanan iş</span>
                <span className="text-gray-200">|</span>
                <span className="text-sm text-gray-500"><strong className="text-gray-900">{p.delivery}</strong> teslimat</span>
                <span className="text-gray-200">|</span>
                <span className="text-sm text-orange-600 font-semibold">₺{p.priceFrom}&apos;dan</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.materials?.map(m => (
                  <span key={m} className="rounded-full border border-gray-200 px-2.5 py-0.5 text-xs text-gray-600">{m}</span>
                ))}
              </div>
            </div>

            {/* Score ring */}
            <div className="shrink-0 text-center">
              <div className={`flex h-16 w-16 items-center justify-center rounded-full border-[3px] ${scoreColor}`}>
                <span className="text-xl font-black">{p.score}</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">Skor</p>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="mt-6 flex flex-wrap gap-3 pt-6 border-t border-gray-100">
            <Link href="/order/new" className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-200 transition hover:bg-orange-400">
              Sipariş Ver
            </Link>
            {p.contact_info?.website && (
              <a href={p.contact_info.website} target="_blank" rel="noopener noreferrer"
                className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50">
                Web Sitesi ↗
              </a>
            )}
            {p.contact_info?.phone && (
              <a href={`tel:${p.contact_info.phone}`}
                className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50">
                {p.contact_info.phone}
              </a>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200">
            {([
              { key: 'portfolio', label: 'Portföy' },
              { key: 'reviews',   label: `Yorumlar (${(reviews.length || (p.demoReviews?.length ?? 0))})` },
              { key: 'score',     label: 'Skor Detayı' },
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3.5 text-sm font-medium border-b-2 transition ${
                  activeTab === tab.key
                    ? 'border-orange-500 text-orange-600 bg-orange-50/30'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Portfolio */}
            {activeTab === 'portfolio' && (
              <div>
                {p.portfolio && p.portfolio.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {p.portfolio.map((item, i) => (
                      <div key={i} className="group rounded-2xl overflow-hidden border border-gray-200 hover:border-orange-300 transition cursor-pointer">
                        <div className={`h-44 bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={0.8} className="w-16 h-16 opacity-40">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                          </svg>
                        </div>
                        <div className="p-4">
                          <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{item.material}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-gray-400">
                    <p className="text-3xl mb-2">🎨</p>
                    <p>Henüz portföy eklenmemiş.</p>
                  </div>
                )}
              </div>
            )}

            {/* Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {(reviews.length > 0 ? reviews.map(r => ({
                  name: r.customer?.full_name ?? 'Anonim',
                  initials: (r.customer?.full_name?.[0] ?? 'A').toUpperCase(),
                  rating: r.rating,
                  text: r.comment,
                  date: new Date(r.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
                })) : (p.demoReviews ?? [])).map((rev, i) => (
                  <div key={i} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                          {rev.initials}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{rev.name}</p>
                          <p className="text-xs text-gray-400">{rev.date}</p>
                        </div>
                      </div>
                      <Stars rating={rev.rating} />
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{rev.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Score breakdown */}
            {activeTab === 'score' && (
              <div className="max-w-lg space-y-5">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`flex h-20 w-20 items-center justify-center rounded-full border-4 ${scoreColor}`}>
                    <span className="text-3xl font-black">{p.score}</span>
                  </div>
                  <div>
                    <p className="text-lg font-black text-gray-900">Genel Skor</p>
                    <p className="text-sm text-gray-500">Son 90 günlük performans bazlı</p>
                    <Stars rating={p.avg_rating ?? 4.9} large />
                  </div>
                </div>

                {(p.scoreBreakdown ?? []).map((item, i) => (
                  <ScoreBar key={i} label={item.label} value={item.value} color={item.color} />
                ))}

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mt-4">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Skor; teslimat hızı (%30), kalite puanı (%40), iletişim (%15) ve iade oranı (%15) ağırlıklarına göre hesaplanır.
                    Her hafta güncellenir.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  )
}
