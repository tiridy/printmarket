'use client'

import { useState } from 'react'
import Link from 'next/link'

const ALL_MATERIALS = ['PLA', 'ABS', 'PETG', 'Resin', 'Nylon', 'Metal']

interface Manufacturer {
  id: number
  name: string
  location: string
  score: number
  badge: string
  badgeColor: string
  materials: string[]
  jobs: number
  rating: number
  reviews: number
  priceFrom: number
  delivery: string
  description: string
  initials: string
  avatarColor: string
  verified: boolean
  featured: boolean
}

const MANUFACTURERS: Manufacturer[] = [
  {
    id: 1, name: 'ProPrint İstanbul', location: 'İstanbul, Türkiye',
    score: 98, badge: 'Süper Üretici', badgeColor: 'bg-orange-100 text-orange-700',
    materials: ['PLA', 'ABS', 'PETG', 'Nylon'], jobs: 847, rating: 4.97, reviews: 312,
    priceFrom: 45, delivery: '2–3 gün', initials: 'PI', avatarColor: 'bg-orange-500',
    description: 'İstanbul\'un en büyük FDM baskı atölyesi. ISO 9001 belgeli, 12 makine kapasitesi.',
    verified: true, featured: true,
  },
  {
    id: 2, name: 'Resin Masters Ankara', location: 'Ankara, Türkiye',
    score: 95, badge: 'Hızlı Teslimat', badgeColor: 'bg-blue-100 text-blue-700',
    materials: ['Resin', 'PLA'], jobs: 512, rating: 4.94, reviews: 198,
    priceFrom: 65, delivery: '1–2 gün', initials: 'RM', avatarColor: 'bg-blue-500',
    description: 'Yüksek çözünürlüklü SLA/DLP reçine baskı uzmanı. Dental ve mücevher sektörüne özel.',
    verified: true, featured: true,
  },
  {
    id: 3, name: 'Metal3D İzmir', location: 'İzmir, Türkiye',
    score: 92, badge: 'Endüstriyel', badgeColor: 'bg-slate-100 text-slate-700',
    materials: ['Metal', 'Nylon', 'ABS'], jobs: 289, rating: 4.91, reviews: 97,
    priceFrom: 120, delivery: '3–5 gün', initials: 'M3', avatarColor: 'bg-slate-600',
    description: 'Paslanmaz çelik, titanyum ve alüminyum SLM baskı hizmetleri. Havacılık kalitesi.',
    verified: true, featured: false,
  },
  {
    id: 4, name: 'HızlıBaskı Bursa', location: 'Bursa, Türkiye',
    score: 89, badge: 'Ekonomik', badgeColor: 'bg-green-100 text-green-700',
    materials: ['PLA', 'ABS', 'PETG'], jobs: 1204, rating: 4.85, reviews: 441,
    priceFrom: 28, delivery: '3–4 gün', initials: 'HB', avatarColor: 'bg-green-500',
    description: 'Büyük hacimli sipariş kapasitesi. Prototip ve seri üretim için uygun fiyatlı seçenek.',
    verified: true, featured: false,
  },
  {
    id: 5, name: 'NylonTech Konya', location: 'Konya, Türkiye',
    score: 87, badge: 'Uzman', badgeColor: 'bg-purple-100 text-purple-700',
    materials: ['Nylon', 'PETG', 'ABS'], jobs: 176, rating: 4.88, reviews: 62,
    priceFrom: 75, delivery: '4–6 gün', initials: 'NT', avatarColor: 'bg-purple-500',
    description: 'MJF ve SLS nylon baskı konusunda uzman. Fonksiyonel parça ve mekanik prototip odaklı.',
    verified: true, featured: false,
  },
  {
    id: 6, name: 'ResinArt Trabzon', location: 'Trabzon, Türkiye',
    score: 84, badge: 'Yeni', badgeColor: 'bg-yellow-100 text-yellow-700',
    materials: ['Resin'], jobs: 89, rating: 4.82, reviews: 31,
    priceFrom: 55, delivery: '2–4 gün', initials: 'RA', avatarColor: 'bg-yellow-500',
    description: 'Sanat heykeli ve dekoratif obje üretiminde uzman. Ultra ince detay kapasitesi.',
    verified: true, featured: false,
  },
]

