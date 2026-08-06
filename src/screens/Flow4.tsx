import { useState } from 'react'
import type { Navigate } from '../App'
import {
  NavBar, Btn, Field, OptionItem, CheckboxItem,
  SectionTitle, BodyText, Divider, A11yNote,
  ScreenWrap, Content, ListRow,
} from '../components/Wire'
import { UserStorage, emptyUsuario, calcAge, formatMonthYear, type Usuario } from '../lib/storage'

// ─── 9. Cadastro ──────────────────────────────────────────────────────────────
// Portado da branch FrontEnd (index.html standalone): fluxo em 2 etapas
// (dados pessoais → saúde/termos), com validação e persistência real.

export function RegisterScreen({ navigate }: { navigate: Navigate }) {
  const [step, setStep] = useState<1 | 2>(1)
  const [form, setForm] = useState<Usuario>(emptyUsuario())
  const [nomeError, setNomeError] = useState('')
  const [telefoneError, setTelefoneError] = useState('')
  const [termosError, setTermosError] = useState(false)

  const update = (key: keyof Usuario) => (value: string) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const handleGuest = () => {
    UserStorage.setGuest()
    navigate('lgpd')
  }

  const validateStep1 = () => {
    let ok = true
    if (!form.nomeCompleto.trim()) {
      setNomeError('Informe seu nome completo')
      ok = false
    } else {
      setNomeError('')
    }
    if (!form.telefone.trim()) {
      setTelefoneError('Informe um telefone para contato')
      ok = false
    } else {
      setTelefoneError('')
    }
    return ok
  }

  const handleContinue = () => {
    if (validateStep1()) setStep(2)
  }

  const handleCriarConta = () => {
    if (!form.termosAceitos) {
      setTermosError(true)
      return
    }
    setTermosError(false)
    UserStorage.save({ ...form, contaCriadaEm: new Date().toISOString() })
    navigate('profile')
  }

  if (step === 2) {
    return (
      <ScreenWrap>
        <NavBar title="Criar Conta" onBack={() => setStep(1)} />
        <Content>
          <SectionTitle>Saúde</SectionTitle>
          <Field
            label="Alergias conhecidas" placeholder="Ex: Penicilina, dipirona, amendoim..." hint="Deixe em branco se não houver"
            value={form.alergias} onChange={update('alergias')}
          />
          <Field
            label="Comorbidades / doenças crônicas" placeholder="Ex: Diabetes tipo 2, hipertensão, asma..." hint="Deixe em branco se não houver"
            value={form.comorbidades} onChange={update('comorbidades')}
          />
          <Field
            label="Medicamentos de uso contínuo" placeholder="Ex: Metformina 850mg, losartana 50mg..." hint="Deixe em branco se não houver"
            value={form.medicamentos} onChange={update('medicamentos')}
          />

          <Divider />

          <div onClick={() => setForm(prev => ({ ...prev, termosAceitos: !prev.termosAceitos }))} style={{ cursor: 'pointer', marginBottom: 4 }}>
            <CheckboxItem
              label="Concordo com os Termos de Uso e Política de Privacidade (LGPD)"
              checked={form.termosAceitos}
              note="Obrigatório para criar conta"
            />
          </div>
          {termosError && (
            <div style={{ fontSize: 11, color: '#DC2626', marginBottom: 12, fontFamily: 'Inter, system-ui, sans-serif' }}>
              ⚠ É preciso aceitar os termos para continuar
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
            <Btn label="Criar conta" onClick={handleCriarConta} variant="primary" />
            <Btn label="Continuar sem cadastro" onClick={handleGuest} variant="ghost" />
          </div>

          <A11yNote notes={[
            'Campos com labels explícitas — sem placeholder como único rótulo',
            'Erros de validação exibidos abaixo do campo com ícone e texto',
          ]} />
        </Content>
      </ScreenWrap>
    )
  }

  return (
    <ScreenWrap>
      <NavBar title="Criar Conta" onBack={() => navigate('home')} />
      <Content>
        <div style={{ fontSize: 12, color: '#7C93A6', marginBottom: 16, backgroundColor: '#EFF5F9', padding: '8px 10px', borderRadius: 6 }}>
          ℹ Cadastro opcional. Permite salvar histórico e pré-preencher triagens futuras.
        </div>

        <SectionTitle>Dados Pessoais</SectionTitle>
        <Field
          label="Nome completo" placeholder="Ex: Maria Aparecida Silva" required
          value={form.nomeCompleto} onChange={update('nomeCompleto')} error={nomeError}
        />
        <Field
          label="Data de nascimento" placeholder="DD/MM/AAAA"
          value={form.dataNascimento} onChange={update('dataNascimento')}
        />
        <Field
          label="Telefone" placeholder="(11) 9 0000-0000" hint="Para receber confirmações" required type="tel"
          value={form.telefone} onChange={update('telefone')} error={telefoneError}
        />
        <Field
          label="E-mail" placeholder="nome@email.com" hint="Opcional" type="email"
          value={form.email} onChange={update('email')}
        />

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#4E6A80', marginBottom: 6, fontFamily: 'Inter, system-ui, sans-serif' }}>
            SEXO BIOLÓGICO
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Feminino', 'Masculino', 'Outro'].map(s => (
              <button
                key={s}
                onClick={() => setForm(prev => ({ ...prev, sexoBiologico: s }))}
                style={{
                  flex: 1, padding: '8px 4px', border: '1.5px solid',
                  borderColor: form.sexoBiologico === s ? '#3A5468' : '#C6D5E0',
                  borderRadius: 6, backgroundColor: form.sexoBiologico === s ? '#EAF2F6' : '#fff',
                  fontSize: 11, cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif',
                  color: '#155E8A',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <Field
          label="Cidade / Bairro" placeholder="Ex: São Paulo — Vila Mariana"
          value={form.cidadeBairro} onChange={update('cidadeBairro')}
        />

        <Divider />
        <SectionTitle>Plano de Saúde</SectionTitle>
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <OptionItem label="Sim" selected={form.possuiPlano === 'Sim'} onClick={() => setForm(prev => ({ ...prev, possuiPlano: 'Sim' }))} />
            <OptionItem label="Não" selected={form.possuiPlano === 'Não'} onClick={() => setForm(prev => ({ ...prev, possuiPlano: 'Não' }))} />
          </div>
          {form.possuiPlano === 'Sim' && (
            <Field
              label="Qual plano?" placeholder="Ex: Unimed, Bradesco Saúde, Amil..."
              value={form.nomePlano} onChange={update('nomePlano')}
            />
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
          <Btn label="Continuar" onClick={handleContinue} variant="primary" />
          <Btn label="Continuar sem cadastro" onClick={handleGuest} variant="ghost" />
        </div>

        <A11yNote notes={[
          'Campos com labels explícitas — sem placeholder como único rótulo',
          'Erros de validação exibidos abaixo do campo com ícone e texto',
        ]} />
      </Content>
    </ScreenWrap>
  )
}

// ─── 10. Perfil do Usuário ────────────────────────────────────────────────────

export function ProfileScreen({ navigate }: { navigate: Navigate }) {
  const [saved, setSaved] = useState<Usuario | null>(() => UserStorage.get())
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<Usuario | null>(saved)
  const [justSaved, setJustSaved] = useState(false)

  const update = (key: keyof Usuario) => (value: string) =>
    setForm(prev => (prev ? { ...prev, [key]: value } : prev))

  const startEdit = () => {
    setForm(saved)
    setEditing(true)
  }

  const handleSave = () => {
    if (!form) return
    UserStorage.save(form)
    setSaved(form)
    setEditing(false)
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 2000)
  }

  const handleLogout = () => {
    UserStorage.clear()
    navigate('home')
  }

  // Sem conta salva (uso anônimo) — convida a criar conta.
  if (!saved) {
    return (
      <ScreenWrap>
        <NavBar title="Meu Perfil" onBack={() => navigate('home')} />
        <Content>
          <div style={{ textAlign: 'center', paddingTop: 48 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>👤</div>
            <BodyText>
              Você está usando o app sem cadastro. Seus dados de triagem não serão salvos para a próxima visita.
            </BodyText>
            <div style={{ marginTop: 16 }}>
              <Btn label="Criar conta agora" onClick={() => navigate('register')} variant="primary" />
            </div>
          </div>
        </Content>
      </ScreenWrap>
    )
  }

  const idade = saved.dataNascimento ? calcAge(saved.dataNascimento) : null
  const criadoEm = saved.contaCriadaEm ? formatMonthYear(saved.contaCriadaEm) : '—'

  return (
    <ScreenWrap>
      <NavBar
        title="Meu Perfil"
        onBack={() => navigate('home')}
        right={
          <button
            onClick={() => (editing ? handleSave() : startEdit())}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#4E6A80', fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {editing ? 'Salvar' : 'Editar'}
          </button>
        }
      />
      <Content>
        {justSaved && (
          <div style={{
            backgroundColor: '#f0fdf4', border: '1.5px solid #16a34a',
            borderRadius: 6, padding: '8px 12px', marginBottom: 12,
            fontSize: 12, color: '#15803d', textAlign: 'center',
          }}>
            ✓ Alterações salvas
          </div>
        )}

        {/* Avatar placeholder */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%', backgroundColor: '#D7E3EC',
            border: '2px solid #C6D5E0', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, color: '#8CA1B2',
          }}>
            👤
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0F2A4A' }}>{saved.nomeCompleto || 'Sem nome'}</div>
            <div style={{ fontSize: 12, color: '#7C93A6', fontFamily: 'Inter, system-ui, sans-serif' }}>Conta criada em {criadoEm}</div>
          </div>
        </div>

        <SectionTitle>Dados Pessoais</SectionTitle>
        {editing && form ? (
          <>
            <Field label="Nome completo" value={form.nomeCompleto} onChange={update('nomeCompleto')} />
            <Field label="Data de nascimento" placeholder="DD/MM/AAAA" value={form.dataNascimento} onChange={update('dataNascimento')} />
            <Field label="Telefone" type="tel" value={form.telefone} onChange={update('telefone')} />
            <Field label="E-mail" type="email" value={form.email} onChange={update('email')} />
            <Field label="Cidade / Bairro" value={form.cidadeBairro} onChange={update('cidadeBairro')} />
          </>
        ) : (
          <div style={{ backgroundColor: '#F5F9FB', border: '1px solid #E3EDF3', borderRadius: 8, overflow: 'hidden', marginBottom: 14 }}>
            {[
              { label: 'Nome', value: saved.nomeCompleto || '—' },
              { label: 'Nascimento', value: saved.dataNascimento ? `${saved.dataNascimento}${idade !== null ? ` · ${idade} anos` : ''}` : '—' },
              { label: 'Sexo', value: saved.sexoBiologico || '—' },
              { label: 'Telefone', value: saved.telefone || '—' },
              { label: 'E-mail', value: saved.email || '—' },
              { label: 'Bairro', value: saved.cidadeBairro || '—' },
            ].map(({ label, value }, i, arr) => (
              <div
                key={label}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 12px', borderBottom: i < arr.length - 1 ? '1px solid #EAF2F6' : 'none',
                }}
              >
                <span style={{ fontSize: 11, color: '#7C93A6', fontFamily: 'Inter, system-ui, sans-serif' }}>{label}</span>
                <span style={{ fontSize: 13, color: '#16324F' }}>{value}</span>
              </div>
            ))}
          </div>
        )}

        <Divider />
        <SectionTitle>Saúde</SectionTitle>
        {editing && form ? (
          <>
            <Field label="Alergias conhecidas" value={form.alergias} onChange={update('alergias')} />
            <Field label="Comorbidades / doenças crônicas" value={form.comorbidades} onChange={update('comorbidades')} />
            <Field label="Medicamentos de uso contínuo" value={form.medicamentos} onChange={update('medicamentos')} />
          </>
        ) : (
          <div style={{ backgroundColor: '#F5F9FB', border: '1px solid #E3EDF3', borderRadius: 8, overflow: 'hidden', marginBottom: 14 }}>
            {[
              { label: 'Plano de saúde', value: saved.possuiPlano === 'Sim' ? (saved.nomePlano || 'Sim') : 'Não informado' },
              { label: 'Alergias', value: saved.alergias || 'Nenhuma informada' },
              { label: 'Comorbidades', value: saved.comorbidades || 'Nenhuma informada' },
              { label: 'Medicamentos', value: saved.medicamentos || 'Nenhum informado' },
            ].map(({ label, value }, i, arr) => (
              <div
                key={label}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                  padding: '10px 12px', borderBottom: i < arr.length - 1 ? '1px solid #EAF2F6' : 'none', gap: 12,
                }}
              >
                <span style={{ fontSize: 11, color: '#7C93A6', fontFamily: 'Inter, system-ui, sans-serif', flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: 12, color: '#16324F', textAlign: 'right' }}>{value}</span>
              </div>
            ))}
          </div>
        )}

        <Divider />

        {editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Btn label="Salvar alterações" onClick={handleSave} variant="primary" />
            <Btn label="Cancelar" onClick={() => setEditing(false)} variant="ghost" />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Btn label="Ver histórico de triagens" onClick={() => navigate('history')} variant="secondary" />
            <Btn label="Iniciar nova triagem" onClick={() => navigate('lgpd')} variant="primary" />
            <Btn label="Sair da conta" onClick={handleLogout} variant="ghost" />
          </div>
        )}

        <A11yNote notes={[
          'Modo de edição com feedback visual claro (border ativo nos campos)',
          'Dados sensíveis de saúde com campo "Visibilidade" para ocultar em tela',
        ]} />
      </Content>
    </ScreenWrap>
  )
}

// ─── 11. Histórico de Triagens ────────────────────────────────────────────────

const RISK_COLORS: Record<string, string> = {
  Emergência: '#dc2626', UPA: '#ea580c', Prioritário: '#ca8a04',
  UBS: '#16a34a', 'Em casa': '#2563eb',
}

const HISTORY_ITEMS = [
  { id: 1, date: '07/07/2025', symptom: 'Febre e dor de cabeça', classification: 'UBS', level: 'green' as const },
  { id: 2, date: '21/05/2025', symptom: 'Falta de ar', classification: 'UPA', level: 'orange' as const },
  { id: 3, date: '03/03/2025', symptom: 'Dor abdominal', classification: 'Prioritário', level: 'yellow' as const },
  { id: 4, date: '15/01/2025', symptom: 'Tosse e coriza', classification: 'Em casa', level: 'blue' as const },
]

export function HistoryScreen({ navigate }: { navigate: Navigate }) {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <ScreenWrap>
      <NavBar title="Histórico de Triagens" onBack={() => navigate('profile')} />
      <Content>
        {selected !== null ? (
          // Detail view
          <HistoryDetail item={HISTORY_ITEMS.find(h => h.id === selected)!} onBack={() => setSelected(null)} navigate={navigate} />
        ) : (
          // List view
          <>
            <div style={{ fontSize: 12, color: '#7C93A6', marginBottom: 14, fontFamily: 'Inter, system-ui, sans-serif' }}>
              {HISTORY_ITEMS.length} triagens realizadas
            </div>

            {HISTORY_ITEMS.map(item => (
              <ListRow key={item.id} onClick={() => setSelected(item.id)}>
                {/* Date badge */}
                <div style={{
                  width: 44, height: 44, borderRadius: 8, backgroundColor: '#EAF2F6',
                  border: '1px solid #DCE7EF', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#155E8A', lineHeight: 1 }}>
                    {item.date.slice(0, 2)}
                  </div>
                  <div style={{ fontSize: 9, color: '#7C93A6', fontFamily: 'Inter, system-ui, sans-serif' }}>
                    {['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'][parseInt(item.date.slice(3, 5)) - 1]}
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0F2A4A', marginBottom: 3 }}>
                    {item.symptom}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, fontFamily: 'Inter, system-ui, sans-serif',
                      color: '#fff', backgroundColor: RISK_COLORS[item.classification] || '#4E6A80',
                      borderRadius: 4, padding: '1px 6px',
                    }}>
                      {item.classification}
                    </span>
                    <span style={{ fontSize: 10, color: '#9AAEBE', fontFamily: 'Inter, system-ui, sans-serif' }}>
                      {item.date}
                    </span>
                  </div>
                </div>
              </ListRow>
            ))}

            <div style={{ marginTop: 16 }}>
              <Btn label="Iniciar nova triagem" onClick={() => navigate('lgpd')} variant="primary" />
            </div>

            <A11yNote notes={[
              'Histórico com datas explícitas (não só "há 3 dias")',
              'Classificação comunicada por cor E texto',
            ]} />
          </>
        )}
      </Content>
    </ScreenWrap>
  )
}

