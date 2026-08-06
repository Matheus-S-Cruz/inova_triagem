import { createContext, useContext, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import { classifyRisk, emptyTriageAnswers, type TriageAnswers, type TriageResult } from '../lib/triage'

// ─── Estado compartilhado da triagem ───────────────────────────────────────
// As telas Q1–Q6 (Flow1.tsx) escrevem aqui a cada resposta, e o ResultScreen
// (Flow2.tsx) lê o resultado já calculado. Isso substitui o antigo
// `demoLevel = 'orange'` fixo por uma classificação real, recalculada a
// cada mudança de resposta.

interface TriageContextValue {
  answers: TriageAnswers
  setAnswers: Dispatch<SetStateAction<TriageAnswers>>
  updateAnswers: (patch: Partial<TriageAnswers>) => void
  toggleVulnerableGroup: (group: string, noneLabel: string) => void
  resetAnswers: () => void
  result: TriageResult
}

const TriageContext = createContext<TriageContextValue | null>(null)

export function TriageProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<TriageAnswers>(emptyTriageAnswers())

  const updateAnswers = (patch: Partial<TriageAnswers>) =>
    setAnswers((prev) => ({ ...prev, ...patch }))

  // Seleção de grupo vulnerável (Q5): marcar "Nenhuma das anteriores" limpa
  // as demais opções, e marcar qualquer outra opção desmarca "Nenhuma".
  const toggleVulnerableGroup = (group: string, noneLabel: string) => {
    setAnswers((prev) => {
      const isSelected = prev.vulnerableGroups.includes(group)
      if (group === noneLabel) {
        return { ...prev, vulnerableGroups: isSelected ? [] : [noneLabel] }
      }
      const withoutNone = prev.vulnerableGroups.filter((g) => g !== noneLabel)
      const next = isSelected ? withoutNone.filter((g) => g !== group) : [...withoutNone, group]
      return { ...prev, vulnerableGroups: next }
    })
  }

  const resetAnswers = () => setAnswers(emptyTriageAnswers())

  const result = useMemo(() => classifyRisk(answers), [answers])

  return (
    <TriageContext.Provider value={{ answers, setAnswers, updateAnswers, toggleVulnerableGroup, resetAnswers, result }}>
      {children}
    </TriageContext.Provider>
  )
}

export function useTriage() {
  const ctx = useContext(TriageContext)
  if (!ctx) throw new Error('useTriage precisa ser usado dentro de um TriageProvider')
  return ctx
}