import { useState } from "react"

import type { Navigate } from "../App"

import {
  NavBar,
  Btn,
  OccupancyTag,
  WaitTime,
  SectionTitle,
  Divider,
  A11yNote,
  ScreenWrap,
  Content,
  ListRow,
} from "../components/Wire"

import { LocationMap } from "../components/LocationMap"
import { HEALTH_UNITS, RISK_LEVEL_UNIT_TYPES } from "../lib/healthUnits"
import {
  useGeolocation,
  distanceKm,
  FLORIANOPOLIS_FALLBACK,
} from "../lib/geolocation"
import { useTriage } from "../context/TriageContext"

// ─── Unit data ────────────────────────────────────────────────────────────────

type UnitType = "UBS" | "UPA" | "Hospital" | "Particular"

type OccLevel = "low" | "medium" | "high"

interface Unit {
  id: number

  name: string

  type: UnitType

  distance: string

  wait: number

  occupancy: OccLevel

  address: string

  hours: string

  phone: string
}

const UNITS: Unit[] = [
  {
    id: 1,
    name: "UBS Vila Mariana",
    type: "UBS",
    distance: "0,4 km",
    wait: 25,
    occupancy: "low",
    address: "R. Domingos de Morais, 2187",
    hours: "Seg–Sex 7h–19h",
    phone: "(11) 5085-6070",
  },

  {
    id: 2,
    name: "UPA Santo André",
    type: "UPA",
    distance: "1,2 km",
    wait: 70,
    occupancy: "high",
    address: "Av. Industrial, 600",
    hours: "24 horas",
    phone: "(11) 4437-5000",
  },

  {
    id: 3,
    name: "UBS Saúde Coletiva",
    type: "UBS",
    distance: "1,8 km",
    wait: 40,
    occupancy: "medium",
    address: "R. Catequese, 43",
    hours: "Seg–Sex 7h–17h",
    phone: "(11) 4993-5660",
  },

  {
    id: 4,
    name: "Hospital Municipal",
    type: "Hospital",
    distance: "2,4 km",
    wait: 90,
    occupancy: "high",
    address: "Av. Getúlio Vargas, 1800",
    hours: "24 horas",
    phone: "(11) 4455-0000",
  },

  {
    id: 5,
    name: "Clínica Vida+",
    type: "Particular",
    distance: "3,1 km",
    wait: 15,
    occupancy: "low",
    address: "R. das Flores, 120",
    hours: "Seg–Sáb 8h–20h",
    phone: "(11) 3344-5566",
  },
]

const TYPE_COLORS: Record<UnitType, string> = {
  UBS: "#4E6A80",
  UPA: "#ea580c",
  Hospital: "#7c3aed",
  Particular: "#0369a1",
}

// ─── Classificação por distância (substitui a antiga lotação mockada) ─────
// Verde = perto, Amarelo = médio, Vermelho = longe. Os limites (em km) são
// pensados para Florianópolis — a maioria das unidades cadastradas em
// lib/healthUnits.ts fica dentro de uma faixa de poucos km do usuário.
type DistanceLevel = "near" | "medium" | "far"

function getDistanceLevel(km: number): DistanceLevel {
  if (km <= 2) return "near"
  if (km <= 5) return "medium"
  return "far"
}

const DISTANCE_CONFIG: Record<DistanceLevel, { color: string; label: string }> = {
  near: { color: "#16a34a", label: "Perto" },
  medium: { color: "#ca8a04", label: "Médio" },
  far: { color: "#dc2626", label: "Longe" },
}

function DistanceTag({ km }: { km: number }) {
  const level = getDistanceLevel(km)
  const c = DISTANCE_CONFIG[level]
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 11,
        fontWeight: 600,
        color: c.color,
        border: `1.5px solid ${c.color}`,
        borderRadius: 20,
        padding: "2px 8px",
        fontFamily: "Inter, system-ui, sans-serif",
        backgroundColor: `${c.color}12`,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: c.color,
          flexShrink: 0,
          display: "inline-block",
        }}
      />
      {c.label}
    </span>
  )
}

