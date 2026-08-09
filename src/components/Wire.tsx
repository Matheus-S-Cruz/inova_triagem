import { type ReactNode, type CSSProperties } from "react"

import type { TriageAnswers } from "../lib/triage"

// ─── Mobile page shell ──────────────────────────────────────────────────────

// Substitui o antigo PhoneFrame (moldura de iPhone falsa). Agora é só um

// container de página: full-bleed em telas de celular reais, e um "cartão"

// centralizado em telas largas (sem fingir ser um device).

export function MobilePage({ children }: { children: ReactNode }) {
  return <div className="mobile-page">{children}</div>
}

// ─── Navigation bar ───────────────────────────────────────────────────────────

export function NavBar({
  title,
  onBack,
  right,
}: {
  title: string
  onBack?: () => void
  right?: ReactNode
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 16px",

        backgroundColor: "#EFF5F9",
        borderBottom: "1px solid #D7E3EC",
        minHeight: 44,
      }}
    >
      {onBack ? (
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0 8px 0 0",

            fontSize: 15,
            color: "#4E6A80",
            fontFamily: "Inter, system-ui, sans-serif",
            flexShrink: 0,
          }}
        >
          ←
        </button>
      ) : (
        <div style={{ width: 24 }} />
      )}
      <div
        style={{
          flex: 1,
          textAlign: "center",
          fontSize: 14,
          fontWeight: 600,
          color: "#16324F",
        }}
      >
        {title}
      </div>
      <div style={{ minWidth: 24 }}>{right}</div>
    </div>
  )
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

