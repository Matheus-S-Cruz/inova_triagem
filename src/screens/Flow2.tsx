import { useEffect, useRef } from "react"

import type { Navigate } from "../App"

import {
  NavBar,
  Btn,
  RiskBadge,
  Divider,
  SectionTitle,
  Disclaimer,
  A11yNote,
  ScreenWrap,
  Content,
  BodyText,
  AnswersSummary,
} from "../components/Wire"

import { useTriage } from "../context/TriageContext"

import type { RiskLevel } from "../lib/triage"

import { UserStorage, HistoryStorage, formatTodayDate } from "../lib/storage"

import {
   useGeolocation,
   findNearestUnit,
   FLORIANOPOLIS_FALLBACK,
} from "../lib/geolocation"

import { HEALTH_UNITS, RISK_LEVEL_UNIT_TYPES } from "../lib/healthUnits"

// ─── 4. Resultado da Classificação ────────────────────────────────────────────

const RECOMMENDATIONS: Record<RiskLevel, {
  level: RiskLevel

  heading: string

  body: string

  cta: string

  ctaTarget: Parameters<Navigate>[0]

  secondary?: string

  secondaryTarget?: Parameters<Navigate>[0]
}> = {
  red: {
    level: "red",

    heading: "Procure emergência imediatamente",

    body: "Seus sintomas indicam risco imediato de vida. Ligue para o SAMU (192) ou vá ao pronto-socorro mais próximo agora. Não espere.",

    cta: "Ver hospitais próximos",

    ctaTarget: "map",

    secondary: "Ver no mapa",

    secondaryTarget: "map",
  },

  orange: {
    level: "orange",

    heading: "Atendimento urgente na UPA",

    body: "Seus sintomas requerem avaliação médica com urgência. Dirija-se a uma UPA ou pronto atendimento em até 1 hora.",

    cta: "Ver UPAs próximas",

    ctaTarget: "unitlist",

    secondary: "Ver no mapa",

    secondaryTarget: "map",
  },

  yellow: {
    level: "yellow",

    heading: "Atendimento prioritário hoje",

    body: "Você deve ser atendido com prioridade. Procure uma UBS ou pronto atendimento em até 2 horas. Evite aglomerações.",

    cta: "Ver unidades próximas",

    ctaTarget: "unitlist",

    secondary: "Agendar UBS",

    secondaryTarget: "unitlist",
  },

  green: {
    level: "green",

    heading: "UBS ou teleconsulta",

    body: "Sua situação não é urgente. Agende uma consulta na UBS do seu bairro ou utilize o serviço de teleconsulta.",

    cta: "Agendar UBS",

    ctaTarget: "unitlist",

    secondary: "Iniciar teleconsulta",

    secondaryTarget: "unitlist",
  },
}

// Rótulo curto usado no histórico (telas de Perfil/Histórico, Flow4.tsx)

const LEVEL_CLASSIFICATION: Record<RiskLevel, string> = {
  red: "Emergência",

  orange: "UPA",

  yellow: "Prioritário",

  green: "UBS",
}

// Precisa bater exatamente com o label usado em Q5Screen (Flow1.tsx, GROUPS).
const CHILD_GROUP_LABEL = "Criança (menor de 5 anos)"

