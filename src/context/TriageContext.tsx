import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react"

import type { ScreenId } from "../App"

import {
  classifyRisk,
  emptyTriageAnswers,
  type TriageAnswers,
  type TriageResult,
} from "../lib/triage"

import type { NearestUnitResult } from "../lib/geolocation"
import type { HealthUnitMarker } from "../components/LocationMap"

// ─── Estado compartilhado da triagem ───────────────────────────────────────

// As telas Q1–Q6 (Flow1.tsx) escrevem aqui a cada resposta, e o ResultScreen

// (Flow2.tsx) lê o resultado já calculado. Isso substitui o antigo

// `demoLevel = 'orange'` fixo por uma classificação real, recalculada a

// cada mudança de resposta.

//

// `historySaved` controla se ESTA triagem (o conjunto atual de respostas)

// já foi gravada em HistoryStorage. Evita duplicar o registro se o usuário

// voltar/revisitar o ResultScreen sem reiniciar a triagem. É zerado sempre

// que `resetAnswers()` roda (ou seja, ao iniciar uma nova triagem).

interface TriageContextValue {

  
  
  answers: TriageAnswers

  setAnswers: Dispatch<SetStateAction<TriageAnswers>>

  updateAnswers: (patch: Partial<TriageAnswers>) => void

  toggleVulnerableGroup: (group: string, noneLabel: string) => void

  resetAnswers: () => void

  result: TriageResult

  historySaved: boolean

  markHistorySaved: () => void

     /** Unidade mais próxima compatível com o nível de risco atual — calculada
    * pelo ResultScreen (Flow2.tsx) assim que a triagem termina. Consumida
    * pelo MapScreen (destaque no mapa) e pelo UnitDetailScreen. */
  nearestUnit: NearestUnitResult | null
 
   setNearestUnit: Dispatch<SetStateAction<NearestUnitResult | null>>
   /** Unidade que o usuário clicou explicitamente (numa lista ou no mapa) —
   * usada pela tela de detalhes (UnitDetailScreen, em Flow3.tsx) para
   * mostrar os dados da unidade certa, em vez de sempre cair na
   * `nearestUnit` da triagem ou no dado de demonstração fixo. */
  selectedUnit: HealthUnitMarker | null

  setSelectedUnit: Dispatch<SetStateAction<HealthUnitMarker | null>>

  /** Tela para onde o botão "voltar" do UnitDetailScreen deve levar, quando
   * a unidade foi aberta a partir de um contexto específico (ex: direto do
   * ResultScreen) em vez do fluxo padrão mapa → lista → detalhe. `null`
   * usa o destino padrão ("unitlist"). Consumido e limpo pelo próprio
   * UnitDetailScreen assim que o back é usado. */
  returnScreen: ScreenId | null

  setReturnScreen: Dispatch<SetStateAction<ScreenId | null>>
}

const TriageContext = createContext<TriageContextValue | null>(null)

// ─── Persistência da unidade selecionada ───────────────────────────────────
// Diferente das respostas da triagem (que fazem sentido "zerar" a cada F5),
// a unidade que o usuário está vendo em UnitDetailScreen precisa sobreviver
// a um refresh de página — senão a tela certa aparece (o hash da URL já
// cuida disso), mas sem o dado da unidade, caindo no fallback fixo de
// demonstração. Usa sessionStorage (dura enquanto a aba estiver aberta, ao
// contrário do localStorage que seria permanente entre sessões).
const SELECTED_UNIT_KEY = "triagem_app_unidade_selecionada"

function loadSelectedUnit(): HealthUnitMarker | null {
  if (typeof window === "undefined") return null

  const raw = window.sessionStorage.getItem(SELECTED_UNIT_KEY)

  return raw ? (JSON.parse(raw) as HealthUnitMarker) : null
}

function persistSelectedUnit(unit: HealthUnitMarker | null) {
  if (typeof window === "undefined") return

  if (unit) {
    window.sessionStorage.setItem(SELECTED_UNIT_KEY, JSON.stringify(unit))
  } else {
    window.sessionStorage.removeItem(SELECTED_UNIT_KEY)
  }
}

export function TriageProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<TriageAnswers>(emptyTriageAnswers())

  const [historySaved, setHistorySaved] = useState(false)

  const [nearestUnit, setNearestUnit] = useState<NearestUnitResult | null>(
    null,
  )
  
  const [selectedUnit, setSelectedUnitState] =
    useState<HealthUnitMarker | null>(() => loadSelectedUnit())

  const [returnScreen, setReturnScreen] = useState<ScreenId | null>(null)

  // Envolve o setState padrão para também gravar no sessionStorage a cada
  // mudança — assim um F5 na tela de detalhes (UnitDetailScreen) continua
  // mostrando a unidade certa, em vez de cair no dado de demonstração.
  const setSelectedUnit: Dispatch<SetStateAction<HealthUnitMarker | null>> = (
    value,
  ) => {
    setSelectedUnitState((prev) => {
      const next =
        typeof value === "function"
          ? (value as (p: HealthUnitMarker | null) => HealthUnitMarker | null)(
              prev,
            )
          : value

      persistSelectedUnit(next)

      return next
    })
  }


  const updateAnswers = (patch: Partial<TriageAnswers>) =>
    setAnswers((prev) => ({ ...prev, ...patch }))

  // Seleção de grupo vulnerável (Q5): marcar "Nenhuma das anteriores" limpa

  // as demais opções, e marcar qualquer outra opção desmarca "Nenhuma".

  const toggleVulnerableGroup = (group: string, noneLabel: string) => {
    setAnswers((prev) => {
      const isSelected = prev.vulnerableGroups.includes(group)
      
      // Marcar "Nenhuma das anteriores" limpa qualquer outra seleção
      if (group === noneLabel) {
        return { ...prev, vulnerableGroups: isSelected ? [] : [noneLabel] }
      }
      
      // Marcar qualquer outra opção automaticamente desmarca "Nenhuma"
      const withoutNone = prev.vulnerableGroups.filter((g) => g !== noneLabel)

      const next = isSelected
        ? withoutNone.filter((g) => g !== group)
        : [...withoutNone, group]

      return { ...prev, vulnerableGroups: next }
    })
  }

  const resetAnswers = () => {
    setAnswers(emptyTriageAnswers())

    setHistorySaved(false)

    setNearestUnit(null)

    setSelectedUnit(null)
  }

  const markHistorySaved = () => setHistorySaved(true)

  const result = useMemo(() => classifyRisk(answers), [answers])
  // Recalcula a classificação de risco toda vez que uma resposta muda —
  // é isso que substitui o antigo nível fixo "orange" do wireframe

  return (
    <TriageContext.Provider
      value={{
        answers,
        setAnswers,
        updateAnswers,
        toggleVulnerableGroup,
        resetAnswers,

        result,
        historySaved,
        markHistorySaved,

        nearestUnit,
        setNearestUnit,

        selectedUnit,
        setSelectedUnit,

        returnScreen,
        setReturnScreen,
      }}
    >
      {children}
    </TriageContext.Provider>
  )
}

export function useTriage() {
  const ctx = useContext(TriageContext)

  if (!ctx)
    throw new Error("useTriage precisa ser usado dentro de um TriageProvider")

  return ctx
}