export function ProgressBar({
  current,
  total,
}: {
  current: number
  total: number
}) {
  return (
    <div style={{ padding: "8px 16px 4px", backgroundColor: "#EFF5F9" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: "#7C93A6",
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          Pergunta {current} de {total}
        </span>
        <span
          style={{
            fontSize: 10,
            color: "#7C93A6",
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          {Math.round((current / total) * 100)}%
        </span>
      </div>
      <div style={{ height: 4, backgroundColor: "#D7E3EC", borderRadius: 2 }}>
        <div
          style={{
            height: 4,
            width: `${(current / total) * 100}%`,

            backgroundColor: "#4E6A80",
            borderRadius: 2,
            transition: "width 0.3s",
          }}
        />
      </div>
    </div>
  )
}

// ─── Buttons ──────────────────────────────────────────────────────────────────

type BtnVariant = "primary" | "secondary" | "ghost" | "danger"

export function Btn({
  label,
  onClick,
  variant = "primary",
  full = true,
  small = false,
}: {
  label: string

  onClick?: () => void

  variant?: BtnVariant

  full?: boolean

  small?: boolean
}) {
  const styles: Record<BtnVariant, CSSProperties> = {
    primary: {
      background: "linear-gradient(135deg, #155E8A 0%, #0F9B8E 100%)",

      color: "#fff",
      border: "1.5px solid transparent",

      boxShadow: "0 2px 8px rgba(21,94,138,0.28)",
    },

    secondary: {
      backgroundColor: "#fff",
      color: "#155E8A",
      border: "1.5px solid #B8D2E0",
    },

    ghost: {
      backgroundColor: "transparent",
      color: "#4E6A80",
      border: "1.5px solid #C6D5E0",
    },

    danger: {
      backgroundColor: "#DC2626",
      color: "#fff",
      border: "1.5px solid #DC2626",
    },
  }

  return (
    <button
      onClick={onClick}
      style={{
        ...styles[variant],

        width: full ? "100%" : undefined,

        padding: small ? "8px 14px" : "13px 18px",

        fontSize: small ? 12 : 14,

        fontWeight: 700,

        borderRadius: 10,

        cursor: "pointer",

        fontFamily: "Inter, system-ui, sans-serif",

        textAlign: "center",

        display: "block",

        letterSpacing: "-0.01em",

        transition: "transform 0.08s ease, box-shadow 0.15s ease",
      }}
    >
      {label}
    </button>
  )
}

// ─── Form elements ────────────────────────────────────────────────────────────

/**
 * Campo de formulário. Sem `onChange`, funciona como no wireframe original
 * (apenas exibe o `placeholder` como texto estático). Com `value` +
 * `onChange`, vira um input controlado de verdade — usado nas telas de
 * Cadastro/Perfil (portado da branch FrontEnd) para capturar dados reais.
 */

export function Field({
  label,
  placeholder = "____________",
  hint,
  value,
  onChange,
  type = "text",
  error,
  required,
}: {
  label: string

  placeholder?: string

  hint?: string

  value?: string

  onChange?: (value: string) => void

  type?: "text" | "tel" | "email"

  error?: string

  required?: boolean
}) {
  const isControlled = onChange !== undefined

  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#16324F",
          marginBottom: 5,
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {label}
        {required && <span style={{ color: "#DC2626" }}> *</span>}
      </div>

      {isControlled ? (
        <input
          type={type}
          value={value ?? ""}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",

            padding: "10px 12px",
            border: `1.5px solid ${error ? "#DC2626" : "#DCE7EF"}`,

            borderRadius: 10,
            backgroundColor: error ? "#FEF2F2" : "#fff",

            fontSize: 13,
            color: "#16324F",
            fontFamily: "Inter, system-ui, sans-serif",

            outline: "none",
          }}
        />
      ) : (
        <div
          style={{
            padding: "10px 12px",
            border: "1.5px solid #DCE7EF",
            borderRadius: 10,

            backgroundColor: "#fff",
            fontSize: 13,
            color: "#9AAEBE",
          }}
        >
          {placeholder}
        </div>
      )}

      {error ? (
        <div
          style={{
            fontSize: 10.5,
            color: "#DC2626",
            marginTop: 4,
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          ⚠ {error}
        </div>
      ) : hint ? (
        <div
          style={{
            fontSize: 10.5,
            color: "#7C93A6",
            marginTop: 4,
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          {hint}
        </div>
      ) : null}
    </div>
  )
}

export function OptionItem({
  label,
  selected,
  onClick,
  color,
}: {
  label: string
  selected?: boolean
  onClick?: () => void
  color?: string
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        width: "100%",

        padding: "11px 14px",
        marginBottom: 7,
        border: "1.5px solid",

        borderColor: selected ? "#155E8A" : "#DCE7EF",
        borderRadius: 10,

        backgroundColor: selected ? "#EFF7F6" : "#fff",

        boxShadow: selected ? "0 1px 4px rgba(21,94,138,0.12)" : "none",

        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <div
        style={{
          width: 17,
          height: 17,
          borderRadius: "50%",
          border: "2px solid",

          borderColor: selected ? "#155E8A" : "#C6D5E0",
          flexShrink: 0,

          backgroundColor:
            color && selected ? color : selected ? "#155E8A" : "transparent",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected && !color && (
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "#fff",
            }}
          />
        )}
      </div>
      <span
        style={{
          fontSize: 13.5,
          color: "#16324F",
          fontWeight: selected ? 600 : 400,
        }}
      >
        {label}
      </span>
    </button>
  )
}

export function CheckboxItem({
  label,
  checked,
  note,
}: {
  label: string
  checked?: boolean
  note?: string
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        marginBottom: 8,
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          border: "2px solid #B8D2E0",
          borderRadius: 5,
          flexShrink: 0,
          marginTop: 1,

          backgroundColor: checked ? "#155E8A" : "#fff",
          borderColor: checked ? "#155E8A" : "#B8D2E0",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {checked && (
          <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>
            ✓
          </span>
        )}
      </div>
      <div>
        <div style={{ fontSize: 13, color: "#16324F", lineHeight: 1.4 }}>
          {label}
        </div>
        {note && (
          <div
            style={{
              fontSize: 10,
              color: "#7C93A6",
              fontFamily: "Inter, system-ui, sans-serif",
              marginTop: 2,
            }}
          >
            {note}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Risk classification ───────────────────────────────────────────────────────

export type RiskLevel = "red" | "orange" | "yellow" | "green"

const RISK_CONFIG: Record<RiskLevel, {
  bg: string
  text: string
  label: string
  subtitle: string
}> = {
  red: {
    bg: "#dc2626",
    text: "#fff",
    label: "EMERGÊNCIA",
    subtitle: "Risco imediato de vida",
  },

  orange: {
    bg: "#ea580c",
    text: "#fff",
    label: "UPA",
    subtitle: "Atendimento urgente",
  },

  yellow: {
    bg: "#ca8a04",
    text: "#fff",
    label: "PRIORITÁRIO",
    subtitle: "Atendimento em até 2h",
  },

  green: {
    bg: "#16a34a",
    text: "#fff",
    label: "UBS",
    subtitle: "Atendimento sem urgência",
  },
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  const c = RISK_CONFIG[level]

  return (
    <div
      style={{
        backgroundColor: c.bg,
        borderRadius: 16,
        padding: "22px 16px",
        textAlign: "center",
        margin: "12px 0",

        boxShadow: `0 8px 20px ${c.bg}55`,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: c.text,
          opacity: 0.8,
          fontFamily: "Inter, system-ui, sans-serif",
          letterSpacing: "0.1em",
        }}
      >
        CLASSIFICAÇÃO DE RISCO
      </div>
      <div
        style={{
          fontSize: 32,
          fontWeight: 900,
          color: c.text,
          letterSpacing: "-0.02em",
          margin: "4px 0",
        }}
      >
        {c.label}
      </div>
      <div style={{ fontSize: 12, color: c.text, opacity: 0.85 }}>
        {c.subtitle}
      </div>
    </div>
  )
}

export type OccupancyLevel = "low" | "medium" | "high"

const OCC_CONFIG: Record<OccupancyLevel, { color: string label: string }> = {
  low: { color: "#16a34a", label: "Baixa" },

  medium: { color: "#ca8a04", label: "Média" },

  high: { color: "#dc2626", label: "Alta" },
}

export function OccupancyTag({ level }: { level: OccupancyLevel }) {
  const c = OCC_CONFIG[level]

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 11,
        fontWeight: 600,

        color: c.color,
        border: `1.5px solid ${c.color}`,
        borderRadius: 20,
        padding: "2px 8px",

        fontFamily: "Inter, system-ui, sans-serif",
        backgroundColor: `${c.color}12`,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: c.color,
          flexShrink: 0,
          display: "inline-block",
        }}
      />
      Lotação {c.label}
    </span>
  )
}

export function WaitTime({ minutes }: { minutes: number }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontFamily: "Inter, system-ui, sans-serif",
        color: "#4E6A80",

        border: "1px solid #DCE7EF",
        borderRadius: 20,
        padding: "2px 8px",
        backgroundColor: "#F5F9FB",
      }}
    >
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
        height: 240,
        backgroundColor: "#E3EDF3",
        border: "1.5px dashed #9AAEBE",

        borderRadius: 8,
        position: "relative",
        overflow: "hidden",
        cursor: onTap ? "pointer" : undefined,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Grid lines to suggest a map */}
      {[...Array(6)].map((_, i) => (
        <div
          key={`h${i}`}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${i * 20}%`,
            height: 1,
            backgroundColor: "#C6D5E0",
          }}
        />
      ))}
      {[...Array(6)].map((_, i) => (
        <div
          key={`v${i}`}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${i * 20}%`,
            width: 1,
            backgroundColor: "#C6D5E0",
          }}
        />
      ))}
      {/* Markers */}
      <MapMarker x={30} y={40} color="#16a34a" label="UBS" />
      <MapMarker x={55} y={55} color="#dc2626" label="UPA" />
      <MapMarker x={70} y={35} color="#ca8a04" label="UBS" />
      <MapMarker x={45} y={65} color="#2563eb" label="HOS" />
      {/* User location */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            backgroundColor: "#155E8A",
            borderRadius: "50%",

            border: "3px solid #fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 8,
          right: 8,
          fontSize: 9,
          color: "#7C93A6",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        [MAPA — PLACEHOLDER]
      </div>
    </div>
  )
}

