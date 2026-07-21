import { type ReactNode, type CSSProperties } from 'react'

// ─── Phone shell ──────────────────────────────────────────────────────────────

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div style={{
      width: 375, backgroundColor: '#1a1a1a', borderRadius: 44,
      padding: '10px 4px', boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 0 0 1px #444',
      position: 'relative', flexShrink: 0,
    }}>
      {/* Dynamic island */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
        <div style={{ width: 120, height: 30, backgroundColor: '#111', borderRadius: 20 }} />
      </div>
      {/* Screen area */}
      <div style={{
        backgroundColor: '#fff', borderRadius: 34, overflow: 'hidden',
        height: 750, display: 'flex', flexDirection: 'column',
      }}>
        <StatusBar />
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {children}
        </div>
      </div>
      {/* Home indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
        <div style={{ width: 100, height: 4, backgroundColor: '#444', borderRadius: 2 }} />
      </div>
    </div>
  )
}

export function StatusBar() {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 20px 4px', backgroundColor: '#f5f5f5',
      fontSize: 11, fontWeight: 600, color: '#333', fontFamily: 'system-ui',
    }}>
      <span>9:41</span>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <span style={{ fontSize: 9 }}>▪▪▪▪</span>
        <span style={{ fontSize: 9 }}>WiFi</span>
        <span style={{ fontSize: 9 }}>🔋</span>
      </div>
    </div>
  )
}

// ─── Navigation bar ───────────────────────────────────────────────────────────

export function NavBar({
  title, onBack, right,
}: { title: string; onBack?: () => void; right?: ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', padding: '10px 16px',
      backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd', minHeight: 44,
    }}>
      {onBack ? (
        <button onClick={onBack} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: '0 8px 0 0',
          fontSize: 15, color: '#555', fontFamily: 'monospace', flexShrink: 0,
        }}>
          ←
        </button>
      ) : (
        <div style={{ width: 24 }} />
      )}
      <div style={{ flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 600, color: '#222' }}>
        {title}
      </div>
      <div style={{ minWidth: 24 }}>{right}</div>
    </div>
  )
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

export function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ padding: '8px 16px 4px', backgroundColor: '#f5f5f5' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: '#888', fontFamily: 'monospace' }}>
          Pergunta {current} de {total}
        </span>
        <span style={{ fontSize: 10, color: '#888', fontFamily: 'monospace' }}>
          {Math.round((current / total) * 100)}%
        </span>
      </div>
      <div style={{ height: 4, backgroundColor: '#ddd', borderRadius: 2 }}>
        <div style={{
          height: 4, width: `${(current / total) * 100}%`,
          backgroundColor: '#555', borderRadius: 2, transition: 'width 0.3s',
        }} />
      </div>
    </div>
  )
}

// ─── Buttons ──────────────────────────────────────────────────────────────────

type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

export function Btn({
  label, onClick, variant = 'primary', full = true, small = false,
}: {
  label: string
  onClick?: () => void
  variant?: BtnVariant
  full?: boolean
  small?: boolean
}) {
  const styles: Record<BtnVariant, CSSProperties> = {
    primary: { backgroundColor: '#333', color: '#fff', border: '1.5px solid #333' },
    secondary: { backgroundColor: '#fff', color: '#333', border: '1.5px solid #999' },
    ghost: { backgroundColor: 'transparent', color: '#555', border: '1.5px solid #ccc' },
    danger: { backgroundColor: '#991b1b', color: '#fff', border: '1.5px solid #991b1b' },
  }
  return (
    <button
      onClick={onClick}
      style={{
        ...styles[variant],
        width: full ? '100%' : undefined,
        padding: small ? '7px 12px' : '12px 16px',
        fontSize: small ? 12 : 14,
        fontWeight: 600,
        borderRadius: 6,
        cursor: 'pointer',
        fontFamily: 'system-ui',
        textAlign: 'center',
        display: 'block',
        letterSpacing: '-0.01em',
      }}
    >
      {label}
    </button>
  )
}

// ─── Form elements ────────────────────────────────────────────────────────────

export function Field({ label, placeholder = '____________', hint }: {
  label: string; placeholder?: string; hint?: string
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#555', marginBottom: 4, fontFamily: 'monospace' }}>
        {label}
      </div>
      <div style={{
        padding: '9px 10px', border: '1.5px solid #bbb', borderRadius: 4,
        backgroundColor: '#fafafa', fontSize: 13, color: '#aaa',
      }}>
        {placeholder}
      </div>
      {hint && <div style={{ fontSize: 10, color: '#aaa', marginTop: 3, fontFamily: 'monospace' }}>{hint}</div>}
    </div>
  )
}

export function OptionItem({
  label, selected, onClick, color,
}: { label: string; selected?: boolean; onClick?: () => void; color?: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10, width: '100%',
        padding: '10px 12px', marginBottom: 6, border: '1.5px solid',
        borderColor: selected ? '#444' : '#ccc', borderRadius: 6,
        backgroundColor: selected ? '#f0f0f0' : '#fff',
        cursor: 'pointer', textAlign: 'left',
      }}
    >
      <div style={{
        width: 16, height: 16, borderRadius: '50%', border: '2px solid',
        borderColor: selected ? '#333' : '#ccc', flexShrink: 0,
        backgroundColor: color && selected ? color : selected ? '#333' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {selected && !color && <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#fff' }} />}
      </div>
      <span style={{ fontSize: 13, color: '#222' }}>{label}</span>
    </button>
  )
}

export function CheckboxItem({ label, checked, note }: { label: string; checked?: boolean; note?: string }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
      <div style={{
        width: 16, height: 16, border: '2px solid #999', borderRadius: 3, flexShrink: 0, marginTop: 1,
        backgroundColor: checked ? '#444' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {checked && <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>✓</span>}
      </div>
      <div>
        <div style={{ fontSize: 13, color: '#222', lineHeight: 1.4 }}>{label}</div>
        {note && <div style={{ fontSize: 10, color: '#888', fontFamily: 'monospace', marginTop: 2 }}>{note}</div>}
      </div>
    </div>
  )
}

// ─── Risk classification ───────────────────────────────────────────────────────

export type RiskLevel = 'red' | 'orange' | 'yellow' | 'green' | 'blue'

const RISK_CONFIG: Record<RiskLevel, { bg: string; text: string; label: string; subtitle: string }> = {
  red: { bg: '#dc2626', text: '#fff', label: 'EMERGÊNCIA', subtitle: 'Risco imediato de vida' },
  orange: { bg: '#ea580c', text: '#fff', label: 'UPA', subtitle: 'Atendimento urgente' },
  yellow: { bg: '#ca8a04', text: '#fff', label: 'PRIORITÁRIO', subtitle: 'Atendimento em até 2h' },
  green: { bg: '#16a34a', text: '#fff', label: 'UBS', subtitle: 'Atendimento sem urgência' },
  blue: { bg: '#2563eb', text: '#fff', label: 'ORIENTAÇÃO', subtitle: 'Cuidados em casa' },
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  const c = RISK_CONFIG[level]
  return (
    <div style={{
      backgroundColor: c.bg, borderRadius: 12, padding: '20px 16px', textAlign: 'center', margin: '12px 0',
    }}>
      <div style={{ fontSize: 11, color: c.text, opacity: 0.8, fontFamily: 'monospace', letterSpacing: '0.1em' }}>
        CLASSIFICAÇÃO DE RISCO
      </div>
      <div style={{ fontSize: 32, fontWeight: 900, color: c.text, letterSpacing: '-0.02em', margin: '4px 0' }}>
        {c.label}
      </div>
      <div style={{ fontSize: 12, color: c.text, opacity: 0.85 }}>{c.subtitle}</div>
    </div>
  )
}

export type OccupancyLevel = 'low' | 'medium' | 'high'

const OCC_CONFIG: Record<OccupancyLevel, { color: string; label: string }> = {
  low: { color: '#16a34a', label: 'Baixa' },
  medium: { color: '#ca8a04', label: 'Média' },
  high: { color: '#dc2626', label: 'Alta' },
}

export function OccupancyTag({ level }: { level: OccupancyLevel }) {
  const c = OCC_CONFIG[level]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600,
      color: c.color, border: `1.5px solid ${c.color}`, borderRadius: 4, padding: '1px 6px',
      fontFamily: 'monospace',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: c.color, flexShrink: 0, display: 'inline-block' }} />
      Lotação {c.label}
    </span>
  )
}

export function WaitTime({ minutes }: { minutes: number }) {
  return (
    <span style={{
      fontSize: 11, fontFamily: 'monospace', color: '#555',
      border: '1px solid #ddd', borderRadius: 4, padding: '1px 6px',
    }}>
      ⏱ ~{minutes} min
    </span>
  )
}

// ─── Map placeholder ──────────────────────────────────────────────────────────

export function MapBox({ onTap }: { onTap?: () => void }) {
  return (
    <div
      onClick={onTap}
      style={{
        height: 240, backgroundColor: '#e8e8e8', border: '1.5px dashed #aaa',
        borderRadius: 8, position: 'relative', overflow: 'hidden', cursor: onTap ? 'pointer' : undefined,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* Grid lines to suggest a map */}
      {[...Array(6)].map((_, i) => (
        <div key={`h${i}`} style={{ position: 'absolute', left: 0, right: 0, top: `${i * 20}%`, height: 1, backgroundColor: '#ccc' }} />
      ))}
      {[...Array(6)].map((_, i) => (
        <div key={`v${i}`} style={{ position: 'absolute', top: 0, bottom: 0, left: `${i * 20}%`, width: 1, backgroundColor: '#ccc' }} />
      ))}
      {/* Markers */}
      <MapMarker x={30} y={40} color="#16a34a" label="UBS" />
      <MapMarker x={55} y={55} color="#dc2626" label="UPA" />
      <MapMarker x={70} y={35} color="#ca8a04" label="UBS" />
      <MapMarker x={45} y={65} color="#2563eb" label="HOS" />
      {/* User location */}
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
        <div style={{
          width: 16, height: 16, backgroundColor: '#333', borderRadius: '50%',
          border: '3px solid #fff', boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
        }} />
      </div>
      <div style={{ position: 'absolute', bottom: 8, right: 8, fontSize: 9, color: '#888', fontFamily: 'monospace' }}>
        [MAPA — PLACEHOLDER]
      </div>
    </div>
  )
}

