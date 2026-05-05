import { NextRequest, NextResponse } from 'next/server'

const MATERIAL_MULTIPLIERS: Record<string, number> = {
  PLA:   1.0,
  ABS:   1.1,
  PETG:  1.15,
  Resin: 1.8,
  Nylon: 2.2,
  Metal: 5.5,
}

const COMPLEXITY_THRESHOLDS = {
  low:    5 * 1024 * 1024,   // < 5 MB
  medium: 30 * 1024 * 1024,  // < 30 MB
  high:   Infinity,
}

function estimateFromFileSize(bytes: number, material: string, quantity: number) {
  const mult = MATERIAL_MULTIPLIERS[material] ?? 1.0

  // Base price: ₺0.002 per KB * material multiplier
  const kb = bytes / 1024
  const basePrice = kb * 0.002 * mult * quantity

  // Clamp to sensible range
  const low  = Math.max(50,  Math.round(basePrice * 0.85))
  const high = Math.round(basePrice * 1.35)

  // Print time: rough estimation in hours
  const mb = bytes / (1024 * 1024)
  const printHours = Math.max(1, Math.round(mb * 0.18 * mult))

  // Complexity
  let complexity: 'Düşük' | 'Orta' | 'Yüksek' = 'Düşük'
  if (bytes >= COMPLEXITY_THRESHOLDS.medium) complexity = 'Yüksek'
  else if (bytes >= COMPLEXITY_THRESHOLDS.low) complexity = 'Orta'

  // Delivery days
  const deliveryMin = complexity === 'Düşük' ? 1 : complexity === 'Orta' ? 2 : 3
  const deliveryMax = deliveryMin + 2

  return {
    priceMin: low,
    priceMax: high,
    printHours,
    complexity,
    deliveryMin,
    deliveryMax,
    material,
    quantity,
    fastProductionAvailable: complexity !== 'Yüksek',
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { fileName, fileSize, material = 'PLA', quantity = 1 } = body

    if (!fileName || !fileSize) {
      return NextResponse.json({ error: 'fileName ve fileSize zorunludur.' }, { status: 400 })
    }

    const ext = fileName.split('.').pop()?.toLowerCase()
    if (!['stl', 'obj', '3mf', 'step'].includes(ext ?? '')) {
      return NextResponse.json({ error: 'Desteklenmeyen dosya formatı.' }, { status: 400 })
    }

    const result = estimateFromFileSize(fileSize, material, quantity)

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Fiyat hesaplanamadı.' }, { status: 500 })
  }
}
