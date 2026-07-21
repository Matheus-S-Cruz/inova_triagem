import { useState } from 'react'
import type { Navigate } from '../App'
import {
  NavBar, Btn, Field, OptionItem, CheckboxItem,
  SectionTitle, Divider, A11yNote,
  ScreenWrap, Content, ListRow,
} from '../components/Wire'

// ─── 9. Cadastro ──────────────────────────────────────────────────────────────

export function RegisterScreen({ navigate }: { navigate: Navigate }) {
  const [hasPlan, setHasPlan] = useState<'sim' | 'nao' | null>(null)
  const [sex, setSex] = useState<string | null>(null)

  return (
    <ScreenWrap>
      <NavBar title="Criar Conta" onBack={() => navigate('home')} />
      <Content>
        <div style={{ fontSize: 12, color: '#888', marginBottom: 16, backgroundColor: '#f5f5f5', padding: '8px 10px', borderRadius: 6 }}>
          ℹ Cadastro opcional. Permite salvar histórico e pré-preencher triagens futuras.
        </div>

        <SectionTitle>Dados Pessoais</SectionTitle>
        <Field label="Nome completo" placeholder="Ex: Maria Aparecida Silva" />
        <Field label="Data de nascimento" placeholder="DD/MM/AAAA" />
        <Field label="Telefone" placeholder="(11) 9 0000-0000" hint="Para receber confirmações" />
        <Field label="E-mail" placeholder="nome@email.com" hint="Opcional" />

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#555', marginBottom: 6, fontFamily: 'monospace' }}>
            SEXO BIOLÓGICO
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Feminino', 'Masculino', 'Outro'].map(s => (
              <button
                key={s}
                onClick={() => setSex(s)}
                style={{
                  flex: 1, padding: '8px 4px', border: '1.5px solid',
                  borderColor: sex === s ? '#444' : '#ccc',
                  borderRadius: 6, backgroundColor: sex === s ? '#f0f0f0' : '#fff',
                  fontSize: 11, cursor: 'pointer', fontFamily: 'system-ui',
                  color: '#333',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <Field label="Cidade / Bairro" placeholder="Ex: São Paulo — Vila Mariana" />

        <Divider />
        <SectionTitle>Plano de Saúde</SectionTitle>
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <OptionItem label="Sim" selected={hasPlan === 'sim'} onClick={() => setHasPlan('sim')} />
            <OptionItem label="Não" selected={hasPlan === 'nao'} onClick={() => setHasPlan('nao')} />
          </div>
          {hasPlan === 'sim' && (
            <Field label="Qual plano?" placeholder="Ex: Unimed, Bradesco Saúde, Amil..." />
          )}
        </div>

        <Divider />
        <SectionTitle>Saúde</SectionTitle>
        <Field label="Alergias conhecidas" placeholder="Ex: Penicilina, dipirona, amendoim..." hint="Deixe em branco se não houver" />
        <Field label="Comorbidades / doenças crônicas" placeholder="Ex: Diabetes tipo 2, hipertensão, asma..." hint="Deixe em branco se não houver" />
        <Field label="Medicamentos de uso contínuo" placeholder="Ex: Metformina 850mg, losartana 50mg..." hint="Deixe em branco se não houver" />

        <Divider />

        <div style={{ marginBottom: 16 }}>
          <CheckboxItem
            label="Concordo com os Termos de Uso e Política de Privacidade (LGPD)"
            note="Obrigatório para criar conta"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Btn label="Criar conta" onClick={() => navigate('profile')} variant="primary" />
          <Btn label="Continuar sem cadastro" onClick={() => navigate('lgpd')} variant="ghost" />
        </div>

        <A11yNote notes={[
          'Campos com labels explícitas — sem placeholder como único rótulo',
          'Erros de validação exibidos abaixo do campo com ícone e texto',
          'Senha (não mostrada) deve ter indicador de força acessível por leitor de tela',
        ]} />
      </Content>
    </ScreenWrap>
  )
}

// ─── 10. Perfil do Usuário ────────────────────────────────────────────────────

export function ProfileScreen({ navigate }: { navigate: Navigate }) {
  const [editing, setEditing] = useState(false)

  return (
    <ScreenWrap>
      <NavBar
        title="Meu Perfil"
        onBack={() => navigate('home')}
        right={
          <button
            onClick={() => setEditing(!editing)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#555', fontFamily: 'monospace' }}
          >
            {editing ? 'Salvar' : 'Editar'}
          </button>
        }
      />
      <Content>
        {/* Avatar placeholder */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%', backgroundColor: '#ddd',
            border: '2px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, color: '#999',
          }}>
            👤
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>Maria A. Silva</div>
            <div style={{ fontSize: 12, color: '#888', fontFamily: 'monospace' }}>Conta criada em jan/2025</div>
            {editing && (
              <button style={{ fontSize: 11, color: '#555', marginTop: 4, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
                Alterar foto
              </button>
            )}
          </div>
        </div>

        <SectionTitle>Dados Pessoais</SectionTitle>
        {editing ? (
          <>
            <Field label="Nome completo" placeholder="Maria Aparecida Silva" />
            <Field label="Data de nascimento" placeholder="12/03/1985" />
            <Field label="Telefone" placeholder="(11) 9 8765-4321" />
            <Field label="Cidade / Bairro" placeholder="São Paulo — Vila Mariana" />
          </>
        ) : (
          <div style={{ backgroundColor: '#fafafa', border: '1px solid #e8e8e8', borderRadius: 8, overflow: 'hidden', marginBottom: 14 }}>
            {[
              { label: 'Nome', value: 'Maria Aparecida Silva' },
              { label: 'Nascimento', value: '12/03/1985 · 40 anos' },
              { label: 'Sexo', value: 'Feminino' },
              { label: 'Telefone', value: '(11) 9 8765-4321' },
              { label: 'E-mail', value: 'maria.silva@email.com' },
              { label: 'Bairro', value: 'Vila Mariana — SP' },
            ].map(({ label, value }, i) => (
              <div
                key={label}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 12px', borderBottom: i < 5 ? '1px solid #f0f0f0' : 'none',
                }}
              >
                <span style={{ fontSize: 11, color: '#888', fontFamily: 'monospace' }}>{label}</span>
                <span style={{ fontSize: 13, color: '#222' }}>{value}</span>
              </div>
            ))}
          </div>
        )}

        <Divider />
        <SectionTitle>Saúde</SectionTitle>
        <div style={{ backgroundColor: '#fafafa', border: '1px solid #e8e8e8', borderRadius: 8, overflow: 'hidden', marginBottom: 14 }}>
          {[
            { label: 'Plano de saúde', value: 'Unimed Paulistana' },
            { label: 'Alergias', value: 'Dipirona' },
            { label: 'Comorbidades', value: 'Hipertensão arterial' },
            { label: 'Medicamentos', value: 'Losartana 50mg (1x/dia)' },
          ].map(({ label, value }, i) => (
            <div
              key={label}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                padding: '10px 12px', borderBottom: i < 3 ? '1px solid #f0f0f0' : 'none', gap: 12,
              }}
            >
              <span style={{ fontSize: 11, color: '#888', fontFamily: 'monospace', flexShrink: 0 }}>{label}</span>
              <span style={{ fontSize: 12, color: '#222', textAlign: 'right' }}>{value}</span>
            </div>
          ))}
        </div>

        <Divider />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Btn label="Ver histórico de triagens" onClick={() => navigate('history')} variant="secondary" />
          <Btn label="Iniciar nova triagem" onClick={() => navigate('lgpd')} variant="primary" />
          <Btn label="Sair da conta" onClick={() => navigate('home')} variant="ghost" />
        </div>

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
            <div style={{ fontSize: 12, color: '#888', marginBottom: 14, fontFamily: 'monospace' }}>
              {HISTORY_ITEMS.length} triagens realizadas
            </div>

            {HISTORY_ITEMS.map(item => (
              <ListRow key={item.id} onClick={() => setSelected(item.id)}>
                {/* Date badge */}
                <div style={{
                  width: 44, height: 44, borderRadius: 8, backgroundColor: '#f0f0f0',
                  border: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#333', lineHeight: 1 }}>
                    {item.date.slice(0, 2)}
                  </div>
                  <div style={{ fontSize: 9, color: '#888', fontFamily: 'monospace' }}>
                    {['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'][parseInt(item.date.slice(3, 5)) - 1]}
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 3 }}>
                    {item.symptom}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, fontFamily: 'monospace',
                      color: '#fff', backgroundColor: RISK_COLORS[item.classification] || '#555',
                      borderRadius: 4, padding: '1px 6px',
                    }}>
                      {item.classification}
                    </span>
                    <span style={{ fontSize: 10, color: '#aaa', fontFamily: 'monospace' }}>
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
        color: '#555', fontFamily: 'monospace', marginBottom: 14, padding: 0,
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        ← Voltar ao histórico
      </button>

      <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>
        Triagem de {item.date}
      </div>

      <div style={{ marginBottom: 12 }}>
        <span style={{
          fontSize: 11, fontWeight: 700, fontFamily: 'monospace', color: '#fff',
          backgroundColor: RISK_COLORS[item.classification] || '#555',
          borderRadius: 4, padding: '2px 8px',
        }}>
          {item.classification}
        </span>
      </div>

      <Divider />
      <SectionTitle>Respostas Registradas</SectionTitle>
      <div style={{ backgroundColor: '#fafafa', border: '1px solid #e8e8e8', borderRadius: 8, overflow: 'hidden', marginBottom: 14 }}>
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
            borderBottom: i < arr.length - 1 ? '1px solid #f0f0f0' : 'none',
          }}>
            <span style={{ fontSize: 11, color: '#888', fontFamily: 'monospace' }}>{label}</span>
            <span style={{ fontSize: 12, color: '#222' }}>{value}</span>
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
