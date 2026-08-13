// ─── Horário de funcionamento das unidades de saúde ────────────────────────
// Dados reais (fonte: equipe, a partir de contato/site das unidades).
// UBS têm horário fixo e fecham em dias específicos; UPAs e Hospitais
// funcionam 24h; uma unidade pode estar temporariamente fechada.

export type UnitHoursSpec =
  | { kind: "24h" }
  | { kind: "closed" } // temporariamente fechada (ex: CS Cachoeira do Bom Jesus)
  | {
      kind: "scheduled"
      opensAt: string // "07:00"
      closesAt: string // "17:00"
      /** Dias em que a unidade NÃO abre. 0=domingo ... 6=sábado. */
      closedDays: number[]
    }

const DAY_LABELS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"]

/**
 * Retorna se a unidade está aberta agora. `null` quando não há dado de
 * horário cadastrado (nunca deveria fingir uma resposta nesse caso).
 */
export function isOpenNow(
  spec: UnitHoursSpec | undefined,
  now: Date = new Date(),
): boolean | null {
  if (!spec) return null

  if (spec.kind === "24h") return true

  if (spec.kind === "closed") return false

  const day = now.getDay()

  if (spec.closedDays.includes(day)) return false

  const [oh, om] = spec.opensAt.split(":").map(Number)
  const [ch, cm] = spec.closesAt.split(":").map(Number)

  const minutesNow = now.getHours() * 60 + now.getMinutes()
  const opens = oh * 60 + om
  const closes = ch * 60 + cm

  return minutesNow >= opens && minutesNow < closes
}

/** Texto curto pro selo de status (ex: "Aberta agora", "Fechada agora"). */
export function openStatusLabel(spec: UnitHoursSpec | undefined): string {
  const open = isOpenNow(spec)

  if (open === null) return "Horário não informado"
  if (spec?.kind === "closed") return "Temporariamente fechada"

  return open ? "Aberta agora" : "Fechada agora"
}

/** Texto completo do horário, para exibir na ficha da unidade. */
export function formatHours(spec: UnitHoursSpec | undefined): string {
  if (!spec) return "Horário não informado"

  if (spec.kind === "24h") return "Funciona 24 horas, todos os dias"

  if (spec.kind === "closed") return "Temporariamente fechada"

  const openDays = [0, 1, 2, 3, 4, 5, 6].filter(
    (d) => !spec.closedDays.includes(d),
  )

  // Casos comuns: intervalo contíguo de dias (ex: seg–sex, seg–sáb)
  const isContiguous =
    openDays.length > 0 &&
    openDays[openDays.length - 1] - openDays[0] === openDays.length - 1

  const daysLabel = isContiguous
    ? `${DAY_LABELS[openDays[0]]} a ${DAY_LABELS[openDays[openDays.length - 1]]}`
    : openDays.map((d) => DAY_LABELS[d]).join(", ")

  return `${daysLabel}, ${spec.opensAt}–${spec.closesAt}`
}