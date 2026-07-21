import { useState } from 'react'
import { PhoneFrame } from './components/Wire'
import { HomeScreen, LGPDScreen, Q1Screen, Q2Screen, Q3Screen, Q4Screen, Q5Screen, Q6Screen } from './screens/Flow1'
import { ResultScreen, HomeCareScreen } from './screens/Flow2'
import { MapScreen, UnitListScreen, UnitDetailScreen } from './screens/Flow3'
import { RegisterScreen, ProfileScreen, HistoryScreen } from './screens/Flow4'
import { TeamLoginScreen, OccupancyScreen, AdminScreen } from './screens/Flow5'

export type ScreenId =
  | 'home' | 'lgpd' | 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6'
  | 'result' | 'homecare'
  | 'map' | 'unitlist' | 'unitdetail'
  | 'register' | 'profile' | 'history'
  | 'teamlogin' | 'occupancy' | 'admin'

export type Navigate = (to: ScreenId) => void

const FLOWS = [
  {
    label: 'Fluxo 1 — Entrada e Triagem',
    color: '#6b7280',
    screens: [
      { id: 'home', label: '1. Tela Inicial' },
      { id: 'lgpd', label: '2. Consentimento LGPD' },
      { id: 'q1', label: '3a. Sintoma Principal' },
      { id: 'q2', label: '3b. Duração' },
      { id: 'q3', label: '3c. Febre / Dor / Falta de ar' },
      { id: 'q4', label: '3d. Piora Rápida' },
      { id: 'q5', label: '3e. Grupo Vulnerável' },
      { id: 'q6', label: '3f. Medicamentos' },
    ],
  },
  {
    label: 'Fluxo 2 — Resultado',
    color: '#6b7280',
    screens: [
      { id: 'result', label: '4. Classificação de Risco' },
      { id: 'homecare', label: '5. Cuidados em Casa' },
    ],
  },
  {
    label: 'Fluxo 3 — Mapa e Lotação',
    color: '#6b7280',
    screens: [
      { id: 'map', label: '6. Mapa de Unidades' },
      { id: 'unitlist', label: '7. Lista de Unidades' },
      { id: 'unitdetail', label: '8. Detalhe da Unidade' },
    ],
  },
  {
    label: 'Fluxo 4 — Perfil e Histórico',
    color: '#6b7280',
    screens: [
      { id: 'register', label: '9. Cadastro' },
      { id: 'profile', label: '10. Perfil do Usuário' },
      { id: 'history', label: '11. Histórico de Triagens' },
    ],
  },
  {
    label: 'Fluxo 5 — Painel da Unidade',
    color: '#6b7280',
    screens: [
      { id: 'teamlogin', label: '12. Login da Equipe' },
      { id: 'occupancy', label: '13. Atualizar Lotação' },
      { id: 'admin', label: '14. Painel Administrativo' },
    ],
  },
]

function ScreenRouter({ screen, navigate }: { screen: ScreenId; navigate: Navigate }) {
  switch (screen) {
    case 'home': return <HomeScreen navigate={navigate} />
    case 'lgpd': return <LGPDScreen navigate={navigate} />
    case 'q1': return <Q1Screen navigate={navigate} />
    case 'q2': return <Q2Screen navigate={navigate} />
    case 'q3': return <Q3Screen navigate={navigate} />
    case 'q4': return <Q4Screen navigate={navigate} />
    case 'q5': return <Q5Screen navigate={navigate} />
    case 'q6': return <Q6Screen navigate={navigate} />
    case 'result': return <ResultScreen navigate={navigate} />
    case 'homecare': return <HomeCareScreen navigate={navigate} />
    case 'map': return <MapScreen navigate={navigate} />
    case 'unitlist': return <UnitListScreen navigate={navigate} />
    case 'unitdetail': return <UnitDetailScreen navigate={navigate} />
    case 'register': return <RegisterScreen navigate={navigate} />
    case 'profile': return <ProfileScreen navigate={navigate} />
    case 'history': return <HistoryScreen navigate={navigate} />
    case 'teamlogin': return <TeamLoginScreen navigate={navigate} />
    case 'occupancy': return <OccupancyScreen navigate={navigate} />
    case 'admin': return <AdminScreen navigate={navigate} />
    default: return <HomeScreen navigate={navigate} />
  }
}