// ─── 6. Mapa ──────────────────────────────────────────────────────────────────

export function MapScreen({ navigate }: { navigate: Navigate }) {
  const [activeTab, setActiveTab] = useState<"map" | "list">("map")

  const [filter, setFilter] = useState<UnitType | "Todos">("Todos")

  const { nearestUnit, result } = useTriage()

  const { position: userPosition } = useGeolocation()

  const origin = userPosition ?? FLORIANOPOLIS_FALLBACK

  // Depois de uma triagem, o resultado já aponta a unidade recomendada
  // (ver ResultScreen, em Flow2.tsx) — nesse caso o mapa mostra só ela, em
  // vez das 61 unidades cadastradas, pra não poluir a recomendação. Se o
  // usuário chegou aqui sem ter feito triagem (ex: menu "Unidades
  // próximas"), mantém a lista completa normalmente.
  const mapUnits = nearestUnit ? [nearestUnit.unit] : HEALTH_UNITS

  // "Mais próximas": por padrão (filtro "Todos"), prioriza o(s) tipo(s) de
  // unidade recomendado(s) pelo resultado da triagem (ex: laranja → só
  // UPAs) — assim a lista já nasce alinhada com a recomendação. Se o
  // usuário escolher um filtro manual (UBS/UPA/Hospital/Particular), esse
  // filtro tem prioridade. Distância calculada com o Leaflet
  // (lib/geolocation.ts), a partir da localização real do usuário.
  const recommendedTypes = RISK_LEVEL_UNIT_TYPES[result.level]

  const basePool =
    filter === "Todos"
      ? HEALTH_UNITS.filter((u) => recommendedTypes.includes(u.type))
      : HEALTH_UNITS.filter((u) => u.type === filter)

  const pool = basePool.length > 0 ? basePool : HEALTH_UNITS

  const nearbyUnits = pool
    .map((u) => ({ ...u, distKm: distanceKm(origin, [u.lat, u.lng]) }))
    .sort((a, b) => a.distKm - b.distKm)
    .slice(0, 3)

  return (
    <ScreenWrap>
      <NavBar title="Unidades de Saúde" onBack={() => navigate("result")} />

      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #D7E3EC",
          backgroundColor: "#EFF5F9",
        }}
      >
        {(["map", "list"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() =>
              tab === "list" ? navigate("unitlist") : setActiveTab("map")
            }
            style={{
              flex: 1,
              padding: "10px",
              border: "none",
              cursor: "pointer",

              backgroundColor: activeTab === tab ? "#fff" : "transparent",

              borderBottom:
                activeTab === tab
                  ? "2px solid #155E8A"
                  : "2px solid transparent",

              fontSize: 12,
              fontWeight: activeTab === tab ? 700 : 400,
              color: activeTab === tab ? "#16324F" : "#7C93A6",
            }}
          >
            {tab === "map" ? "🗺  Mapa" : "☰  Lista"}
          </button>
        ))}
      </div>

      <div
        style={{
          padding: "8px 16px",
          borderBottom: "1px solid #E7EFF4",
          display: "flex",
          gap: 6,
          overflowX: "auto",
        }}
      >
        {(["Todos", "UBS", "UPA", "Hospital", "Particular"] as const).map(
          (f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "4px 10px",
                border: "1.5px solid #C6D5E0",
                borderRadius: 12,

                backgroundColor: filter === f ? "#155E8A" : "#fff",

                color: filter === f ? "#fff" : "#4E6A80",

                fontSize: 10,
                fontFamily: "Inter, system-ui, sans-serif",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              {f}
            </button>
          ),
        )}
      </div>

      <Content noPad>
        <div style={{ padding: "12px 16px" }}>
          <LocationMap
             units={mapUnits}
             onUnitClick={() => navigate("unitdetail")}
             highlightUnitId={nearestUnit?.unit.id}
           />
        </div>

        <div style={{ padding: "0 16px 8px" }}>
          <div
            style={{
              fontSize: 10,
              fontFamily: "Inter, system-ui, sans-serif",
              color: "#7C93A6",
              marginBottom: 6,
            }}
          >
            LEGENDA — DISTÂNCIA DOS MARCADORES:
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { color: "#16a34a", label: "Perto" },
              { color: "#ca8a04", label: "Médio" },
              { color: "#dc2626", label: "Longe" },
            ].map(({ color, label }) => (
              <div
                key={label}
                style={{ display: "flex", alignItems: "center", gap: 4 }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: color,
                  }}
                />
                <span
                  style={{
                    fontSize: 10,
                    color: "#4E6A80",
                    fontFamily: "Inter, system-ui, sans-serif",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "8px 16px 16px" }}>
          <SectionTitle>Mais próximas</SectionTitle>
          {nearbyUnits.length === 0 ? (
            <div
              style={{
                fontSize: 12,
                color: "#9AAEBE",
                padding: "12px 0",
                textAlign: "center",
              }}
            >
              Nenhuma unidade do tipo "{filter}" encontrada nesta região.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {nearbyUnits.map((unit) => (
                <div
                  key={unit.id}
                  onClick={() => navigate("unitdetail")}
                  style={{
                    border: "1.5px solid #DCE7EF",
                    borderRadius: 8,
                    padding: "10px 12px",

                    backgroundColor: "#fff",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 6,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#0F2A4A",
                        }}
                      >
                        {unit.name}
                      </div>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          fontFamily: "Inter, system-ui, sans-serif",

                          color: TYPE_COLORS[unit.type],
                          border: `1px solid ${TYPE_COLORS[unit.type]}`,

                          borderRadius: 3,
                          padding: "0 4px",
                        }}
                      >
                        {unit.type}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: "#7C93A6",
                        fontFamily: "Inter, system-ui, sans-serif",
                      }}
                    >
                      {unit.distKm < 1
                        ? `${Math.round(unit.distKm * 1000)} m`
                        : `${unit.distKm.toFixed(1)} km`}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <DistanceTag km={unit.distKm} />
                    
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <A11yNote
          notes={[
            "Marcadores do mapa têm labels textuais alternativas",

            "Informação de lotação comunicada por cor E texto",

            "Filtro por tipo de unidade sincronizado entre mapa e lista",
          ]}
        />
      </Content>
    </ScreenWrap>
  )
}

