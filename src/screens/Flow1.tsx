import { useState } from 'react'
import type { Navigate } from '../App'
import {
  NavBar, ProgressBar, Btn, Field, OptionItem, CheckboxItem,
  SectionTitle, BodyText, Divider, A11yNote, ScreenWrap, Content,
} from '../components/Wire'

// ─── 1. Tela Inicial ──────────────────────────────────────────────────────────

export function HomeScreen({ navigate }: { navigate: Navigate }) {
  return (
    <ScreenWrap>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
        {/* Header area */}
        <div style={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0', padding: '32px 24px 24px' }}>
          {/* Logo placeholder */}
          <div style={{
            width: 64, height: 64, backgroundColor: '#ddd', border: '1.5px solid #bbb',
            borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 14, fontSize: 24,
          }}>
            ✚
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.03em' }}>
            Triagem+
          </div>
          <div style={{ fontSize: 12, color: '#777', marginTop: 4, fontFamily: 'monospace' }}>
            Pré-triagem de saúde
          </div>
        </div>

        <Content>
          {/* Intro text */}
          <div style={{ padding: '4px 0 16px' }}>
            <BodyText>
              Relate seus sintomas antes de sair de casa e receba uma recomendação de atendimento.
            </BodyText>
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 8, backgroundColor: '#f5f5f5',
              border: '1px solid #e0e0e0', borderRadius: 6, padding: '8px 10px', marginBottom: 4,
            }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>ℹ</span>
              <span style={{ fontSize: 12, color: '#555', lineHeight: 1.4 }}>
                A triagem pode ser feita de forma anônima, sem necessidade de cadastro ou login.
              </span>
            </div>
          </div>

          <Divider />

          {/* CTA buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
            <Btn label="✚  Iniciar Triagem" onClick={() => navigate('lgpd')} variant="primary" />
            <Btn label="Entrar / Criar Conta" onClick={() => navigate('register')} variant="secondary" />
          </div>

          <Divider />

          {/* Quick access */}
          <SectionTitle>Acesso Rápido</SectionTitle>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { icon: '🗺', label: 'Unidades\npróximas', to: 'map' as const },
              { icon: '📋', label: 'Histórico', to: 'history' as const },
              { icon: '👤', label: 'Perfil', to: 'profile' as const },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => navigate(item.to)}
                style={{
                  flex: 1, border: '1.5px solid #ddd', borderRadius: 8, padding: '10px 4px',
                  backgroundColor: '#fafafa', cursor: 'pointer', textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 20 }}>{item.icon}</div>
                <div style={{ fontSize: 10, color: '#666', marginTop: 4, whiteSpace: 'pre-line', lineHeight: 1.3 }}>{item.label}</div>
              </button>
            ))}
          </div>

          <A11yNote notes={[
            'Contraste alto disponível (modo alto contraste)',
            'Textos em tamanho mínimo 14px nas ações principais',
            'Suporte a leitor de tela (VoiceOver/TalkBack): elementos com aria-label',
          ]} />
        </Content>
      </div>
    </ScreenWrap>
  )
}

// ─── 2. Consentimento LGPD ────────────────────────────────────────────────────