function MapMarker({ x, y, color, label }: { x: number; y: number; color: string; label: string }) {
  return (
    <div style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-100%)' }}>
      <div style={{
        backgroundColor: color, color: '#fff', fontSize: 9, fontWeight: 700,
        fontFamily: 'monospace', padding: '1px 4px', borderRadius: 3, whiteSpace: 'nowrap',
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
      }}>
        {label}
      </div>
      <div style={{ width: 6, height: 6, backgroundColor: color, borderRadius: '50%', margin: '0 auto' }} />
    </div>
  )
}

// ─── Section / text helpers ───────────────────────────────────────────────────

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: '#666', fontFamily: 'monospace', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8, marginTop: 4 }}>
      {children}
    </div>
  )
}

export function BodyText({ children, size = 13 }: { children: ReactNode; size?: number }) {
  return (
    <p style={{ fontSize: size, color: '#444', lineHeight: 1.5, margin: '0 0 8px' }}>
      {children}
    </p>
  )
}

export function Divider() {
  return <div style={{ height: 1, backgroundColor: '#e8e8e8', margin: '10px 0' }} />
}

// ─── Disclaimer ───────────────────────────────────────────────────────────────

export function Disclaimer() {
  return (
    <div style={{
      border: '2px solid #333', borderRadius: 6, padding: '10px 12px',
      backgroundColor: '#f5f5f5', margin: '12px 0',
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace', color: '#222', letterSpacing: '0.04em', marginBottom: 4 }}>
        ⚠ AVISO IMPORTANTE
      </div>
      <div style={{ fontSize: 11, color: '#333', lineHeight: 1.45 }}>
        Esta ferramenta <strong>não realiza diagnóstico médico</strong>. As recomendações são orientativas e <strong>não substituem avaliação de profissional de saúde</strong>.
      </div>
    </div>
  )
}

// ─── Accessibility annotation ─────────────────────────────────────────────────

export function A11yNote({ notes }: { notes: string[] }) {
  return (
    <div style={{
      borderLeft: '3px solid #888', backgroundColor: '#f0f0f0', padding: '8px 10px',
      margin: '12px 0', borderRadius: '0 4px 4px 0',
    }}>
      <div style={{ fontSize: 9, fontFamily: 'monospace', color: '#666', fontWeight: 700, letterSpacing: '0.06em', marginBottom: 4 }}>
        ♿ ANOTAÇÕES DE ACESSIBILIDADE
      </div>
      {notes.map((n, i) => (
        <div key={i} style={{ fontSize: 10, color: '#555', lineHeight: 1.4, marginBottom: 2, display: 'flex', gap: 4 }}>
          <span>→</span><span>{n}</span>
        </div>
      ))}
    </div>
  )
}

// ─── List items ───────────────────────────────────────────────────────────────

export function ListRow({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '12px 0', borderBottom: '1px solid #eee', display: 'flex',
        alignItems: 'flex-start', gap: 10, cursor: onClick ? 'pointer' : undefined,
      }}
    >
      {children}
      {onClick && <span style={{ fontSize: 12, color: '#bbb', flexShrink: 0, marginLeft: 'auto', alignSelf: 'center' }}>›</span>}
    </div>
  )
}

// ─── Tab bar ──────────────────────────────────────────────────────────────────

export function TabBar({ items, active }: { items: { label: string; icon: string; id: string }[]; active: string }) {
  return (
    <div style={{
      display: 'flex', borderTop: '1px solid #ddd', backgroundColor: '#fafafa',
      position: 'sticky', bottom: 0,
    }}>
      {items.map(item => (
        <div
          key={item.id}
          style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '8px 0', gap: 2,
          }}
        >
          <span style={{ fontSize: 18, color: active === item.id ? '#333' : '#bbb' }}>{item.icon}</span>
          <span style={{ fontSize: 9, fontFamily: 'monospace', color: active === item.id ? '#333' : '#bbb', fontWeight: active === item.id ? 700 : 400 }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Content container ────────────────────────────────────────────────────────

export function Content({ children, noPad = false }: { children: ReactNode; noPad?: boolean }) {
  return (
    <div style={{ flex: 1, padding: noPad ? 0 : '16px 16px 24px', overflowY: 'auto' }}>
      {children}
    </div>
  )
}

// ─── Screen wrapper (fills phone) ─────────────────────────────────────────────

export function ScreenWrap({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#fff' }}>
      {children}
    </div>
  )
}
