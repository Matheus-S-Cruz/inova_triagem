// ─── Unidades de Saúde de Florianópolis — dados reais ──────────────────────
// Fonte: CNES + levantamento de telefone/horário por contato direto com as
// unidades. Consumido por LocationMap.tsx (marcadores) e UnitDetailScreen
// (Flow3.tsx), que usa `phone`/`hours` para o status "aberta agora" real —
// em vez do antigo mock fixo de lotação/fila.

import type { HealthUnitMarker } from "../components/LocationMap"
import type { RiskLevel } from "./triage"
import type { UnitHoursSpec } from "./openingHours"

// Atalhos pros padrões de horário mais comuns entre as UBS
const H_7_17_SAB_DOM: UnitHoursSpec = {
  kind: "scheduled",
  opensAt: "07:00",
  closesAt: "17:00",
  closedDays: [0, 6],
}

const H_7_19_SAB_DOM: UnitHoursSpec = {
  kind: "scheduled",
  opensAt: "07:00",
  closesAt: "19:00",
  closedDays: [0, 6],
}

const H_24H: UnitHoursSpec = { kind: "24h" }

export const HEALTH_UNITS: HealthUnitMarker[] = [
  // ── Centros de Saúde (UBS) ────────────────────────────────────────────
  { id: "cs-abraao", name: "CS Abraão", type: "UBS", lat: -27.603444785156885, lng: -48.59605078193692, address: "R. João Meirelles, s/n - Abraão, Florianópolis - SC, 88085-200", phone: "(48) 3249-5844", hours: H_7_17_SAB_DOM },
  { id: "cs-agronomica", name: "CS Agronômica", type: "UBS", lat: -27.574334183293463, lng: -48.53696620139809, address: "R. Rui Barbosa, s/n - Agronômica, Florianópolis - SC, 88025-300", phone: "(48) 3228-1310", hours: H_7_19_SAB_DOM },
  { id: "cs-alto-ribeirao", name: "CS Alto Ribeirão", type: "UBS", lat: -27.700733396863487, lng: -48.51919504372306, address: "R. Ingá Mirim, S/N° - Ribeirão da Ilha, Florianópolis - SC, 88064-082", phone: "(48) 3269-9917", hours: H_7_17_SAB_DOM },
  { id: "cs-armacao", name: "CS Armação", type: "UBS", lat: -27.75265321348131, lng: -48.509944614885924, address: "Rodovia SC-406, 6074 - Armação do Pântano do Sul, Florianópolis - SC, 88066-260", phone: "(48) 3389-5014", hours: H_7_17_SAB_DOM },
  { id: "cs-balneario", name: "CS Balneário", type: "UBS", lat: -27.57933140416885, lng: -48.583329172562465, address: "Av. Santa Catarina, 1570 - Balneário, Florianópolis - SC, 88075-500", phone: "(48) 3244-4904", hours: H_7_17_SAB_DOM },
  { id: "cs-barra-da-lagoa", name: "CS Barra da Lagoa", type: "UBS", lat: -27.578663380654238, lng: -48.43335413023334, address: "R. Altamiro Barcelos Dutra, 659 - Barra da Lagoa, Florianópolis - SC, 88061-300", phone: "(48) 3232-3302", hours: H_7_17_SAB_DOM },
  { id: "cs-cachoeira-do-bom-jesus", name: "CS Cachoeira do Bom Jesus", type: "UBS", lat: -27.421348478813616, lng: -48.43332803393508, address: "R. Leonel Pereira, 60 - Cachoeira do Bom Jesus, Florianópolis - SC, 88056-300", phone: "(48) 3284-6045", hours: { kind: "closed" } },
  { id: "cs-caeira-da-barra-do-sul", name: "CS Caeira da Barra do Sul", type: "UBS", lat: -27.81149581232848, lng: -48.55867215721293, address: "Rod. Baldicero Filomeno, 19795 - Ribeirão da Ilha, Florianópolis - SC, 88064-764", phone: "(48) 3237-6239", hours: H_7_17_SAB_DOM },
  { id: "cs-campeche", name: "CS Campeche", type: "UBS", lat: -27.681907362318093, lng: -48.49034870324265, address: "R. da Capela, s/n - Campeche, Florianópolis - SC, 88063-400", phone: "(48) 3237-4524", hours: H_7_19_SAB_DOM },
  { id: "cs-canasvieiras", name: "CS Canasvieiras", type: "UBS", lat: -27.45186718577733, lng: -48.456468887908635, address: "R. Francisco Faustino Martins, s/n - Vargem Grande, Florianópolis - SC, 88010-102", phone: "(48) 3269-6902", hours: H_7_19_SAB_DOM },
  { id: "cs-canto-da-lagoa", name: "CS Canto da Lagoa", type: "UBS", lat: -27.61580500581693, lng: -48.48434892043505, address: "R. Laurindo Januário da Silveira, 2507 - Lagoa da Conceição, Florianópolis - SC, 88062-201", phone: "(48) 3232-6121", hours: H_7_17_SAB_DOM },
  { id: "cs-capivari", name: "CS Capivari", type: "UBS", lat: -27.45791223242819, lng: -48.40489668975664, address: "Rod. João Gualberto Soares, 2097 - Ingleses Norte, Florianópolis - SC, 88058-300", phone: "(48) 3369-9261", hours: H_7_19_SAB_DOM },
  { id: "cs-capoeiras", name: "CS Capoeiras", type: "UBS", lat: -27.59683468759085, lng: -48.59719551673926, address: "R. Irmã Bonavita, 286 - Capoeiras, Florianópolis - SC, 88090-150", hours: H_7_17_SAB_DOM },
  { id: "cs-carianos", name: "CS Carianos", type: "UBS", lat: -27.665761429633644, lng: -48.536366703243374, address: "R. Ver. Osvaldo Bittencourt, s/n - Carianos, Florianópolis - SC, 88047-700", phone: "(48) 3338-1125", hours: H_7_17_SAB_DOM },
  { id: "cs-centro", name: "CS Centro", type: "UBS", lat: -27.594415850391893, lng: -48.548865675344395, address: "R. Santos Dumont, 52 - Centro, Florianópolis - SC, 88015-020", phone: "(48) 3952-0127", hours: H_7_17_SAB_DOM },
  { id: "cs-coloninha", name: "CS Coloninha", type: "UBS", lat: -27.590210905916642, lng: -48.59174866091674, address: "Rua Araci Vaz Callado, 1830 - Coloninha, Florianópolis - SC, 88090-260", phone: "(48) 3244-2891", hours: H_7_17_SAB_DOM },
  { id: "cs-coqueiros", name: "CS Coqueiros", type: "UBS", lat: -27.602734007299002, lng: -48.575770420435376, address: "Av. Eng. Max de Souza, s/n - Coqueiros, Florianópolis - SC, 88080-000", phone: "(48) 3248-0451", hours: H_7_17_SAB_DOM },
  { id: "cs-corrego-grande", name: "CS Córrego Grande", type: "UBS", lat: -27.60082720542348, lng: -48.50355100139725, address: "R. João Pio Duarte Silva, 1415 - Córrego Grande, Florianópolis - SC, 88037-000", phone: "(48) 3234-1328", hours: H_7_17_SAB_DOM },
  { id: "cs-costa-da-lagoa", name: "CS Costa da Lagoa", type: "UBS", lat: -27.538203443446633, lng: -48.46072228461559, address: "Servidão Caminho Costa da Lagoa, Ponto 16 - Costa da Lagoa, Florianópolis - SC, 88062-370", phone: "(48) 3335-3119", hours: { kind: "scheduled", opensAt: "08:00", closesAt: "14:00", closedDays: [0, 6] } },
  { id: "cs-costeira-do-pirajubae", name: "CS Costeira do Pirajubaé", type: "UBS", lat: -27.633283640242407, lng: -48.52257855721897, address: "R. João Câncio Jacques, 1461 - Costeira do Pirajubaé, Florianópolis - SC, 88047-011", phone: "(48) 3226-3333", hours: H_7_19_SAB_DOM },
  { id: "cs-estreito", name: "CS Estreito", type: "UBS", lat: -27.585358110633337, lng: -48.58271217441057, address: "Rua Araci Vaz Callado, 742 - Estreito, Florianópolis - SC, 88070-750", phone: "(48) 3244-1200", hours: H_7_19_SAB_DOM },
  { id: "cs-fazenda-do-rio-tavares", name: "CS Fazenda do Rio Tavares", type: "UBS", lat: -27.664164859600817, lng: -48.5029339050916, address: "Rua do Conselho Comunitário, s/n - Fazenda do Rio Tavares, Florianópolis - SC, 88063-700", phone: "(48) 3233-4347", hours: H_7_19_SAB_DOM },
  { id: "cs-ingleses", name: "CS Ingleses", type: "UBS", lat: -27.43984739706386, lng: -48.39890517441529, address: "Tv. dos Imigrantes, 135 - Ingleses Norte, Florianópolis - SC, 88058-418", phone: "(48) 3369-3229", hours: H_7_19_SAB_DOM },
  { id: "cs-itacorubi", name: "CS Itacorubi", type: "UBS", lat: -27.58445525556558, lng: -48.49839484742317, address: "Rod. Amaro Antônio Viêira, 2260 - Itacorubi, Florianópolis - SC, 88034-102", phone: "(48) 3334-5555", hours: H_7_17_SAB_DOM },
  { id: "cs-jardim-atlantico", name: "CS Jardim Atlântico", type: "UBS", lat: -27.579354710976368, lng: -48.598221433929915, address: "R. Aleixo Alves de Souza, s/n - Jardim Atlântico, Florianópolis - SC, 88095-410", phone: "(48) 3348-9595", hours: { kind: "scheduled", opensAt: "08:00", closesAt: "17:00", closedDays: [0, 6] } },
  { id: "cs-joao-paulo", name: "CS João Paulo", type: "UBS", lat: -27.561757698974105, lng: -48.513501933307055, address: "Rodovia João Paulo, s/nº - João Paulo, Florianópolis - SC, 88030-300", phone: "(48) 3238-0606", hours: H_7_17_SAB_DOM },
  { id: "cs-jurere", name: "CS Jurerê", type: "UBS", lat: -27.442084901310196, lng: -48.48359138790883, address: "R. Jurerê Tradicional, 242 - Jurerê, Florianópolis - SC, 88053-750", phone: "(48) 3282-1670", hours: H_7_17_SAB_DOM },
  { id: "cs-lagoa-da-conceicao", name: "CS Lagoa da Conceição", type: "UBS", lat: -27.599460456539138, lng: -48.470515147422844, address: "R. João Pachêco da Costa, 255 - Lagoa da Conceição, Florianópolis - SC, 88062-100", phone: "(48) 3232-0639", hours: H_7_17_SAB_DOM },
  { id: "cs-monte-cristo", name: "CS Monte Cristo", type: "UBS", lat: -27.59125936745376, lng: -48.598998876258534, address: "R. Joaquim Nabuco, s/n - Monte Cristo, Florianópolis - SC, 88090-062", phone: "(48) 3348-7467", hours: H_7_17_SAB_DOM },
  { id: "cs-monte-serrat", name: "CS Monte Serrat", type: "UBS", lat: -27.59484541707336, lng: -48.543365205093956, address: "Av. Mauro Ramos, 722 - Monte Serrat, Florianópolis - SC, 88020-302", phone: "(48) 3223-7816", hours: H_7_17_SAB_DOM },
  { id: "cs-morro-das-pedras", name: "CS Morro das Pedras", type: "UBS", lat: -27.716408402360624, lng: -48.50764744741896, address: "SC-406, 1685 - Morro das Pedras, Florianópolis - SC, 88066-000", phone: "(48) 3338-7627", hours: H_7_19_SAB_DOM },
  { id: "cs-novo-continente", name: "CS Novo Continente", type: "UBS", lat: -27.59784451391087, lng: -48.57977608790368, address: "R. Prof. Clementino de Brito, s/n - Capoeiras, Florianópolis - SC, 88070-150", phone: "(48) 3249-7111", hours: H_7_17_SAB_DOM },
  { id: "cs-pantanal", name: "CS Pantanal", type: "UBS", lat: -27.608046738826985, lng: -48.52131787625793, address: "R. Dep. Antônio Edu Vieira, 855 - Pantanal, Florianópolis - SC, 88040-002", phone: "(48) 3238-2232", hours: H_7_17_SAB_DOM },
  { id: "cs-pantano-do-sul", name: "CS Pântano do Sul", type: "UBS", lat: -27.78055421617732, lng: -48.507507962758694, address: "R. Abelardo Otacílio Gomes, s/n - Pântano do Sul, Florianópolis - SC, 88067-100", phone: "(48) 3237-7032", hours: H_7_17_SAB_DOM },
  { id: "cs-ponta-das-canas", name: "CS Ponta das Canas", type: "UBS", lat: -27.396224790940025, lng: -48.427867460922954, address: "Rua Alcides Bonatelli - Ponta das Canas, Florianópolis - SC, 88056-720", phone: "(48) 3284-1337", hours: H_7_17_SAB_DOM },
  { id: "cs-prainha", name: "CS Prainha", type: "UBS", lat: -27.606486365678943, lng: -48.54681447625805, address: "R. Silva Jardim, 621 - Prainha, Florianópolis - SC, 88020-199", phone: "(48) 3225-8134", hours: H_7_17_SAB_DOM },
  { id: "cs-ratones", name: "CS Ratones", type: "UBS", lat: -27.505241818053822, lng: -48.47092974742594, address: "Estr. João Januário da Silva, 5180 - Ratones, Florianópolis - SC, 88052-200", phone: "(48) 3266-8090", hours: H_7_17_SAB_DOM },
  { id: "cs-ribeirao-da-ilha", name: "CS Ribeirão da Ilha", type: "UBS", lat: -27.717707045708067, lng: -48.56292788663541, address: "R. João José D'Ávila - Ribeirão da Ilha, Florianópolis - SC, 88064-643", phone: "(48) 3337-5997", hours: H_7_17_SAB_DOM },
  { id: "cs-rio-tavares", name: "CS Rio Tavares", type: "UBS", lat: -27.649668903871707, lng: -48.47779464372471, address: "R. Silvio Lopes Araújo, 41 - Rio Tavares, Florianópolis - SC, 88048-391", phone: "(48) 3232-6118", hours: H_7_17_SAB_DOM },
  { id: "cs-rio-vermelho", name: "CS Rio Vermelho", type: "UBS", lat: -27.490504880275264, lng: -48.41947651674275, address: "Rod. João Gualberto Soares, 6471 - São João do Rio Vermelho, Florianópolis - SC, 88060-000", phone: "(48) 3269-7100", hours: H_7_19_SAB_DOM },
  { id: "cs-saco-dos-limoes", name: "CS Saco dos Limões", type: "UBS", lat: -27.615415117752544, lng: -48.52698338238104, address: "R. Aldo Alves, 228 - Saco dos Limões, Florianópolis - SC, 88045-600", phone: "(48) 3223-4563", hours: H_7_17_SAB_DOM },
  { id: "cs-saco-grande", name: "CS Saco Grande", type: "UBS", lat: -27.552540118041232, lng: -48.496340976860836, address: "Rod. Virgílio Várzea, 807 - Saco Grande, Florianópolis - SC, 88032-001", phone: "(48) 3234-6995", hours: H_7_19_SAB_DOM },
  { id: "cs-santinho", name: "CS Santinho", type: "UBS", lat: -27.439652283852986, lng: -48.388464487908884, address: "Estr. Dom João Becker, 862 - Ingleses Norte, Florianópolis - SC, 88058-600", phone: "(48) 3369-5514", hours: H_7_17_SAB_DOM },
  { id: "cs-santo-antonio-de-lisboa", name: "CS Santo Antônio de Lisboa", type: "UBS", lat: -27.500866817937492, lng: -48.51514661919176, address: "R. Padre Lourenço R. de Andrade, s/n - Santo Antônio de Lisboa, Florianópolis - SC, 88050-400", phone: "(48) 3235-3294", hours: H_7_17_SAB_DOM },
  { id: "cs-sape", name: "CS Sapé", type: "UBS", lat: -27.58665990342508, lng: -48.599233632081365, address: "Tv. Waldemar Osmar Hermann, 82 - Sapé, Florianópolis - SC, 88095-685", phone: "(48) 3240-6602", hours: H_7_17_SAB_DOM },
  { id: "cs-tapera", name: "CS Tapera", type: "UBS", lat: -27.686962475712004, lng: -48.56487242103382, address: "R. das Areias, s/n - Tapera da Base, Florianópolis - SC, 88049-300", phone: "(48) 3338-4531", hours: H_7_17_SAB_DOM },
  { id: "cs-trindade", name: "CS Trindade", type: "UBS", lat: -27.58557388434934, lng: -48.52246460324585, address: "R. Prof. Odilon Fernandes, 571 - Trindade, Florianópolis - SC, 88036-250", phone: "(48) 3234-9577", hours: H_7_19_SAB_DOM },
  { id: "cs-vargem-grande", name: "CS Vargem Grande", type: "UBS", lat: -27.472196666088063, lng: -48.44417742471473, address: "Estr. Cristóvão Machado de Campos, 2460 - Vargem Grande, Florianópolis - SC, 88052-600", phone: "(48) 3269-5034", hours: H_7_17_SAB_DOM },
  { id: "cs-vargem-pequena", name: "CS Vargem Pequena", type: "UBS", lat: -27.47522809811073, lng: -48.46028708975588, address: "Estr. Manoel Leôncio de Souza Brito, 1325 - Vargem Pequena, Florianópolis - SC, 88052-400", phone: "(48) 3269-5898", hours: H_7_17_SAB_DOM },
  // Única com horário de sábado (só fecha domingo)
  { id: "cs-vila-aparecida", name: "CS Vila Aparecida", type: "UBS", lat: -27.605691086927713, lng: -48.58532981858715, address: "R. Fermino Costa, 284 - Vila Aparecida, Florianópolis - SC, 88085-030", phone: "(48) 3244-6724", hours: { kind: "scheduled", opensAt: "07:00", closesAt: "17:00", closedDays: [0] } },

  // ── UPAs (24 horas) ────────────────────────────────────────────────────
  { id: "upa-continente", name: "UPA Continente", type: "UPA", lat: -27.58051941507374, lng: -48.59732193881795, address: "R. Gualberto Senna, 300 - Jardim Atlântico, Florianópolis - SC, 88095-256", phone: "(48) 3380-6785", hours: H_24H },
  { id: "upa-norte-da-ilha", name: "UPA Norte da Ilha", type: "UPA", lat: -27.451589003997622, lng: -48.45630411981703, address: "R. Francisco Faustino Martins, s/n - Vargem Grande, Florianópolis - SC, 88010-102", phone: "(48) 3261-0624", hours: H_24H },

  // ── Hospitais (24 horas) ───────────────────────────────────────────────
  { id: "hosp-guarnicao-florianopolis", name: "Hospital de Guarnição de Florianópolis", type: "Hospital", lat: -27.60425166899786, lng: -48.546448821036535, address: "R. Silva Jardim, 441 - Centro, Florianópolis - SC, 88020-200", phone: "(48) 3025-4814", hours: H_24H },
  { id: "hosp-florianopolis", name: "Hospital Florianópolis", type: "Hospital", lat: -27.589529796610638, lng: -48.58723054557483, address: "R. Santa Rita de Cássia, 1665 - Estreito, Florianópolis - SC, 88090-352", phone: "(48) 3380-8700", hours: H_24H },
  { id: "hosp-governador-celso-ramos", name: "Hospital Governador Celso Ramos", type: "Hospital", lat: -27.58849587704026, lng: -48.55041463882821, address: "Rua Irmã Benwarda, 297 - Centro, Florianópolis - SC, 88015-270", hours: H_24H },
  { id: "hosp-infantil-joana-de-gusmao", name: "Hospital Infantil Joana de Gusmão", type: "Hospital", pediatric: true, lat: -27.576149012390378, lng: -48.53575631156329, address: "R. Rui Barbosa, 152 - Agronômica, Florianópolis - SC, 88025-301", phone: "(48) 3664-3200", hours: H_24H },
  { id: "hosp-nereu-ramos", name: "Hospital Nereu Ramos", type: "Hospital", lat: -27.57716948155396, lng: -48.53414260324634, address: "R. Rui Barbosa, 800 - Agronômica, Florianópolis - SC, 88025-301", phone: "(48) 3665-9401", hours: H_24H },
  { id: "hosp-multi", name: "Multi Hospital", type: "Hospital", lat: -27.664809811142174, lng: -48.54479903207875, address: "Av. Dep. Diomício Freitas, 3393 - Carianos, Florianópolis - SC, 88047-900", phone: "0800 000 4310", hours: H_24H },
]

// ─── Mapeamento nível de risco → tipo(s) de unidade recomendado(s) ─────────
export const RISK_LEVEL_UNIT_TYPES: Record<RiskLevel, HealthUnitMarker["type"][]> = {
  red: ["Hospital"],
  orange: ["UPA"],
  yellow: ["UBS"],
  green: ["UBS"],
}