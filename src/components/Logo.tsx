// ─── Triagem+ — Logo ───────────────────────────────────────────────────────
// Conceito: um "pino de localização" (orientação) com uma cruz de saúde vazada
// no centro (cuidado médico), em gradiente azul → verde-água (tecnologia que
// cuida). A forma é simples o bastante para funcionar em 16px (favicon) e em
// telas grandes, sem depender de detalhe fino.

export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="triagemGradient" x1="4" y1="2" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#155E8A" />
          <stop offset="1" stopColor="#0F9B8E" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="38" height="38" rx="11" fill="url(#triagemGradient)" />
      {/* Pino de localização (orientação) */}
      <path
        d="M20 8c-5.25 0-9.5 4.03-9.5 9c0 6.5 9.5 15 9.5 15s9.5-8.5 9.5-15c0-4.97-4.25-9-9.5-9Z"
        fill="white"
        fillOpacity="0.98"
      />
      {/* Cruz de saúde vazada no centro do pino */}
      <path
        d="M17.6 13.6h4.8v3.2h3.2v4.8h-3.2v3.2h-4.8v-3.2h-3.2v-4.8h3.2v-3.2Z"
        fill="url(#triagemGradient)"
      />
    </svg>
  )
}

export function LogoLockup({ size = 32, dark = false }: { size?: number; dark?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.3 }}>
      <LogoMark size={size} />
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{
          fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 800, letterSpacing: '-0.02em',
          fontSize: size * 0.62, color: dark ? '#fff' : 'var(--color-primary-dark, #0F2A4A)',
        }}>
          Triagem<span style={{ color: 'var(--color-accent, #0F9B8E)' }}>+</span>
        </span>
        <span style={{
          fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 600, letterSpacing: '0.08em',
          fontSize: size * 0.24, color: dark ? 'rgba(255,255,255,0.6)' : 'var(--color-text-muted, #7C93A6)',
          textTransform: 'uppercase', marginTop: 1,
        }}>
          Orientação de saúde
        </span>
      </div>
    </div>
  )
}