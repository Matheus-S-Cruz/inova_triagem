import type { Navigate } from '../App'
import {
  NavBar, Btn, RiskBadge, Divider, SectionTitle,
  Disclaimer, A11yNote, ScreenWrap, Content, BodyText,
} from '../components/Wire'
import { useTriage } from '../context/TriageContext'
import type { RiskLevel } from '../lib/triage'

// ─── 4. Resultado da Classificação ────────────────────────────────────────────

const RECOMMENDATIONS: Record<RiskLevel, {
  level: RiskLevel
  heading: string
  body: string
  cta: string
  ctaTarget: Parameters<Navigate>[0]
  secondary?: string
  secondaryTarget?: Parameters<Navigate>[0]
}> = {
  red: {
    level: 'red',
    heading: 'Procure emergência imediatamente',
    body: 'Seus sintomas indicam risco imediato de vida. Ligue para o SAMU (192) ou vá ao pronto-socorro mais próximo agora. Não espere.',
    cta: 'Ver hospitais próximos',
    ctaTarget: 'map',
    secondary: 'Ver no mapa',
    secondaryTarget: 'map',
  },
  orange: {
    level: 'orange',
    heading: 'Atendimento urgente na UPA',
    body: 'Seus sintomas requerem avaliação médica com urgência. Dirija-se a uma UPA ou pronto atendimento em até 1 hora.',
    cta: 'Ver UPAs próximas',
    ctaTarget: 'unitlist',
    secondary: 'Ver no mapa',
    secondaryTarget: 'map',
  },
  yellow: {
    level: 'yellow',
    heading: 'Atendimento prioritário hoje',
    body: 'Você deve ser atendido com prioridade. Procure uma UBS ou pronto atendimento em até 2 horas. Evite aglomerações.',
    cta: 'Ver unidades próximas',
    ctaTarget: 'unitlist',
    secondary: 'Agendar UBS',
    secondaryTarget: 'unitlist',
  },
  green: {
    level: 'green',
    heading: 'UBS ou teleconsulta',
    body: 'Sua situação não é urgente. Agende uma consulta na UBS do seu bairro ou utilize o serviço de teleconsulta.',
    cta: 'Agendar UBS',
    ctaTarget: 'unitlist',
    secondary: 'Iniciar teleconsulta',
    secondaryTarget: 'unitlist',
  },
  blue: {
    level: 'blue',
    heading: 'Cuidados em casa',
    body: 'Seus sintomas podem ser manejados em casa com repouso e hidratação. Siga as orientações de autocuidado.',
    cta: 'Ver orientações',
    ctaTarget: 'homecare',
    secondary: 'Buscar unidade se piorar',
    secondaryTarget: 'unitlist',
  },
}

