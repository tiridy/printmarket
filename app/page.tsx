import Link from 'next/link'
import { supabase } from './utils/supabase'

export default async function Home() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .limit(6)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div>
            <Link href="/" className="text-2xl font-bold tracking-tight text-orange-400">
              TİRİDY
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-full border border-slate-700 bg-slate-900 px-5 py-2 text-sm font-semibold text-slate-100 transition hover:border-orange-400 hover:text-orange-400"
            >
              Giriş Yap
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-orange-400"
            >
              Kayıt Ol
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-orange-500/15 to-transparent" />
          <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 lg:flex-row lg:items-center lg:gap-16">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full bg-orange-500/15 px-4 py-1 text-sm font-semibold text-orange-300">
                3D Baskı için Üretici ve Müşteri Platformu
              </span>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Tasarımınızı hayata geçir, işini büyüt.
              </h1>
              <p className="mt-6 max-w-xl text-slate-300 sm:text-lg">
                TİRİDY, müşterilerin taleplerini üreticilerle eşleştiren modern bir 3D baskı pazaryeri.
                Talep oluştur, teklif al ve sipariş yönetimini tek yerden yap.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full bg-orange-500 px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-orange-400"
                >
                  Hemen Başla
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-7 py-3 text-sm font-semibold text-slate-100 transition hover:border-orange-400 hover:text-orange-400"
                >
                  Giriş Yap
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl lg:max-w-xl">
              <div className="mb-8 flex items-center justify-between rounded-3xl bg-slate-950/80 p-5">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Hemen aktif</p>
                  <p className="mt-2 text-2xl font-semibold text-white">Üretici ve talep keşfi</p>
                </div>
                <div className="rounded-2xl bg-orange-500 px-3 py-2 text-sm font-semibold text-slate-950">%100</div>
              </div>
              <div className="space-y-5">
                <div className="rounded-3xl bg-slate-950/90 p-5">
                  <p className="text-sm text-slate-500">Hızlı listeleme</p>
                  <p className="mt-3 text-lg font-semibold text-white">Ürünlerinizi birkaç adımda yayınlayın.</p>
                </div>
                <div className="rounded-3xl bg-slate-950/90 p-5">
                  <p className="text-sm text-slate-500">Kolay teklif yönetimi</p>
                  <p className="mt-3 text-lg font-semibold text-white">Müşteri taleplerine teklif verin.</p>
                </div>
                <div className="rounded-3xl bg-slate-950/90 p-5">
                  <p className="text-sm text-slate-500">Güvenli ödeme</p>
                  <p className="mt-3 text-lg font-semibold text-white">Escrow destekli ödeme akışı.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-800 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">Öne Çıkan Ürünler</p>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">En popüler 3D baskı ürünleri</h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-400">
                Doğrudan üreticilerden profesyonel ürünler keşfedin, hazır tasarımları inceleyin ve hızlıca sipariş verin.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {products?.map((product) => (
                <div key={product.id} className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-slate-950/20 transition hover:-translate-y-1 hover:border-orange-400">
                  <div className="mb-4 h-48 rounded-3xl bg-gradient-to-br from-orange-500/15 to-slate-800 p-4 text-white">
                    <div className="flex h-full items-end justify-between">
                      <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-orange-300">3D Baskı</span>
                      <span className="text-lg font-semibold">${product.price}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white">{product.name}</h3>
                  <p className="mt-3 text-slate-400 line-clamp-3">{product.description ?? 'Ürün detayları yakında eklenecek.'}</p>
                  <Link
                    href={`/product/${product.id}`}
                    className="mt-6 inline-flex items-center rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-orange-400"
                  >
                    İncele
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 lg:grid-cols-3">
              <div className="space-y-6">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">Nasıl Çalışır</p>
                <h2 className="text-4xl font-semibold text-white">Teknik baskı sürecini 3 adımda yönetin</h2>
                <p className="text-slate-400">
                  TİRİDY ile talep oluşturun, üreticilerle eşleşin ve siparişinizi güvenli ödeme altyapısıyla tamamlayın.
                {[
                  {
                    title: '1. Talebini Oluştur',
                    description: 'Müşteri olarak projenin detaylarını kaydedin ve bütçe ile teslim süresini belirleyin.',
                  },
                  {
                    title: '2. Teklif Alın',
                    description: 'Üreticiler taleplerinize teklif sunar, seçenekleri karşılaştırın.',
                  },
                  {
                    title: '3. Siparişini Güvende Tut',
                    description: 'Siparişinizi onaylayın, ödeme escrow ile saklansın ve teslimatı takip edin.',
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-slate-950/10">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-slate-950">
                      <span className="font-semibold">{item.title.split('.')[0]}</span>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 text-slate-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 bg-slate-950/95 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© 2026 TİRİDY. 3D baskı üreticileri ve müşterileri için özel platform.</p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <Link href="#" className="hover:text-orange-400">Hizmet Şartları</Link>
            <Link href="#" className="hover:text-orange-400">Gizlilik Politikası</Link>
            <Link href="#" className="hover:text-orange-400">Destek</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
