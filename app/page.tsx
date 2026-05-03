import Link from 'next/link'
import { supabase } from './utils/supabase'

export default async function Home() {
  // Fetch featured products and requests
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .limit(6)

  const { data: requests } = await supabase
    .from('requests')
    .select('*')
    .eq('status', 'open')
    .limit(6)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">3D Print Market</h1>
            <div className="flex space-x-4">
              <Link href="/login" className="text-blue-600 hover:text-blue-800">
                Giriş Yap
              </Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Kayıt Ol
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">3D Baskı Dünyasında Bağlantı Kurun</h2>
          <p className="text-xl mb-8">Müşterilerinizle üreticileri bir araya getirin</p>
          <div className="flex justify-center space-x-4">
            <Link href="/dashboard/customer" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
              Talep Oluştur
            </Link>
            <Link href="/dashboard/producer" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
              Ürün Sat
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Öne Çıkan Ürünler</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products?.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md p-6">
                <h4 className="text-xl font-semibold mb-2">{product.name}</h4>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <p className="text-2xl font-bold text-blue-600">${product.price}</p>
                <Link href={`/product/${product.id}`} className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  İncele
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Requests */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Açık Talepler</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {requests?.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-md p-6">
                <h4 className="text-xl font-semibold mb-2">{request.title}</h4>
                <p className="text-gray-600 mb-4">{request.description}</p>
                <p className="text-lg font-semibold text-green-600">Bütçe: ${request.budget}</p>
                <Link href={`/request/${request.id}`} className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Teklif Ver
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 3D Print Market. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}
