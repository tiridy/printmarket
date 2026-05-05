'use client'

import { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../utils/supabase'

/* ─── Types ─────────────────────────────────────────────────── */
interface PricingResult {
  priceMin: number
  priceMax: number
  printHours: number
  complexity: string
  deliveryMin: number
  deliveryMax: number
  fastProductionAvailable: boolean
}

interface FormData {
  material: string
  quantity: number
  deadline: string
  notes: string
  title: string
}

const MATERIALS = [
  { id: 'PLA',   label: 'PLA',   desc: 'Genel amaçlı',     icon: '🌿', price: '₺' },
  { id: 'ABS',   label: 'ABS',   desc: 'Yüksek dayanım',   icon: '⚙️', price: '₺₺' },
  { id: 'PETG',  label: 'PETG',  desc: 'Nem dirençli',     icon: '💧', price: '₺₺' },
  { id: 'Resin', label: 'Resin', desc: 'Ultra detay',      icon: '🔬', price: '₺₺₺' },
  { id: 'Nylon', label: 'Nylon', desc: 'Esnek & hafif',    icon: '🪢', price: '₺₺₺' },
  { id: 'Metal', label: 'Metal', desc: 'Endüstriyel',      icon: '🔩', price: '₺₺₺₺₺' },
]

const STEPS = ['Dosya Yükle', 'Proje Detayları', 'AI Fiyat Analizi', 'Sipariş Modu']

/* ─── Step Indicator ─────────────────────────────────────────── */
function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
              i < current  ? 'bg-orange-500 text-white' :
              i === current ? 'bg-orange-500 text-white ring-4 ring-orange-500/20' :
                              'bg-gray-100 text-gray-400'
            }`}>
              {i < current ? (
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : i + 1}
            </div>
            <span className={`mt-1.5 hidden text-[10px] font-medium sm:block ${i === current ? 'text-orange-600' : 'text-gray-400'}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-0.5 flex-1 mx-2 rounded ${i < current ? 'bg-orange-500' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function NewOrderPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [pricing, setPricing] = useState<PricingResult | null>(null)
  const [loadingPrice, setLoadingPrice] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<FormData>({
    material: 'PLA', quantity: 1, deadline: '', notes: '', title: '',
  })

  /* ── File handling ── */
  const acceptFile = useCallback((f: File) => {
    const ext = f.name.split('.').pop()?.toLowerCase()
    if (!['stl', 'obj', '3mf', 'step'].includes(ext ?? '')) {
      alert('Lütfen STL, OBJ, 3MF veya STEP dosyası yükleyin.')
      return
    }
    setFile(f)
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) acceptFile(f)
  }, [acceptFile])

  /* ── AI Pricing ── */
  const fetchPricing = async () => {
    if (!file) return
    setLoadingPrice(true)
    try {
      const res = await fetch('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          material: form.material,
          quantity: form.quantity,
        }),
      })
      const data = await res.json()
      setPricing(data)
    } catch {
      setPricing(null)
    } finally {
      setLoadingPrice(false)
    }
  }

  const handleNext = async () => {
    if (step === 1) await fetchPricing()
    setStep(s => s + 1)
  }

  /* ── Submit order (create request in Supabase) ── */
  const handleSubmit = async (mode: 'bidding' | 'fast') => {
    setSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const deadline = form.deadline || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)

      const { error } = await supabase.from('requests').insert({
        customer_id: user.id,
        title: form.title || file?.name.replace(/\.[^/.]+$/, '') || 'Yeni 3D Baskı Talebi',
        description: form.notes || '',
        category: form.material,
        budget: pricing?.priceMax ?? 0,
        deadline,
        status: 'open',
        metadata: {
          file_name: file?.name,
          file_size: file?.size,
          material: form.material,
          quantity: form.quantity,
          pricing,
          mode,
        },
      })

      if (error) throw error
      router.push('/dashboard/customer')
    } catch (err) {
      console.error(err)
      alert('Talep oluşturulamadı, lütfen tekrar deneyin.')
    } finally {
      setSubmitting(false)
    }
  }

  const fmtSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-black text-orange-500">TİRİDY</Link>
          <span className="text-sm font-medium text-gray-500">Yeni Sipariş</span>
          <Link href="/dashboard/customer" className="text-sm text-gray-400 hover:text-gray-600">İptal</Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <StepBar current={step} />

        {/* ── Step 0: File Upload ── */}
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900">3D Dosyanı Yükle</h1>
              <p className="mt-1 text-gray-500">STL, OBJ, 3MF veya STEP formatı desteklenir.</p>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer rounded-3xl border-2 border-dashed p-16 text-center transition-all ${
                dragging
                  ? 'border-orange-400 bg-orange-50 scale-[1.01]'
                  : file
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".stl,.obj,.3mf,.step"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) acceptFile(f) }}
              />

              {file ? (
                <div className="space-y-3">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-green-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">{fmtSize(file.size)} • {file.name.split('.').pop()?.toUpperCase()}</p>
                  <p className="text-xs text-gray-400">Değiştirmek için tekrar tıkla</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl transition-colors ${dragging ? 'bg-orange-100' : 'bg-gray-100'}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={`w-8 h-8 ${dragging ? 'text-orange-500' : 'text-gray-400'}`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-700">{dragging ? 'Bırak!' : 'Dosyayı buraya sürükle'}</p>
                    <p className="mt-1 text-sm text-gray-400">ya da tıklayarak seç</p>
                  </div>
                  <div className="flex justify-center gap-2">
                    {['STL', 'OBJ', '3MF', 'STEP'].map(f => (
                      <span key={f} className="rounded-full border border-gray-200 px-3 py-0.5 text-xs text-gray-500">{f}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3D Preview placeholder */}
            {file && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700">3D Önizleme</p>
                  <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-600">Beta</span>
                </div>
                <div className="flex h-48 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800">
                  <div className="text-center">
                    <div className="mx-auto mb-3 h-16 w-16 rounded-xl bg-orange-500/20 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="w-10 h-10 text-orange-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-slate-300">{file.name}</p>
                    <p className="mt-1 text-xs text-slate-500">3D görüntüleyici yükleniyor...</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setStep(1)}
                disabled={!file}
                className="rounded-xl bg-orange-500 px-8 py-3 text-sm font-semibold text-white shadow-sm shadow-orange-200 transition hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Devam Et →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 1: Project Details ── */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Proje Detayları</h1>
              <p className="mt-1 text-gray-500">Malzeme, adet ve süre bilgilerini girin.</p>
            </div>

            {/* File summary */}
            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 text-orange-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">{file?.name}</p>
                <p className="text-xs text-gray-400">{file ? fmtSize(file.size) : ''}</p>
              </div>
              <button onClick={() => setStep(0)} className="text-xs text-orange-500 hover:underline">Değiştir</button>
            </div>

            {/* Title */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Proje Adı</label>
              <input
                type="text"
                value={form.title}
                placeholder={file?.name.replace(/\.[^/.]+$/, '') || 'Proje adı girin'}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            {/* Material */}
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700">Malzeme Seçin <span className="text-orange-500">*</span></label>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {MATERIALS.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, material: m.id }))}
                    className={`relative rounded-2xl border p-4 text-left transition-all ${
                      form.material === m.id
                        ? 'border-orange-400 bg-orange-50 ring-1 ring-orange-300/50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    {form.material === m.id && (
                      <span className="absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500">
                        <svg viewBox="0 0 12 12" fill="white" className="w-2.5 h-2.5">
                          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    )}
                    <span className="text-xl">{m.icon}</span>
                    <p className="mt-1.5 text-sm font-semibold text-gray-900">{m.label}</p>
                    <p className="text-xs text-gray-400">{m.desc}</p>
                    <p className="mt-1 text-xs font-medium text-orange-500">{m.price}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Deadline */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Adet <span className="text-orange-500">*</span></label>
                <input
                  type="number" min={1} max={10000}
                  value={form.quantity}
                  onChange={e => setForm(f => ({ ...f, quantity: Math.max(1, parseInt(e.target.value) || 1) }))}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Son Tarih</label>
                <input
                  type="date"
                  value={form.deadline}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Notlar & Özel İstekler</label>
              <textarea
                rows={3}
                value={form.notes}
                placeholder="Renk tercihi, yüzey kalitesi, tolerans gereksinimleri..."
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(0)} className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
                ← Geri
              </button>
              <button
                onClick={handleNext}
                className="rounded-xl bg-orange-500 px-8 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-200 transition hover:bg-orange-400"
              >
                AI Fiyat Al →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: AI Pricing ── */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900">AI Fiyat Analizi</h1>
              <p className="mt-1 text-gray-500">Yapay zeka dosyanızı analiz etti.</p>
            </div>

            {loadingPrice ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white p-20 gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-orange-500" />
                <p className="text-sm font-medium text-gray-600">Dosya analiz ediliyor...</p>
                <p className="text-xs text-gray-400">Hacim, malzeme ve baskı süresi hesaplanıyor</p>
              </div>
            ) : pricing ? (
              <div className="space-y-4">
                {/* Price card */}
                <div className="rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-8">
                  <div className="mb-6 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 text-orange-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-orange-700">AI Analiz Sonucu</span>
                    <span className="ml-auto flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      Tamamlandı
                    </span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white border border-orange-100 p-5 shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">Tahmini Fiyat</p>
                      <p className="text-3xl font-black text-gray-900">
                        ₺{pricing.priceMin.toLocaleString('tr-TR')}
                        <span className="text-base font-normal text-gray-400"> – ₺{pricing.priceMax.toLocaleString('tr-TR')}</span>
                      </p>
                      <p className="mt-1 text-xs text-orange-600">{form.quantity} adet × {form.material}</p>
                    </div>
                    <div className="rounded-2xl bg-white border border-orange-100 p-5 shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">Baskı Süresi</p>
                      <p className="text-3xl font-black text-gray-900">
                        {pricing.printHours}
                        <span className="text-base font-normal text-gray-400"> saat</span>
                      </p>
                      <p className="mt-1 text-xs text-blue-600">Karmaşıklık: {pricing.complexity}</p>
                    </div>
                    <div className="rounded-2xl bg-white border border-orange-100 p-5 shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">Teslimat Süresi</p>
                      <p className="text-3xl font-black text-gray-900">
                        {pricing.deliveryMin}–{pricing.deliveryMax}
                        <span className="text-base font-normal text-gray-400"> gün</span>
                      </p>
                      <p className={`mt-1 text-xs ${pricing.fastProductionAvailable ? 'text-green-600' : 'text-gray-400'}`}>
                        {pricing.fastProductionAvailable ? '⚡ Hızlı üretim mevcut' : 'Standart üretim'}
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 text-xs text-gray-400">
                    * Bu fiyat bir tahmindir. Gerçek teklifler üreticiye göre değişebilir.
                  </p>
                </div>

                {/* Summary */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                  <p className="mb-3 text-sm font-semibold text-gray-700">Sipariş Özeti</p>
                  <div className="grid gap-2 text-sm sm:grid-cols-2">
                    {[
                      ['Dosya', file?.name ?? ''],
                      ['Malzeme', form.material],
                      ['Adet', `${form.quantity} adet`],
                      ['Son Tarih', form.deadline || 'Belirtilmedi'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between py-1 border-b border-gray-50">
                        <span className="text-gray-400">{k}</span>
                        <span className="font-medium text-gray-700 truncate max-w-[180px]">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
                <p className="text-sm text-red-600">Fiyat analizi yüklenemedi.</p>
                <button onClick={fetchPricing} className="mt-3 text-sm text-orange-500 underline">Tekrar Dene</button>
              </div>
            )}

            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
                ← Geri
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={loadingPrice || !pricing}
                className="rounded-xl bg-orange-500 px-8 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-200 transition hover:bg-orange-400 disabled:opacity-40"
              >
                Sipariş Modu Seç →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Mode Selection ── */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Sipariş Modu</h1>
              <p className="mt-1 text-gray-500">Nasıl devam etmek istediğinizi seçin.</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Bidding mode */}
              <div className="rounded-3xl border border-gray-200 bg-white p-7 flex flex-col">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6 text-blue-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Teklif Al</h3>
                <p className="mt-2 flex-1 text-sm text-gray-500 leading-relaxed">
                  Talebini yayınla, üreticilerden rekabetçi teklifler al. En uygun fiyatı karşılaştır ve seç.
                </p>
                <ul className="my-5 space-y-2">
                  {['Birden fazla teklif karşılaştır', 'Üreticilerle pazarlık yap', 'En düşük fiyatı bul'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-xs text-gray-600">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green-500 shrink-0">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mb-4 rounded-xl bg-blue-50 px-4 py-2 text-center">
                  <p className="text-xs text-blue-600">Ortalama yanıt süresi: <strong>2–4 saat</strong></p>
                </div>
                <button
                  onClick={() => handleSubmit('bidding')}
                  disabled={submitting}
                  className="w-full rounded-xl border-2 border-blue-500 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 disabled:opacity-50"
                >
                  {submitting ? 'Kaydediliyor...' : 'Teklif Talebi Oluştur'}
                </button>
              </div>

              {/* Fast production */}
              <div className={`rounded-3xl border-2 p-7 flex flex-col ${pricing?.fastProductionAvailable ? 'border-orange-400 bg-orange-50/40' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6 text-orange-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  </div>
                  {pricing?.fastProductionAvailable && (
                    <span className="rounded-full bg-orange-500 px-2.5 py-0.5 text-xs font-bold text-white">⚡ HIZLI</span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900">Hızlı Üretim</h3>
                <p className="mt-2 flex-1 text-sm text-gray-500 leading-relaxed">
                  Önceden onaylı üreticilerden birini anında seç. Teklif bekleme yok, hemen üretime geç.
                </p>
                <ul className="my-5 space-y-2">
                  {['Anında sipariş ver', 'Beklemeksizin üretim başlar', `${pricing?.deliveryMin ?? 1}–${pricing?.deliveryMax ?? 3} günde teslim`].map(item => (
                    <li key={item} className="flex items-center gap-2 text-xs text-gray-600">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-orange-500 shrink-0">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mb-4 rounded-xl bg-orange-100 px-4 py-2 text-center">
                  <p className="text-xs text-orange-700">+%8 hızlı üretim ücreti uygulanır</p>
                </div>
                <button
                  onClick={() => handleSubmit('fast')}
                  disabled={submitting || !pricing?.fastProductionAvailable}
                  className="w-full rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white shadow-sm shadow-orange-200 transition hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Kaydediliyor...' : '⚡ Hızlı Üretim Başlat'}
                </button>
                {!pricing?.fastProductionAvailable && (
                  <p className="mt-2 text-center text-xs text-gray-400">Karmaşık dosyalar için mevcut değil</p>
                )}
              </div>
            </div>

            <div className="flex justify-start">
              <button onClick={() => setStep(2)} className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
                ← Geri
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
