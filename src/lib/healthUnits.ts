// ─── Unidades de Saúde de Florianópolis — dados reais ──────────────────────
// Fonte: CNES
// Consumido por LocationMap.tsx (prop `units`) para popular os marcadores
// coloridos no mapa — ver TODO que existia em Flow3.tsx/LocationMap.tsx.

import type { HealthUnitMarker } from "../components/LocationMap"
import type { RiskLevel } from "./triage"

export const HEALTH_UNITS: HealthUnitMarker[] = [
  // ── Centros de Saúde (UBS) ────────────────────────────────────────────
  { id: "cs-abraao", name: "CS Abraão", type: "UBS", lat: -27.603661, lng: -48.595979 },
  { id: "cs-agronomica", name: "CS Agronômica", type: "UBS", lat: -27.574267612263995, lng: -48.53663360739043 },
  { id: "cs-alto-ribeirao", name: "CS Alto Ribeirão", type: "UBS", lat: -27.7011887, lng: -48.5184835 },
  { id: "cs-armacao", name: "CS Armação", type: "UBS", lat: -27.752368548925624, lng: -48.509790300446895 },
  { id: "cs-balneario", name: "CS Balneário", type: "UBS", lat: -27.57958915, lng: -48.58328315 },
  { id: "cs-barra-da-lagoa", name: "CS Barra da Lagoa", type: "UBS", lat: -27.578828, lng: -48.433458 },
  { id: "cs-cachoeira-do-bom-jesus", name: "CS Cachoeira do Bom Jesus", type: "UBS", lat: -27.421960, lng: -48.431094 },
  { id: "cs-caeira-da-barra-do-sul", name: "CS Caeira da Barra do Sul", type: "UBS", lat: -27.811578, lng: -48.558795 },
  { id: "cs-campeche", name: "CS Campeche", type: "UBS", lat: -27.68118, lng: -48.493632 },
  { id: "cs-canasvieiras", name: "CS Canasvieiras", type: "UBS", lat: -27.451499, lng: -48.456532 },
  { id: "cs-canto-da-lagoa", name: "CS Canto da Lagoa", type: "UBS", lat: -27.616677, lng: -48.484084 },
  { id: "cs-capivari", name: "CS Capivari", type: "UBS", lat: -27.4581141, lng: -48.406973 },
  { id: "cs-capoeiras", name: "CS Capoeiras", type: "UBS", lat: -27.597048, lng: -48.597229 },
  { id: "cs-carianos", name: "CS Carianos", type: "UBS", lat: -27.668634, lng: -48.535848 },
  { id: "cs-centro", name: "CS Centro", type: "UBS", lat: -27.595175935826596, lng: -48.54864278736147 },
  { id: "cs-coloninha", name: "CS Coloninha", type: "UBS", lat: -27.58992537330872, lng: -48.589181900024414 },
  { id: "cs-coqueiros", name: "CS Coqueiros", type: "UBS", lat: -27.603061002857213, lng: -48.575652837753296 },
  { id: "cs-corrego-grande", name: "CS Córrego Grande", type: "UBS", lat: -27.600902, lng: -48.503628 },
  { id: "cs-costa-da-lagoa", name: "CS Costa da Lagoa", type: "UBS", lat: -27.568964, lng: -48.460731 },
  { id: "cs-costeira-do-pirajubae", name: "CS Costeira do Pirajubaé", type: "UBS", lat: -27.633534, lng: -48.522710 },
  { id: "cs-estreito", name: "CS Estreito", type: "UBS", lat: -27.585418, lng: -48.582779 },
  { id: "cs-fazenda-do-rio-tavares", name: "CS Fazenda do Rio Tavares", type: "UBS", lat: -27.665024, lng: -48.502845 },
  { id: "cs-ingleses", name: "CS Ingleses", type: "UBS", lat: -27.440588, lng: -48.399048 },
  { id: "cs-itacorubi", name: "CS Itacorubi", type: "UBS", lat: -27.584634, lng: -48.498282 },
  { id: "cs-jardim-atlantico", name: "CS Jardim Atlântico", type: "UBS", lat: -27.579587, lng: -48.598197 },
  { id: "cs-joao-paulo", name: "CS João Paulo", type: "UBS", lat: -27.561030, lng: -48.511909 },
  { id: "cs-jurere", name: "CS Jurerê", type: "UBS", lat: -27.442283, lng: -48.483718 },
  { id: "cs-lagoa-da-conceicao", name: "CS Lagoa da Conceição", type: "UBS", lat: -27.600345, lng: -48.471628 },
  { id: "cs-monte-cristo", name: "CS Monte Cristo", type: "UBS", lat: -27.5921364, lng: -48.5950672 },
  { id: "cs-monte-serrat", name: "CS Monte Serrat", type: "UBS", lat: -27.594846346272195, lng: -48.54323833284625 },
  { id: "cs-morro-das-pedras", name: "CS Morro das Pedras", type: "UBS", lat: -27.454737, lng: -48.404679 },
  { id: "cs-novo-continente", name: "CS Novo Continente", type: "UBS", lat: -27.5972317, lng: -48.5806653 },
  { id: "cs-pantanal", name: "CS Pantanal", type: "UBS", lat: -27.607919, lng: -48.520108 },
  { id: "cs-pantano-do-sul", name: "CS Pântano do Sul", type: "UBS", lat: -27.780147, lng: -48.507365 },
  { id: "cs-ponta-das-canas", name: "CS Ponta das Canas", type: "UBS", lat: -27.396373, lng: -48.427902 },
  { id: "cs-prainha", name: "CS Prainha", type: "UBS", lat: -27.606644, lng: -48.546805 },
  { id: "cs-ratones", name: "CS Ratones", type: "UBS", lat: -27.505579, lng: -48.471094 },
  { id: "cs-ribeirao-da-ilha", name: "CS Ribeirão da Ilha", type: "UBS", lat: -27.596433, lng: -48.549965 },
  { id: "cs-rio-tavares", name: "CS Rio Tavares", type: "UBS", lat: -27.651534, lng: -48.4758021 },
  { id: "cs-rio-vermelho", name: "CS Rio Vermelho", type: "UBS", lat: -27.490586, lng: -48.419566 },
  { id: "cs-saco-dos-limoes", name: "CS Saco dos Limões", type: "UBS", lat: -27.615406, lng: -48.527029 },
  { id: "cs-saco-grande", name: "CS Saco Grande", type: "UBS", lat: -27.552628, lng: -48.496206 },
  { id: "cs-santinho", name: "CS Santinho", type: "UBS", lat: -27.439818, lng: -48.388498 },
  { id: "cs-santo-antonio-de-lisboa", name: "CS Santo Antônio de Lisboa", type: "UBS", lat: -27.498269, lng: -48.514007 },
  { id: "cs-sape", name: "CS Saco Grande II (Sapé)", type: "UBS", lat: -27.586698, lng: -48.599186 },
  { id: "cs-tapera", name: "CS Tapera", type: "UBS", lat: -27.687085, lng: -48.564414 },
  { id: "cs-trindade", name: "CS Trindade", type: "UBS", lat: -27.585673, lng: -48.522473 },
  { id: "cs-vargem-grande", name: "CS Vargem Grande", type: "UBS", lat: -27.472176, lng: -48.444292 },
  { id: "cs-vargem-pequena", name: "CS Vargem Pequena", type: "UBS", lat: -27.475218, lng: -48.460305 },
  { id: "cs-vila-aparecida", name: "CS Vila Aparecida", type: "UBS", lat: -27.605808, lng: -48.585286 },

  // ── UPAs ───────────────────────────────────────────────────────────────
  { id: "upa-continente", name: "UPA Continente", type: "UPA", lat: -27.5790143, lng: -48.598533 },
  { id: "upa-norte-da-ilha", name: "UPA Norte da Ilha", type: "UPA", lat: -27.451516, lng: -48.456535 },
  { id: "upa-sul-da-ilha", name: "UPA Sul da Ilha", type: "UPA", lat: -27.6636765, lng: -48.5467212 },

  // ── Hospitais ──────────────────────────────────────────────────────────
  { id: "hosp-pm-comandante-laras", name: "Hospital da Polícia Militar Comandante Laras (HPM)", type: "Hospital", lat: -27.5952823, lng: -48.542388 },
  { id: "hosp-custodia-tratamento-psiquiatrico", name: "Hospital de Custódia e Tratamento Psiquiátrico", type: "Hospital", lat: -27.577571, lng: -48.527103 },
  { id: "hosp-guarnicao-florianopolis", name: "Hospital de Guarnição de Florianópolis", type: "Hospital", lat: -27.604823, lng: -48.545869 },
  { id: "hosp-florianopolis", name: "Hospital Florianópolis", type: "Hospital", lat: -27.589586, lng: -48.587251 },
  { id: "hosp-governador-celso-ramos", name: "Hospital Governador Celso Ramos", type: "Hospital", lat: -27.588373049612994, lng: -48.55065733194351 },
  { id: "hosp-infantil-joana-de-gusmao", name: "Hospital Infantil Joana de Gusmão", type: "Hospital", lat: -27.57644105631247, lng: -48.53540897369385 },
  { id: "hosp-nereu-ramos", name: "Hospital Nereu Ramos", type: "Hospital", lat: -27.577205994452246, lng: -48.534151896043454 },
  { id: "hosp-multi", name: "Multi Hospital", type: "Hospital", lat: -27.6661016, lng: -48.5470846 },
]

 
 // ─── Mapeamento nível de risco → tipo(s) de unidade recomendado(s) ─────────
 // Usado pelo ResultScreen (Flow2.tsx) para achar a unidade mais próxima
 // compatível com a gravidade do caso — ex: vermelho (emergência) só deve
 // sugerir Hospital, nunca uma UBS.
 export const RISK_LEVEL_UNIT_TYPES: Record<RiskLevel, HealthUnitMarker["type"][]> = {
  red: ["Hospital"],
  orange: ["UPA"],
  yellow: ["UBS"],
  green: ["UBS"],
}