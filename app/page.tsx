import Link from 'next/link'
import { ScoreBadge, Stars, SectionHeader } from './components/ui'
import LandingNav from './components/LandingNav'

const STATS = [
  { value: '12,400+', label: 'Tamamlanan İş' },
  { value: '340+',    label: 'Doğrulanmış Üretici' },
  { value: '4.9/5',   label: 'Ortalama Puan' },
  { value: '98%',     label: 'Zamanında Teslimat' },
]

const MATERIALS = [
  { name: 'PLA',   desc: 'Genel amaçlı, çevre dostu',  cls: 'badge-success' },
  { name: 'ABS',   desc: 'Yüksek dayanıklılık',        cls: 'badge-info' },
  { name: 'Resin', desc: 'Ultra-ince detay',            cls: 'badge-brand' },
  { name: 'PETG',  desc: 'Nem ve ısı direnci',          cls: 'badge-warning' },
  { name: 'Nylon', desc: 'Esnek ve hafif',              cls: 'badge-neutral' },
  { name: 'Metal', desc: 'Endüstriyel güç',             cls: 'badge-neutral' },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Dosyanı Yükle',
    desc: 'STL veya OBJ dosyanı sürükle-bırak ile yükle. Sistem anında 3D önizleme oluşturur.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'AI Fiyat Al',
    desc: 'Yapay zeka dosyayı analiz eder: hacim, malzeme kullanımı ve baskı süresi hesaplanır. Saniyeler içinde fiyat aralığı görürsün.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Üretici Seç & Sipariş Ver',
    desc: 'Teklif al ya da anında "Hızlı Üretim" modunu kullan. Akıllı eşleştirme en uygun üreticileri önerir.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
]

const FEATURES = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>,
    title: 'AI Anlık Fiyatlama',
    desc: 'Dosya yükler yüklenmez yapay zeka hacim, malzeme ve baskı süresi hesaplar. Teklif beklemeden fiyat görürsün.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
    title: 'Hızlı Üretim Modu',
    desc: 'Önceden onaylı üreticiler listesinden seç, teklif sürecini atla. Anında sipariş ver, hemen üretime geç.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>,
    title: 'Üretici Skor Sistemi',
    desc: 'Her üretici; teslimat hızı, müşteri puanı ve iade oranına göre puanlanır. Güvenilirliği tek bakışta görürsün.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>,
    title: 'Akıllı Eşleştirme',
    desc: 'Konumuna, malzeme kapasitesine ve geçmiş performansa göre en uygun üreticiler otomatik önerilir.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
    title: 'Gerçek Zamanlı Mesajlaşma',
    desc: 'Üreticilerle doğrudan mesajlaş, dosya paylaş, revizyon talep et. Her sipariş için ayrı sohbet kanalı.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
    title: 'Güvenli Escrow Ödeme',
    desc: 'Ödemen teslimat onayına kadar sistemde güvende tutulur. Sorun olursa tam iade garantisi.',
  },
]

const MANUFACTURERS = [
  { id: 1, name: 'ProPrint İstanbul',    location: 'İstanbul', score: 98, badge: 'Süper Üretici', badgeCls: 'badge-brand',   materials: ['PLA','ABS','PETG'], jobs: 847,  rating: 4.97, price: '₺45', delivery: '2–3 gün', initials: 'PI' },
  { id: 2, name: 'Resin Masters Ankara', location: 'Ankara',   score: 95, badge: 'Hızlı Teslimat', badgeCls: 'badge-info',   materials: ['Resin','PLA'],     jobs: 512,  rating: 4.94, price: '₺65', delivery: '1–2 gün', initials: 'RM' },
  { id: 3, name: 'Metal3D İzmir',        location: 'İzmir',    score: 92, badge: 'Endüstriyel',   badgeCls: 'badge-neutral', materials: ['Metal','Nylon'],    jobs: 289,  rating: 4.91, price: '₺120','delivery': '3–5 gün', initials: 'M3' },
]

