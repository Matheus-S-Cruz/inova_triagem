// ─── Persistência local de usuário ─────────────────────────────────────────
// Espelha o objeto aceito/retornado pelo backend Spring Boot em
// backend/src/main/java/com/triagem/backend/model/Usuario.java — os nomes
// dos campos são os mesmos de propósito, para que trocar localStorage por
// chamadas à API (ver backend/README.md) seja só trocar esta camada, sem
// mexer nas telas.

import type { RiskLevel, TriageAnswers } from './triage'

export interface Usuario {
  nomeCompleto: string
  dataNascimento: string // DD/MM/AAAA
  telefone: string
  email: string
  sexoBiologico: string // 'Feminino' | 'Masculino' | 'Outro' | ''
  cidadeBairro: string
  possuiPlano: string // 'Sim' | 'Não' | ''
  nomePlano: string
  alergias: string
  comorbidades: string
  medicamentos: string
  termosAceitos: boolean
  receberNotificacoes: boolean
  contaCriadaEm: string // ISO
}

export function emptyUsuario(): Usuario {
  return {
    nomeCompleto: '',
    dataNascimento: '',
    telefone: '',
    email: '',
    sexoBiologico: '',
    cidadeBairro: '',
    possuiPlano: '',
    nomePlano: '',
    alergias: '',
    comorbidades: '',
    medicamentos: '',
    termosAceitos: false,
    receberNotificacoes: false,
    contaCriadaEm: '',
  }
}

const STORAGE_KEY = 'triagem_app_usuario'
const GUEST_KEY = 'triagem_app_convidado'

export const UserStorage = {
  get(): Usuario | null {
    if (typeof window === 'undefined') return null
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Usuario) : null
  },
  save(data: Usuario) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    window.localStorage.removeItem(GUEST_KEY)
  },
  clear() {
    window.localStorage.removeItem(STORAGE_KEY)
    window.localStorage.removeItem(GUEST_KEY)
  },
  setGuest() {
    window.localStorage.setItem(GUEST_KEY, '1')
  },
  isGuest(): boolean {
    return window.localStorage.getItem(GUEST_KEY) === '1'
  },
}

/** Calcula idade a partir de uma data no formato DD/MM/AAAA. */
export function calcAge(dobStr: string): number | null {
  const parts = dobStr.split('/')
  if (parts.length !== 3) return null
  const [d, m, y] = parts.map(Number)
  if (!d || !m || !y) return null
  const birth = new Date(y, m - 1, d)
  if (Number.isNaN(birth.getTime())) return null
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--
  return age
}

/** Formata uma data ISO como "mês/ano" (ex: "jan/2025"). */
export function formatMonthYear(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
  return `${meses[d.getMonth()]}/${d.getFullYear()}`
}

/** Formata a data de hoje como DD/MM/AAAA. */
export function formatTodayDate(): string {
  const d = new Date()
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}/${d.getFullYear()}`
}

// ─── Histórico de triagens ──────────────────────────────────────────────────
// Só é gravado quando o usuário tem conta (ver ResultScreen, em Flow2.tsx).
// Uso anônimo/convidado nunca grava nada aqui.

export interface TriageHistoryEntry {
  id: string
  date: string // DD/MM/AAAA
  symptom: string
  level: RiskLevel
  classification: string // rótulo curto exibido na lista (ex: "UBS", "UPA")
  reasons: string[]
  answers: TriageAnswers
}

const HISTORY_KEY = 'triagem_app_historico'

export const HistoryStorage = {
  getAll(): TriageHistoryEntry[] {
    if (typeof window === 'undefined') return []
    const raw = window.localStorage.getItem(HISTORY_KEY)
    return raw ? (JSON.parse(raw) as TriageHistoryEntry[]) : []
  },
  add(entry: TriageHistoryEntry) {
    const all = HistoryStorage.getAll()
    // Evita duplicata: mesma classificação + mesmas respostas registradas
   // nos últimos 5 segundos é considerada a mesma triagem.
   const isDuplicate = all[0]
     && all[0].level === entry.level
     && JSON.stringify(all[0].answers) === JSON.stringify(entry.answers)
     && Date.now() - Number(all[0].id) < 5000
   if (isDuplicate) return
    all.unshift(entry) // mais recente primeiro
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(all))
  },
  clear() {
    window.localStorage.removeItem(HISTORY_KEY)
  },
}