export function ResultScreen({ navigate }: { navigate: Navigate }) {
  const { answers, result, resetAnswers } = useTriage()
  const rec = RECOMMENDATIONS[result.level]

  const startNewTriage = () => {
    resetAnswers()
    navigate('q1')
  }

  const yesNoLabel = (v: 'sim' | 'nao' | null) => (v === 'sim' ? 'Sim' : v === 'nao' ? 'Não' : '—')

  return (
    <ScreenWrap>
      <NavBar title="Resultado da Triagem" />
      <Content>
        {/* Risk badge — classificação real, calculada pelo algoritmo de triagem */}
        <RiskBadge level={rec.level} />

        {/* Recommendation */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0F2A4A', marginBottom: 6 }}>
            {rec.heading}
          </div>
          <BodyText>{rec.body}</BodyText>
        </div>

        <Disclaimer />

        <Divider />

        {/* Por que essa classificação? */}
        <SectionTitle>Por que essa classificação?</SectionTitle>
        <div style={{
          backgroundColor: '#EFF5F9', border: '1px solid #DCE7EF',
          borderRadius: 6, padding: '10px 12px', marginBottom: 16,
        }}>
          {result.reasons.map((reason, i) => (
            <div key={i} style={{ display: 'flex', gap: 6, marginBottom: i < result.reasons.length - 1 ? 6 : 0 }}>
              <span style={{ color: '#155E8A', fontSize: 12, flexShrink: 0 }}>●</span>
              <span style={{ fontSize: 12, color: '#3A5468', lineHeight: 1.4 }}>{reason}</span>
            </div>
          ))}
        </div>

        {/* Symptom summary — respostas reais dadas pelo usuário */}
        <SectionTitle>Resumo da Triagem</SectionTitle>
        <div style={{
          backgroundColor: '#F5F9FB', border: '1px solid #E3EDF3',
          borderRadius: 6, padding: '10px 12px', marginBottom: 16,
        }}>
          {[
            { label: 'Sintoma', value: answers.symptom || answers.symptomOther || '—' },
            { label: 'Duração', value: answers.duration || '—' },
            { label: 'Febre', value: yesNoLabel(answers.fever) },
            { label: 'Dor intensa', value: yesNoLabel(answers.intensePain) },
            { label: 'Falta de ar', value: yesNoLabel(answers.breathingDifficulty) },
            { label: 'Piora rápida', value: yesNoLabel(answers.rapidWorsening) },
            { label: 'Grupo de risco', value: answers.vulnerableGroups.length ? answers.vulnerableGroups.join(', ') : 'Nenhum' },
            { label: 'Em uso de medicamento', value: yesNoLabel(answers.usingMedication) },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: '#7C93A6', fontFamily: 'Inter, system-ui, sans-serif', flexShrink: 0 }}>{label}</span>
              <span style={{ fontSize: 12, color: '#16324F', fontWeight: 600, textAlign: 'right' }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Btn label={rec.cta} onClick={() => navigate(rec.ctaTarget)} variant="primary" />
          {rec.secondary && rec.secondaryTarget && (
            <Btn label={rec.secondary} onClick={() => navigate(rec.secondaryTarget!)} variant="secondary" />
          )}
          <Btn label="Nova triagem" onClick={startNewTriage} variant="ghost" />
        </div>

        <A11yNote notes={[
          'Nível de risco comunicado por cor E texto (não só cor)',
          'Botão principal com aria-label descrevendo ação completa',
          'Aviso médico em destaque com role="alert"',
        ]} />
      </Content>
    </ScreenWrap>
  )
}

// ─── 5. Cuidados em Casa ──────────────────────────────────────────────────────

const HOME_CARE_ITEMS = [
  { icon: '💧', text: 'Hidrate-se: beba ao menos 2L de água por dia, água de coco ou soro caseiro.' },
  { icon: '🛌', text: 'Descanse: evite esforço físico e mantenha-se em repouso.' },
  { icon: '🌡', text: 'Monitore a febre: use paracetamol (conforme bula) se acima de 37,8°C.' },
  { icon: '🍵', text: 'Alimentação leve: prefira caldos, frutas e evite alimentos gordurosos.' },
  { icon: '😷', text: 'Isolamento: evite contato próximo com outras pessoas enquanto houver sintomas.' },
  { icon: '📞', text: 'Ligue para a UBS se os sintomas piorarem ou durarem mais de 3 dias.' },
]

const ALERT_SIGNS = [
  'Dificuldade para respirar ou falta de ar',
  'Dor no peito persistente ou intensa',
  'Confusão mental ou dificuldade para ficar acordado',
  'Lábios ou rosto azulados',
  'Febre acima de 39,5°C que não cede',
]

export function HomeCareScreen({ navigate }: { navigate: Navigate }) {
  const { resetAnswers } = useTriage()

  const startNewTriage = () => {
    resetAnswers()
    navigate('q1')
  }

  return (
    <ScreenWrap>
      <NavBar title="Cuidados em Casa" onBack={() => navigate('result')} />
      <Content>
        {/* Header badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            backgroundColor: '#2563eb', borderRadius: 8, padding: '6px 12px',
            fontSize: 12, fontWeight: 700, color: '#fff',
          }}>
            🏠 Orientação em Casa
          </div>
          <div style={{ fontSize: 12, color: '#4E6A80' }}>Nível Azul</div>
        </div>

        <Disclaimer />

        <SectionTitle>O que fazer agora</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {HOME_CARE_ITEMS.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex', gap: 10, padding: '10px', backgroundColor: '#F5F9FB',
                border: '1px solid #E3EDF3', borderRadius: 6, alignItems: 'flex-start',
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              <span style={{ fontSize: 12, color: '#155E8A', lineHeight: 1.5 }}>{item.text}</span>
            </div>
          ))}
        </div>

        <Divider />

        {/* Red flag signs */}
        <SectionTitle>🚨 Sinais de Alerta — Procure emergência se:</SectionTitle>
        <div style={{
          backgroundColor: '#fef2f2', border: '1.5px solid #dc2626',
          borderRadius: 6, padding: '10px 12px', marginBottom: 16,
        }}>
          {ALERT_SIGNS.map((sign, i) => (
            <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
              <span style={{ color: '#dc2626', fontSize: 12, flexShrink: 0 }}>●</span>
              <span style={{ fontSize: 12, color: '#7f1d1d', lineHeight: 1.4 }}>{sign}</span>
            </div>
          ))}
        </div>

        {/* Monitoring checklist */}
        <SectionTitle>Monitoramento</SectionTitle>
        <div style={{
          backgroundColor: '#EFF5F9', border: '1px solid #DCE7EF',
          borderRadius: 6, padding: '10px 12px', marginBottom: 16,
        }}>
          <div style={{ fontSize: 11, color: '#5C7690', marginBottom: 6 }}>Próximas 24h — anote suas observações:</div>
          {['Temperatura (manhã)', 'Temperatura (tarde)', 'Intensidade dos sintomas', 'Alimentação'].map(item => (
            <div key={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: '#3A5468' }}>{item}</span>
              <div style={{ width: 80, height: 20, border: '1px solid #C6D5E0', borderRadius: 3, backgroundColor: '#fff' }} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Btn label="Agendar UBS (se piorar)" onClick={() => navigate('unitlist')} variant="secondary" />
          <Btn label="Buscar unidades próximas" onClick={() => navigate('map')} variant="ghost" />
          <Btn label="Nova triagem" onClick={startNewTriage} variant="ghost" />
        </div>

        <A11yNote notes={[
          'Sinais de alerta em vermelho E com marcadores textuais',
          'Toda informação crítica disponível em tamanho mínimo 12px',
        ]} />
      </Content>
    </ScreenWrap>
  )
}