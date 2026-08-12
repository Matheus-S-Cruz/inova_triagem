// ─── Motor de Pré-Triagem — Triagem+ ───────────────────────────────────────

// Implementa RF01 (questionário dinâmico), RF02 (classificação de risco com

// base em protocolo médico, inspirado no Protocolo de Manchester) e RF03

// (direcionamento de conduta), conforme a seção "Definições" do documento

// do projeto:

//

//   UBS  → prevenção e rotina, sem pressa (vacina, curativo simples, receita)

//   UPA  → urgência súbita mas não gravíssima (febre alta, dor forte súbita,

//          corte profundo, suspeita de fratura, PA muito alta/baixa, dor

//          intensa no peito, vômito/diarreia com desidratação)

//   Hospital → emergência com risco iminente de vida (infarto, AVC, trauma

//          grave, cirurgia de emergência)

//

// Este NÃO é um sistema de diagnóstico — é uma árvore de decisão de

// orientação, deliberadamente conservadora (erra para o lado de recomendar

// um nível de cuidado mais alto quando há dúvida).

export type YesNo = "sim" | "nao" | null

export interface TriageAnswers {
  symptom: string | null

  symptomOther: string

  duration: string | null

  fever: YesNo

  intensePain: YesNo

  breathingDifficulty: YesNo

  rapidWorsening: YesNo

  vulnerableGroups: string[]

  usingMedication: YesNo

  medicationDetails: string
}

export function emptyTriageAnswers(): TriageAnswers {
  return {
    symptom: null,

    symptomOther: "",

    duration: null,

    fever: null,

    intensePain: null,

    breathingDifficulty: null,

    rapidWorsening: null,

    vulnerableGroups: [],

    usingMedication: null,

    medicationDetails: "",
  }
}

/** Todas as perguntas obrigatórias (Q1–Q4, Q6) foram respondidas. Q5 é opcional. */

export function isTriageComplete(a: TriageAnswers): boolean {
  return (
    !!a.symptom &&
    !!a.duration &&
    a.fever !== null &&
    a.intensePain !== null &&
    a.breathingDifficulty !== null &&
    a.rapidWorsening !== null &&
    a.usingMedication !== null
  )
}

export type RiskLevel = "red" | "orange" | "yellow" | "green"

export interface TriageResult {
  level: RiskLevel

  reasons: string[]
}

// Grupos de vulnerabilidade que elevam a prioridade clínica (conforme Q5)

const HIGH_RISK_GROUPS = [
  "Criança (menor de 5 anos)",

  "Idoso (60 anos ou mais)",

  "Gestante",

  "Puérpera (até 45 dias após parto)",

  "Imunossuprimido / transplantado",
]

const CHRONIC_GROUP =
  "Portador de doença crônica (diabetes, HAS, cardiopatia, DPOC...)"

const GI_SYMPTOMS = ["Vômito / Náusea", "Diarreia"]

const RECENT_DURATIONS = ["Menos de 6 horas", "Hoje (6–24h)"]

const LONG_DURATIONS = ["4 a 7 dias", "Mais de 1 semana"]