const TESTIMONIALS = [
  { name: 'Ayşe Kaya', role: 'Ürün Tasarımcısı', text: 'AI fiyatlama özelliği inanılmaz. Dosyayı yükler yüklemez bütçemi planlayabiliyorum. Artık fiyat müzakeresiyle zaman kaybetmiyorum.', rating: 5, initials: 'AK', bg: 'bg-purple-500' },
  { name: 'Mehmet Demir', role: 'ProPrint İstanbul — Üretici', text: 'Platformdan ayda 60+ sipariş alıyorum. Akıllı eşleştirme sayesinde sadece kapasiteme uygun işler geliyor.', rating: 5, initials: 'MD', bg: 'bg-blue-500' },
  { name: 'Can Yılmaz', role: 'Makine Mühendisi', text: 'Hızlı Üretim modu ile prototiplerim artık 24 saatte elimde. Eskiden bu süreç haftalar alıyordu.', rating: 5, initials: 'CY', bg: 'bg-green-500' },
]

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-surface-base)', color: 'var(--color-neutral-100)' }}>

      <LandingNav />

      <main>
        {/* ── Hero ── */}
        <section className="relative overflow-hidden py-24 lg:py-32">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full blur-3xl" style={{ background: 'rgba(249,115,22,.07)' }} />
            <div className="absolute top-20 right-0 h-72 w-72 rounded-full blur-3xl" style={{ background: 'rgba(59,130,246,.05)' }} />
          </div>

          <div className="relative mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-4xl text-center">
              <span className="badge badge-brand badge-dot mb-6 inline-flex">
                AI destekli 3D baskı pazaryeri
              </span>

              <h1 className="display-xl text-white mt-4">
                3D dosyandan
                <span className="block gradient-text">saniyeler içinde fiyat al</span>
              </h1>

              <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed" style={{ color: 'var(--color-neutral-400)' }}>
                STL / OBJ dosyanı yükle, yapay zeka anlık fiyat hesaplasın. 340+ doğrulanmış
                üreticiden teklif al ya da &quot;Hızlı Üretim&quot; moduyla anında sipariş ver.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/order/new" className="btn btn-primary btn-lg group">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 transition group-hover:-translate-y-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  3D Dosya Yükle
                </Link>
                <Link href="/explore" className="btn btn-outline-dark btn-lg">
                  Üreticileri Keşfet
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              <p className="mt-5 text-sm" style={{ color: 'var(--color-neutral-500)' }}>Ücretsiz kayıt • Kredi kartı gerekmez</p>
            </div>

            {/* AI pricing demo card */}
            <div className="mx-auto mt-16 max-w-3xl animate-in">
              <div className="card-dark p-6" style={{ boxShadow: '0 25px 50px rgba(0,0,0,.5)' }}>
                <div className="mb-5 flex items-center gap-3 pb-5" style={{ borderBottom: '1px solid var(--color-surface-overlay)' }}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'rgba(249,115,22,.12)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5" style={{ color: 'var(--color-brand-400)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">AI Anlık Fiyat Analizi</p>
                    <p className="text-xs" style={{ color: 'var(--color-neutral-500)' }}>robot_arm_v3.stl — 84.2 MB</p>
                  </div>
                  <span className="badge badge-success badge-dot ml-auto">Analiz tamamlandı</span>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { label: 'Tahmini Fiyat', value: '₺340', suffix: '– ₺520', sub: 'Malzeme: PLA / ABS', subColor: 'var(--color-brand-400)' },
                    { label: 'Baskı Süresi',  value: '14',  suffix: 'saat',    sub: 'Karmaşıklık: Orta', subColor: 'var(--color-info)' },
                    { label: 'Teslim Süresi', value: '2',   suffix: '– 4 gün', sub: 'Hızlı Üretim mevcut', subColor: 'var(--color-success)' },
                  ].map(s => (
                    <div key={s.label} className="rounded-2xl p-4" style={{ background: 'var(--color-surface-base)' }}>
                      <p className="text-xs mb-1" style={{ color: 'var(--color-neutral-500)' }}>{s.label}</p>
                      <p className="text-2xl font-black text-white">
                        {s.value} <span className="text-base font-normal" style={{ color: 'var(--color-neutral-400)' }}>{s.suffix}</span>
                      </p>
                      <p className="mt-1 text-xs" style={{ color: s.subColor }}>{s.sub}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <Link href="/order/new" className="btn btn-primary justify-center">Teklif Al</Link>
                  <Link href="/order/new" className="btn btn-outline-dark justify-center">⚡ Hızlı Üretim</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Trust Stats ── */}
        <section style={{ borderTop: '1px solid var(--color-surface-overlay)', borderBottom: '1px solid var(--color-surface-overlay)', background: 'rgba(15,23,42,.5)' }} className="py-12">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {STATS.map(s => (
                <div key={s.label} className="text-center">
                  <p className="display-md text-white">{s.value}</p>
                  <p className="mt-1 text-sm" style={{ color: 'var(--color-neutral-500)' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section id="how" className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeader dark label="Nasıl Çalışır" title="3 adımda tamamla" desc="Karmaşık üretim süreçlerini sade ve hızlı bir deneyime dönüştürdük." />
            <div className="mt-16 grid gap-5 md:grid-cols-3">
              {HOW_IT_WORKS.map((item, i) => (
                <div key={i} className="card-dark card-dark-hover p-8 group">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl transition-colors group-hover:text-white" style={{ background: 'rgba(249,115,22,.1)', color: 'var(--color-brand-400)' }} data-group-hover-bg="var(--color-brand-500)">
                      {item.icon}
                    </div>
                    <span className="text-5xl font-black" style={{ color: 'var(--color-surface-overlay)' }}>{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <p className="mt-3 leading-relaxed" style={{ color: 'var(--color-neutral-400)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/order/new" className="btn btn-primary btn-lg">Hemen Başla — Ücretsiz</Link>
            </div>
          </div>
        </section>

        {/* ── Materials ── */}
        <section style={{ borderTop: '1px solid var(--color-surface-overlay)', borderBottom: '1px solid var(--color-surface-overlay)', background: 'rgba(15,23,42,.4)' }} className="py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="section-label">Desteklenen Malzemeler</p>
                <h2 className="mt-2 display-sm text-white">Her malzeme, her uygulama</h2>
              </div>
              <Link href="/explore" className="text-sm font-medium transition hover:opacity-80" style={{ color: 'var(--color-brand-400)' }}>Tüm üreticilere bak →</Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {MATERIALS.map(m => (
                <div key={m.name} className="card-dark p-4 flex items-center gap-3">
                  <span className={`badge ${m.cls} text-sm font-black px-3 py-1`}>{m.name}</span>
                  <span className="text-sm" style={{ color: 'var(--color-neutral-400)' }}>{m.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeader dark label="Neden TİRİDY" title="Platformu farklı kılan özellikler" />
            <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f, i) => (
                <div key={i} className="card-dark card-dark-hover p-7 group">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl transition-colors" style={{ background: 'rgba(249,115,22,.1)', color: 'var(--color-brand-400)' }}>
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white">{f.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--color-neutral-400)' }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured Manufacturers ── */}
        <section style={{ borderTop: '1px solid var(--color-surface-overlay)', borderBottom: '1px solid var(--color-surface-overlay)', background: 'rgba(15,23,42,.4)' }} className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 flex items-end justify-between flex-wrap gap-4">
              <div>
                <p className="section-label">Öne Çıkan Üreticiler</p>
                <h2 className="mt-2 display-sm text-white">En yüksek puanlı üreticiler</h2>
                <p className="mt-3 text-sm" style={{ color: 'var(--color-neutral-400)' }}>Tüm üreticiler AI doğrulamasından geçirilmiş ve puanlanmıştır.</p>
              </div>
              <Link href="/explore" className="btn btn-outline-dark btn-sm">Tümünü Gör →</Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {MANUFACTURERS.map(m => (
                <Link key={m.id} href={`/producers/${m.id}`} className="card-dark card-dark-hover p-6 block">
                  <div className="mb-5 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="avatar avatar-md" style={{ background: 'var(--color-brand-500)' }}>{m.initials}</div>
                      <div>
                        <p className="font-bold text-white">{m.name}</p>
                        <p className="text-xs" style={{ color: 'var(--color-neutral-500)' }}>{m.location}</p>
                      </div>
                    </div>
                    <ScoreBadge score={m.score} />
                  </div>

                  <div className="mb-5 flex flex-wrap gap-1.5">
                    {m.materials.map(mat => (
                      <span key={mat} className="badge badge-neutral">{mat}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--color-surface-overlay)' }}>
                    <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--color-neutral-500)' }}>
                      <span>{m.jobs} iş</span>
                      <span>•</span>
                      <Stars rating={m.rating} />
                      <span>{m.rating}</span>
                      <span>•</span>
                      <span>{m.delivery}</span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: 'var(--color-brand-400)' }}>{m.price}&apos;dan</span>
                  </div>
                  <div className="mt-3">
                    <span className={`badge ${m.badgeCls}`}>{m.badge}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeader dark label="Kullanıcı Yorumları" title="Onlar denedi, memnun kaldı" />
            <div className="mt-16 grid gap-5 md:grid-cols-3">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="card-dark p-7">
                  <Stars rating={t.rating} size="md" />
                  <p className="mt-4 leading-relaxed" style={{ color: 'var(--color-neutral-300)' }}>&quot;{t.text}&quot;</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className={`avatar avatar-md avatar-round ${t.bg}`}>{t.initials}</div>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs" style={{ color: 'var(--color-neutral-500)' }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="relative overflow-hidden rounded-[2.5rem] p-12 text-center" style={{ background: 'linear-gradient(135deg, var(--color-brand-500), var(--color-brand-700))' }}>
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl" style={{ background: 'rgba(255,255,255,.06)' }} />
                <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full blur-2xl" style={{ background: 'rgba(0,0,0,.12)' }} />
              </div>
              <h2 className="relative display-md text-white">3D dosyanı yükle,<br />üretimi başlat</h2>
              <p className="relative mx-auto mt-4 max-w-xl text-lg" style={{ color: 'rgba(255,255,255,.8)' }}>
                Ücretsiz kayıt ol, STL / OBJ dosyanı yükle, saniyeler içinde AI fiyat analizi al.
              </p>
              <div className="relative mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/register" className="btn btn-xl rounded-full font-bold" style={{ background: '#fff', color: 'var(--color-brand-600)' }}>
                  Ücretsiz Başla
                </Link>
                <Link href="/explore" className="btn btn-xl rounded-full" style={{ border: '2px solid rgba(255,255,255,.4)', color: '#fff' }}>
                  Üreticileri Keşfet
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid var(--color-surface-overlay)', background: 'var(--color-surface-base)' }} className="py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <p className="text-2xl font-black" style={{ color: 'var(--color-brand-500)' }}>TİRİDY</p>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--color-neutral-500)' }}>Türkiye&apos;nin en büyük 3D baskı pazaryeri. Müşteriler ve üreticiler için.</p>
            </div>
            {[
              { title: 'Platform',  links: ['Üreticiler','Sipariş Ver','Fiyatlar','Nasıl Çalışır'] },
              { title: 'Üreticiler',links: ['Üretici Ol','Skor Sistemi','Ödeme','Destek'] },
              { title: 'Şirket',   links: ['Hakkımızda','Blog','Kariyer','İletişim'] },
            ].map(col => (
              <div key={col.title}>
                <p className="text-sm font-bold text-white">{col.title}</p>
                <ul className="mt-4 space-y-2">
                  {col.links.map(l => (
                    <li key={l}><Link href="#" className="text-sm transition hover:opacity-80" style={{ color: 'var(--color-neutral-500)' }}>{l}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 pt-8 text-sm md:flex-row" style={{ borderTop: '1px solid var(--color-surface-overlay)', color: 'var(--color-neutral-600)' }}>
            <p>© 2026 TİRİDY. Tüm hakları saklıdır.</p>
            <div className="flex gap-6">
              {['Gizlilik','Şartlar','Çerezler'].map(l => (
                <Link key={l} href="#" className="transition hover:opacity-80" style={{ color: 'var(--color-neutral-500)' }}>{l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
