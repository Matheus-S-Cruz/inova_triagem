import { useState } from 'react'
import type { Navigate } from '../App'
import {
  NavBar, Btn, Field, SectionTitle, Divider,
  OccupancyTag, A11yNote, ScreenWrap, Content,
} from '../components/Wire'

type OccLevel = 'low' | 'medium' | 'high'

// ─── 12. Login da Equipe ──────────────────────────────────────────────────────

export function TeamLoginScreen({ navigate }: { navigate: Navigate }) {
  return (
    <ScreenWrap>
      <NavBar title="" />
      <Content>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52, backgroundColor: '#333', borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, margin: '0 auto 12px',
          }}>
            🏥
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
            Triagem+ Equipe
          </div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
            Acesso restrito — equipe da unidade de saúde
          </div>
        </div>

        <div style={{
          backgroundColor: '#f5f5f5', border: '1px solid #e0e0e0',
          borderRadius: 8, padding: '16px', marginBottom: 20,
        }}>
          <SectionTitle>Credenciais da Unidade</SectionTitle>
          <Field label="Código da unidade (CNES)" placeholder="Ex: 0012345" hint="Código Nacional de Estabelecimentos de Saúde" />
          <Field label="Usuário" placeholder="Matrícula ou e-mail institucional" />
          <Field label="Senha" placeholder="••••••••" />

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#555', textDecoration: 'underline' }}>
              Esqueci minha senha
            </button>
          </div>

          <Btn label="Entrar" onClick={() => navigate('occupancy')} variant="primary" />
        </div>

        <div style={{ fontSize: 11, color: '#aaa', textAlign: 'center', lineHeight: 1.5, fontFamily: 'monospace' }}>
          Acesso autorizado somente a servidores cadastrados.<br />
          Tentativas suspeitas são registradas e reportadas.
        </div>

        <Divider />

        <div style={{ textAlign: 'center' }}>
          <button onClick={() => navigate('home')} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 12, color: '#888', textDecoration: 'underline',
          }}>
            ← Voltar ao app do cidadão
          </button>
        </div>

        <A11yNote notes={[
          'Campo de senha com botão para exibir/ocultar (acessível por leitor de tela)',
          'Erro de login com mensagem textual — não só cor vermelha',
          'Sessão com timeout automático por segurança',
        ]} />
      </Content>
    </ScreenWrap>
  )
}

// ─── 13. Painel de Lotação ────────────────────────────────────────────────────

const OCC_LABELS: Record<OccLevel, string> = {
  low: 'Baixa — unidade tem capacidade disponível',
  medium: 'Média — unidade operando com atenção',
  high: 'Alta — unidade próxima do limite',
}

const OCC_SLIDER_COLORS: Record<OccLevel, string> = {
  low: '#16a34a', medium: '#ca8a04', high: '#dc2626',
}

