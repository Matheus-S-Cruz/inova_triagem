// ─── Geolocalização do usuário + cálculo de unidade de saúde mais próxima ──
// Hook único usado tanto pelo mapa (LocationMap.tsx) quanto pelo motor de
// recomendação do resultado da triagem (Flow2.tsx) — assim os dois falam a
// mesma posição do usuário e a mesma fórmula de distância, sem duplicar
// lógica de geolocalização em dois lugares.
import L from "leaflet"
import { useEffect, useState } from "react"
import type { HealthUnitMarker } from "../components/LocationMap"

export type GeoStatus = "loading" | "ok" | "error"

export interface GeoResult {
  position: [number, number] | null // [lat, lng]
  accuracy: number | null
  status: GeoStatus
  errorMsg: string
}

// Fallback quando a geolocalização falha/é negada. Como as unidades de
// saúde cadastradas (ver lib/healthUnits.ts) são todas de Florianópolis, o
// fallback aponta pro centro da cidade — não pra São Paulo — assim "unidade
// mais próxima" continua fazendo sentido mesmo sem permissão de localização.
export const FLORIANOPOLIS_FALLBACK: [number, number] = [-27.5954, -48.548]

export function useGeolocation(): GeoResult {
  const [position, setPosition] = useState<[number, number] | null>(null)
  const [accuracy, setAccuracy] = useState<number | null>(null)
  const [status, setStatus] = useState<GeoStatus>("loading")
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

  return { position, accuracy, status, errorMsg }
}

/** Distância em km entre duas coordenadas, usando o cálculo nativo do
 * Leaflet (L.LatLng.distanceTo, que retorna metros) — evita reimplementar
 * a fórmula de distância geográfica na mão, já que o projeto já depende
 * de leaflet mesmo. */
export function distanceKm(
  [lat1, lng1]: [number, number],
  [lat2, lng2]: [number, number],
): number {
  const metros = L.latLng(lat1, lng1).distanceTo(L.latLng(lat2, lng2))
  return metros / 1000
}

export interface NearestUnitResult {
  unit: HealthUnitMarker
  distanceKm: number
}

/**
 * Encontra a unidade mais próxima de `position`, filtrando por tipo (ex: só
 * "Hospital" para risco vermelho). Se nenhuma unidade do tipo pedido
 * existir, cai para a mais próxima entre TODAS as unidades — nunca retorna
 * null enquanto houver ao menos uma unidade cadastrada.
 */
export function findNearestUnit(
  position: [number, number],
  units: HealthUnitMarker[],
  preferredTypes?: HealthUnitMarker["type"][],
): NearestUnitResult | null {
  if (units.length === 0) return null

  const pool =
    preferredTypes && preferredTypes.length > 0
      ? units.filter((u) => preferredTypes.includes(u.type))
      : units

  const candidates = pool.length > 0 ? pool : units // fallback: nenhuma do tipo pedido

  let nearest = candidates[0]
  let nearestDist = distanceKm(position, [nearest.lat, nearest.lng])

  for (const u of candidates.slice(1)) {
    const d = distanceKm(position, [u.lat, u.lng])
    if (d < nearestDist) {
      nearest = u
      nearestDist = d
    }
  }

  return { unit: nearest, distanceKm: nearestDist }
}