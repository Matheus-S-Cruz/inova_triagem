// ─── Máscaras de formatação para inputs ────────────────────────────────────
// Funções puras: recebem o valor bruto digitado e devolvem o valor já
// formatado, adicionando barras/parênteses/hífen progressivamente conforme
// o usuário digita, e limitando os valores fora de faixa.

const CURRENT_YEAR = new Date().getFullYear() // usado como teto para o ano

/**
 * Formata progressivamente uma data como DD/MM/AAAA.
 * - Dia: limitado entre 01 e 31
 * - Mês: limitado entre 01 e 12
 * - Ano: não pode passar do ano atual (ex: 2026)
 */
export function formatDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8) // DDMMAAAA — só dígitos

  let day = digits.slice(0, 2)
  let month = digits.slice(2, 4)
  let year = digits.slice(4, 8)

  if (day.length === 2) {
    const d = parseInt(day, 10)
    if (d < 1) day = '01'
    if (d > 31) day = '31'
  }

  if (month.length === 2) {
    const m = parseInt(month, 10)
    if (m < 1) month = '01'
    if (m > 12) month = '12'
  }

  if (year.length === 4) {
    const y = parseInt(year, 10)
    if (y > CURRENT_YEAR) year = String(CURRENT_YEAR)
  }

  let result = day
  if (month) result += '/' + month
  if (year) result += '/' + year
  return result
}

/**
 * Formata progressivamente um telefone celular brasileiro como
 * (DD) 9XXXX-XXXX, adicionando parênteses e hífen conforme o usuário digita.
 */
export function formatPhoneInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11) // DD + 9 dígitos
  if (digits.length === 0) return ''

  const ddd = digits.slice(0, 2)
  let result = '(' + ddd

  if (digits.length > 2) {
    result += ') '
    const rest = digits.slice(2)
    result += rest.length > 5
      ? rest.slice(0, rest.length - 4) + '-' + rest.slice(rest.length - 4)
      : rest
  }

  return result
}