function ScoreRing({ score }: { score: number }) {
  const color = score >= 95 ? 'text-orange-500' : score >= 90 ? 'text-blue-500' : 'text-green-500'
  const ring  = score >= 95 ? 'border-orange-400' : score >= 90 ? 'border-blue-400' : 'border-green-400'
  return (
    <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${ring} bg-white`}>
      <span className={`text-xs font-black ${color}`}>{score}</span>
    </div>
  )
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <svg viewBox="0 0 20 20" fill="#f97316" className="w-3.5 h-3.5">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <span className="text-xs font-semibold text-gray-700">{rating}</span>
    </div>
  )
}

export default function ExplorePage() {
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [maxPrice, setMaxPrice] = useState(500)
  const [sortBy, setSortBy] = useState<'score' | 'price' | 'jobs' | 'rating'>('score')
  const [search, setSearch] = useState('')
  const [onlyFeatured, setOnlyFeatured] = useState(false)

  const toggleMaterial = (m: string) =>
    setSelectedMaterials(prev =>
      prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]
    )

  const filtered = MANUFACTURERS
    .filter(m => {
      if (search && !m.name.toLowerCase().includes(search.toLowerCase()) &&
          !m.location.toLowerCase().includes(search.toLowerCase())) return false
      if (selectedMaterials.length && !selectedMaterials.some(mat => m.materials.includes(mat))) return false
      if (m.rating < minRating) return false
      if (m.priceFrom > maxPrice) return false
      if (onlyFeatured && !m.featured) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'score')  return b.score - a.score
      if (sortBy === 'price')  return a.priceFrom - b.priceFrom
      if (sortBy === 'jobs')   return b.jobs - a.jobs
      if (sortBy === 'rating') return b.rating - a.rating
      return 0
    })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-black text-orange-500">TİRİDY</Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/explore" className="text-sm font-semibold text-orange-600">Üreticiler</Link>
            <Link href="/order/new" className="text-sm text-gray-500 hover:text-gray-700">Sipariş Ver</Link>
          </nav>
          <div className="flex gap-2">
            <Link href="/login" className="rounded-full border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-600 hover:border-gray-300">Giriş</Link>
            <Link href="/register" className="rounded-full bg-orange-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-orange-400">Kayıt Ol</Link>
          </div>
        </div>
      </header>

      {/* Hero strip */}
      <div className="border-b border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="text-3xl font-black text-gray-900">Üreticileri Keşfet</h1>
          <p className="mt-1 text-gray-500">{MANUFACTURERS.length} doğrulanmış 3D baskı üreticisi • Türkiye geneli</p>
          <div className="mt-4 flex max-w-lg items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-gray-400 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Üretici veya şehir ara..."
              className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 flex gap-8">

        {/* ── Sidebar Filters ── */}
        <aside className="w-56 shrink-0 space-y-6">

          {/* Sort */}
          <div>
            <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-gray-400">Sıralama</p>
            <div className="space-y-1">
              {[
                { key: 'score',  label: 'En Yüksek Puan' },
                { key: 'rating', label: 'En İyi Değerlendirme' },
                { key: 'price',  label: 'En Düşük Fiyat' },
                { key: 'jobs',   label: 'En Çok İş' },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setSortBy(opt.key as typeof sortBy)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                    sortBy === opt.key
                      ? 'bg-orange-50 font-semibold text-orange-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Featured toggle */}
          <div>
            <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-gray-400">Filtre</p>
            <label className="flex cursor-pointer items-center gap-2.5">
              <div
                onClick={() => setOnlyFeatured(f => !f)}
                className={`relative h-5 w-9 rounded-full transition ${onlyFeatured ? 'bg-orange-500' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${onlyFeatured ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm text-gray-700">Öne çıkanlar</span>
            </label>
          </div>

          {/* Materials */}
          <div>
            <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-gray-400">Malzeme</p>
            <div className="space-y-1.5">
              {ALL_MATERIALS.map(m => (
                <label key={m} className="flex cursor-pointer items-center gap-2.5">
                  <div
                    onClick={() => toggleMaterial(m)}
                    className={`flex h-4 w-4 items-center justify-center rounded border transition ${
                      selectedMaterials.includes(m)
                        ? 'border-orange-500 bg-orange-500'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {selectedMaterials.includes(m) && (
                      <svg viewBox="0 0 12 12" fill="white" className="w-2.5 h-2.5">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-gray-700">{m}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-gray-400">Min. Puan</p>
            <div className="space-y-1">
              {[0, 4.8, 4.9, 4.95].map(r => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className={`w-full rounded-lg px-3 py-1.5 text-left text-sm transition ${
                    minRating === r
                      ? 'bg-orange-50 font-semibold text-orange-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {r === 0 ? 'Tümü' : `${r}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Max price */}
          <div>
            <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-gray-400">
              Maks. Başlangıç Fiyatı: <span className="text-orange-500">₺{maxPrice}</span>
            </p>
            <input
              type="range" min={20} max={500} step={5}
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>₺20</span><span>₺500+</span>
            </div>
          </div>

          {/* Reset */}
          {(selectedMaterials.length > 0 || minRating > 0 || maxPrice < 500 || onlyFeatured) && (
            <button
              onClick={() => { setSelectedMaterials([]); setMinRating(0); setMaxPrice(500); setOnlyFeatured(false) }}
              className="w-full rounded-xl border border-gray-200 py-2 text-xs font-medium text-gray-500 hover:border-red-200 hover:text-red-500 transition"
            >
              Filtreleri Temizle
            </button>
          )}
        </aside>

        {/* ── Results Grid ── */}
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-900">{filtered.length}</span> üretici bulundu
            </p>
            <Link
              href="/order/new"
              className="rounded-full bg-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-orange-200 hover:bg-orange-400 transition"
            >
              + Talep Oluştur
            </Link>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-16 text-center">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-semibold text-gray-700">Sonuç bulunamadı</p>
              <p className="mt-1 text-sm text-gray-400">Filtrelerinizi değiştirmeyi deneyin</p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {filtered.map(m => (
                <Link
                  key={m.id}
                  href={`/producers/${m.id}`}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md"
                >
                  {/* Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${m.avatarColor} text-sm font-black text-white shadow-sm`}>
                        {m.initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900 group-hover:text-orange-600 transition">{m.name}</p>
                          {m.verified && (
                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-blue-500 shrink-0">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">{m.location}</p>
                      </div>
                    </div>
                    <ScoreRing score={m.score} />
                  </div>

                  {/* Description */}
                  <p className="mb-4 text-sm text-gray-500 line-clamp-2">{m.description}</p>

                  {/* Materials */}
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {m.materials.map(mat => (
                      <span key={mat} className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                        selectedMaterials.includes(mat)
                          ? 'border-orange-300 bg-orange-50 text-orange-600'
                          : 'border-gray-200 text-gray-500'
                      }`}>
                        {mat}
                      </span>
                    ))}
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-3">
                      <Stars rating={m.rating} />
                      <span className="text-xs text-gray-400">({m.reviews})</span>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-xs text-gray-500">{m.jobs} iş</span>
                      <span className="text-xs text-gray-300">•</span>
                      <span className="text-xs text-gray-500">{m.delivery}</span>
                    </div>
                    <span className="text-sm font-bold text-orange-500">₺{m.priceFrom}&apos;dan</span>
                  </div>

                  <div className="mt-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${m.badgeColor}`}>
                      {m.badge}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