function MapMarker({
  x,
  y,
  color,
  label,
}: {
  x: number
  y: number
  color: string
  label: string
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%,-100%)",
      }}
    >
      <div
        style={{
          backgroundColor: color,
          color: "#fff",
          fontSize: 9,
          fontWeight: 700,

          fontFamily: "Inter, system-ui, sans-serif",
          padding: "1px 4px",
          borderRadius: 3,
          whiteSpace: "nowrap",

          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }}
      >
        {label}
      </div>
      <div
        style={{
          width: 6,
          height: 6,
          backgroundColor: color,
          borderRadius: "50%",
          margin: "0 auto",
        }}
      />
    </div>
  )
}

// ─── Section / text helpers ───────────────────────────────────────────────────

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: "#5C7690",
        fontFamily: "Inter, system-ui, sans-serif",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        marginBottom: 8,
        marginTop: 4,
      }}
    >
      {children}
    </div>
  )
}

export function BodyText({
  children,
  size = 13,
}: {
  children: ReactNode
  size?: number
}) {
  return (
    <p
      style={{
        fontSize: size,
        color: "#3A5468",
        lineHeight: 1.5,
        margin: "0 0 8px",
      }}
    >
      {children}
    </p>
  )
}

export function Divider() {
  return (
    <div style={{ height: 1, backgroundColor: "#E3EDF3", margin: "10px 0" }} />
  )
}

