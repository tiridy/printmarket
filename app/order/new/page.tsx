'use client'

import { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../utils/supabase'
import { Stepper, Button, Badge } from '../../components/ui'

interface PricingResult {
  priceMin: number; priceMax: number; printHours: number
  complexity: string; deliveryMin: number; deliveryMax: number
  fastProductionAvailable: boolean
}
interface FormData {
  material: string; quantity: number; deadline: string; notes: string; title: string
}

const MATERIALS = [
  { id: 'PLA',   label: 'PLA',   desc: 'Genel amaçlı',   icon: '🌿', price: '₺' },
  { id: 'ABS',   label: 'ABS',   desc: 'Yüksek dayanım', icon: '⚙️', price: '₺₺' },
  { id: 'PETG',  label: 'PETG',  desc: 'Nem dirençli',   icon: '💧', price: '₺₺' },
  { id: 'Resin', label: 'Resin', desc: 'Ultra detay',    icon: '🔬', price: '₺₺₺' },
  { id: 'Nylon', label: 'Nylon', desc: 'Esnek & hafif',  icon: '🪢', price: '₺₺₺' },
  { id: 'Metal', label: 'Metal', desc: 'Endüstriyel',    icon: '🔩', price: '₺₺₺₺₺' },
]

const STEPS = [
  { label: 'Dosya Yükle' },
  { label: 'Proje Detayları' },
  { label: 'AI Fiyat' },
  { label: 'Sipariş Modu' },
]

const inputCls = 'input'

export default function NewOrderPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step,         setStep]         = useState(0)
  const [dragging,     setDragging]     = useState(false)
  const [file,         setFile]         = useState<File | null>(null)
  const [pricing,      setPricing]      = useState<PricingResult | null>(null)
  const [loadingPrice, setLoadingPrice] = useState(false)
  const [submitting,   setSubmitting]   = useState(false)
  const [form,         setForm]         = useState<FormData>({
    material: 'PLA', quantity: 1, deadline: '', notes: '', title: '',
  })

  const acceptFile = useCallback((f: File) => {
    const ext = f.name.split('.').pop()?.toLowerCase()
    if (!['stl', 'obj', '3mf', 'step'].includes(ext ?? '')) {
      alert('Lütfen STL, OBJ, 3MF veya STEP dosyası yükleyin.')
      return
    }
    setFile(f)
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]; if (f) acceptFile(f)
  }, [acceptFile])

  const fetchPricing = async () => {
    if (!file) return
    setLoadingPrice(true)
    try {
      const res = await fetch('/api/pricing', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, fileSize: file.size, material: form.material, quantity: form.quantity }),
      })
      setPricing(await res.json())
    } catch { setPricing(null) } finally { setLoadingPrice(false) }
  }

  const handleNext = async () => {
    if (step === 1) await fetchPricing()
    setStep(s => s + 1)
  }

  const handleSubmit = async (mode: 'bidding' | 'fast') => {
    setSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const deadline = form.deadline || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)
      const { error } = await supabase.from('requests').insert({
        customer_id: user.id,
        title: form.title || file?.name.replace(/\.[^/.]+$/, '') || 'Yeni 3D Baskı Talebi',
        description: form.notes || '', category: form.material,
        budget: pricing?.priceMax ?? 0, deadline, status: 'open',
        metadata: { file_name: file?.name, file_size: file?.size, material: form.material, quantity: form.quantity, pricing, mode },
      })
      if (error) throw error
      router.push('/dashboard/customer')
    } catch { alert('Talep oluşturulamadı, lütfen tekrar deneyin.') } finally { setSubmitting(false) }
  }

  const fmtSize = (bytes: number) =>
    bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-neutral-50)' }}>
      <header className="sticky top-0 z-20 glass-light" style={{ borderBottom: '1px solid var(--color-neutral-200)' }}>
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-black" style={{ color: 'var(--color-brand-500)' }}>TİRİDY</Link>
          <span className="text-sm font-medium" style={{ color: 'var(--color-neutral-500)' }}>Yeni Sipariş</span>
          <Link href="/dashboard/customer" className="text-sm transition hover:opacity-70" style={{ color: 'var(--color-neutral-400)' }}>İptal</Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <Stepper steps={STEPS} current={step} />

        {/* ── Step 0: File Upload ── */}
        {step === 0 && (
          <div className="space-y-6 animate-in">
            <div>
              <h1 className="display-sm" style={{ color: 'var(--color-neutral-900)' }}>3D Dosyanı Yükle</h1>
              <p className="mt-1 text-sm" style={{ color: 'var(--color-neutral-500)' }}>STL, OBJ, 3MF veya STEP formatı desteklenir.</p>
            </div>

            <div
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`dropzone ${dragging ? 'dropzone-active' : ''} ${file ? 'dropzone-success' : ''}`}
            >
              <input ref={fileInputRef} type="file" accept=".stl,.obj,.3mf,.step" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) acceptFile(f) }} />

              {file ? (
                <div className="space-y-3">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: 'var(--color-success-light)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8" style={{ color: 'var(--color-success-dark)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-lg font-bold" style={{ color: 'var(--color-neutral-900)' }}>{file.name}</p>
                  <p className="text-sm" style={{ color: 'var(--color-neutral-500)' }}>{fmtSize(file.size)} • {file.name.split('.').pop()?.toUpperCase()}</p>
                  <p className="text-xs" style={{ color: 'var(--color-neutral-400)' }}>Değiştirmek için tekrar tıkla</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: dragging ? 'var(--color-brand-100)' : 'var(--color-neutral-100)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8" style={{ color: dragging ? 'var(--color-brand-500)' : 'var(--color-neutral-400)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-bold" style={{ color: 'var(--color-neutral-700)' }}>{dragging ? 'Bırak!' : 'Dosyayı buraya sürükle'}</p>
                    <p className="mt-1 text-sm" style={{ color: 'var(--color-neutral-400)' }}>ya da tıklayarak seç</p>
                  </div>
                  <div className="flex justify-center gap-2">
                    {['STL', 'OBJ', '3MF', 'STEP'].map(f => (
                      <Badge key={f} variant="neutral">{f}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {file && (
              <div className="card p-6">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-neutral-700)' }}>3D Önizleme</p>
                  <Badge variant="brand">Beta</Badge>
                </div>
                <div className="flex h-48 items-center justify-center rounded-2xl" style={{ background: 'linear-gradient(135deg, var(--color-surface-raised), var(--color-surface-base))' }}>
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl" style={{ background: 'rgba(249,115,22,.15)' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="w-10 h-10" style={{ color: 'var(--color-brand-400)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-white">{file.name}</p>
                    <p className="mt-1 text-xs" style={{ color: 'var(--color-neutral-500)' }}>3D görüntüleyici yükleniyor...</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={() => setStep(1)} disabled={!file}>Devam Et →</Button>
            </div>
          </div>
        )}

        {/* ── Step 1: Project Details ── */}
        {step === 1 && (
          <div className="space-y-6 animate-in">
            <div>
              <h1 className="display-sm" style={{ color: 'var(--color-neutral-900)' }}>Proje Detayları</h1>
              <p className="mt-1 text-sm" style={{ color: 'var(--color-neutral-500)' }}>Malzeme, adet ve süre bilgilerini girin.</p>
            </div>

            <div className="card p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'var(--color-brand-100)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5" style={{ color: 'var(--color-brand-600)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold" style={{ color: 'var(--color-neutral-900)' }}>{file?.name}</p>
                <p className="text-xs" style={{ color: 'var(--color-neutral-400)' }}>{file ? fmtSize(file.size) : ''}</p>
              </div>
              <button onClick={() => setStep(0)} className="text-xs font-medium" style={{ color: 'var(--color-brand-500)' }}>Değiştir</button>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>Proje Adı</label>
              <input type="text" value={form.title} placeholder={file?.name.replace(/\.[^/.]+$/, '') || 'Proje adı girin'}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputCls} />
            </div>

            <div>
              <p className="mb-3 text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>
                Malzeme Seçin <span style={{ color: 'var(--color-brand-500)' }}>*</span>
              </p>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {MATERIALS.map(m => (
                  <button key={m.id} type="button" onClick={() => setForm(f => ({ ...f, material: m.id }))}
                    className="relative rounded-2xl border p-4 text-left transition-all"
                    style={{
                      borderColor: form.material === m.id ? 'var(--color-brand-400)' : 'var(--color-neutral-200)',
                      background:  form.material === m.id ? 'var(--color-brand-50)' : 'var(--color-neutral-0)',
                      boxShadow:   form.material === m.id ? '0 0 0 1px rgba(249,115,22,.25)' : undefined,
                    }}>
                    {form.material === m.id && (
                      <span className="absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full" style={{ background: 'var(--color-brand-500)' }}>
                        <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                    )}
                    <span className="text-xl">{m.icon}</span>
                    <p className="mt-1.5 text-sm font-semibold" style={{ color: 'var(--color-neutral-900)' }}>{m.label}</p>
                    <p className="text-xs" style={{ color: 'var(--color-neutral-400)' }}>{m.desc}</p>
                    <p className="mt-1 text-xs font-medium" style={{ color: 'var(--color-brand-500)' }}>{m.price}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>
                  Adet <span style={{ color: 'var(--color-brand-500)' }}>*</span>
                </label>
                <input type="number" min={1} max={10000} value={form.quantity}
                  onChange={e => setForm(f => ({ ...f, quantity: Math.max(1, parseInt(e.target.value) || 1) }))}
                  className={inputCls} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>Son Tarih</label>
                <input type="date" value={form.deadline} min={new Date().toISOString().slice(0, 10)}
                  onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} className={inputCls} />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>Notlar & Özel İstekler</label>
              <textarea rows={3} value={form.notes} placeholder="Renk tercihi, yüzey kalitesi, tolerans gereksinimleri..."
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                className={`${inputCls} resize-none`} />
            </div>

            <div className="flex justify-between">
              <Button variant="secondary" onClick={() => setStep(0)}>← Geri</Button>
              <Button onClick={handleNext}>AI Fiyat Al →</Button>
            </div>
          </div>
        )}

        {/* ── Step 2: AI Pricing ── */}
        {step === 2 && (
          <div className="space-y-6 animate-in">
            <div>
              <h1 className="display-sm" style={{ color: 'var(--color-neutral-900)' }}>AI Fiyat Analizi</h1>
              <p className="mt-1 text-sm" style={{ color: 'var(--color-neutral-500)' }}>Yapay zeka dosyanızı analiz etti.</p>
            </div>

            {loadingPrice ? (
              <div className="card flex flex-col items-center justify-center gap-4 p-20">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-orange-500" />
                <p className="text-sm font-medium" style={{ color: 'var(--color-neutral-600)' }}>Dosya analiz ediliyor...</p>
                <p className="text-xs" style={{ color: 'var(--color-neutral-400)' }}>Hacim, malzeme ve baskı süresi hesaplanıyor</p>
              </div>
            ) : pricing ? (
              <div className="space-y-4">
                <div className="card-brand p-8">
                  <div className="mb-6 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'var(--color-brand-100)' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4" style={{ color: 'var(--color-brand-600)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold" style={{ color: 'var(--color-brand-700)' }}>AI Analiz Sonucu</span>
                    <Badge variant="success" dot className="ml-auto">Tamamlandı</Badge>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      { label: 'Tahmini Fiyat', main: `₺${pricing.priceMin.toLocaleString('tr-TR')}`, suffix: `– ₺${pricing.priceMax.toLocaleString('tr-TR')}`, sub: `${form.quantity} adet × ${form.material}`, subColor: 'var(--color-brand-600)' },
                      { label: 'Baskı Süresi',  main: `${pricing.printHours}`, suffix: 'saat', sub: `Karmaşıklık: ${pricing.complexity}`, subColor: 'var(--color-info)' },
                      { label: 'Teslimat',      main: `${pricing.deliveryMin}–${pricing.deliveryMax}`, suffix: 'gün', sub: pricing.fastProductionAvailable ? '⚡ Hızlı üretim mevcut' : 'Standart üretim', subColor: pricing.fastProductionAvailable ? 'var(--color-success)' : 'var(--color-neutral-400)' },
                    ].map(s => (
                      <div key={s.label} className="card p-5">
                        <p className="text-xs mb-1" style={{ color: 'var(--color-neutral-500)' }}>{s.label}</p>
                        <p className="text-2xl font-black" style={{ color: 'var(--color-neutral-900)' }}>
                          {s.main} <span className="text-base font-normal" style={{ color: 'var(--color-neutral-400)' }}>{s.suffix}</span>
                        </p>
                        <p className="mt-1 text-xs" style={{ color: s.subColor }}>{s.sub}</p>
                      </div>
                    ))}
                  </div>

                  <p className="mt-5 text-xs" style={{ color: 'var(--color-neutral-400)' }}>
                    * Bu fiyat bir tahmindir. Gerçek teklifler üreticiye göre değişebilir.
                  </p>
                </div>

                <div className="card p-5">
                  <p className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-neutral-700)' }}>Sipariş Özeti</p>
                  <div className="grid gap-1 sm:grid-cols-2 text-sm">
                    {[['Dosya', file?.name ?? ''], ['Malzeme', form.material], ['Adet', `${form.quantity} adet`], ['Son Tarih', form.deadline || 'Belirtilmedi']].map(([k, v]) => (
                      <div key={k} className="flex justify-between py-1.5" style={{ borderBottom: '1px solid var(--color-neutral-100)' }}>
                        <span style={{ color: 'var(--color-neutral-400)' }}>{k}</span>
                        <span className="font-medium truncate max-w-[180px]" style={{ color: 'var(--color-neutral-700)' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="card p-8 text-center" style={{ borderColor: 'var(--color-danger-light)' }}>
                <p className="text-sm" style={{ color: 'var(--color-danger)' }}>Fiyat analizi yüklenemedi.</p>
                <button onClick={fetchPricing} className="mt-3 text-sm underline" style={{ color: 'var(--color-brand-500)' }}>Tekrar Dene</button>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="secondary" onClick={() => setStep(1)}>← Geri</Button>
              <Button onClick={() => setStep(3)} disabled={loadingPrice || !pricing}>Sipariş Modu Seç →</Button>
            </div>
          </div>
        )}

        {/* ── Step 3: Mode Selection ── */}
        {step === 3 && (
          <div className="space-y-6 animate-in">
            <div>
              <h1 className="display-sm" style={{ color: 'var(--color-neutral-900)' }}>Sipariş Modu</h1>
              <p className="mt-1 text-sm" style={{ color: 'var(--color-neutral-500)' }}>Nasıl devam etmek istediğinizi seçin.</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Bidding */}
              <div className="card p-7 flex flex-col">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: 'var(--color-info-light)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6" style={{ color: 'var(--color-info-dark)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--color-neutral-900)' }}>Teklif Al</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed" style={{ color: 'var(--color-neutral-500)' }}>
                  Talebini yayınla, üreticilerden rekabetçi teklifler al. En uygun fiyatı karşılaştır ve seç.
                </p>
                <ul className="my-5 space-y-2">
                  {['Birden fazla teklif karşılaştır', 'Üreticilerle pazarlık yap', 'En düşük fiyatı bul'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-neutral-600)' }}>
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0" style={{ color: 'var(--color-success)' }}>
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mb-4 rounded-xl p-3 text-center" style={{ background: 'var(--color-info-light)' }}>
                  <p className="text-xs" style={{ color: 'var(--color-info-dark)' }}>Ortalama yanıt: <strong>2–4 saat</strong></p>
                </div>
                <Button variant="secondary" onClick={() => handleSubmit('bidding')} loading={submitting} className="w-full justify-center" style={{ borderColor: 'var(--color-info)', color: 'var(--color-info-dark)' }}>
                  Teklif Talebi Oluştur
                </Button>
              </div>

              {/* Fast production */}
              <div className="flex flex-col p-7 rounded-[var(--radius-2xl)]"
                style={{
                  border: `2px solid ${pricing?.fastProductionAvailable ? 'var(--color-brand-400)' : 'var(--color-neutral-200)'}`,
                  background: pricing?.fastProductionAvailable ? 'rgba(249,115,22,.04)' : 'var(--color-neutral-50)',
                  opacity: pricing?.fastProductionAvailable ? 1 : 0.6,
                }}>
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: 'var(--color-brand-100)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6" style={{ color: 'var(--color-brand-600)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  </div>
                  {pricing?.fastProductionAvailable && <Badge variant="brand">⚡ HIZLI</Badge>}
                </div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--color-neutral-900)' }}>Hızlı Üretim</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed" style={{ color: 'var(--color-neutral-500)' }}>
                  Önceden onaylı üreticilerden birini anında seç. Teklif bekleme yok, hemen üretime geç.
                </p>
                <ul className="my-5 space-y-2">
                  {['Anında sipariş ver', 'Beklemeksizin üretim başlar', `${pricing?.deliveryMin ?? 1}–${pricing?.deliveryMax ?? 3} günde teslim`].map(item => (
                    <li key={item} className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-neutral-600)' }}>
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0" style={{ color: 'var(--color-brand-500)' }}>
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mb-4 rounded-xl p-3 text-center" style={{ background: 'var(--color-brand-100)' }}>
                  <p className="text-xs" style={{ color: 'var(--color-brand-700)' }}>+%8 hızlı üretim ücreti uygulanır</p>
                </div>
                <Button onClick={() => handleSubmit('fast')} loading={submitting}
                  disabled={!pricing?.fastProductionAvailable} className="w-full justify-center">
                  ⚡ Hızlı Üretim Başlat
                </Button>
              </div>
            </div>

            <div className="flex">
              <Button variant="secondary" onClick={() => setStep(2)}>← Geri</Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