// ─── 7. Lista de Unidades ─────────────────────────────────────────────────────

export function UnitListScreen({ navigate }: { navigate: Navigate }) {
  const [sort, setSort] = useState<"dist" | "wait" | "occ">("dist")

  const [filter, setFilter] = useState<UnitType | "Todos">("Todos")

  const filtered =
    filter === "Todos" ? UNITS : UNITS.filter((u) => u.type === filter)

  return (
    <ScreenWrap>
      <NavBar title="Unidades Próximas" onBack={() => navigate("map")} />

      {/* Tab toggle */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #D7E3EC",
          backgroundColor: "#EFF5F9",
        }}
      >
        {(["map", "list"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => (tab === "map" ? navigate("map") : undefined)}
            style={{
              flex: 1,
              padding: "10px",
              border: "none",
              cursor: "pointer",

              backgroundColor: tab === "list" ? "#fff" : "transparent",

              borderBottom:
                tab === "list" ? "2px solid #155E8A" : "2px solid transparent",

              fontSize: 12,
              fontWeight: tab === "list" ? 700 : 400,
              color: tab === "list" ? "#16324F" : "#7C93A6",
            }}
          >
            {tab === "map" ? "🗺  Mapa" : "☰  Lista"}
          </button>
        ))}
      </div>

      {/* Filter */}
      <div
        style={{
          padding: "8px 16px",
          borderBottom: "1px solid #E7EFF4",
          display: "flex",
          gap: 6,
          overflowX: "auto",
        }}
      >
        {(["Todos", "UBS", "UPA", "Hospital", "Particular"] as const).map(
          (f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "4px 10px",
                border: "1.5px solid #C6D5E0",
                borderRadius: 12,

                backgroundColor: filter === f ? "#155E8A" : "#fff",

                color: filter === f ? "#fff" : "#4E6A80",

                fontSize: 10,
                fontFamily: "Inter, system-ui, sans-serif",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              {f}
            </button>
          ),
        )}
      </div>

      {/* Sort */}
      <div
        style={{
          padding: "6px 16px",
          borderBottom: "1px solid #E7EFF4",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: "#7C93A6",
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          Ordenar:
        </span>
        {[
          { k: "dist" as const, l: "Distância" },
          { k: "wait" as const, l: "Espera" },
          { k: "occ" as const, l: "Lotação" },
        ].map(({ k, l }) => (
          <button
            key={k}
            onClick={() => setSort(k)}
            style={{
              padding: "3px 8px",
              border: "1px solid",
              borderRadius: 3,
              cursor: "pointer",
              fontSize: 10,

              borderColor: sort === k ? "#4E6A80" : "#D7E3EC",

              backgroundColor: sort === k ? "#4E6A80" : "#fff",

              color: sort === k ? "#fff" : "#5C7690",

              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      <Content>
        {filtered.map((unit) => (
          <ListRow key={unit.id} onClick={() => navigate("unitdetail")}>
            {/* Type badge */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: "#EAF2F6",

                border: `2px solid ${TYPE_COLORS[unit.type]}`,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,

                fontSize: 10,
                fontWeight: 700,
                color: TYPE_COLORS[unit.type],
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              {unit.type}
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#0F2A4A",
                  marginBottom: 3,
                }}
              >
                {unit.name}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  flexWrap: "wrap",
                  marginBottom: 3,
                }}
              >
                <OccupancyTag level={unit.occupancy} />
                <WaitTime minutes={unit.wait} />
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#7C93A6",
                  fontFamily: "Inter, system-ui, sans-serif",
                }}
              >
                📍 {unit.distance} · {unit.hours}
              </div>
            </div>
          </ListRow>
        ))}

        <A11yNote
          notes={[
            "Lista ordenável por critérios relevantes (distância, espera)",

            "Status de lotação com rótulo textual além da cor",

            "Itens da lista acessíveis por teclado (tab/enter)",
          ]}
        />
      </Content>
    </ScreenWrap>
  )
}