export function classifyRisk(a: TriageAnswers): TriageResult {
  const reasons: string[] = []

  // Sinalizadores calculados uma vez, reaproveitados em várias regras abaixo
  const hasHighRiskGroup = a.vulnerableGroups.some((g) =>
    HIGH_RISK_GROUPS.includes(g),
  )

  const hasChronic = a.vulnerableGroups.includes(CHRONIC_GROUP)

  const recentOnset =
    a.duration !== null && RECENT_DURATIONS.includes(a.duration)

  const longOnset = a.duration !== null && LONG_DURATIONS.includes(a.duration)

  const isGI = a.symptom !== null && GI_SYMPTOMS.includes(a.symptom)

  // ── VERMELHO — Emergência (Hospital): risco imediato de vida ───────────
  // A árvore é avaliada nesta ordem (vermelho → laranja → amarelo → verde)
  // e retorna no primeiro critério que bater — por isso a ordem importa:
  // sinais mais graves são checados primeiro.

  if (
    a.symptom === "Dor no peito" &&
    (a.breathingDifficulty === "sim" || a.intensePain === "sim")
  ) {
    reasons.push(
      "Dor no peito associada a falta de ar ou dor intensa — sinais compatíveis com emergência cardiovascular.",
    )

    return { level: "red", reasons }
  }

  if (a.breathingDifficulty === "sim" && a.rapidWorsening === "sim") {
    reasons.push(
      "Falta de ar com piora rápida nas últimas horas — risco respiratório grave.",
    )

    return { level: "red", reasons }
  }

  if (a.breathingDifficulty === "sim" && a.intensePain === "sim") {
    reasons.push("Falta de ar associada a dor intensa (≥7/10).")

    return { level: "red", reasons }
  }

  // ── LARANJA — Urgência (UPA): não pode esperar, mas não é gravíssimo ───

  if (a.breathingDifficulty === "sim") {
    reasons.push("Relato de dificuldade para respirar / falta de ar.")

    return { level: "orange", reasons }
  }

  if (a.symptom === "Dor no peito") {
    reasons.push(
      "Dor no peito relatada — necessita avaliação rápida mesmo sem outros sinais.",
    )

    return { level: "orange", reasons }
  }

  if (a.intensePain === "sim") {
    reasons.push("Dor intensa (nível ≥7/10 relatado).")

    return { level: "orange", reasons }
  }

  if (a.fever === "sim" && a.rapidWorsening === "sim") {
    reasons.push("Febre associada a piora rápida dos sintomas.")

    return { level: "orange", reasons }
  }

  if (hasHighRiskGroup && (a.fever === "sim" || a.rapidWorsening === "sim")) {
    reasons.push(
      "Paciente em grupo de risco (criança, idoso, gestante, puérpera ou imunossuprimido) com febre ou piora rápida.",
    )

    return { level: "orange", reasons }
  }

  if (isGI && recentOnset && (a.fever === "sim" || hasHighRiskGroup)) {
    reasons.push(
      "Vômito ou diarreia de início recente, com risco de desidratação.",
    )

    return { level: "orange", reasons }
  }

  // ── AMARELO — Prioritário: atendimento em até ~2h ──────────────────────

  if (a.rapidWorsening === "sim") {
    reasons.push("Sintomas pioraram rapidamente nas últimas horas.")

    return { level: "yellow", reasons }
  }

  if (hasHighRiskGroup) {
    reasons.push(
      "Paciente pertence a grupo de risco e deve ser priorizado, mesmo sem sinais de alarme.",
    )

    return { level: "yellow", reasons }
  }

  if (a.fever === "sim" && recentOnset) {
    reasons.push("Febre de início recente (menos de 24h).")

    return { level: "yellow", reasons }
  }

  if (hasChronic && a.fever === "sim") {
    reasons.push("Febre em paciente com doença crônica pré-existente.")

    return { level: "yellow", reasons }
  }

  if (isGI && recentOnset) {
    reasons.push("Vômito ou diarreia de início recente.")

    return { level: "yellow", reasons }
  }

  // ── VERDE — UBS: sem urgência, mas merece avaliação presencial ─────────

  if (a.fever === "sim" || a.symptom === "Dor abdominal" || hasChronic) {
    reasons.push(
      "Sintomas presentes, sem sinais de alarme — recomenda-se avaliação em UBS.",
    )

    return { level: "green", reasons }
  }

  if (longOnset) {
    reasons.push(
      "Sintomas persistentes há vários dias — recomenda-se avaliação em UBS.",
    )

    return { level: "green", reasons }
  }

  // ── VERDE — UBS: fallback final. Sem nível "cuidados em casa": todo

  // paciente é sempre direcionado a UBS, UPA ou Hospital.

  reasons.push(
    "Sintomas leves, de início recente e sem sinais de alarme — recomenda-se avaliação em UBS.",
  )

  return { level: "green", reasons }
}
