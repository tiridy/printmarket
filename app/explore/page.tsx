'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ScoreRing, ScoreBadge, Stars, Badge, EmptyState } from '../components/ui'

const ALL_MATERIALS = ['PLA', 'ABS', 'PETG', 'Resin', 'Nylon', 'Metal']

interface Manufacturer {
  id: number; name: string; location: string; score: number
  badge: string; badgeVariant: 'brand' | 'info' | 'neutral' | 'success' | 'warning'
  materials: string[]; jobs: number; rating: number; reviews: number
  priceFrom: number; delivery: string; description: string
  initials: string; verified: boolean; featured: boolean
}

const MANUFACTURERS: Manufacturer[] = [
  { id: 1, name: 'ProPrint İstanbul',    location: 'İstanbul, TR', score: 98, badge: 'Süper Üretici', badgeVariant: 'brand',   materials: ['PLA','ABS','PETG','Nylon'], jobs: 847,  rating: 4.97, reviews: 312, priceFrom: 45,  delivery: '2–3 gün', description: 'İstanbul\'un en büyük FDM baskı atölyesi. ISO 9001 belgeli, 12 makine kapasitesi.',  initials: 'PI', verified: true, featured: true },
  { id: 2, name: 'Resin Masters Ankara', location: 'Ankara, TR',   score: 95, badge: 'Hızlı Teslimat', badgeVariant: 'info',    materials: ['Resin','PLA'],             jobs: 512,  rating: 4.94, reviews: 198, priceFrom: 65,  delivery: '1–2 gün', description: 'Yüksek çözünürlüklü SLA/DLP reçine baskı uzmanı. Dental ve mücevher sektörüne özel.', initials: 'RM', verified: true, featured: true },
  { id: 3, name: 'Metal3D İzmir',        location: 'İzmir, TR',    score: 92, badge: 'Endüstriyel',   badgeVariant: 'neutral',  materials: ['Metal','Nylon','ABS'],     jobs: 289,  rating: 4.91, reviews: 97,  priceFrom: 120, delivery: '3–5 gün', description: 'Paslanmaz çelik, titanyum ve alüminyum SLM baskı. Havacılık kalitesi.',               initials: 'M3', verified: true, featured: false },
  { id: 4, name: 'HızlıBaskı Bursa',    location: 'Bursa, TR',    score: 89, badge: 'Ekonomik',      badgeVariant: 'success',  materials: ['PLA','ABS','PETG'],        jobs: 1204, rating: 4.85, reviews: 441, priceFrom: 28,  delivery: '3–4 gün', description: 'Büyük hacimli sipariş kapasitesi. Prototip ve seri üretim için uygun fiyatlı seçenek.', initials: 'HB', verified: true, featured: false },
  { id: 5, name: 'NylonTech Konya',     location: 'Konya, TR',    score: 87, badge: 'Uzman',         badgeVariant: 'brand',    materials: ['Nylon','PETG','ABS'],      jobs: 176,  rating: 4.88, reviews: 62,  priceFrom: 75,  delivery: '4–6 gün', description: 'MJF ve SLS nylon baskı uzmanı. Fonksiyonel parça ve mekanik prototip odaklı.',     initials: 'NT', verified: true, featured: false },
  { id: 6, name: 'ResinArt Trabzon',    location: 'Trabzon, TR',  score: 84, badge: 'Yeni',          badgeVariant: 'warning',  materials: ['Resin'],                   jobs: 89,   rating: 4.82, reviews: 31,  priceFrom: 55,  delivery: '2–4 gün', description: 'Sanat heykeli ve dekoratif obje üretiminde uzman. Ultra ince detay kapasitesi.',    initials: 'RA', verified: true, featured: false },
]

