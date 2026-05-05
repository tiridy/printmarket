import Link from 'next/link'

const STATS = [
  { value: '12,400+', label: 'Tamamlanan İş' },
  { value: '340+',    label: 'Doğrulanmış Üretici' },
  { value: '4.9/5',   label: 'Ortalama Puan' },
  { value: '98%',     label: 'Zamanında Teslimat' },
]

const MATERIALS = [
  { name: 'PLA', desc: 'Genel amaçlı, çevre dostu', color: 'bg-green-100 text-green-700 border-green-200' },
  { name: 'ABS', desc: 'Yüksek dayanıklılık', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { name: 'Resin', desc: 'Ultra-ince detay', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { name: 'PETG', desc: 'Nem ve ısı direnci', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { name: 'Nylon', desc: 'Esnek ve hafif', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { name: 'Metal', desc: 'Endüstriyel güç', color: 'bg-slate-200 text-slate-700 border-slate-300' },
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

const MANUFACTURERS = [
  {
    name: 'ProPrint İstanbul',
    location: 'İstanbul, TR',
    score: 98,
    badge: 'Süper Üretici',
    badgeCls: 'bg-orange-100 text-orange-700',
    materials: ['PLA', 'ABS', 'PETG'],
    jobs: 847,
    rating: 4.97,
    price: '₺45',
    delivery: '2-3 gün',
    initials: 'PI',
  },
  {
    name: 'Resin Masters Ankara',
    location: 'Ankara, TR',
    score: 95,
    badge: 'Hızlı Üretici',
    badgeCls: 'bg-blue-100 text-blue-700',
    materials: ['Resin', 'PLA'],
    jobs: 512,
    rating: 4.94,
    price: '₺65',
    delivery: '1-2 gün',
    initials: 'RM',
  },
  {
    name: 'Metal3D İzmir',
    location: 'İzmir, TR',
    score: 92,
    badge: 'Doğrulanmış',
    badgeCls: 'bg-green-100 text-green-700',
    materials: ['Metal', 'Nylon', 'ABS'],
    jobs: 289,
    rating: 4.91,
    price: '₺120',
    delivery: '3-5 gün',
    initials: 'M3',
  },
]

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: 'AI Anlık Fiyatlama',
    desc: 'Dosya yükler yüklenmez yapay zeka hacim, malzeme ve baskı süresi hesaplar. Teklif beklemeden fiyat görürsün.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Hızlı Üretim Modu',
    desc: 'Önceden onaylı üreticiler listesinden seç, teklif sürecini atla. Anında sipariş ver, hemen üretime geç.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    title: 'Üretici Skor Sistemi',
    desc: 'Her üretici; teslimat hızı, müşteri puanı ve iade oranına göre puanlanır. Güvenilirliği tek bakışta görürsün.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    title: 'Akıllı Eşleştirme',
    desc: 'Konumuna, malzeme kapasitesine ve geçmiş performansa göre en uygun üreticiler otomatik önerilir.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 016 3H3.375A2.25 2.25 0 011.125 5.25v13.5A2.25 2.25 0 013.375 21h10.5A2.25 2.25 0 0116.125 18.75V18M8.25 9h7.5A2.25 2.25 0 0118 11.25v3M8.25 9H6" />
      </svg>
    ),
    title: 'Gerçek Zamanlı Mesajlaşma',
    desc: 'Üreticilerle doğrudan mesajlaş, dosya paylaş, revizyon talep et. Her sipariş için ayrı sohbet kanalı.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Güvenli Escrow Ödeme',
    desc: 'Ödemen teslimat onayına kadar sistemde güvende tutulur. Sorun olursa tam iade garantisi.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Ayşe Kaya',
    role: 'Ürün Tasarımcısı',
    text: 'AI fiyatlama özelliği inanılmaz. Dosyayı yükler yüklemez bütçemi planlayabiliyorum. Artık fiyat müzakeresiyle zaman kaybetmiyorum.',
    rating: 5,
    initials: 'AK',
    color: 'bg-purple-500',
  },
  {
    name: 'Mehmet Demir',
    role: 'ProPrint İstanbul — Üretici',
    text: 'Platformdan ayda 60+ sipariş alıyorum. Akıllı eşleştirme sayesinde sadece kapasiteme uygun işler geliyor. Verimliliğim 3 katına çıktı.',
    rating: 5,
    initials: 'MD',
    color: 'bg-blue-500',
  },
  {
    name: 'Can Yılmaz',
    role: 'Makine Mühendisi',
    text: 'Hızlı Üretim modu ile prototiplerim artık 24 saatte elimde. Eskiden bu süreç haftalar alıyordu. TİRİDY tam bir oyun değiştirici.',
    rating: 5,
    initials: 'CY',
    color: 'bg-green-500',
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} viewBox="0 0 20 20" fill={i <= rating ? '#f97316' : '#e2e8f0'} className="w-4 h-4">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 95 ? 'bg-orange-500' : score >= 90 ? 'bg-blue-500' : 'bg-green-500'
  return (
    <div className={`flex items-center gap-1 ${color} text-white rounded-full px-2.5 py-1 text-xs font-bold`}>
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      {score}
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-30 border-b border-slate-800/60 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <Link href="/" className="text-2xl font-black tracking-tight text-orange-500 select-none">
            TİRİDY
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/explore" className="text-sm font-medium text-slate-400 transition hover:text-white">Üreticiler</Link>
            <Link href="/order/new" className="text-sm font-medium text-slate-400 transition hover:text-white">Sipariş Ver</Link>
            <Link href="#features" className="text-sm font-medium text-slate-400 transition hover:text-white">Özellikler</Link>
            <Link href="#how" className="text-sm font-medium text-slate-400 transition hover:text-white">Nasıl Çalışır</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden rounded-full border border-slate-700 px-5 py-2 text-sm font-medium text-slate-300 transition hover:border-orange-400 hover:text-orange-400 sm:block">
              Giriş Yap
            </Link>
            <Link href="/register" className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-400">
              Ücretsiz Başla
            </Link>
          </div>
        </div>
      </header>

      <main>

        {/* ── Hero ── */}
        <section className="relative overflow-hidden py-24 lg:py-32">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-orange-500/8 blur-3xl" />
            <div className="absolute top-20 right-0 h-72 w-72 rounded-full bg-blue-500/6 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-sm font-semibold text-orange-300">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
                AI destekli 3D baskı pazaryeri
              </span>
              <h1 className="mt-8 text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                3D dosyandan
                <span className="block bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  saniyeler içinde fiyat al
                </span>
              </h1>
              <p className="mx-auto mt-8 max-w-2xl text-lg text-slate-400 sm:text-xl">
                STL / OBJ dosyanı yükle, yapay zeka anlık fiyat hesaplasın. 340+ doğrulanmış üreticiden teklif al ya da &quot;Hızlı Üretim&quot; moduyla anında sipariş ver.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/order/new"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-orange-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-400 hover:shadow-orange-400/30"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 transition group-hover:-translate-y-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  3D Dosya Yükle
                </Link>
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-8 py-3.5 text-base font-medium text-slate-300 transition hover:border-slate-600 hover:text-white"
                >
                  Üreticileri Keşfet
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              <p className="mt-5 text-sm text-slate-500">Ücretsiz kayıt • Kredi kartı gerekmez • Anında başla</p>
            </div>

            {/* Hero visual — AI pricing card */}
            <div className="mx-auto mt-16 max-w-3xl">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur-xl">
                <div className="mb-5 flex items-center gap-3 border-b border-slate-800 pb-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-400">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">AI Anlık Fiyat Analizi</p>
                    <p className="text-xs text-slate-500">robot_arm_v3.stl — 84.2 MB</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5 rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                    Analiz tamamlandı
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-950/80 p-4">
                    <p className="text-xs text-slate-500 mb-1">Tahmini Fiyat</p>
                    <p className="text-2xl font-black text-white">₺340 <span className="text-base font-normal text-slate-400">– ₺520</span></p>
                    <p className="mt-1 text-xs text-orange-400">Malzeme: PLA / ABS</p>
                  </div>
                  <div className="rounded-2xl bg-slate-950/80 p-4">
                    <p className="text-xs text-slate-500 mb-1">Baskı Süresi</p>
                    <p className="text-2xl font-black text-white">14 <span className="text-base font-normal text-slate-400">saat</span></p>
                    <p className="mt-1 text-xs text-blue-400">Karmaşıklık: Orta</p>
                  </div>
                  <div className="rounded-2xl bg-slate-950/80 p-4">
                    <p className="text-xs text-slate-500 mb-1">Teslim Süresi</p>
                    <p className="text-2xl font-black text-white">2 <span className="text-base font-normal text-slate-400">– 4 gün</span></p>
                    <p className="mt-1 text-xs text-green-400">Hızlı Üretim mevcut</p>
                  </div>
                </div>
                <div className="mt-5 flex gap-3">
                  <Link href="/order/new" className="flex-1 rounded-xl bg-orange-500 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-orange-400">
                    Teklif Al
                  </Link>
                  <Link href="/order/new" className="flex-1 rounded-xl border border-slate-700 py-2.5 text-center text-sm font-medium text-slate-300 transition hover:border-orange-400 hover:text-orange-400">
                    ⚡ Hızlı Üretim
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Trust Stats ── */}
        <section className="border-y border-slate-800 bg-slate-900/40 py-12">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {STATS.map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl font-black text-white sm:text-4xl">{s.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section id="how" className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-orange-400">Nasıl Çalışır</span>
              <h2 className="mt-4 text-4xl font-black text-white sm:text-5xl">3 adımda tamamla</h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-400">
                Karmaşık üretim süreçlerini sade ve hızlı bir deneyime dönüştürdük.
              </p>
            </div>
            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {HOW_IT_WORKS.map((item, i) => (
                <div key={i} className="group relative rounded-3xl border border-slate-800 bg-slate-900/50 p-8 transition hover:border-orange-500/40 hover:bg-slate-900">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 transition group-hover:bg-orange-500 group-hover:text-white">
                      {item.icon}
                    </div>
                    <span className="text-5xl font-black text-slate-800 transition group-hover:text-slate-700">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <p className="mt-3 text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/order/new" className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-400">
                Hemen Başla — Ücretsiz
              </Link>
            </div>
          </div>
        </section>

        {/* ── Materials ── */}
        <section className="border-y border-slate-800 bg-slate-900/30 py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-orange-400">Desteklenen Malzemeler</span>
                <h2 className="mt-2 text-3xl font-black text-white">Her malzeme, her uygulama</h2>
              </div>
              <Link href="/explore" className="text-sm font-medium text-orange-400 transition hover:text-orange-300">Tüm üreticilere bak →</Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {MATERIALS.map(m => (
                <div key={m.name} className={`flex items-center gap-3 rounded-2xl border px-5 py-4 ${m.color}`}>
                  <span className="text-lg font-black">{m.name}</span>
                  <span className="text-sm opacity-75">{m.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-orange-400">Neden TİRİDY</span>
              <h2 className="mt-4 text-4xl font-black text-white sm:text-5xl">Platformu farklı kılan özellikler</h2>
            </div>
            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f, i) => (
                <div key={i} className="group rounded-3xl border border-slate-800 bg-slate-900/50 p-7 transition hover:border-orange-500/30 hover:bg-slate-900">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400 transition group-hover:bg-orange-500 group-hover:text-white">
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white">{f.title}</h3>
                  <p className="mt-3 text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured Manufacturers ── */}
        <section className="border-y border-slate-800 bg-slate-900/30 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 flex items-end justify-between flex-wrap gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-orange-400">Öne Çıkan Üreticiler</span>
                <h2 className="mt-2 text-4xl font-black text-white">En yüksek puanlı üreticiler</h2>
                <p className="mt-3 text-slate-400">Tüm üreticiler AI doğrulamasından geçirilmiş ve puanlanmıştır.</p>
              </div>
              <Link href="/explore" className="rounded-full border border-slate-700 px-6 py-2.5 text-sm font-medium text-slate-300 transition hover:border-orange-400 hover:text-orange-400">
                Tümünü Gör →
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {MANUFACTURERS.map((m, i) => (
                <Link key={i} href={`/producers/${i + 1}`} className="group rounded-3xl border border-slate-800 bg-slate-900 p-6 transition hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-500/5">
                  <div className="mb-5 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-sm font-black text-white shadow-md shadow-orange-500/30">
                        {m.initials}
                      </div>
                      <div>
                        <p className="font-bold text-white">{m.name}</p>
                        <p className="text-xs text-slate-500">{m.location}</p>
                      </div>
                    </div>
                    <ScoreBadge score={m.score} />
                  </div>
                  <div className="mb-5 flex flex-wrap gap-1.5">
                    {m.materials.map(mat => (
                      <span key={mat} className="rounded-full border border-slate-700 px-2.5 py-0.5 text-xs text-slate-400">{mat}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{m.jobs} iş</span>
                      <span>•</span>
                      <span>⭐ {m.rating}</span>
                      <span>•</span>
                      <span>{m.delivery}</span>
                    </div>
                    <span className="text-sm font-bold text-orange-400">{m.price}&apos;dan</span>
                  </div>
                  <div className={`mt-3 inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${m.badgeCls}`}>
                    {m.badge}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-orange-400">Kullanıcı Yorumları</span>
              <h2 className="mt-4 text-4xl font-black text-white sm:text-5xl">Onlar denedi, memnun kaldı</h2>
            </div>
            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="rounded-3xl border border-slate-800 bg-slate-900/50 p-7">
                  <StarRating rating={t.rating} />
                  <p className="mt-4 text-slate-300 leading-relaxed">&quot;{t.text}&quot;</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${t.color} text-sm font-bold text-white`}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
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
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-orange-500 to-orange-600 p-12 text-center shadow-2xl shadow-orange-500/20">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-black/10 blur-2xl" />
              </div>
              <h2 className="relative text-4xl font-black text-white sm:text-5xl">3D dosyanı yükle,<br />üretimi başlat</h2>
              <p className="relative mx-auto mt-4 max-w-xl text-lg text-orange-100">
                Ücretsiz kayıt ol, STL / OBJ dosyanı yükle, saniyeler içinde AI fiyat analizi al.
              </p>
              <div className="relative mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/register" className="rounded-full bg-white px-8 py-3.5 text-base font-bold text-orange-600 shadow-lg transition hover:bg-orange-50">
                  Ücretsiz Başla
                </Link>
                <Link href="/explore" className="rounded-full border-2 border-white/40 px-8 py-3.5 text-base font-semibold text-white transition hover:border-white hover:bg-white/10">
                  Üreticileri Keşfet
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800 bg-slate-950 py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <p className="text-2xl font-black text-orange-500">TİRİDY</p>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">Türkiye&apos;nin en büyük 3D baskı pazaryeri. Müşteriler ve üreticiler için.</p>
            </div>
            {[
              { title: 'Platform', links: ['Üreticiler', 'Sipariş Ver', 'Fiyatlar', 'Nasıl Çalışır'] },
              { title: 'Üreticiler', links: ['Üretici Ol', 'Skor Sistemi', 'Ödeme', 'Destek'] },
              { title: 'Şirket', links: ['Hakkımızda', 'Blog', 'Kariyer', 'İletişim'] },
            ].map(col => (
              <div key={col.title}>
                <p className="text-sm font-bold text-white">{col.title}</p>
                <ul className="mt-4 space-y-2">
                  {col.links.map(l => (
                    <li key={l}><Link href="#" className="text-sm text-slate-500 transition hover:text-orange-400">{l}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-sm text-slate-600 md:flex-row">
            <p>© 2026 TİRİDY. Tüm hakları saklıdır.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-orange-400">Gizlilik</Link>
              <Link href="#" className="hover:text-orange-400">Şartlar</Link>
              <Link href="#" className="hover:text-orange-400">Çerezler</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