export function OccupancyScreen({ navigate }: { navigate: Navigate }) {
  const [occ, setOcc] = useState<OccLevel>('high')
  const [queue, setQueue] = useState(70)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <ScreenWrap>
      <NavBar
        title="Atualizar Lotação"
        onBack={() => navigate('teamlogin')}
        right={
          <button
            onClick={() => navigate('admin')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#555', fontFamily: 'monospace' }}
          >
            Painel ›
          </button>
        }
      />
      <Content>
        {/* Unit header */}
        <div style={{
          backgroundColor: '#f5f5f5', border: '1px solid #e0e0e0',
          borderRadius: 8, padding: '10px 12px', marginBottom: 16,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>UPA Santo André</div>
          <div style={{ fontSize: 11, color: '#888', fontFamily: 'monospace' }}>CNES 0012345 · Última atualização: 5 min atrás</div>
        </div>

        {/* Status atual */}
        <SectionTitle>Status Atual</SectionTitle>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <OccupancyTag level={occ} />
          <span style={{ fontSize: 12, color: '#555' }}>{OCC_LABELS[occ]}</span>
        </div>

        {/* Lotação selector */}
        <SectionTitle>Definir Lotação</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {(['low', 'medium', 'high'] as OccLevel[]).map(level => (
            <button
              key={level}
              onClick={() => setOcc(level)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                border: '2px solid', borderColor: occ === level ? OCC_SLIDER_COLORS[level] : '#ddd',
                borderRadius: 8, backgroundColor: occ === level ? `${OCC_SLIDER_COLORS[level]}15` : '#fff',
                cursor: 'pointer', textAlign: 'left',
              }}
            >
              <div style={{
                width: 14, height: 14, borderRadius: '50%',
                backgroundColor: occ === level ? OCC_SLIDER_COLORS[level] : '#ddd',
                flexShrink: 0,
              }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: OCC_SLIDER_COLORS[level] }}>
                  {level === 'low' ? 'Baixa' : level === 'medium' ? 'Média' : 'Alta'}
                </div>
                <div style={{ fontSize: 11, color: '#888' }}>{OCC_LABELS[level]}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Queue time */}
        <SectionTitle>Tempo Estimado de Espera</SectionTitle>
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <input
              type="range" min={0} max={180} step={5} value={queue}
              onChange={(e) => setQueue(Number(e.target.value))}
              style={{ flex: 1, accentColor: '#333' }}
            />
            <div style={{
              minWidth: 54, textAlign: 'center', padding: '4px 8px',
              border: '1.5px solid #ccc', borderRadius: 6,
              fontSize: 14, fontWeight: 700, color: '#222', fontFamily: 'monospace',
            }}>
              {queue}min
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#aaa', fontFamily: 'monospace' }}>
            <span>0 min</span><span>30</span><span>60</span><span>90</span><span>120</span><span>180 min</span>
          </div>
        </div>

        {/* Capacity */}
        <SectionTitle>Capacidade Ocupada</SectionTitle>
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div style={{ flex: 1, height: 20, backgroundColor: '#eee', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: '87%',
                backgroundColor: OCC_SLIDER_COLORS[occ], transition: 'width 0.3s',
              }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#222', fontFamily: 'monospace', minWidth: 36 }}>87%</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Field label="Atendimentos em espera" placeholder="12 pacientes" />
            <Field label="Leitos ocupados" placeholder="18 / 20" />
          </div>
        </div>

        {/* Save */}
        {saved && (
          <div style={{
            backgroundColor: '#f0fdf4', border: '1.5px solid #16a34a',
            borderRadius: 6, padding: '8px 12px', marginBottom: 12,
            fontSize: 12, color: '#15803d', textAlign: 'center',
          }}>
            ✓ Status atualizado com sucesso — usuários serão notificados
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Btn label="Salvar e publicar status" onClick={handleSave} variant="primary" />
          <Btn label="Ver painel administrativo" onClick={() => navigate('admin')} variant="secondary" />
        </div>

        <A11yNote notes={[
          'Slider de tempo com valor numérico exibido ao lado',
          'Feedback de sucesso em texto (não só mudança de cor)',
        ]} />
      </Content>
    </ScreenWrap>
  )
}

// ─── 14. Painel Administrativo ────────────────────────────────────────────────

const PRIORITY_DATA = [
  { level: 'Emergência', color: '#dc2626', count: 3, pct: 8 },
  { level: 'UPA', color: '#ea580c', count: 11, pct: 29 },
  { level: 'Prioritário', color: '#ca8a04', count: 9, pct: 24 },
  { level: 'UBS', color: '#16a34a', count: 12, pct: 32 },
  { level: 'Em casa', color: '#2563eb', count: 3, pct: 8 },
]

const TOP_SYMPTOMS = [
  { symptom: 'Febre', count: 14 },
  { symptom: 'Tosse', count: 11 },
  { symptom: 'Dor de cabeça', count: 9 },
  { symptom: 'Falta de ar', count: 6 },
  { symptom: 'Dor abdominal', count: 5 },
  { symptom: 'Vômito / Náusea', count: 4 },
]

const REGION_DATA = [
  { region: 'Vila Mariana', demand: 'high' as OccLevel, count: 18 },
  { region: 'Ipiranga', demand: 'medium' as OccLevel, count: 12 },
  { region: 'Saúde', demand: 'medium' as OccLevel, count: 9 },
  { region: 'Cursino', demand: 'low' as OccLevel, count: 4 },
  { region: 'Jabaquara', demand: 'low' as OccLevel, count: 3 },
]

const REGION_OCC_COLORS: Record<OccLevel, string> = {
  low: '#16a34a', medium: '#ca8a04', high: '#dc2626',
}

export function AdminScreen({ navigate }: { navigate: Navigate }) {
  const total = PRIORITY_DATA.reduce((s, d) => s + d.count, 0)

  return (
    <ScreenWrap>
      <NavBar title="Painel Administrativo" onBack={() => navigate('occupancy')} />
      <Content>
        {/* Context bar */}
        <div style={{
          backgroundColor: '#f5f5f5', border: '1px solid #e0e0e0',
          borderRadius: 6, padding: '8px 12px', marginBottom: 16,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#333' }}>UPA Santo André</div>
            <div style={{ fontSize: 10, color: '#888', fontFamily: 'monospace' }}>Hoje · 09/07/2025 · Turno 07h–19h</div>
          </div>
          <button
            onClick={() => navigate('occupancy')}
            style={{
              padding: '5px 10px', border: '1.5px solid #ccc', borderRadius: 4,
              backgroundColor: '#fff', cursor: 'pointer', fontSize: 10, fontFamily: 'monospace', color: '#555',
            }}
          >
            ← Lotação
          </button>
        </div>

        {/* KPI cards */}
        <SectionTitle>Solicitações Recebidas — Hoje</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
          {[
            { label: 'Total', value: total, sub: 'triagens' },
            { label: 'Urgente/Emerg.', value: 14, sub: 'laranja+verm.' },
            { label: 'Última hora', value: 7, sub: 'solicitações' },
          ].map(({ label, value, sub }) => (
            <div key={label} style={{
              border: '1.5px solid #e0e0e0', borderRadius: 8, padding: '10px 8px',
              backgroundColor: '#fafafa', textAlign: 'center',
            }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.02em' }}>{value}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#555' }}>{label}</div>
              <div style={{ fontSize: 9, color: '#aaa', fontFamily: 'monospace' }}>{sub}</div>
            </div>
          ))}
        </div>

        <Divider />

        {/* Classification breakdown */}
        <SectionTitle>Classificação por Prioridade</SectionTitle>
        <div style={{ marginBottom: 16 }}>
          {PRIORITY_DATA.map(({ level, color, count, pct }) => (
            <div key={level} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: color }} />
                  <span style={{ fontSize: 11, color: '#333' }}>{level}</span>
                </div>
                <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#555' }}>
                  {count} ({pct}%)
                </span>
              </div>
              <div style={{ height: 8, backgroundColor: '#eee', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, backgroundColor: color, transition: 'width 0.4s' }} />
              </div>
            </div>
          ))}
        </div>

        <Divider />

        {/* Top symptoms */}
        <SectionTitle>Sintomas Mais Relatados</SectionTitle>
        <div style={{ marginBottom: 16 }}>
          {TOP_SYMPTOMS.map(({ symptom, count }) => (
            <div key={symptom} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: '#333', minWidth: 110 }}>{symptom}</span>
              <div style={{ flex: 1, height: 10, backgroundColor: '#eee', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${(count / TOP_SYMPTOMS[0].count) * 100}%`,
                  backgroundColor: '#888',
                }} />
              </div>
              <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#666', minWidth: 18, textAlign: 'right' }}>
                {count}
              </span>
            </div>
          ))}
        </div>

        <Divider />

        {/* Region demand */}
        <SectionTitle>Demanda por Região</SectionTitle>
        <div style={{ marginBottom: 16 }}>
          {/* Mini map placeholder */}
          <div style={{
            height: 100, backgroundColor: '#eee', border: '1.5px dashed #bbb',
            borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 10, fontSize: 10, color: '#aaa', fontFamily: 'monospace',
          }}>
            [MAPA COROPLÉTICO — PLACEHOLDER]<br />
            Intensidade por bairro/região
          </div>

          {REGION_DATA.map(({ region, demand, count }) => (
            <div key={region} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '6px 10px', marginBottom: 4,
              border: '1px solid #e8e8e8', borderRadius: 6, backgroundColor: '#fafafa',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: REGION_OCC_COLORS[demand] }} />
                <span style={{ fontSize: 12, color: '#333' }}>{region}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#888' }}>
                  {count} triagens
                </span>
                <span style={{
                  fontSize: 9, fontWeight: 700, color: REGION_OCC_COLORS[demand],
                  border: `1px solid ${REGION_OCC_COLORS[demand]}`, borderRadius: 3, padding: '0 4px',
                  fontFamily: 'monospace',
                }}>
                  {demand === 'low' ? 'BAIXA' : demand === 'medium' ? 'MÉDIA' : 'ALTA'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <Divider />

        {/* Recent alerts */}
        <SectionTitle>Alertas Recentes</SectionTitle>
        <div style={{ marginBottom: 16 }}>
          {[
            { time: '08:47', type: 'high', msg: '3 casos de falta de ar nas últimas 2h — zona Sul' },
            { time: '07:23', msg: 'UPA Ipiranga reportou lotação alta' },
            { time: '06:55', msg: 'Pico de 12 triagens simultâneas registrado' },
          ].map(({ time, type, msg }, i) => (
            <div key={i} style={{
              display: 'flex', gap: 8, padding: '7px 0',
              borderBottom: i < 2 ? '1px solid #f0f0f0' : 'none',
            }}>
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#aaa', flexShrink: 0, marginTop: 1 }}>{time}</span>
              {type === 'high' && (
                <span style={{ color: '#dc2626', fontSize: 12, flexShrink: 0 }}>⚠</span>
              )}
              <span style={{ fontSize: 11, color: '#444', lineHeight: 1.4 }}>{msg}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Btn label="Exportar relatório (CSV)" onClick={() => {}} variant="secondary" />
          <Btn label="Atualizar lotação da unidade" onClick={() => navigate('occupancy')} variant="ghost" />
          <Btn label="Sair" onClick={() => navigate('teamlogin')} variant="ghost" />
        </div>

        <A11yNote notes={[
          'Gráficos acompanhados de tabelas de dados equivalentes',
          'Alertas de alta urgência com role="alert" para leitores de tela',
          'Painel requer autenticação — sessão expira após 30min de inatividade',
        ]} />
      </Content>
    </ScreenWrap>
  )
}
