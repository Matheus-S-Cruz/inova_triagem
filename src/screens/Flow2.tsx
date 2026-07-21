import type { Navigate } from '../App'
import {
  NavBar, Btn, RiskBadge, Divider, SectionTitle,
  Disclaimer, A11yNote, ScreenWrap, Content, BodyText,
} from '../components/Wire'

// ─── 4. Resultado da Classificação ────────────────────────────────────────────

const RECOMMENDATIONS: Record<string, {
  level: 'red' | 'orange' | 'yellow' | 'green' | 'blue'
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
    cta: 'Ligar SAMU (192)',
    ctaTarget: 'map',
    secondary: 'Ver hospitais próximos',
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
  // Demo: cycling through risk levels via a selector
  const demoLevel = 'orange' // default demo
  const rec = RECOMMENDATIONS[demoLevel]

  return (
    <ScreenWrap>
      <NavBar title="Resultado da Triagem" />
      <Content>
        {/* Demo level picker — wireframe helper */}
        <div style={{ backgroundColor: '#f0f0f0', border: '1px dashed #ccc', borderRadius: 6, padding: '8px 10px', marginBottom: 12 }}>
          <div style={{ fontSize: 9, fontFamily: 'monospace', color: '#888', marginBottom: 6 }}>
            [WIREFRAME] SIMULAR NÍVEL DE RISCO:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {[
              { key: 'red', label: 'Vermelho', color: '#dc2626' },
              { key: 'orange', label: 'Laranja', color: '#ea580c' },
              { key: 'yellow', label: 'Amarelo', color: '#ca8a04' },
              { key: 'green', label: 'Verde', color: '#16a34a' },
              { key: 'blue', label: 'Azul', color: '#2563eb' },
            ].map(({ key, label, color }) => (
              <span
                key={key}
                style={{
                  padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                  backgroundColor: color, color: '#fff', cursor: 'pointer',
                  opacity: key === demoLevel ? 1 : 0.4,
                  fontFamily: 'monospace',
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Risk badge */}
        <RiskBadge level={rec.level} />

        {/* Recommendation */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>
            {rec.heading}
          </div>
          <BodyText>{rec.body}</BodyText>
        </div>

        <Disclaimer />

        <Divider />

        {/* Symptom summary */}
        <SectionTitle>Resumo da Triagem</SectionTitle>
        <div style={{
          backgroundColor: '#fafafa', border: '1px solid #e8e8e8',
          borderRadius: 6, padding: '10px 12px', marginBottom: 16,
        }}>
          {[
            { label: 'Sintoma', value: 'Falta de ar' },
            { label: 'Duração', value: 'Hoje (6–24h)' },
            { label: 'Febre', value: 'Sim' },
            { label: 'Dor intensa', value: 'Não' },
            { label: 'Piora rápida', value: 'Sim' },
            { label: 'Grupo de risco', value: 'Nenhum' },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: '#888', fontFamily: 'monospace' }}>{label}</span>
              <span style={{ fontSize: 12, color: '#222', fontWeight: 600 }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Btn label={rec.cta} onClick={() => navigate(rec.ctaTarget)} variant="primary" />
          {rec.secondary && rec.secondaryTarget && (
            <Btn label={rec.secondary} onClick={() => navigate(rec.secondaryTarget!)} variant="secondary" />
          )}
          <Btn label="Nova triagem" onClick={() => navigate('q1')} variant="ghost" />
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
          <div style={{ fontSize: 12, color: '#555' }}>Nível Azul</div>
        </div>

        <Disclaimer />

        <SectionTitle>O que fazer agora</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {HOME_CARE_ITEMS.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex', gap: 10, padding: '10px', backgroundColor: '#fafafa',
                border: '1px solid #e8e8e8', borderRadius: 6, alignItems: 'flex-start',
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              <span style={{ fontSize: 12, color: '#333', lineHeight: 1.5 }}>{item.text}</span>
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
          backgroundColor: '#f5f5f5', border: '1px solid #e0e0e0',
          borderRadius: 6, padding: '10px 12px', marginBottom: 16,
        }}>
          <div style={{ fontSize: 11, color: '#666', marginBottom: 6 }}>Próximas 24h — anote suas observações:</div>
          {['Temperatura (manhã)', 'Temperatura (tarde)', 'Intensidade dos sintomas', 'Alimentação'].map(item => (
            <div key={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: '#444' }}>{item}</span>
              <div style={{ width: 80, height: 20, border: '1px solid #ccc', borderRadius: 3, backgroundColor: '#fff' }} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Btn label="Agendar UBS (se piorar)" onClick={() => navigate('unitlist')} variant="secondary" />
          <Btn label="Buscar unidades próximas" onClick={() => navigate('map')} variant="ghost" />
          <Btn label="Nova triagem" onClick={() => navigate('q1')} variant="ghost" />
        </div>

        <A11yNote notes={[
          'Sinais de alerta em vermelho E com marcadores textuais',
          'Toda informação crítica disponível em tamanho mínimo 12px',
        ]} />
      </Content>
    </ScreenWrap>
  )
}