const AVATAR_COLORS = ['bg-orange-500', 'bg-blue-500', 'bg-slate-600', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500']

export default function ExplorePage() {
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [minRating,   setMinRating]   = useState(0)
  const [maxPrice,    setMaxPrice]    = useState(500)
  const [sortBy,      setSortBy]      = useState<'score'|'price'|'jobs'|'rating'>('score')
  const [search,      setSearch]      = useState('')
  const [onlyFeatured,setOnlyFeatured]= useState(false)

  const toggleMaterial = (m: string) =>
    setSelectedMaterials(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])

  const filtered = MANUFACTURERS.filter(m => {
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.location.toLowerCase().includes(search.toLowerCase())) return false
    if (selectedMaterials.length && !selectedMaterials.some(mat => m.materials.includes(mat))) return false
    if (m.rating < minRating) return false
    if (m.priceFrom > maxPrice) return false
    if (onlyFeatured && !m.featured) return false
    return true
  }).sort((a, b) => {
    if (sortBy === 'score')  return b.score - a.score
    if (sortBy === 'price')  return a.priceFrom - b.priceFrom
    if (sortBy === 'jobs')   return b.jobs - a.jobs
    if (sortBy === 'rating') return b.rating - a.rating
    return 0
  })

  const hasFilters = selectedMaterials.length > 0 || minRating > 0 || maxPrice < 500 || onlyFeatured

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-neutral-50)' }}>
      <header className="sticky top-0 z-20 glass-light" style={{ borderBottom: '1px solid var(--color-neutral-200)' }}>
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-black" style={{ color: 'var(--color-brand-500)' }}>TİRİDY</Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/explore" className="text-sm font-semibold" style={{ color: 'var(--color-brand-600)' }}>Üreticiler</Link>
            <Link href="/order/new" className="text-sm transition hover:opacity-80" style={{ color: 'var(--color-neutral-500)' }}>Sipariş Ver</Link>
          </nav>
          <div className="flex gap-2">
            <Link href="/login"    className="btn btn-secondary btn-sm">Giriş</Link>
            <Link href="/register" className="btn btn-primary btn-sm">Kayıt Ol</Link>
          </div>
        </div>
      </header>

      {/* Hero strip */}
      <div style={{ borderBottom: '1px solid var(--color-neutral-200)', background: 'var(--color-neutral-0)' }} className="py-8">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="display-md" style={{ color: 'var(--color-neutral-900)' }}>Üreticileri Keşfet</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-neutral-500)' }}>
            {MANUFACTURERS.length} doğrulanmış 3D baskı üreticisi • Türkiye geneli
          </p>
          <div className="mt-4 max-w-lg">
            <div className="input-icon-wrapper">
              <span className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Üretici veya şehir ara..." className="input" />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 flex gap-8">

        {/* ── Sidebar ── */}
        <aside className="w-56 shrink-0 space-y-6">

          <div>
            <p className="section-label mb-2.5">Sıralama</p>
            {[['score','En Yüksek Puan'],['rating','En İyi Değerlendirme'],['price','En Düşük Fiyat'],['jobs','En Çok İş']].map(([key, label]) => (
              <button key={key} onClick={() => setSortBy(key as typeof sortBy)}
                className={`nav-item w-full text-left ${sortBy === key ? 'nav-item-active' : ''}`}>
                {label}
              </button>
            ))}
          </div>

          <hr className="divider" />

          <div>
            <p className="section-label mb-3">Filtre</p>
            <label className="flex cursor-pointer items-center gap-2.5">
              <div onClick={() => setOnlyFeatured(f => !f)}
                className="relative h-5 w-9 rounded-full transition-colors"
                style={{ background: onlyFeatured ? 'var(--color-brand-500)' : 'var(--color-neutral-200)' }}>
                <span className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform"
                  style={{ transform: onlyFeatured ? 'translateX(16px)' : 'translateX(2px)' }} />
              </div>
              <span className="text-sm" style={{ color: 'var(--color-neutral-700)' }}>Öne çıkanlar</span>
            </label>
          </div>

          <div>
            <p className="section-label mb-3">Malzeme</p>
            <div className="space-y-2">
              {ALL_MATERIALS.map(m => (
                <label key={m} className="flex cursor-pointer items-center gap-2.5">
                  <div onClick={() => toggleMaterial(m)}
                    className="flex h-4 w-4 items-center justify-center rounded border transition"
                    style={{
                      borderColor:  selectedMaterials.includes(m) ? 'var(--color-brand-500)' : 'var(--color-neutral-300)',
                      background:   selectedMaterials.includes(m) ? 'var(--color-brand-500)' : 'var(--color-neutral-0)',
                    }}>
                    {selectedMaterials.includes(m) && (
                      <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-sm" style={{ color: 'var(--color-neutral-700)' }}>{m}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="section-label mb-3">Min. Puan</p>
            {[[0,'Tümü'],[4.8,'4.8+'],[4.9,'4.9+'],[4.95,'4.95+']].map(([r, label]) => (
              <button key={String(r)} onClick={() => setMinRating(Number(r))}
                className={`nav-item w-full text-left ${minRating === r ? 'nav-item-active' : ''}`}>
                {label}
              </button>
            ))}
          </div>

          <div>
            <p className="section-label mb-2">
              Maks. Fiyat: <span style={{ color: 'var(--color-brand-500)' }}>₺{maxPrice}</span>
            </p>
            <input type="range" min={20} max={500} step={5} value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-orange-500" />
            <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--color-neutral-400)' }}>
              <span>₺20</span><span>₺500+</span>
            </div>
          </div>

          {hasFilters && (
            <button onClick={() => { setSelectedMaterials([]); setMinRating(0); setMaxPrice(500); setOnlyFeatured(false) }}
              className="btn btn-ghost btn-sm w-full" style={{ color: 'var(--color-danger)', border: '1px solid var(--color-danger-light)' }}>
              Filtreleri Temizle
            </button>
          )}
        </aside>

        {/* ── Results ── */}
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--color-neutral-500)' }}>
              <span className="font-semibold" style={{ color: 'var(--color-neutral-900)' }}>{filtered.length}</span> üretici bulundu
            </p>
            <Link href="/order/new" className="btn btn-primary btn-sm">+ Talep Oluştur</Link>
          </div>

          {filtered.length === 0 ? (
            <EmptyState icon="🔍" title="Sonuç bulunamadı" desc="Filtrelerinizi değiştirmeyi deneyin." />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {filtered.map((m, i) => (
                <Link key={m.id} href={`/producers/${m.id}`} className="card card-hover p-6 block">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`avatar avatar-md ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>{m.initials}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold" style={{ color: 'var(--color-neutral-900)' }}>{m.name}</p>
                          {m.verified && (
                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0" style={{ color: 'var(--color-info)' }}>
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <p className="text-xs" style={{ color: 'var(--color-neutral-400)' }}>{m.location}</p>
                      </div>
                    </div>
                    <ScoreRing score={m.score} />
                  </div>

                  <p className="mb-4 text-sm truncate-2" style={{ color: 'var(--color-neutral-500)' }}>{m.description}</p>

                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {m.materials.map(mat => (
                      <Badge key={mat} variant={selectedMaterials.includes(mat) ? 'brand' : 'neutral'}>{mat}</Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--color-neutral-100)' }}>
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-neutral-500)' }}>
                      <Stars rating={m.rating} />
                      <span className="font-semibold" style={{ color: 'var(--color-neutral-700)' }}>{m.rating}</span>
                      <span>({m.reviews})</span>
                      <span style={{ color: 'var(--color-neutral-300)' }}>•</span>
                      <span>{m.jobs} iş</span>
                      <span style={{ color: 'var(--color-neutral-300)' }}>•</span>
                      <span>{m.delivery}</span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: 'var(--color-brand-500)' }}>₺{m.priceFrom}&apos;dan</span>
                  </div>

                  <div className="mt-3">
                    <Badge variant={m.badgeVariant}>{m.badge}</Badge>
                    <ScoreBadge score={m.score} className="ml-2" />
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