export function LGPDScreen({ navigate }: { navigate: Navigate }) {
  const [agreed, setAgreed] = useState(false)
  return (
    <ScreenWrap>
      <NavBar title="Privacidade e Dados" onBack={() => navigate('home')} />
      <Content>
        <SectionTitle>Uso de Dados de Saúde — LGPD</SectionTitle>
        <div style={{
          backgroundColor: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: 6,
          padding: '12px', marginBottom: 12, fontSize: 12, color: '#444', lineHeight: 1.6,
        }}>
          <p style={{ margin: '0 0 8px' }}>
            <strong>Por que coletamos dados?</strong> Para processar sua triagem e gerar
            recomendações de atendimento. Dados de saúde são considerados sensíveis pela
            LGPD (Lei 13.709/2018) e tratados com proteção reforçada.
          </p>
          <p style={{ margin: '0 0 8px' }}>
            <strong>O que coletamos:</strong> Sintomas relatados, localização aproximada
            (para busca de unidades) e dados de perfil, se fornecidos voluntariamente.
          </p>
          <p style={{ margin: '0 0 8px' }}>
            <strong>Compartilhamento:</strong> Dados nunca são vendidos. Podem ser
            compartilhados anonimamente com a Secretaria de Saúde para fins de
            vigilância epidemiológica.
          </p>
          <p style={{ margin: 0 }}>
            <strong>Triagem anônima:</strong> Se não criar conta, nenhum dado pessoal
            identificável é armazenado após a sessão.
          </p>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div
            onClick={() => setAgreed(!agreed)}
            style={{ cursor: 'pointer' }}
          >
            <CheckboxItem
              label="Li e aceito o uso dos meus dados de saúde para fins de triagem, conforme descrito acima."
              checked={agreed}
            />
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <CheckboxItem label="Desejo receber informações de saúde da Secretaria Municipal (opcional)" />
        </div>

        <div style={{ fontSize: 11, color: '#aaa', fontFamily: 'monospace', marginBottom: 16 }}>
          Ao continuar, você também concorda com os Termos de Uso.
        </div>

        <Btn
          label="Continuar"
          onClick={() => agreed && navigate('q1')}
          variant={agreed ? 'primary' : 'ghost'}
        />

        <A11yNote notes={[
          'Textos de política em tamanho legível (mín. 12px)',
          'Checkbox acessível via teclado e leitor de tela',
        ]} />
      </Content>
    </ScreenWrap>
  )
}

// ─── 3a. Sintoma Principal ────────────────────────────────────────────────────

const SYMPTOMS = [
  'Febre', 'Dor de cabeça', 'Tosse', 'Falta de ar',
  'Dor no peito', 'Vômito / Náusea', 'Diarreia', 'Dor abdominal',
  'Dor no corpo', 'Outros',
]

export function Q1Screen({ navigate }: { navigate: Navigate }) {
  const [selected, setSelected] = useState<string | null>(null)
  return (
    <ScreenWrap>
      <NavBar title="Triagem" onBack={() => navigate('lgpd')} />
      <ProgressBar current={1} total={6} />
      <Content>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>
            Qual é o seu principal sintoma?
          </div>
          <div style={{ fontSize: 12, color: '#888' }}>Selecione o que melhor descreve sua queixa</div>
        </div>

        {SYMPTOMS.map(s => (
          <OptionItem key={s} label={s} selected={selected === s} onClick={() => setSelected(s)} />
        ))}

        <Field label="Ou descreva com suas palavras" placeholder="Ex: dor ao engolir..." />

        <div style={{ marginTop: 8 }}>
          <Btn label="Próxima →" onClick={() => selected && navigate('q2')} variant={selected ? 'primary' : 'ghost'} />
        </div>

        <A11yNote notes={[
          'Lista de opções navegável por leitor de tela com aria-checked',
          'Campo de texto com label explícita associada',
        ]} />
      </Content>
    </ScreenWrap>
  )
}

// ─── 3b. Duração ──────────────────────────────────────────────────────────────

const DURATIONS = [
  'Menos de 6 horas', 'Hoje (6–24h)', '2 a 3 dias', '4 a 7 dias', 'Mais de 1 semana',
]

export function Q2Screen({ navigate }: { navigate: Navigate }) {
  const [selected, setSelected] = useState<string | null>(null)
  return (
    <ScreenWrap>
      <NavBar title="Triagem" onBack={() => navigate('q1')} />
      <ProgressBar current={2} total={6} />
      <Content>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>
            Há quanto tempo o sintoma começou?
          </div>
          <div style={{ fontSize: 12, color: '#888' }}>Considere o início do sintoma principal</div>
        </div>

        {DURATIONS.map(d => (
          <OptionItem key={d} label={d} selected={selected === d} onClick={() => setSelected(d)} />
        ))}

        <div style={{ marginTop: 8 }}>
          <Btn label="Próxima →" onClick={() => selected && navigate('q3')} variant={selected ? 'primary' : 'ghost'} />
        </div>
      </Content>
    </ScreenWrap>
  )
}

