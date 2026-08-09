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

export function ResultScreen({ navigate }: { navigate: Navigate }) {
  const { answers, result, resetAnswers, historySaved, markHistorySaved } =
    useTriage()

  const rec = RECOMMENDATIONS[result.level]

  const alreadySavedRef = useRef(false)

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