export function ResultScreen({ navigate }: { navigate: Navigate }) {
  const {
     answers,
     result,
     resetAnswers,
     historySaved,
     markHistorySaved,
     nearestUnit,
     setNearestUnit,
     setSelectedUnit,
     setReturnScreen,
   } = useTriage()

  const rec = RECOMMENDATIONS[result.level]

  const alreadySavedRef = useRef(false)

  const { position: userPosition, status: geoStatus } = useGeolocation()

  // Calcula a unidade mais próxima compatível com o nível de risco (ex:
  // vermelho → só hospitais) assim que a localização estiver disponível.
  // Enquanto a geolocalização carrega/falha, usa o fallback de
  // Florianópolis — assim a recomendação nunca fica vazia.
  //
  // Caso especial: emergência (vermelho) + "Criança (menor de 5 anos)"
  // marcada em Q5 → a busca é restrita ao(s) hospital(is) com atendimento
  // pediátrico (ver campo `pediatric` em lib/healthUnits.ts), então só o
  // Hospital Infantil Joana de Gusmão pode ser recomendado aqui — e ainda
  // assim continua sendo escolhido pelo critério normal de "mais próximo".
  useEffect(() => {
    const origin = userPosition ?? FLORIANOPOLIS_FALLBACK

    const preferredTypes = RISK_LEVEL_UNIT_TYPES[result.level]

    const hasChild = answers.vulnerableGroups.includes(CHILD_GROUP_LABEL)

    const pool =
      result.level === "red" && hasChild
        ? HEALTH_UNITS.filter((u) => u.pediatric)
        : HEALTH_UNITS

    setNearestUnit(findNearestUnit(origin, pool, preferredTypes))
  }, [userPosition, result.level, answers.vulnerableGroups])

  // Só é usado quando o resultado recomenda UBS (yellow/green) e o usuário
  // não consegue ir dentro do horário de atendimento — calcula a UPA mais
  // próxima sob demanda (independente do nível de risco) e leva direto
  // para a tela de detalhes dela.
  const handleSeeNearestUPA = () => {
    const origin = userPosition ?? FLORIANOPOLIS_FALLBACK

    const nearestUPA = findNearestUnit(origin, HEALTH_UNITS, ["UPA"])

    if (nearestUPA) {
      setSelectedUnit(nearestUPA.unit)
      setReturnScreen("result")

      navigate("unitdetail")
    }
  }

  useEffect(() => {
    const account = UserStorage.get()

    if (account && !historySaved && !alreadySavedRef.current) {
      alreadySavedRef.current = true

      HistoryStorage.add(
        {
          id: `${Date.now()}`,

          date: formatTodayDate(),

          symptom:
            answers.symptom ||
            answers.symptomOther ||
            "Sintoma não especificado",

          level: result.level,

          classification: LEVEL_CLASSIFICATION[result.level],

          reasons: result.reasons,

          answers,
        },
        account.id,
      )

      markHistorySaved()
    }
  }, [])

  const startNewTriage = () => {
    resetAnswers()

    navigate("q1")
  }

  return (
    <ScreenWrap>
      <NavBar title="Resultado da Triagem" />
      <Content>
        <RiskBadge level={rec.level} />

        {nearestUnit && (
          <div
            style={{
              border: "1.5px solid #B8D2E0",
              borderRadius: 10,
              padding: "12px 14px",
              backgroundColor: "#F5F9FB",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#5C7690",
                letterSpacing: "0.06em",
                fontFamily: "Inter, system-ui, sans-serif",
                marginBottom: 6,
              }}
            >
              📍 UNIDADE MAIS PRÓXIMA RECOMENDADA
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0F2A4A" }}>
                {nearestUnit.unit.name}
              </div>
              <div style={{ fontSize: 11, color: "#7C93A6" }}>
                {nearestUnit.unit.type} · a{" "}
                {nearestUnit.distanceKm < 1
                  ? `${Math.round(nearestUnit.distanceKm * 1000)} m`
                  : `${nearestUnit.distanceKm.toFixed(1)} km`}{" "}
                de você
              </div>
            </div>
            {geoStatus === "error" && (
              <div style={{ fontSize: 10, color: "#CA8A04", marginBottom: 8 }}>
                ⚠ Localização não disponível — distância calculada a partir
                do centro de Florianópolis.
              </div>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <Btn
                label="Ver no mapa"
                onClick={() => navigate("map")}
                variant="primary"
                small
                full={false}
              />
              <Btn
                label="Ver detalhes"
                onClick={() => {
                  setReturnScreen("result")
                  navigate("unitdetail")
                }}
                variant="secondary"
                small
                full={false}
              />
            </div>
          </div>
        )}

         {(result.level === "yellow" || result.level === "green") && (
          <div
            style={{
              border: "1.5px solid #FDE68A",
              borderRadius: 10,
              padding: "12px 14px",
              backgroundColor: "#FFFBEB",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 15, flexShrink: 0 }}>🕐</span>
              <span style={{ fontSize: 12, color: "#7C5B00", lineHeight: 1.5 }}>
                UBS costumam funcionar das <strong>7h às 17h</strong>. Se você
                não conseguir se deslocar dentro desse horário, o mais
                indicado é procurar uma UPA (funcionam 24 horas).
              </span>
            </div>
            <Btn
              label="Ver UPA mais próxima"
              onClick={handleSeeNearestUPA}
              variant="secondary"
              small
            />
          </div>
        )}

        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#0F2A4A",
              marginBottom: 6,
            }}
          >
            {rec.heading}
          </div>
          <BodyText>{rec.body}</BodyText>
        </div>

        <Disclaimer />

        <Divider />

        <SectionTitle>Por que essa classificação?</SectionTitle>
        <div
          style={{
            backgroundColor: "#EFF5F9",
            border: "1px solid #DCE7EF",

            borderRadius: 6,
            padding: "10px 12px",
            marginBottom: 16,
          }}
        >
          {result.reasons.map((reason, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 6,
                marginBottom: i < result.reasons.length - 1 ? 6 : 0,
              }}
            >
              <span style={{ color: "#155E8A", fontSize: 12, flexShrink: 0 }}>
                ●
              </span>
              <span style={{ fontSize: 12, color: "#3A5468", lineHeight: 1.4 }}>
                {reason}
              </span>
            </div>
          ))}
        </div>

        <SectionTitle>Resumo da Triagem</SectionTitle>
        <div style={{ marginBottom: 16 }}>
          <AnswersSummary answers={answers} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Btn
            label={rec.cta}
            onClick={() => navigate(rec.ctaTarget)}
            variant="primary"
          />
          {rec.secondary && rec.secondaryTarget && (
            <Btn
              label={rec.secondary}
              onClick={() => navigate(rec.secondaryTarget!)}
              variant="secondary"
            />
          )}
          <Btn label="Nova triagem" onClick={startNewTriage} variant="ghost" />
        </div>

        <A11yNote
          notes={[
            "Nível de risco comunicado por cor E texto (não só cor)",

            "Botão principal com aria-label descrevendo ação completa",

            'Aviso médico em destaque com role="alert"',
          ]}
        />
      </Content>
    </ScreenWrap>
  )
}