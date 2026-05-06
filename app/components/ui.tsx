/**
 * TİRİDY Design System — Shared UI Components
 * All components use the CSS classes defined in globals.css
 */
import { type ReactNode, type ButtonHTMLAttributes, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'

/* ─── Button ─────────────────────────────────────────────────── */
type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'primary-dark' | 'outline-dark'
type BtnSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant
  size?: BtnSize
  loading?: boolean
  as?: 'button' | 'a'
  href?: string
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const sizeClass = size === 'md' ? '' : `btn-${size}`
  const cls = `btn btn-${variant} ${sizeClass} ${className}`.trim()

  return (
    <button className={cls} disabled={disabled || loading} {...props}>
      {loading && (
        <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </button>
  )
}

/* ─── Card ───────────────────────────────────────────────────── */
interface CardProps {
  variant?: 'default' | 'dark' | 'brand' | 'hover' | 'dark-hover'
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ variant = 'default', children, className = '', onClick }: CardProps) {
  const variantClass = {
    default:    'card',
    dark:       'card-dark',
    brand:      'card-brand',
    hover:      'card card-hover',
    'dark-hover': 'card-dark card-dark-hover',
  }[variant]

  return (
    <div className={`${variantClass} ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}

/* ─── Input ──────────────────────────────────────────────────── */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  required?: boolean
  icon?: ReactNode
}

export function Input({ label, hint, error, required, icon, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>
          {label}
          {required && <span className="text-xs" style={{ color: 'var(--color-brand-500)' }}>*</span>}
        </label>
      )}
      <div className={icon ? 'input-icon-wrapper' : undefined}>
        {icon && <span className="input-icon w-4 h-4">{icon}</span>}
        <input
          className={`input ${error ? 'input-error' : ''} ${className}`}
          {...props}
        />
      </div>
      {hint  && !error && <p className="text-xs" style={{ color: 'var(--color-neutral-400)' }}>{hint}</p>}
      {error && <p className="text-xs" style={{ color: 'var(--color-danger)' }}>{error}</p>}
    </div>
  )
}

/* ─── Textarea ───────────────────────────────────────────────── */
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
  required?: boolean
}

export function Textarea({ label, hint, error, required, className = '', ...props }: TextareaProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>
          {label}
          {required && <span className="text-xs" style={{ color: 'var(--color-brand-500)' }}>*</span>}
        </label>
      )}
      <textarea
        className={`input textarea ${error ? 'input-error' : ''} ${className}`}
        {...props}
      />
      {hint  && !error && <p className="text-xs" style={{ color: 'var(--color-neutral-400)' }}>{hint}</p>}
      {error && <p className="text-xs" style={{ color: 'var(--color-danger)' }}>{error}</p>}
    </div>
  )
}

/* ─── Badge ──────────────────────────────────────────────────── */
type BadgeVariant = 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'

export function Badge({ variant = 'neutral', dot = false, children, className = '' }: {
  variant?: BadgeVariant; dot?: boolean; children: ReactNode; className?: string
}) {
  return (
    <span className={`badge badge-${variant} ${dot ? 'badge-dot' : ''} ${className}`}>
      {children}
    </span>
  )
}

/* ─── Score Ring ─────────────────────────────────────────────── */
type ScoreTier = 'gold' | 'silver' | 'bronze'
type RingSize  = 'default' | 'lg' | 'xl'

function getScoreTier(score: number): ScoreTier {
  if (score >= 95) return 'gold'
  if (score >= 90) return 'silver'
  return 'bronze'
}

export function ScoreRing({ score, size = 'default', className = '' }: {
  score: number; size?: RingSize; className?: string
}) {
  const tier     = getScoreTier(score)
  const sizeClass = size === 'default' ? '' : `score-ring-${size}`
  return (
    <div className={`score-ring score-ring-${tier} ${sizeClass} ${className}`}>
      {score}
    </div>
  )
}

/* ─── Score Badge (pill) ─────────────────────────────────────── */
export function ScoreBadge({ score, className = '' }: { score: number; className?: string }) {
  const tier = getScoreTier(score)
  return (
    <span className={`score-badge score-badge-${tier} ${className}`}>
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
      {score}
    </span>
  )
}

/* ─── Progress Bar ───────────────────────────────────────────── */
type ProgressVariant = 'brand' | 'success' | 'info'

export function ProgressBar({ value, max = 100, variant = 'brand', size = 'md', label, className = '' }: {
  value: number; max?: number; variant?: ProgressVariant; size?: 'sm' | 'md' | 'lg'; label?: string; className?: string
}) {
  const pct        = Math.min(100, Math.round((value / max) * 100))
  const barVariant = variant === 'brand' ? '' : `progress-bar-${variant}`
  const sizeClass  = size === 'md' ? '' : `progress-${size}`

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex justify-between text-xs font-medium" style={{ color: 'var(--color-neutral-600)' }}>
          <span>{label}</span>
          <span style={{ color: 'var(--color-neutral-900)' }}>{pct}</span>
        </div>
      )}
      <div className={`progress ${sizeClass}`}>
        <div className={`progress-bar ${barVariant}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

/* ─── Stepper ────────────────────────────────────────────────── */
interface StepItem { label: string }

export function Stepper({ steps, current }: { steps: StepItem[]; current: number }) {
  return (
    <div className="flex items-start mb-8">
      {steps.map((step, i) => {
        const done    = i < current
        const active  = i === current
        const circleClass = done ? 'step-circle-done' : active ? 'step-circle-active' : 'step-circle-pending'
        const labelClass  = done ? 'step-label-done'  : active ? 'step-label-active'  : 'step-label-pending'

        return (
          <div key={i} className="flex items-start flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`step-circle ${circleClass}`}>
                {done ? (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : <span>{i + 1}</span>}
              </div>
              <span className={`step-label ${labelClass} hidden sm:block`}>{step.label}</span>
            </div>

            {i < steps.length - 1 && (
              <div className={`step-connector mt-4 mx-2 ${done ? 'step-connector-done' : 'step-connector-pending'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─── Empty State ────────────────────────────────────────────── */
export function EmptyState({ icon, title, desc, action, onAction }: {
  icon: string; title: string; desc: string; action?: string; onAction?: () => void
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <p className="empty-state-title">{title}</p>
      <p className="empty-state-desc">{desc}</p>
      {action && (
        <button onClick={onAction} className="btn btn-primary btn-sm mt-5">
          {action}
        </button>
      )}
    </div>
  )
}

/* ─── Status Badge (order statuses) ─────────────────────────── */
const ORDER_STATUS_MAP: Record<string, { label: string; variant: BadgeVariant }> = {
  open:        { label: 'Açık',          variant: 'success' },
  closed:      { label: 'Kapalı',        variant: 'neutral' },
  completed:   { label: 'Tamamlandı',    variant: 'info' },
  pending:     { label: 'Bekliyor',      variant: 'warning' },
  confirmed:   { label: 'Onaylandı',     variant: 'info' },
  in_progress: { label: 'Üretimde',      variant: 'brand' },
  shipped:     { label: 'Kargoda',       variant: 'info' },
  delivered:   { label: 'Teslim Edildi', variant: 'success' },
  cancelled:   { label: 'İptal Edildi',  variant: 'danger' },
  accepted:    { label: 'Kabul Edildi',  variant: 'success' },
  rejected:    { label: 'Reddedildi',    variant: 'danger' },
}

export function StatusBadge({ status, dot = false }: { status: string; dot?: boolean }) {
  const cfg = ORDER_STATUS_MAP[status] ?? { label: status, variant: 'neutral' as BadgeVariant }
  return <Badge variant={cfg.variant} dot={dot}>{cfg.label}</Badge>
}

/* ─── Avatar ─────────────────────────────────────────────────── */
export function Avatar({ initials, size = 'md', className = '' }: {
  initials: string; size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string
}) {
  return (
    <div className={`avatar avatar-${size} ${className}`}>
      {initials}
    </div>
  )
}

/* ─── Star Rating ────────────────────────────────────────────── */
export function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const sz = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5'
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} viewBox="0 0 20 20" fill={i <= Math.round(rating) ? 'var(--color-brand-500)' : 'var(--color-neutral-200)'} className={sz}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  )
}

/* ─── Section Header ─────────────────────────────────────────── */
export function SectionHeader({ label, title, desc, dark = false }: {
  label: string; title: string; desc?: string; dark?: boolean
}) {
  return (
    <div className="text-center">
      <p className="section-label">{label}</p>
      <h2 className={`mt-4 display-md ${dark ? 'text-white' : ''}`}>{title}</h2>
      {desc && <p className={`mx-auto mt-4 max-w-xl text-base ${dark ? 'text-slate-400' : 'text-neutral-500'}`}>{desc}</p>}
    </div>
  )
}

/* ─── Spinner ────────────────────────────────────────────────── */
export function Spinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sz = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' }[size]
  return (
    <div className={`${sz} animate-spin rounded-full border-2 border-neutral-200 border-t-orange-500 ${className}`} />
  )
}

/* ─── Loading Page ───────────────────────────────────────────── */
export function LoadingPage({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`flex min-h-screen items-center justify-center ${dark ? 'bg-slate-950' : 'bg-neutral-50'}`}>
      <Spinner size="lg" />
    </div>
  )
}

/* ─── Field Wrapper ──────────────────────────────────────────── */
export function Field({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--color-neutral-700)' }}>
        {label}
        {required && <span className="text-xs" style={{ color: 'var(--color-brand-500)' }}>*</span>}
      </label>
      {children}
      {hint && <p className="text-xs" style={{ color: 'var(--color-neutral-400)' }}>{hint}</p>}
    </div>
  )
}

/* ─── Section Card (for profile forms) ──────────────────────── */
export function SectionCard({ title, icon, children }: {
  title: string; icon: string; children: ReactNode
}) {
  return (
    <section className="card overflow-hidden">
      <div className="flex items-center gap-2.5 border-b px-6 py-4" style={{ borderColor: 'var(--color-neutral-100)', backgroundColor: 'var(--color-neutral-50)' }}>
        <span>{icon}</span>
        <h2 className="text-sm font-semibold tracking-wide" style={{ color: 'var(--color-neutral-700)' }}>{title}</h2>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </section>
  )
}
