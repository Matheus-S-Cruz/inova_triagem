// ─── Compartilhamento / exportação do resultado da triagem ────────────────
// Gera um resumo textual (compartilhamento nativo / clipboard) e uma versão
// HTML imprimível ("Baixar/Imprimir PDF" via window.print() — sem depender
// de lib de PDF). Os dois reaproveitam a mesma extração de dados, pra não
// duplicar a lista de perguntas/respostas em dois lugares.

import type { TriageAnswers, TriageResult, RiskLevel } from "./triage"
import type { Usuario } from "./storage"

const LEVEL_LABEL: Record<RiskLevel, string> = {
  red: "Emergência",
  orange: "UPA — Urgente",
  yellow: "Prioritário",
  green: "UBS",
}

function yesNo(v: "sim" | "nao" | null): string {
  return v === "sim" ? "Sim" : v === "nao" ? "Não" : "Não informado"
}

function nowLabel(): string {
  const d = new Date()
  const date = d.toLocaleDateString("pt-BR")
  const time = d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })
  return `${date} às ${time}`
}

interface SummaryInput {
  answers: TriageAnswers
  result: TriageResult
  /** null = triagem anônima — nesse caso os dados de saúde não são incluídos,
   * já que eles só existem em Usuario (conta logada). */
  usuario: Usuario | null
}

/** Extração única dos dados — usada tanto pelo texto quanto pelo HTML. */
function buildSummarySections(input: SummaryInput) {
  const { answers, result, usuario } = input

  const paciente = usuario?.nomeCompleto || "Paciente (triagem anônima)"

  const respostas: [string, string][] = [
    ["Sintoma principal", answers.symptom || answers.symptomOther || "Não informado"],
    ["Duração", answers.duration || "Não informado"],
    ["Febre", yesNo(answers.fever)],
    ["Dor intensa (≥7/10)", yesNo(answers.intensePain)],
    ["Falta de ar", yesNo(answers.breathingDifficulty)],
    ["Piora rápida", yesNo(answers.rapidWorsening)],
    [
      "Grupo de risco",
      answers.vulnerableGroups.length ? answers.vulnerableGroups.join(", ") : "Nenhum",
    ],
    [
      "Uso de medicamentos",
      answers.usingMedication === "sim"
        ? answers.medicationDetails || "Sim (não especificado)"
        : yesNo(answers.usingMedication),
    ],
  ]

  const saude: [string, string][] | null = usuario
    ? [
        ["Alergias", usuario.alergias || "Nenhuma informada"],
        ["Comorbidades", usuario.comorbidades || "Nenhuma informada"],
        ["Medicamentos de uso contínuo", usuario.medicamentos || "Nenhum informado"],
      ]
    : null

  return {
    paciente,
    dataHora: nowLabel(),
    classificacao: LEVEL_LABEL[result.level],
    motivos: result.reasons,
    respostas,
    saude,
  }
}

export function buildTriageSummaryText(input: SummaryInput): string {
  const s = buildSummarySections(input)
  const lines: string[] = []

  lines.push("TRIAGEM+ — RESUMO DA TRIAGEM")
  lines.push(`Paciente: ${s.paciente}`)
  lines.push(`Data/hora: ${s.dataHora}`)
  lines.push("")
  lines.push(`Classificação: ${s.classificacao}`)
  lines.push("")
  lines.push("Motivo da classificação:")
  s.motivos.forEach((m) => lines.push(`- ${m}`))
  lines.push("")
  lines.push("Respostas da triagem:")
  s.respostas.forEach(([k, v]) => lines.push(`- ${k}: ${v}`))

  if (s.saude) {
    lines.push("")
    lines.push("Dados de saúde do paciente:")
    s.saude.forEach(([k, v]) => lines.push(`- ${k}: ${v}`))
  }

  lines.push("")
  lines.push("⚠ Esta triagem é orientativa e não substitui avaliação de profissional de saúde.")

  return lines.join("\n")
}

export function buildTriagePrintableHtml(input: SummaryInput): string {
  const s = buildSummarySections(input)

  const row = ([k, v]: [string, string]) =>
    `<tr><td style="padding:4px 10px 4px 0;color:#5C7690;white-space:nowrap;">${k}</td><td style="padding:4px 0;color:#16324F;font-weight:600;">${v}</td></tr>`

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<title>Resumo da Triagem — Triagem+</title>
<style>
  body { font-family: Arial, sans-serif; color: #16324F; padding: 24px; max-width: 640px; margin: 0 auto; }
  h1 { font-size: 18px; color: #0F2A4A; margin-bottom: 2px; }
  .sub { font-size: 12px; color: #7C93A6; margin-bottom: 16px; }
  .badge { display: inline-block; background: #155E8A; color: #fff; font-weight: 700; padding: 6px 14px; border-radius: 6px; font-size: 14px; margin-bottom: 16px; }
  h2 { font-size: 13px; color: #5C7690; text-transform: uppercase; letter-spacing: 0.04em; margin: 18px 0 6px; }
  ul { margin: 0; padding-left: 18px; }
  li { font-size: 13px; margin-bottom: 4px; }
  table { border-collapse: collapse; width: 100%; }
  td { font-size: 13px; vertical-align: top; }
  .disclaimer { margin-top: 24px; font-size: 11px; color: #7C5B00; background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 6px; padding: 10px 12px; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
  <h1>Triagem+ — Resumo da Triagem</h1>
  <div class="sub">Paciente: ${s.paciente} · ${s.dataHora}</div>
  <div class="badge">${s.classificacao}</div>

  <h2>Motivo da classificação</h2>
  <ul>${s.motivos.map((m) => `<li>${m}</li>`).join("")}</ul>

  <h2>Respostas da triagem</h2>
  <table>${s.respostas.map(row).join("")}</table>

  ${s.saude ? `<h2>Dados de saúde do paciente</h2><table>${s.saude.map(row).join("")}</table>` : ""}

  <div class="disclaimer">⚠ Esta triagem é orientativa e não substitui avaliação de profissional de saúde.</div>
</body>
</html>`
}

/**
 * Web Share API quando disponível (comum em navegadores mobile). Sem
 * suporte (ex: desktop), cai para copiar no clipboard. Retorna qual
 * caminho foi usado, pra tela mostrar o feedback certo.
 */
export async function shareOrCopyTriageSummary(
  text: string,
): Promise<"shared" | "copied" | "failed"> {
  if (navigator.share) {
    try {
      await navigator.share({ title: "Resumo da Triagem — Triagem+", text })
      return "shared"
    } catch (err) {
      // Cancelamento do share nativo não é erro real — só não cai no
      // fallback de clipboard depois de um cancelamento intencional.
      if (err instanceof Error && err.name === "AbortError") return "failed"
    }
  }

  try {
    await navigator.clipboard.writeText(text)
    return "copied"
  } catch {
    return "failed"
  }
}

/** Abre uma aba com a versão imprimível e já dispara o diálogo de
 * impressão (de onde o usuário escolhe "Salvar como PDF"). Sem lib de
 * PDF — usa só a impressão nativa do navegador. */
export function openPrintableTriageSummary(html: string): boolean {
  const win = window.open("", "_blank")
  if (!win) return false

  win.document.open()
  win.document.write(html)
  win.document.close()

  win.onload = () => {
    win.focus()
    win.print()
  }

  return true
}