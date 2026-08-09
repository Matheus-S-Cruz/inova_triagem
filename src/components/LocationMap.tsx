import { useEffect, useState } from "react"

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet"

import L from "leaflet"

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

// ─── Tipo de unidade de saúde ───────────────────────────────────────────────
// TODO: quando o backend/classificação de risco estiver pronto, popular esse
// tipo com os dados reais (id, nome, tipo, distância, lotação, etc.) e passar
// via prop `units` para o LocationMap. Por enquanto o mapa só mostra a
// localização do paciente.
export interface HealthUnitMarker {
  id: string | number
  name: string
  type: "UBS" | "UPA" | "Hospital" | "Particular"
  lat: number
  lng: number
}

const UNIT_TYPE_COLORS: Record<HealthUnitMarker["type"], string> = {
  UBS: "#4E6A80",
  UPA: "#ea580c",
  Hospital: "#7c3aed",
  Particular: "#0369a1",
}

/** Ícone colorido por tipo de unidade — usado quando `units` for preenchido. */
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

// ─── Sub-componente: centraliza o mapa quando a localização muda ───────────
// react-leaflet não recentraliza automaticamente quando o `center` do
// MapContainer muda depois da primeira renderização — esse componente
// resolve isso chamando map.setView() sempre que `position` mudar.
function RecenterOnLocate({
    position,
    zoom = 16,
  }: {
    position: [number, number]
    zoom?: number
  }) {
  const map = useMap()

  useEffect(() => {
    // flyTo anima o pan + zoom juntos, em vez de "pular" direto pra posição
    map.flyTo(position, zoom, { duration: 1.2 })
  }, [position, zoom, map])

  return null
}

const SAO_PAULO_FALLBACK: [number, number] = [-23.5505, -46.6333]

export function LocationMap({
  units = [],
  onUnitClick,
}: {
  /** Unidades de saúde a exibir no mapa. Vazio por enquanto — ver TODO acima. */
  units?: HealthUnitMarker[]
  onUnitClick?: (unit: HealthUnitMarker) => void
}) {
  const [position, setPosition] = useState<[number, number] | null>(null)
  const [accuracy, setAccuracy] = useState<number | null>(null)
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("error")
      setErrorMsg("Seu navegador não suporta geolocalização.")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude])
        setAccuracy(pos.coords.accuracy)
        setStatus("ok")
      },
      (err) => {
        setStatus("error")
        setErrorMsg(
          err.code === err.PERMISSION_DENIED
            ? "Permissão de localização negada. Mostrando região padrão."
            : "Não foi possível obter sua localização. Mostrando região padrão.",
        )
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  }, [])

  const center = position ?? SAO_PAULO_FALLBACK

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

          {position && <RecenterOnLocate position={position} zoom={16} />}

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

          {/* TODO: quando `units` vier preenchido (resultado da triagem +
              busca de unidades próximas), estes marcadores aparecem
              automaticamente — nenhuma outra mudança é necessária aqui. */}
          {units.map((unit) => (
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
              </Popup>
            </Marker>
          ))}
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