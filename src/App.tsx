import { useEffect, useState } from "react"

import { MobilePage } from "./components/Wire"

import { TriageProvider, useTriage } from "./context/TriageContext"

import { UserStorage, type Usuario } from "./lib/storage"

import {
  HomeScreen,
  LGPDScreen,
  Q1Screen,
  Q2Screen,
  Q3Screen,
  Q4Screen,
  Q5Screen,
  Q6Screen,
} from "./screens/Flow1"

import { ResultScreen } from "./screens/Flow2"

import { MapScreen, UnitListScreen, UnitDetailScreen } from "./screens/Flow3"

import {
  RegisterScreen,
  LoginScreen,
  ProfileScreen,
  HistoryScreen,
} from "./screens/Flow4"

import { TeamLoginScreen, OccupancyScreen, AdminScreen } from "./screens/Flow5"

export type ScreenId = "home" | "lgpd" | "q1" | "q2" | "q3" | "q4" | "q5" | "q6" | "result" | "map" | "unitlist" | "unitdetail" | "register" | "login" | "profile" | "history" | "teamlogin" | "occupancy" | "admin"

export type Navigate = (to: ScreenId) => void

// FLOWS continua servindo de fonte de verdade para ALL_SCREEN_IDS (validação
// do hash da URL) — não removemos "Fluxo 1" daqui, senão um F5 numa tela de
// pergunta (ex: #q3) cairia em "home" por não achar o hash na lista válida.
// A seção "Fluxo 1" só deixa de ser RENDERIZADA no menu lateral (ver
// `visibleFlows` dentro de AppShell), substituída pelos atalhos reais.
const FLOWS = [
  {
    label: "Fluxo 1 — Entrada e Triagem",

    screens: [
      { id: "home", label: "1. Tela Inicial" },

      { id: "lgpd", label: "2. Consentimento LGPD" },

      { id: "q1", label: "3a. Sintoma Principal" },

      { id: "q2", label: "3b. Duração" },

      { id: "q3", label: "3c. Febre / Dor / Falta de ar" },

      { id: "q4", label: "3d. Piora Rápida" },

      { id: "q5", label: "3e. Grupo Vulnerável" },

      { id: "q6", label: "3f. Medicamentos" },
    ],
  },

  {
    label: "Fluxo 2 — Resultado",

    screens: [{ id: "result", label: "4. Classificação de Risco" }],
  },

  {
    label: "Fluxo 3 — Mapa e Lotação",

    screens: [
      { id: "map", label: "6. Mapa de Unidades" },

      { id: "unitlist", label: "7. Lista de Unidades" },

      { id: "unitdetail", label: "8. Detalhe da Unidade" },
    ],
  },

  {
    label: "Fluxo 4 — Perfil e Histórico",

    screens: [
      { id: "register", label: "9. Cadastro" },

      { id: "login", label: "9b. Entrar" },

      { id: "profile", label: "10. Perfil do Usuário" },

      { id: "history", label: "11. Histórico de Triagens" },
    ],
  },

  {
    label: "Fluxo 5 — Painel da Unidade",

    screens: [
      { id: "teamlogin", label: "12. Login da Equipe" },

      { id: "occupancy", label: "13. Atualizar Lotação" },

      { id: "admin", label: "14. Painel Administrativo" },
    ],
  },
]

// Conjunto de todos os ids válidos (derivado de FLOWS), usado para validar

// o hash da URL — evita duplicar a lista de screens em outro lugar.

const ALL_SCREEN_IDS = new Set(
  FLOWS.flatMap((f) => f.screens).map((s) => s.id),
) as Set<ScreenId>

/** Lê a tela atual a partir de window.location.hash (ex: "#profile" → 'profile'). */

function getScreenFromHash(): ScreenId {
  // Lê a tela salva na URL (#profile, #q1, etc). Se o hash não existir
  // ou for inválido, cai no fallback "home" — assim um F5 não perde o lugar
  const hash = window.location.hash.replace("#", "") as ScreenId

  return ALL_SCREEN_IDS.has(hash) ? hash : "home"
}