// ─── 3c. Febre / Dor / Falta de ar ───────────────────────────────────────────

type YesNo = 'sim' | 'nao' | null

export function Q3Screen({ navigate }: { navigate: Navigate }) {
  const [febre, setFebre] = useState<YesNo>(null)
  const [dor, setDor] = useState<YesNo>(null)
  const [falta, setFalta] = useState<YesNo>(null)

  const allAnswered = febre && dor && falta

  return (
    <ScreenWrap>
      <NavBar title="Triagem" onBack={() => navigate('q2')} />
      <ProgressBar current={3} total={6} />
      <Content>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>
            Sobre seus sintomas agora:
          </div>
          <div style={{ fontSize: 12, color: '#888' }}>Responda cada item com Sim ou Não</div>
        </div>

        {[
          { label: 'Tem febre (acima de 37,8°C)?', val: febre, set: setFebre },
          { label: 'Sente dor intensa (≥7 em 10)?', val: dor, set: setDor },
          { label: 'Tem dificuldade para respirar / falta de ar?', val: falta, set: setFalta },
        ].map(({ label, val, set }) => (
          <div key={label} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#222', marginBottom: 6 }}>{label}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <OptionItem label="Sim" selected={val === 'sim'} onClick={() => set('sim')} />
              <OptionItem label="Não" selected={val === 'nao'} onClick={() => set('nao')} />
            </div>
          </div>
        ))}

        {/* Conditional branch note */}
        {falta === 'sim' && (
          <div style={{
            border: '1.5px dashed #dc2626', borderRadius: 6, padding: '8px 10px',
            backgroundColor: '#fef2f2', marginBottom: 12,
          }}>
            <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#dc2626', fontWeight: 700, marginBottom: 2 }}>
              ↳ PERGUNTA CONDICIONAL
            </div>
            <div style={{ fontSize: 11, color: '#991b1b' }}>
              Falta de ar = Sim → protocolo de urgência respiratória ativado nas próximas perguntas.
            </div>
          </div>
        )}

        <div style={{ marginTop: 8 }}>
          <Btn label="Próxima →" onClick={() => allAnswered && navigate('q4')} variant={allAnswered ? 'primary' : 'ghost'} />
        </div>
      </Content>
    </ScreenWrap>
  )
}

// ─── 3d. Piora Rápida ─────────────────────────────────────────────────────────

export function Q4Screen({ navigate }: { navigate: Navigate }) {
  const [selected, setSelected] = useState<YesNo>(null)
  return (
    <ScreenWrap>
      <NavBar title="Triagem" onBack={() => navigate('q3')} />
      <ProgressBar current={4} total={6} />
      <Content>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>
            Os sintomas pioraram rapidamente nas últimas horas?
          </div>
          <div style={{ fontSize: 12, color: '#888' }}>
            Ex.: febre que subiu muito, dor que aumentou, nova falta de ar
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          <OptionItem label="Sim — piorou rápido" selected={selected === 'sim'} onClick={() => setSelected('sim')} />
          <OptionItem label="Não — estável ou melhorando" selected={selected === 'nao'} onClick={() => setSelected('nao')} />
        </div>

        {selected === 'sim' && (
          <div style={{
            border: '1.5px dashed #ea580c', borderRadius: 6, padding: '8px 10px',
            backgroundColor: '#fff7ed', marginBottom: 12,
          }}>
            <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#ea580c', fontWeight: 700, marginBottom: 2 }}>
              ↳ PERGUNTA CONDICIONAL
            </div>
            <div style={{ fontSize: 11, color: '#9a3412' }}>
              Piora rápida = Sim → próxima pergunta verifica grupos de risco (idosos, crianças, gestantes).
            </div>
          </div>
        )}

        <Btn label="Próxima →" onClick={() => selected && navigate('q5')} variant={selected ? 'primary' : 'ghost'} />
      </Content>
    </ScreenWrap>
  )
}

// ─── 3e. Grupo Vulnerável ─────────────────────────────────────────────────────