export default function App() {
  const [screen, setScreen] = useState<ScreenId>('home')
  const navigate: Navigate = (to) => setScreen(to)

  const currentLabel = FLOWS.flatMap(f => f.screens).find(s => s.id === screen)?.label ?? ''

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#d4d4d4', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Sidebar navigator */}
      <aside style={{
        width: 230, backgroundColor: '#1a1a1a', color: '#ccc',
        overflowY: 'auto', flexShrink: 0, borderRight: '1px solid #333',
      }}>
        <div style={{ padding: '14px 12px 10px', borderBottom: '1px solid #333' }}>
          <div style={{ fontSize: 9, fontFamily: 'monospace', color: '#555', letterSpacing: '0.08em', marginBottom: 3 }}>
            PROTÓTIPO LO-FI
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
            Triagem+
          </div>
          <div style={{ fontSize: 9, color: '#555', marginTop: 1 }}>
            Wireframe · 14 telas · 5 fluxos
          </div>
        </div>

        {FLOWS.map((flow) => (
          <div key={flow.label}>
            <div style={{
              padding: '10px 12px 3px', fontSize: 9, fontFamily: 'monospace',
              color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              {flow.label}
            </div>
            {flow.screens.map((s) => (
              <button
                key={s.id}
                onClick={() => navigate(s.id as ScreenId)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '5px 12px 5px 16px', fontSize: 11,
                  color: screen === s.id ? '#fff' : '#888',
                  backgroundColor: screen === s.id ? '#383838' : 'transparent',
                  border: 'none', cursor: 'pointer',
                  borderLeft: screen === s.id ? '2px solid #bbb' : '2px solid transparent',
                  transition: 'all 0.1s',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        ))}

        <div style={{ padding: '16px 12px', borderTop: '1px solid #333', marginTop: 8 }}>
          <div style={{ fontSize: 9, color: '#444', fontFamily: 'monospace', lineHeight: 1.5 }}>
            ♿ Anotações de acessibilidade<br />
            indicadas nas telas relevantes
          </div>
        </div>
      </aside>

      {/* Main canvas */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '32px 24px', overflowY: 'auto' }}>
        {/* Frame label */}
        <div style={{ marginBottom: 12, fontFamily: 'monospace', fontSize: 11, color: '#666', textAlign: 'center' }}>
          <span style={{ backgroundColor: '#c0c0c0', padding: '2px 8px', borderRadius: 2 }}>
            {currentLabel}
          </span>
        </div>

        <PhoneFrame>
          <ScreenRouter screen={screen} navigate={navigate} />
        </PhoneFrame>

        {/* Quick-jump arrows */}
        <div style={{ display: 'flex', gap: 8, marginTop: 16, alignItems: 'center' }}>
          {(() => {
            const all = FLOWS.flatMap(f => f.screens)
            const idx = all.findIndex(s => s.id === screen)
            const prev = idx > 0 ? all[idx - 1] : null
            const next = idx < all.length - 1 ? all[idx + 1] : null
            return (
              <>
                <button
                  onClick={() => prev && navigate(prev.id as ScreenId)}
                  disabled={!prev}
                  style={{
                    padding: '5px 12px', fontSize: 11, fontFamily: 'monospace',
                    backgroundColor: prev ? '#b0b0b0' : '#ccc', color: prev ? '#222' : '#999',
                    border: '1px solid #999', cursor: prev ? 'pointer' : 'default',
                    borderRadius: 2,
                  }}
                >
                  ← Anterior
                </button>
                <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#777' }}>
                  {FLOWS.flatMap(f => f.screens).findIndex(s => s.id === screen) + 1} / {FLOWS.flatMap(f => f.screens).length}
                </span>
                <button
                  onClick={() => next && navigate(next.id as ScreenId)}
                  disabled={!next}
                  style={{
                    padding: '5px 12px', fontSize: 11, fontFamily: 'monospace',
                    backgroundColor: next ? '#b0b0b0' : '#ccc', color: next ? '#222' : '#999',
                    border: '1px solid #999', cursor: next ? 'pointer' : 'default',
                    borderRadius: 2,
                  }}
                >
                  Próxima →
                </button>
              </>
            )
          })()}
        </div>
      </main>
    </div>
  )
}
