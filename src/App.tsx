import { useState } from 'react'
import { MobilePage } from './components/Wire'
import { TriageProvider } from './context/TriageContext'
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
    screens: [
      { id: 'result', label: '4. Classificação de Risco' },
      { id: 'homecare', label: '5. Cuidados em Casa' },
    ],
  },
  {
    label: 'Fluxo 3 — Mapa e Lotação',
    screens: [
      { id: 'map', label: '6. Mapa de Unidades' },
      { id: 'unitlist', label: '7. Lista de Unidades' },
      { id: 'unitdetail', label: '8. Detalhe da Unidade' },
    ],
  },
  {
    label: 'Fluxo 4 — Perfil e Histórico',
    screens: [
      { id: 'register', label: '9. Cadastro' },
      { id: 'profile', label: '10. Perfil do Usuário' },
      { id: 'history', label: '11. Histórico de Triagens' },
    ],
  },
  {
    label: 'Fluxo 5 — Painel da Unidade',
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
  const [screen, setScreen] = useState<ScreenId>('home') // ← era 'home'
  const [navOpen, setNavOpen] = useState(false)
  const [navCollapsed, setNavCollapsed] = useState(false)
  // ...restante do arquivo sem alterações

  const navigate: Navigate = (to) => {
    setScreen(to)
    setNavOpen(false) // fecha o drawer ao navegar, em telas pequenas
  }

  const currentLabel = FLOWS.flatMap(f => f.screens).find(s => s.id === screen)?.label ?? ''

  return (
    <div className="app-shell" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Topbar só aparece em telas estreitas (ver .app-topbar no index.css) */}
      <div className="app-topbar">
        <button
          onClick={() => setNavOpen(v => !v)}
          aria-label="Abrir navegação de telas"
          style={{
            background: 'none', border: '1px solid #155E8A', borderRadius: 6,
            color: '#fff', fontSize: 16, padding: '4px 10px', cursor: 'pointer',
          }}
        >
          ☰
        </button>
        <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>Triagem+</span>
      </div>

      {/* Sidebar navigator (ferramenta de dev — não faz parte do produto final) */}
      <aside
        className={`app-sidebar${navOpen ? ' open' : ''}${navCollapsed ? ' collapsed' : ''}`}
        style={{ backgroundColor: '#0F2A4A', color: '#C6D5E0', overflowY: 'auto' }}
      >
        <div style={{ padding: '14px 12px 10px', borderBottom: '1px solid #155E8A', position: 'relative' }}>
          {/* X — fecha o drawer no mobile */}
          {navOpen && (
            <button
              onClick={() => setNavOpen(false)}
              aria-label="Fechar navegação"
              style={{
                position: 'absolute', top: 10, right: 10,
                background: 'none', border: '1px solid #155E8A', borderRadius: 6,
                color: '#fff', fontSize: 14, width: 26, height: 26, cursor: 'pointer',
              }}
            >
              ✕
            </button>
          )}
          {/* ‹ — minimiza o menu no desktop */}
          <button
            className="sidebar-collapse-btn"
            onClick={() => setNavCollapsed(true)}
            aria-label="Minimizar menu"
            style={{
              position: 'absolute', top: 10, right: 10,
              background: 'none', border: '1px solid #155E8A', borderRadius: 6,
              color: '#fff', fontSize: 14, width: 26, height: 26, cursor: 'pointer',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            ‹
          </button>
          <div style={{ fontSize: 9, fontFamily: 'Inter, system-ui, sans-serif', color: '#4E6A80', letterSpacing: '0.08em', marginBottom: 3 }}>
            PROTÓTIPO LO-FI
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
            Triagem+
          </div>
          <div style={{ fontSize: 9, color: '#4E6A80', marginTop: 1 }}>
            Wireframe · 14 telas · 5 fluxos
          </div>
        </div>

        {FLOWS.map((flow) => (
          <div key={flow.label}>
            <div style={{
              padding: '10px 12px 3px', fontSize: 9, fontFamily: 'Inter, system-ui, sans-serif',
              color: '#4E6A80', textTransform: 'uppercase', letterSpacing: '0.06em',
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
                  color: screen === s.id ? '#fff' : '#7C93A6',
                  backgroundColor: screen === s.id ? '#134E75' : 'transparent',
                  border: 'none', cursor: 'pointer',
                  borderLeft: screen === s.id ? '2px solid #A9BBC9' : '2px solid transparent',
                  transition: 'all 0.1s',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        ))}

        <div style={{ padding: '16px 12px', borderTop: '1px solid #155E8A', marginTop: 8 }}>
          <div style={{ fontSize: 9, color: '#3A5468', fontFamily: 'Inter, system-ui, sans-serif', lineHeight: 1.5 }}>
            ♿ Anotações de acessibilidade<br />
            indicadas nas telas relevantes
          </div>
        </div>
      </aside>

      {/* › — reabre o menu minimizado (só existe em desktop, quando navCollapsed) */}
      {navCollapsed && (
        <button
          className="sidebar-reopen-btn"
          onClick={() => setNavCollapsed(false)}
          aria-label="Expandir menu"
          style={{
            position: 'fixed', top: 16, left: 8, zIndex: 20,
            background: '#0F2A4A', border: '1px solid #155E8A', borderRadius: 6,
            color: '#fff', fontSize: 14, width: 26, height: 26, cursor: 'pointer',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          ›
        </button>
      )}

      {/* Fundo escurecido — clicar fora do menu também fecha (só existe em telas estreitas) */}
      {navOpen && <div className="app-backdrop" onClick={() => setNavOpen(false)} />}

      {/* Main: página web comum, ocupando 100% do espaço, sem moldura de device */}
      <main className="app-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', padding: 0, overflowY: 'auto' }}>
        {/* Frame label — só visual de dev, pode remover se quiser 100% "produto" */}
        <div style={{ padding: '8px 0', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, color: '#5C7690', textAlign: 'center' }}>
          <span style={{ backgroundColor: '#B9C8D4', padding: '2px 8px', borderRadius: 2 }}>
            {currentLabel}
          </span>
        </div>

        <MobilePage>
          {/* TriageProvider guarda as respostas de Q1–Q6 em um só lugar, para
              que o algoritmo de classificação em src/lib/triage.ts calcule o
              resultado real (em vez do antigo nível fixo "UPA") */}
          <TriageProvider>
            <ScreenRouter screen={screen} navigate={navigate} />
          </TriageProvider>
        </MobilePage>

        {/* Quick-jump arrows */}
        <div style={{ display: 'flex', gap: 8, padding: '16px 0', alignItems: 'center', justifyContent: 'center' }}>
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
                    padding: '5px 12px', fontSize: 11, fontFamily: 'Inter, system-ui, sans-serif',
                    backgroundColor: prev ? '#AFC2D1' : '#C6D5E0', color: prev ? '#16324F' : '#8CA1B2',
                    border: '1px solid #8CA1B2', cursor: prev ? 'pointer' : 'default',
                    borderRadius: 2,
                  }}
                >
                  ← Anterior
                </button>
                <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 10, color: '#66809A' }}>
                  {FLOWS.flatMap(f => f.screens).findIndex(s => s.id === screen) + 1} / {FLOWS.flatMap(f => f.screens).length}
                </span>
                <button
                  onClick={() => next && navigate(next.id as ScreenId)}
                  disabled={!next}
                  style={{
                    padding: '5px 12px', fontSize: 11, fontFamily: 'Inter, system-ui, sans-serif',
                    backgroundColor: next ? '#AFC2D1' : '#C6D5E0', color: next ? '#16324F' : '#8CA1B2',
                    border: '1px solid #8CA1B2', cursor: next ? 'pointer' : 'default',
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