function ScreenRouter({
  screen,
  navigate,
}: {
  screen: ScreenId
  navigate: Navigate
}) {
  switch (screen) {
    case "home":
      return <HomeScreen navigate={navigate} />

    case "lgpd":
      return <LGPDScreen navigate={navigate} />

    case "q1":
      return <Q1Screen navigate={navigate} />

    case "q2":
      return <Q2Screen navigate={navigate} />

    case "q3":
      return <Q3Screen navigate={navigate} />

    case "q4":
      return <Q4Screen navigate={navigate} />

    case "q5":
      return <Q5Screen navigate={navigate} />

    case "q6":
      return <Q6Screen navigate={navigate} />

    case "result":
      return <ResultScreen navigate={navigate} />

    case "map":
      return <MapScreen navigate={navigate} />

    case "unitlist":
      return <UnitListScreen navigate={navigate} />

    case "unitdetail":
      return <UnitDetailScreen navigate={navigate} />

    case "register":
      return <RegisterScreen navigate={navigate} />

    case "login":
      return <LoginScreen navigate={navigate} />

    case "profile":
      return <ProfileScreen navigate={navigate} />

    case "history":
      return <HistoryScreen navigate={navigate} />

    case "teamlogin":
      return <TeamLoginScreen navigate={navigate} />

    case "occupancy":
      return <OccupancyScreen navigate={navigate} />

    case "admin":
      return <AdminScreen navigate={navigate} />

    default:
      return <HomeScreen navigate={navigate} />
  }
}

