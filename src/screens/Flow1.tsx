import { useState } from 'react'
import type { Navigate } from '../App'
import {
  NavBar, ProgressBar, Btn, Field, OptionItem, CheckboxItem,
  SectionTitle, BodyText, Divider, A11yNote, ScreenWrap, Content,
} from '../components/Wire'
import { LogoLockup } from '../components/Logo'
import { UserStorage } from '../lib/storage'
import { useTriage } from '../context/TriageContext'

// ─── 1. Tela Inicial ──────────────────────────────────────────────────────────

export function HomeScreen({ navigate }: { navigate: Navigate }) {
  // Mesma checagem que existia no init() da branch FrontEnd: se já há uma
  // conta salva, o atalho leva direto ao Perfil em vez de abrir o Cadastro.
  const hasAccount = !!UserStorage.get()
  const { resetAnswers } = useTriage()

  const startTriage = () => {
    resetAnswers() // começa uma nova triagem do zero
    navigate('lgpd')
  }

  return (
    <ScreenWrap>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
        {/* Header area */}
        <div style={{
          background: 'linear-gradient(160deg, #EFF5F9 0%, #E4F1EE 100%)',
          borderBottom: '1px solid #DCE7EF', padding: '32px 24px 24px',
        }}>
          <div style={{ marginBottom: 4 }}>
            <LogoLockup size={40} />
          </div>
        </div>

        <Content>
          {/* Intro text */}
          <div style={{ padding: '4px 0 16px' }}>
            <BodyText>
              Relate seus sintomas antes de sair de casa e receba uma recomendação de atendimento.
            </BodyText>
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 8, backgroundColor: '#EFF5F9',
              border: '1px solid #DCE7EF', borderRadius: 6, padding: '8px 10px', marginBottom: 4,
            }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>ℹ</span>
              <span style={{ fontSize: 12, color: '#4E6A80', lineHeight: 1.4 }}>
                A triagem pode ser feita de forma anônima, sem necessidade de cadastro ou login.
              </span>
            </div>
          </div>

          <Divider />

          {/* CTA buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
            <Btn label="✚  Iniciar Triagem" onClick={startTriage} variant="primary" />
            <Btn
              label={hasAccount ? 'Meu Perfil' : 'Entrar / Criar Conta'}
              onClick={() => navigate(hasAccount ? 'profile' : 'register')}
              variant="secondary"
            />
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
                  flex: 1, border: '1.5px solid #D7E3EC', borderRadius: 8, padding: '10px 4px',
                  backgroundColor: '#F5F9FB', cursor: 'pointer', textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 20 }}>{item.icon}</div>
                <div style={{ fontSize: 10, color: '#5C7690', marginTop: 4, whiteSpace: 'pre-line', lineHeight: 1.3 }}>{item.label}</div>
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
          backgroundColor: '#EFF5F9', border: '1px solid #DCE7EF', borderRadius: 6,
          padding: '12px', marginBottom: 12, fontSize: 12, color: '#3A5468', lineHeight: 1.6,
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

        <div style={{ fontSize: 11, color: '#9AAEBE', fontFamily: 'Inter, system-ui, sans-serif', marginBottom: 16 }}>
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
  const { answers, updateAnswers } = useTriage()
  const canProceed = !!answers.symptom || !!answers.symptomOther.trim()

  return (
    <ScreenWrap>
      <NavBar title="Triagem" onBack={() => navigate('lgpd')} />
      <ProgressBar current={1} total={6} />
      <Content>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#0F2A4A', marginBottom: 4 }}>
            Qual é o seu principal sintoma?
          </div>
          <div style={{ fontSize: 12, color: '#7C93A6' }}>Selecione o que melhor descreve sua queixa</div>
        </div>

        {SYMPTOMS.map(s => (
          <OptionItem key={s} label={s} selected={answers.symptom === s} onClick={() => updateAnswers({ symptom: s })} />
        ))}

        <Field
          label="Ou descreva com suas palavras"
          placeholder="Ex: dor ao engolir..."
          value={answers.symptomOther}
          onChange={(v) => updateAnswers({ symptomOther: v })}
        />

        <div style={{ marginTop: 8 }}>
          <Btn label="Próxima →" onClick={() => canProceed && navigate('q2')} variant={canProceed ? 'primary' : 'ghost'} />
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
  const { answers, updateAnswers } = useTriage()
  return (
    <ScreenWrap>
      <NavBar title="Triagem" onBack={() => navigate('q1')} />
      <ProgressBar current={2} total={6} />
      <Content>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#0F2A4A', marginBottom: 4 }}>
            Há quanto tempo o sintoma começou?
          </div>
          <div style={{ fontSize: 12, color: '#7C93A6' }}>Considere o início do sintoma principal</div>
        </div>

        {DURATIONS.map(d => (
          <OptionItem key={d} label={d} selected={answers.duration === d} onClick={() => updateAnswers({ duration: d })} />
        ))}

        <div style={{ marginTop: 8 }}>
          <Btn label="Próxima →" onClick={() => answers.duration && navigate('q3')} variant={answers.duration ? 'primary' : 'ghost'} />
        </div>
      </Content>
    </ScreenWrap>
  )
}

// ─── 3c. Febre / Dor / Falta de ar ───────────────────────────────────────────

export function Q3Screen({ navigate }: { navigate: Navigate }) {
  const { answers, updateAnswers } = useTriage()
  const allAnswered = answers.fever && answers.intensePain && answers.breathingDifficulty

  return (
    <ScreenWrap>
      <NavBar title="Triagem" onBack={() => navigate('q2')} />
      <ProgressBar current={3} total={6} />
      <Content>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#0F2A4A', marginBottom: 4 }}>
            Sobre seus sintomas agora:
          </div>
          <div style={{ fontSize: 12, color: '#7C93A6' }}>Responda cada item com Sim ou Não</div>
        </div>

        {[
          { label: 'Tem febre (acima de 37,8°C)?', val: answers.fever, key: 'fever' as const },
          { label: 'Sente dor intensa (≥7 em 10)?', val: answers.intensePain, key: 'intensePain' as const },
          { label: 'Tem dificuldade para respirar / falta de ar?', val: answers.breathingDifficulty, key: 'breathingDifficulty' as const },
        ].map(({ label, val, key }) => (
          <div key={label} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#16324F', marginBottom: 6 }}>{label}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <OptionItem label="Sim" selected={val === 'sim'} onClick={() => updateAnswers({ [key]: 'sim' })} />
              <OptionItem label="Não" selected={val === 'nao'} onClick={() => updateAnswers({ [key]: 'nao' })} />
            </div>
          </div>
        ))}

        {/* Conditional branch note */}
        {answers.breathingDifficulty === 'sim' && (
          <div style={{
            border: '1.5px dashed #dc2626', borderRadius: 6, padding: '8px 10px',
            backgroundColor: '#fef2f2', marginBottom: 12,
          }}>
            <div style={{ fontSize: 10, fontFamily: 'Inter, system-ui, sans-serif', color: '#dc2626', fontWeight: 700, marginBottom: 2 }}>
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
  const { answers, updateAnswers } = useTriage()
  return (
    <ScreenWrap>
      <NavBar title="Triagem" onBack={() => navigate('q3')} />
      <ProgressBar current={4} total={6} />
      <Content>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#0F2A4A', marginBottom: 4 }}>
            Os sintomas pioraram rapidamente nas últimas horas?
          </div>
          <div style={{ fontSize: 12, color: '#7C93A6' }}>
            Ex.: febre que subiu muito, dor que aumentou, nova falta de ar
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          <OptionItem label="Sim — piorou rápido" selected={answers.rapidWorsening === 'sim'} onClick={() => updateAnswers({ rapidWorsening: 'sim' })} />
          <OptionItem label="Não — estável ou melhorando" selected={answers.rapidWorsening === 'nao'} onClick={() => updateAnswers({ rapidWorsening: 'nao' })} />
        </div>

        {answers.rapidWorsening === 'sim' && (
          <div style={{
            border: '1.5px dashed #ea580c', borderRadius: 6, padding: '8px 10px',
            backgroundColor: '#fff7ed', marginBottom: 12,
          }}>
            <div style={{ fontSize: 10, fontFamily: 'Inter, system-ui, sans-serif', color: '#ea580c', fontWeight: 700, marginBottom: 2 }}>
              ↳ PERGUNTA CONDICIONAL
            </div>
            <div style={{ fontSize: 11, color: '#9a3412' }}>
              Piora rápida = Sim → próxima pergunta verifica grupos de risco (idosos, crianças, gestantes).
            </div>
          </div>
        )}

        <Btn label="Próxima →" onClick={() => answers.rapidWorsening && navigate('q5')} variant={answers.rapidWorsening ? 'primary' : 'ghost'} />
      </Content>
    </ScreenWrap>
  )
}

// ─── 3e. Grupo Vulnerável ─────────────────────────────────────────────────────

const GROUPS = [
  'Criança (menor de 5 anos)',
  'Idoso (60 anos ou mais)',
  'Gestante',
  'Puérpera (até 45 dias após parto)',
  'Imunossuprimido / transplantado',
  'Portador de doença crônica (diabetes, HAS, cardiopatia, DPOC...)',
  'Nenhuma das anteriores',
]
const NONE_LABEL = 'Nenhuma das anteriores'

export function Q5Screen({ navigate }: { navigate: Navigate }) {
  const { answers, toggleVulnerableGroup } = useTriage()

  return (
    <ScreenWrap>
      <NavBar title="Triagem" onBack={() => navigate('q4')} />
      <ProgressBar current={5} total={6} />
      <Content>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#0F2A4A', marginBottom: 4 }}>
            O paciente pertence a algum grupo de risco?
          </div>
          <div style={{ fontSize: 12, color: '#7C93A6' }}>Pode selecionar mais de uma opção</div>
        </div>

        {GROUPS.map(g => (
          <div key={g} onClick={() => toggleVulnerableGroup(g, NONE_LABEL)} style={{ cursor: 'pointer', marginBottom: 6 }}>
            <CheckboxItem label={g} checked={answers.vulnerableGroups.includes(g)} />
          </div>
        ))}

        <div style={{
          border: '1.5px dashed #7C93A6', borderRadius: 6, padding: '8px 10px',
          backgroundColor: '#EFF5F9', marginBottom: 12, marginTop: 4,
        }}>
          <div style={{ fontSize: 10, fontFamily: 'Inter, system-ui, sans-serif', color: '#5C7690', fontWeight: 700, marginBottom: 2 }}>
            ↳ PERGUNTA CONDICIONAL
          </div>
          <div style={{ fontSize: 11, color: '#4E6A80' }}>
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
  const { answers, updateAnswers } = useTriage()

  return (
    <ScreenWrap>
      <NavBar title="Triagem" onBack={() => navigate('q5')} />
      <ProgressBar current={6} total={6} />
      <Content>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#0F2A4A', marginBottom: 4 }}>
            Está em uso de algum medicamento?
          </div>
          <div style={{ fontSize: 12, color: '#7C93A6' }}>
            Inclua remédios de uso contínuo, automedicação ou fitoterápicos
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          <OptionItem label="Sim" selected={answers.usingMedication === 'sim'} onClick={() => updateAnswers({ usingMedication: 'sim' })} />
          <OptionItem label="Não" selected={answers.usingMedication === 'nao'} onClick={() => updateAnswers({ usingMedication: 'nao' })} />
        </div>

        {answers.usingMedication === 'sim' && (
          <div style={{ marginBottom: 16 }}>
            <Field
              label="Quais medicamentos? (opcional)"
              placeholder="Ex: Losartana 50mg, Paracetamol..."
              value={answers.medicationDetails}
              onChange={(v) => updateAnswers({ medicationDetails: v })}
            />
            <div style={{
              border: '1.5px dashed #7C93A6', borderRadius: 6, padding: '8px 10px',
              backgroundColor: '#EFF5F9', marginBottom: 8,
            }}>
              <div style={{ fontSize: 10, fontFamily: 'Inter, system-ui, sans-serif', color: '#5C7690', fontWeight: 700, marginBottom: 2 }}>
                ↳ PERGUNTA CONDICIONAL
              </div>
              <div style={{ fontSize: 11, color: '#4E6A80' }}>
                Anticoagulantes / imunossupressores identificados → alerta de risco elevado adicionado ao resultado.
              </div>
            </div>
          </div>
        )}

        <div style={{ backgroundColor: '#EAF2F6', border: '1px solid #D7E3EC', borderRadius: 6, padding: '10px', marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: '#4E6A80', textAlign: 'center' }}>
            ✅ Todas as perguntas respondidas
          </div>
          <div style={{ fontSize: 10, color: '#7C93A6', textAlign: 'center', marginTop: 2, fontFamily: 'Inter, system-ui, sans-serif' }}>
            O algoritmo irá calcular sua classificação de risco
          </div>
        </div>

        <Btn
          label="Ver Resultado da Triagem →"
          onClick={() => answers.usingMedication && navigate('result')}
          variant={answers.usingMedication ? 'primary' : 'ghost'}
        />
      </Content>
    </ScreenWrap>
  )
}