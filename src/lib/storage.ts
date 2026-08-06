// ─── Persistência local de usuário ─────────────────────────────────────────
// Espelha o objeto aceito/retornado pelo backend Spring Boot em
// backend/src/main/java/com/triagem/backend/model/Usuario.java — os nomes
// dos campos são os mesmos de propósito, para que trocar localStorage por
// chamadas à API (ver backend/README.md) seja só trocar esta camada, sem
// mexer nas telas.

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