export function Q5Screen({ navigate }: { navigate: Navigate }) {
  const [groups, setGroups] = useState<Record<string, boolean>>({})
  const toggle = (g: string) => setGroups(prev => ({ ...prev, [g]: !prev[g] }))

  const GROUPS = [
    'Criança (menor de 5 anos)',
    'Idoso (60 anos ou mais)',
    'Gestante',
    'Puérpera (até 45 dias após parto)',
    'Imunossuprimido / transplantado',
    'Portador de doença crônica (diabetes, HAS, cardiopatia, DPOC...)',
    'Nenhuma das anteriores',
  ]

  return (
    <ScreenWrap>
      <NavBar title="Triagem" onBack={() => navigate('q4')} />
      <ProgressBar current={5} total={6} />
      <Content>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>
            O paciente pertence a algum grupo de risco?
          </div>
          <div style={{ fontSize: 12, color: '#888' }}>Pode selecionar mais de uma opção</div>
        </div>

        {GROUPS.map(g => (
          <div key={g} onClick={() => toggle(g)} style={{ cursor: 'pointer', marginBottom: 6 }}>
            <CheckboxItem label={g} checked={!!groups[g]} />
          </div>
        ))}

        <div style={{
          border: '1.5px dashed #888', borderRadius: 6, padding: '8px 10px',
          backgroundColor: '#f5f5f5', marginBottom: 12, marginTop: 4,
        }}>
          <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#666', fontWeight: 700, marginBottom: 2 }}>
            ↳ PERGUNTA CONDICIONAL
          </div>
          <div style={{ fontSize: 11, color: '#555' }}>
            Se idoso ou criança selecionados → algoritmo aplica pontuação de risco aumentada.
            Se gestante → encaminhamento preferencial para maternidade.
          </div>
        </div>

        <Btn label="Próxima →" onClick={() => navigate('q6')} variant="primary" />
      </Content>
    </ScreenWrap>
  )
}

// ─── 3f. Medicamentos ─────────────────────────────────────────────────────────

export function Q6Screen({ navigate }: { navigate: Navigate }) {
  const [using, setUsing] = useState<YesNo>(null)
  return (
    <ScreenWrap>
      <NavBar title="Triagem" onBack={() => navigate('q5')} />
      <ProgressBar current={6} total={6} />
      <Content>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>
            Está em uso de algum medicamento?
          </div>
          <div style={{ fontSize: 12, color: '#888' }}>
            Inclua remédios de uso contínuo, automedicação ou fitoterápicos
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          <OptionItem label="Sim" selected={using === 'sim'} onClick={() => setUsing('sim')} />
          <OptionItem label="Não" selected={using === 'nao'} onClick={() => setUsing('nao')} />
        </div>

        {using === 'sim' && (
          <div style={{ marginBottom: 16 }}>
            <Field label="Quais medicamentos? (opcional)" placeholder="Ex: Losartana 50mg, Paracetamol..." />
            <div style={{
              border: '1.5px dashed #888', borderRadius: 6, padding: '8px 10px',
              backgroundColor: '#f5f5f5', marginBottom: 8,
            }}>
              <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#666', fontWeight: 700, marginBottom: 2 }}>
                ↳ PERGUNTA CONDICIONAL
              </div>
              <div style={{ fontSize: 11, color: '#555' }}>
                Anticoagulantes / imunossupressores identificados → alerta de risco elevado adicionado ao resultado.
              </div>
            </div>
          </div>
        )}

        <div style={{ backgroundColor: '#f0f0f0', border: '1px solid #ddd', borderRadius: 6, padding: '10px', marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: '#555', textAlign: 'center' }}>
            ✅ Todas as perguntas respondidas
          </div>
          <div style={{ fontSize: 10, color: '#888', textAlign: 'center', marginTop: 2, fontFamily: 'monospace' }}>
            O algoritmo irá calcular sua classificação de risco
          </div>
        </div>

        <Btn
          label="Ver Resultado da Triagem →"
          onClick={() => using && navigate('result')}
          variant={using ? 'primary' : 'ghost'}
        />
      </Content>
    </ScreenWrap>
  )
}
