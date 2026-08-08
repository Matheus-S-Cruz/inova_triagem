// ─── Persistência local de usuário ─────────────────────────────────────────
// Espelha o objeto aceito/retornado pelo backend Spring Boot em
// backend/src/main/java/com/triagem/backend/model/Usuario.java — os nomes
// dos campos são os mesmos de propósito, para que trocar localStorage por
// chamadas à API (ver backend/README.md) seja só trocar esta camada, sem
// mexer nas telas.

import type { RiskLevel, TriageAnswers } from './triage'

export interface Usuario {
  id: string
  nomeCompleto: string
  dataNascimento: string // DD/MM/AAAA
  telefone: string
  email: string
  senha: string
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
    id: '',
    nomeCompleto: '',
    dataNascimento: '',
    telefone: '',
    email: '',
    senha: '',
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

function generateUserId(): string {
  return `u_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}


const USERS_KEY = 'triagem_app_usuarios' // lista de todas as contas cadastradas
const GUEST_KEY = 'triagem_app_convidado'
const SESSION_KEY = 'triagem_app_sessao'

function getAllUsers(): Usuario[] {
  if (typeof window === 'undefined') return []
  const raw = window.localStorage.getItem(USERS_KEY)
  return raw ? (JSON.parse(raw) as Usuario[]) : []
}

function saveAllUsers(users: Usuario[]) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

/** Resultado de operações que podem ser recusadas por duplicidade de conta. */
export type SaveUserResult = { ok: true } | { ok: false; error: string }

export const UserStorage = {
  /** Retorna a conta atualmente logada nesta aba (ou null). */
  get(): Usuario | null {
    if (typeof window === 'undefined') return null
    const sessionId = window.localStorage.getItem(SESSION_KEY)
    if (!sessionId) return null
    return getAllUsers().find((u) => u.id === sessionId) ?? null
  },
  /**
   * Verifica se e-mail ou telefone já pertencem a OUTRA conta, sem salvar
   * nada. Permite ao Cadastro avisar o usuário antes de avançar de etapa
   * (ex: logo após preencher Telefone/E-mail no step 1), em vez de só no
   * fim do fluxo. save() reaproveita esta mesma checagem como garantia final.
   */
  checkDuplicate(data: Usuario): SaveUserResult {
    const users = getAllUsers()
    const emailClean = data.email.trim().toLowerCase()
    const phoneDigits = data.telefone.replace(/\D/g, '')
    const duplicate = users.find((u) => {
      if (u.id === data.id) return false // não compara consigo mesma (edição de perfil)
      const sameEmail = !!emailClean && u.email.trim().toLowerCase() === emailClean
      const samePhone = !!phoneDigits && u.telefone.replace(/\D/g, '') === phoneDigits
      return sameEmail || samePhone
    })
    if (!duplicate) return { ok: true }
    const sameEmail = !!emailClean && duplicate.email.trim().toLowerCase() === emailClean
    return {
      ok: false,
      error: sameEmail
        ? 'Já existe uma conta cadastrada com este e-mail.'
        : 'Já existe uma conta cadastrada com este telefone.',
    }
  },
  /**
   * Cria ou atualiza uma conta na lista e já loga com ela.
   * Recusa a operação se e-mail ou telefone já pertencerem a OUTRA conta.
   */
  save(data: Usuario): SaveUserResult {
    const withId = data.id ? data : { ...data, id: generateUserId() }

    const dup = UserStorage.checkDuplicate(withId)
    if (!dup.ok) return dup

    const users = getAllUsers()
    const idx = users.findIndex((u) => u.id === withId.id)
    if (idx >= 0) {
      users[idx] = withId
    } else {
      users.push(withId)
    }
    saveAllUsers(users)
    window.localStorage.removeItem(GUEST_KEY)
    window.localStorage.setItem(SESSION_KEY, withId.id) // cadastrar já loga com essa conta
    return { ok: true }
  },
  /** Apaga só a conta logada e todos os dados dela — não afeta outras contas. */
  deleteAccount() {
    const account = UserStorage.get()
    if (!account) return
    const users = getAllUsers().filter((u) => u.id !== account.id)
    saveAllUsers(users)
    window.localStorage.removeItem(SESSION_KEY)
    HistoryStorage.clear(account.id)
  },
  /** Login real: confere e-mail/telefone + senha contra a conta salva. */
  login(identifier: string, senha: string): Usuario | null {
   
    
    const idClean = identifier.trim().toLowerCase()
    const idDigits = identifier.replace(/\D/g, '')
    const account = getAllUsers().find((account) =>
      (!!account.email && account.email.toLowerCase() === idClean) ||
      (!!account.telefone && !!idDigits && account.telefone.replace(/\D/g, '') === idDigits)
    )
    if (account && account.senha === senha) {
      window.localStorage.setItem(SESSION_KEY, account.id)
      return account
    }
    return null
  },
  /** Só encerra a sessão — a conta continua salva pra próximo login. */
  logout() {
    window.localStorage.removeItem(SESSION_KEY)
  },
  /** Existe sessão ativa? (usuário logado agora, na aba atual) */
  isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false
    return !!window.localStorage.getItem(SESSION_KEY)
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
function historyKey(userId: string) {
   return `${HISTORY_KEY}_${userId}`
 }

export const HistoryStorage = {
    getAll(userId: string): TriageHistoryEntry[] {
    if (typeof window === 'undefined' || !userId) return []
    const raw = window.localStorage.getItem(historyKey(userId))
    return raw ? (JSON.parse(raw) as TriageHistoryEntry[]) : []
  },
  add(entry: TriageHistoryEntry, userId: string) {
    if (!userId) return
    const all = HistoryStorage.getAll(userId)
    // Evita duplicata: mesma classificação + mesmas respostas registradas
   // nos últimos 5 segundos é considerada a mesma triagem.
   const isDuplicate = all[0]
     && all[0].level === entry.level
     && JSON.stringify(all[0].answers) === JSON.stringify(entry.answers)
     && Date.now() - Number(all[0].id) < 5000
   if (isDuplicate) return
    all.unshift(entry) // mais recente primeiro
    window.localStorage.setItem(historyKey(userId), JSON.stringify(all))
  },
  clear(userId: string) {
    if (!userId) return
    window.localStorage.removeItem(historyKey(userId))
  },
}