// ─── Disclaimer ───────────────────────────────────────────────────────────────

export function Disclaimer() {
  return (
    <div
      style={{
        border: "1.5px solid #B8D2E0",
        borderRadius: 10,
        padding: "12px 14px",

        backgroundColor: "#EFF5F9",
        margin: "12px 0",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          fontFamily: "Inter, system-ui, sans-serif",
          color: "#16324F",
          letterSpacing: "0.04em",
          marginBottom: 4,
        }}
      >
        ⚠ AVISO IMPORTANTE
      </div>
      <div style={{ fontSize: 11, color: "#155E8A", lineHeight: 1.45 }}>
        Esta ferramenta <strong>não realiza diagnóstico médico</strong>. As
        recomendações são orientativas e{" "}
        <strong>não substituem avaliação de profissional de saúde</strong>.
      </div>
    </div>
  )
}

// ─── Accessibility annotation ─────────────────────────────────────────────────

export function A11yNote({ notes }: { notes: string[] }) {
  return (
    <div
      style={{
        borderLeft: "3px solid #7C93A6",
        backgroundColor: "#EAF2F6",
        padding: "8px 10px",

        margin: "12px 0",
        borderRadius: "0 4px 4px 0",
      }}
    >
      <div
        style={{
          fontSize: 9,
          fontFamily: "Inter, system-ui, sans-serif",
          color: "#5C7690",
          fontWeight: 700,
          letterSpacing: "0.06em",
          marginBottom: 4,
        }}
      >
        ♿ ANOTAÇÕES DE ACESSIBILIDADE
      </div>
      {notes.map((n, i) => (
        <div
          key={i}
          style={{
            fontSize: 10,
            color: "#4E6A80",
            lineHeight: 1.4,
            marginBottom: 2,
            display: "flex",
            gap: 4,
          }}
        >
          <span>→</span>
          <span>{n}</span>
        </div>
      ))}
    </div>
  )
}

// ─── List items ───────────────────────────────────────────────────────────────