// ─── 8. Detalhe da Unidade ────────────────────────────────────────────────────

export function UnitDetailScreen({ navigate }: { navigate: Navigate }) {
  const { nearestUnit } = useTriage()

  // Quando o ResultScreen já calculou a unidade mais próxima (ver
  // TriageContext.nearestUnit), mostra os dados reais dela — nome, tipo e
  // distância real do usuário. Sem isso (ex: acesso direto pelo menu de
  // navegação, sem ter passado pela triagem), cai no dado de demonstração.
  const unit: Unit = nearestUnit
    ? {
        id: 0,
        name: nearestUnit.unit.name,
        type: nearestUnit.unit.type,
        distance:
          nearestUnit.distanceKm < 1
            ? `${Math.round(nearestUnit.distanceKm * 1000)} m`
            : `${nearestUnit.distanceKm.toFixed(1)} km`,
        wait: 0,
        occupancy: "medium",
        address: "Endereço não cadastrado ainda",
        hours: "Consulte a unidade",
        phone: "—",
      }
    : UNITS[1] // demo: UPA Santo André

  return (
    <ScreenWrap>
      <NavBar title="Detalhes" onBack={() => navigate("unitlist")} />
      <Content>
        {/* Header */}
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 6,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: "#0F2A4A",
                  letterSpacing: "-0.02em",
                  marginBottom: 3,
                }}
              >
                {unit.name}
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  fontFamily: "Inter, system-ui, sans-serif",

                  color: TYPE_COLORS[unit.type],
                  border: `1.5px solid ${TYPE_COLORS[unit.type]}`,

                  borderRadius: 4,
                  padding: "1px 6px",
                }}
              >
                {unit.type}
              </span>
            </div>
            <div style={{ textAlign: "right" }}>
              <OccupancyTag level={unit.occupancy} />
              <div
                style={{
                  fontSize: 10,
                  color: "#7C93A6",
                  fontFamily: "Inter, system-ui, sans-serif",
                  marginTop: 4,
                }}
              >
                Atualizado há 5 min
              </div>
            </div>
          </div>
        </div>

        {/* Live status */}
        <div
          style={{
            backgroundColor: "#F5F9FB",
            border: "1.5px solid #DCE7EF",

            borderRadius: 8,
            padding: "12px",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontFamily: "Inter, system-ui, sans-serif",
              color: "#7C93A6",
              marginBottom: 8,
              letterSpacing: "0.05em",
            }}
          >
            STATUS ATUAL
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#dc2626" }}>
                {unit.wait}
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "#7C93A6",
                  fontFamily: "Inter, system-ui, sans-serif",
                }}
              >
                MIN ESPERA
              </div>
            </div>
            <div style={{ width: 1, backgroundColor: "#E7EFF4" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#155E8A" }}>
                87%
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "#7C93A6",
                  fontFamily: "Inter, system-ui, sans-serif",
                }}
              >
                CAPACIDADE
              </div>
            </div>
            <div style={{ width: 1, backgroundColor: "#E7EFF4" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#155E8A" }}>
                12
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "#7C93A6",
                  fontFamily: "Inter, system-ui, sans-serif",
                }}
              >
                NA FILA
              </div>
            </div>
          </div>
        </div>

        <Divider />
        <SectionTitle>Informações</SectionTitle>

        {[
          { icon: "📍", label: "Endereço", value: unit.address },

          { icon: "🕐", label: "Horário", value: unit.hours },

          { icon: "📞", label: "Telefone", value: unit.phone },

          {
            icon: "♿",
            label: "Acessibilidade",
            value: "Rampa, banheiro adaptado, libras",
          },

          {
            icon: "🚌",
            label: "Transporte",
            value: "Linhas 4512, 6280 — parada a 80m",
          },
        ].map(({ icon, label, value }) => (
          <div
            key={label}
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 10,
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontFamily: "Inter, system-ui, sans-serif",
                  color: "#7C93A6",
                }}
              >
                {label.toUpperCase()}
              </div>
              <div style={{ fontSize: 13, color: "#16324F" }}>{value}</div>
            </div>
          </div>
        ))}

        <Divider />

        {/* Services */}
        <SectionTitle>Serviços Disponíveis</SectionTitle>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: 16,
          }}
        >
          {[
            "Clínica Geral",
            "Pediatria",
            "Ortopedia",
            "Raio-X",
            "Laboratório",
            "Farmácia",
          ].map((s) => (
            <span
              key={s}
              style={{
                fontSize: 11,
                border: "1px solid #C6D5E0",
                borderRadius: 4,

                padding: "2px 8px",
                color: "#4E6A80",
                backgroundColor: "#F5F9FB",
              }}
            >
              {s}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Btn label="📍 Como Chegar" onClick={() => {}} variant="primary" />
          <Btn
            label="📞 Ligar para a Unidade"
            onClick={() => {}}
            variant="secondary"
          />
          <Btn
            label="← Voltar à lista"
            onClick={() => navigate("unitlist")}
            variant="ghost"
          />
        </div>

        <A11yNote
          notes={[
            "Status numérico (tempo, capacidade) complementa a cor",

            'Telefone clicável com href="tel:" para usuários de leitor de tela',
          ]}
        />
      </Content>
    </ScreenWrap>
  )
}
