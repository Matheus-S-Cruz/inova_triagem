import { useEffect } from "react"

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet"

import L from "leaflet"

import { useGeolocation, FLORIANOPOLIS_FALLBACK } from "../lib/geolocation"

// ─── Fix do ícone padrão do Leaflet ─────────────────────────────────────────
// Bundlers como o Vite não resolvem os caminhos relativos que o Leaflet usa
// internamente para o ícone padrão do marcador — sem isso, o marcador
// aparece quebrado (ícone quebrado / invisível). Usamos os ícones via CDN
// para não precisar mexer em configuração de assets do Vite.
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
  ._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

export interface HealthUnitMarker {
  id: string | number
  name: string
  type: "UBS" | "UPA" | "Hospital" | "Particular"
  lat: number
  lng: number
  /** Endereço completo — exibido no popup do mapa e na tela de detalhes
    * da unidade (ver UnitDetailScreen, em Flow3.tsx). */
   address?: string
}

const UNIT_TYPE_COLORS: Record<HealthUnitMarker["type"], string> = {
  UBS: "#4E6A80",
  UPA: "#ea580c",
  Hospital: "#7c3aed",
  Particular: "#0369a1",
}

function unitIcon(type: HealthUnitMarker["type"]) {
  const color = UNIT_TYPE_COLORS[type]
  return L.divIcon({
    className: "unit-marker",
    html: `<div style="
      width: 14px; height: 14px; border-radius: 50%;
      background:${color}; border: 2px solid #fff;
      box-shadow: 0 1px 4px rgba(0,0,0,0.4);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })
}

/** Ícone maior/destacado — usado para a unidade recomendada (mais próxima). */
function highlightedUnitIcon(type: HealthUnitMarker["type"]) {
  const color = UNIT_TYPE_COLORS[type]
  return L.divIcon({
    className: "unit-marker-highlight",
    html: `<div style="
      width: 22px; height: 22px; border-radius: 50%;
      background:${color}; border: 3px solid #fff;
      box-shadow: 0 0 0 3px ${color}66, 0 2px 8px rgba(0,0,0,0.5);
    "></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  })
}

// ─── Sub-componente: centraliza o mapa quando a localização muda ───────────
// react-leaflet não recentraliza automaticamente quando o `center` do
// MapContainer muda depois da primeira renderização — esse componente
// resolve isso chamando map.flyTo() sempre que `position` mudar.
function RecenterOnLocate({
  position,
  zoom = 16,
}: {
  position: [number, number]
  zoom?: number
}) {
  const map = useMap()

  useEffect(() => {
    map.flyTo(position, zoom, { duration: 1.2 })
  }, [position, zoom, map])

  return null
}

// ─── Sub-componente: enquadra usuário + unidade destacada juntos ──────────
// Usado quando já existe uma unidade recomendada (ver
// TriageContext.nearestUnit) — em vez de só centralizar no usuário, o mapa
// ajusta zoom/pan para os dois pontos ficarem visíveis ao mesmo tempo.
function FocusOnPair({
  userPosition,
  unitPosition,
}: {
  userPosition: [number, number]
  unitPosition: [number, number]
}) {
  const map = useMap()

  useEffect(() => {
    const bounds = L.latLngBounds([userPosition, unitPosition])
    map.flyToBounds(bounds, { padding: [48, 48], duration: 1.2, maxZoom: 16 })
  }, [userPosition, unitPosition, map])

  return null
}

export function LocationMap({
  units = [],
  onUnitClick,
  highlightUnitId,
}: {
  /** Unidades de saúde a exibir no mapa. */
  units?: HealthUnitMarker[]
  onUnitClick?: (unit: HealthUnitMarker) => void
  /** Id da unidade a destacar (ex: a mais próxima calculada no resultado da
   * triagem — ver TriageContext.nearestUnit). Recebe ícone maior e o mapa
   * se ajusta para mostrar usuário + unidade juntos. */
  highlightUnitId?: string | number
}) {
  const { position, accuracy, status, errorMsg } = useGeolocation()

  const center = position ?? FLORIANOPOLIS_FALLBACK

  const highlighted = highlightUnitId
    ? units.find((u) => u.id === highlightUnitId)
    : undefined

  const otherUnits = highlighted
    ? units.filter((u) => u.id !== highlighted.id)
    : units

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          height: 240,
          borderRadius: 8,
          overflow: "hidden",
          border: "1.5px solid #DCE7EF",
        }}
      >
        <MapContainer
          center={center}
          zoom={position ? 15 : 12}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {position && highlighted && (
            <FocusOnPair
              userPosition={position}
              unitPosition={[highlighted.lat, highlighted.lng]}
            />
          )}
          {position && !highlighted && (
            <RecenterOnLocate position={position} zoom={16} />
          )}

          {position && (
            <>
              <Marker position={position}>
                <Popup>Você está aqui</Popup>
              </Marker>
              {accuracy && (
                <Circle
                  center={position}
                  radius={accuracy}
                  pathOptions={{
                    color: "#155E8A",
                    fillColor: "#155E8A",
                    fillOpacity: 0.1,
                  }}
                />
              )}
            </>
          )}

          {otherUnits.map((unit) => (
            <Marker
              key={unit.id}
              position={[unit.lat, unit.lng]}
              icon={unitIcon(unit.type)}
              eventHandlers={{
                click: () => onUnitClick?.(unit),
              }}
            >
              <Popup>
                <strong>{unit.name}</strong>
                <br />
                {unit.type}
                {unit.address && (
                  <>
                    <br />
                    <span style={{ fontSize: 11 }}>{unit.address}</span>
                  </>
                )}
              </Popup>
            </Marker>
          ))}

          {highlighted && (
            <Marker
              position={[highlighted.lat, highlighted.lng]}
              icon={highlightedUnitIcon(highlighted.type)}
              eventHandlers={{
                click: () => onUnitClick?.(highlighted),
                add: (e) => {
                  ;(e.target as L.Marker).openPopup()
                },
              }}
            >
              <Popup>
                <strong>⭐ {highlighted.name}</strong>
                <br />
                {highlighted.type} — unidade recomendada
                {highlighted.address && (
                  <>
                    <br />
                    <span style={{ fontSize: 11 }}>{highlighted.address}</span>
                  </>
                )}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {status === "loading" && (
        <div
          style={{
            fontSize: 11,
            color: "#7C93A6",
            marginTop: 6,
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          Obtendo sua localização...
        </div>
      )}

      {status === "error" && (
        <div
          style={{
            fontSize: 11,
            color: "#CA8A04",
            marginTop: 6,
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          ⚠ {errorMsg}
        </div>
      )}
    </div>
  )
}