export function ListRow({
  children,
  onClick,
}: {
  children: ReactNode
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "12px 0",
        borderBottom: "1px solid #E7EFF4",
        display: "flex",

        alignItems: "flex-start",
        gap: 10,
        cursor: onClick ? "pointer" : undefined,
      }}
    >
      {children}
      {onClick && (
        <span
          style={{
            fontSize: 12,
            color: "#A9BBC9",
            flexShrink: 0,
            marginLeft: "auto",
            alignSelf: "center",
          }}
        >
          ›
        </span>
      )}
    </div>
  )
}

// ─── Tab bar ──────────────────────────────────────────────────────────────────

export function TabBar({
  items,
  active,
}: {
  items: { label: string icon: string id: string }[]
  active: string
}) {
  return (
    <div
      style={{
        display: "flex",
        borderTop: "1px solid #D7E3EC",
        backgroundColor: "#F5F9FB",

        position: "sticky",
        bottom: 0,
      }}
    >
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",

            padding: "8px 0",
            gap: 2,
          }}
        >
          <span
            style={{
              fontSize: 18,
              color: active === item.id ? "#155E8A" : "#A9BBC9",
            }}
          >
            {item.icon}
          </span>
          <span
            style={{
              fontSize: 9,
              fontFamily: "Inter, system-ui, sans-serif",
              color: active === item.id ? "#155E8A" : "#A9BBC9",
              fontWeight: active === item.id ? 700 : 400,
            }}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Content container ────────────────────────────────────────────────────────

export function Content({
  children,
  noPad = false,
}: {
  children: ReactNode
  noPad?: boolean
}) {
  return (
    <div
      style={{
        flex: 1,
        padding: noPad ? 0 : "16px 16px 24px",
        overflowY: "auto",
      }}
    >
      {children}
    </div>
  )
}

// ─── Screen wrapper (fills phone) ─────────────────────────────────────────────

export function ScreenWrap({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "#fff",
      }}
    >
      {children}
    </div>
  )
}

// ─── Answers summary (compartilhado) ──────────────────────────────────────

// Usado em 3 lugares: modal de confirmação (Q6Screen), resultado

// (ResultScreen) e detalhe do histórico (HistoryDetail). Antes cada tela

// tinha sua própria cópia dessa tabela — qualquer campo novo no

// questionário exigia editar 3 arquivos. Agora é um único ponto de verdade.

function yesNoLabel(v: "sim" | "nao" | null): string {
  return v === "sim" ? "Sim" : v === "nao" ? "Não" : "—"
}

export function AnswersSummary({ answers }: { answers: TriageAnswers }) {
  const rows: { label: string value: string }[] = [
    { label: "Sintoma", value: answers.symptom || answers.symptomOther || "—" },

    { label: "Duração", value: answers.duration || "—" },

    { label: "Febre", value: yesNoLabel(answers.fever) },

    { label: "Dor intensa", value: yesNoLabel(answers.intensePain) },

    { label: "Falta de ar", value: yesNoLabel(answers.breathingDifficulty) },

    { label: "Piora rápida", value: yesNoLabel(answers.rapidWorsening) },

    {
      label: "Grupo de risco",
      value: answers.vulnerableGroups.length
        ? answers.vulnerableGroups.join(", ")
        : "Nenhum",
    },

    {
      label: "Medicamentos",

      value:
        answers.usingMedication === "sim"
          ? answers.medicationDetails || "Sim (não especificado)"
          : yesNoLabel(answers.usingMedication),
    },
  ]

  return (
    <div
      style={{
        backgroundColor: "#F5F9FB",
        border: "1px solid #E3EDF3",

        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      {rows.map(({ label, value }, i) => (
        <div
          key={label}
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,

            padding: "8px 12px",
            borderBottom: i < rows.length - 1 ? "1px solid #EAF2F6" : "none",
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: "#7C93A6",
              fontFamily: "Inter, system-ui, sans-serif",
              flexShrink: 0,
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontSize: 12,
              color: "#16324F",
              fontWeight: 600,
              textAlign: "right",
            }}
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  )
}