export default function App() {
  // A tela inicial vem do hash da URL (se houver um válido), em vez de

  // sempre começar em 'home'. Isso faz o F5 manter a tela atual.

  const [screen, setScreen] = useState<ScreenId>(() =>
    typeof window !== "undefined" ? getScreenFromHash() : "home",
  )

  const [navOpen, setNavOpen] = useState(false)

  const [navCollapsed, setNavCollapsed] = useState(true)

  // Mantém a tela sincronizada com a URL: reage ao voltar/avançar do

  // navegador (evento hashchange) trocando a tela sem precisar de

  // react-router.

  useEffect(() => {
    const onHashChange = () => setScreen(getScreenFromHash())

    window.addEventListener("hashchange", onHashChange)

    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  const navigate: Navigate = (to) => {
    setScreen(to)

    window.location.hash = to // grava a tela atual na URL (sobrevive a F5)

    setNavOpen(false) // fecha o drawer ao navegar, em telas pequenas
  }

  // TriageProvider precisa envolver o menu lateral também (não só a tela
  // ativa), porque o atalho "Unidades Próximas" do menu usa setNearestUnit
  // do contexto — ver AppShell logo abaixo.
  return (
    <TriageProvider>
      <AppShell
        screen={screen}
        navigate={navigate}
        navOpen={navOpen}
        setNavOpen={setNavOpen}
        navCollapsed={navCollapsed}
        setNavCollapsed={setNavCollapsed}
      />
    </TriageProvider>
  )
}

function AppShell({
  screen,
  navigate,
  navOpen,
  setNavOpen,
  navCollapsed,
  setNavCollapsed,
}: {
  screen: ScreenId
  navigate: Navigate
  navOpen: boolean
  setNavOpen: (v: boolean | ((prev: boolean) => boolean)) => void
  navCollapsed: boolean
  setNavCollapsed: (v: boolean) => void
}) {
  const { setNearestUnit } = useTriage()

  // Recalculado a cada render (que já acontece a cada navigate()) — reflete
  // login/logout feitos em LoginScreen/RegisterScreen/ProfileScreen sem
  // precisar de um estado próprio duplicado aqui.
  const account: Usuario | null = UserStorage.isLoggedIn()
    ? UserStorage.get()
    : null

  // "Unidades Próximas" no menu lateral é uma consulta geral, não ligada a
  // uma triagem específica — limpa o nearestUnit (se houver, de uma
  // triagem anterior) para o mapa mostrar TODAS as unidades. Mesma lógica
  // já usada no atalho "Unidades Próximas" da HomeScreen.
  const openNearbyUnits = () => {
    setNearestUnit(null)

    navigate("map")
  }

  

  const navItemStyle = (active: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    textAlign: "left",

    padding: "16px 14px 16px 18px",
    fontSize: 14,
    fontWeight: active ? 700 : 400,

    color: active ? "#fff" : "#C6D5E0",

    backgroundColor: active ? "#134E75" : "transparent",

    border: "none",
    cursor: "pointer",

    borderLeft: active ? "3px solid #A9BBC9" : "3px solid transparent",
    borderBottom: "1px solid #163B5C",

    transition: "all 0.1s",
  })

  return (
    <div
      className="app-shell"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      {/* Topbar só aparece em telas estreitas (ver .app-topbar no index.css) */}
      <div className="app-topbar">
        <button
          onClick={() => setNavOpen((v) => !v)}
          aria-label="Abrir navegação de telas"
          style={{
            background: "#0F2A4A",
            border: "1px solid #155E8A",
            borderRadius: 8,

            color: "#fff",
            fontSize: 18,
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(15, 42, 74, 0.3)",
          }}
        >
          ☰
        </button>
        
      </div>

      {/* Menu lateral */}
      <aside
        className={`app-sidebar${navOpen ? " open" : ""}${
          navCollapsed ? " collapsed" : ""
        }`}
        style={{
          backgroundColor: "#0F2A4A",
          color: "#C6D5E0",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            padding: "16px 12px 14px",
            borderBottom: "1px solid #155E8A",
            position: "relative",
          }}
        >
          {/* X — fecha o drawer no mobile */}
          {navOpen && (
            <button
              onClick={() => setNavOpen(false)}
              aria-label="Fechar navegação"
              style={{
                position: "absolute",
                top: 10,
                right: 10,

                background: "none",
                border: "1px solid #155E8A",
                borderRadius: 6,

                color: "#fff",
                fontSize: 14,
                width: 26,
                height: 26,
                cursor: "pointer",
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
              position: "absolute",
              top: 10,
              right: 10,

              background: "none",
              border: "1px solid #155E8A",
              borderRadius: 6,

              color: "#fff",
              fontSize: 14,
              width: 26,
              height: 26,
              cursor: "pointer",

              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ‹
          </button>

          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.01em",
              marginBottom: 10,
            }}
          >
            Triagem+
          </div>

          {account ? (
            // ── Logado: mostra o perfil da pessoa ──────────────────────
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                paddingRight: 30,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: "#1B4A6D",

                  border: "1.5px solid #3A6E93",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  fontSize: 18,
                  flexShrink: 0,
                  backgroundImage: account.fotoPerfil
                  ? `url(${account.fotoPerfil})`
                  : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                }}
              >
                {!account.fotoPerfil && "👤"}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: 4,
                    lineHeight: 1.2,
                  }}
                >
                  {account.nomeCompleto || "Usuário"}
                </div>
                <button
                  onClick={() => navigate("profile")}
                  style={{
                    background: "none",
                    border: "1px solid #3A6E93",
                    borderRadius: 12,
                    padding: "2px 10px",

                    color: "#9FC3DB",
                    fontSize: 10,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "Inter, system-ui, sans-serif",
                  }}
                >
                  Meu Perfil
                </button>
              </div>
            </div>
          ) : (
            // ── Deslogado: convite para cadastro/login ─────────────────
            <button
              onClick={() => navigate("login")}
              style={{
                width: "calc(100% - 30px)",
                background: "linear-gradient(135deg, #155E8A 0%, #0F9B8E 100%)",

                color: "#fff",
                border: "none",
                borderRadius: 8,

                padding: "8px 12px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              Cadastrar / Entrar
            </button>
          )}
        </div>

        {/* Atalhos reais — no lugar do antigo "Fluxo 1" (telas internas) */}
        <div>
          <div
            style={{
              padding: "14px 12px 6px",
              fontSize: 10,
              fontFamily: "Inter, system-ui, sans-serif",

              color: "#4E6A80",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Acesso
          </div>

           <div style={{ borderTop: "1px solid #163B5C" }}>
            <button
              onClick={() => navigate("home")}
              style={navItemStyle(screen === "home")}
            >
              🏠 Página Inicial
            </button>

            <button
              onClick={openNearbyUnits}
              style={navItemStyle(screen === "map")}
            >
              🗺 Unidades Próximas
            </button>

            {account && (
              <button
                onClick={() => navigate("history")}
                style={navItemStyle(screen === "history")}
              >
                📋 Histórico de Triagens
              </button>
            )}
          </div>
        </div>

       

        <div
          style={{
            padding: "16px 12px",
            borderTop: "1px solid #155E8A",
            marginTop: 8,
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: "#3A5468",
              fontFamily: "Inter, system-ui, sans-serif",
              lineHeight: 1.5,
            }}
          >
            ♿ Anotações de acessibilidade
            <br />
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
            position: "fixed",
            top: 12,
            left: 12,
            zIndex: 40,

            background: "#0F2A4A",
            border: "1px solid #155E8A",
            borderRadius: 8,

            color: "#fff",
            fontSize: 18,
            width: 40,
            height: 40,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(15, 42, 74, 0.3)",

            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ☰
        </button>
      )}

      {/* Fundo escurecido — clicar fora do menu também fecha (só existe em telas estreitas) */}
      {navOpen && (
        <div className="app-backdrop" onClick={() => setNavOpen(false)} />
      )}

      {/* Main: página web comum, ocupando 100% do espaço, sem moldura de device */}
      <main
        className="app-main"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          padding: navCollapsed ? "60px 0 0" : 0,
          overflowY: "auto",
        }}
      >
        <MobilePage>
          <ScreenRouter screen={screen} navigate={navigate} />
        </MobilePage>
      </main>
    </div>
  )
}