function HistoryDetail({ item, onBack, navigate }: {
  item: { id: number; date: string; symptom: string; classification: string; level: 'red' | 'orange' | 'yellow' | 'green' | 'blue' }
  onBack: () => void
  navigate: Navigate
}) {
  return (
    <>
      <button onClick={onBack} style={{
        background: 'none', border: 'none', cursor: 'pointer', fontSize: 13,
        color: '#4E6A80', fontFamily: 'Inter, system-ui, sans-serif', marginBottom: 14, padding: 0,
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        ← Voltar ao histórico
      </button>

      <div style={{ fontSize: 15, fontWeight: 700, color: '#0F2A4A', marginBottom: 4 }}>
        Triagem de {item.date}
      </div>

      <div style={{ marginBottom: 12 }}>
        <span style={{
          fontSize: 11, fontWeight: 700, fontFamily: 'Inter, system-ui, sans-serif', color: '#fff',
          backgroundColor: RISK_COLORS[item.classification] || '#4E6A80',
          borderRadius: 4, padding: '2px 8px',
        }}>
          {item.classification}
        </span>
      </div>

      <Divider />
      <SectionTitle>Respostas Registradas</SectionTitle>
      <div style={{ backgroundColor: '#F5F9FB', border: '1px solid #E3EDF3', borderRadius: 8, overflow: 'hidden', marginBottom: 14 }}>
        {[
          { label: 'Sintoma', value: item.symptom },
          { label: 'Duração', value: 'Hoje (6–24h)' },
          { label: 'Febre', value: 'Sim' },
          { label: 'Dor intensa', value: 'Não' },
          { label: 'Piora rápida', value: 'Não' },
          { label: 'Grupo de risco', value: 'Nenhum' },
          { label: 'Medicamentos', value: 'Losartana 50mg' },
        ].map(({ label, value }, i, arr) => (
          <div key={label} style={{
            display: 'flex', justifyContent: 'space-between', padding: '8px 12px',
            borderBottom: i < arr.length - 1 ? '1px solid #EAF2F6' : 'none',
          }}>
            <span style={{ fontSize: 11, color: '#7C93A6', fontFamily: 'Inter, system-ui, sans-serif' }}>{label}</span>
            <span style={{ fontSize: 12, color: '#16324F' }}>{value}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Btn label="Refazer triagem" onClick={() => navigate('lgpd')} variant="primary" />
        <Btn label="Ver unidades próximas" onClick={() => navigate('unitlist')} variant="secondary" />
      </div>
    </>
  )
}
