// ─── Testes do Motor de Pré-Triagem — Triagem+ ─────────────────────────────

// Cobre cada ramo de decisão de classifyRisk() (src/lib/triage.ts), na

// mesma ordem em que aparecem na função: VERMELHO → LARANJA → AMARELO →

// VERDE. O objetivo não é só "passar" — é travar o comportamento clínico

// esperado, para que uma mudança futura no algoritmo quebre um teste em vez

// de silenciosamente reclassificar um paciente errado.

//

// Rodar com: npm run test  (ou npm run test:watch durante o desenvolvimento)

import { describe, it, expect } from "vitest"

import {
  classifyRisk,
  emptyTriageAnswers,
  isTriageComplete,
  type TriageAnswers,
} from "./triage"

/** Helper: parte de respostas vazias e sobrescreve só o que o teste precisa. */

function answers(overrides: Partial<TriageAnswers>): TriageAnswers {
  return { ...emptyTriageAnswers(), ...overrides }
}

describe("classifyRisk — VERMELHO (Hospital / emergência)", () => {
  it("dor no peito + falta de ar → red", () => {
    const result = classifyRisk(
      answers({
        symptom: "Dor no peito",

        breathingDifficulty: "sim",
      }),
    )

    expect(result.level).toBe("red")
  })

  it("dor no peito + dor intensa → red", () => {
    const result = classifyRisk(
      answers({
        symptom: "Dor no peito",

        intensePain: "sim",
      }),
    )

    expect(result.level).toBe("red")
  })

  it("falta de ar + piora rápida → red", () => {
    const result = classifyRisk(
      answers({
        breathingDifficulty: "sim",

        rapidWorsening: "sim",
      }),
    )

    expect(result.level).toBe("red")
  })

  it("falta de ar + dor intensa → red", () => {
    const result = classifyRisk(
      answers({
        breathingDifficulty: "sim",

        intensePain: "sim",
      }),
    )

    expect(result.level).toBe("red")
  })

  it("dor no peito isolada, sem falta de ar nem dor intensa → NÃO deve ser red", () => {
    // Guarda contra falso-positivo: só "Dor no peito" sozinho cai em orange,

    // não em red. Se esse teste falhar, o critério de emergência ficou

    // permissivo demais.

    const result = classifyRisk(
      answers({
        symptom: "Dor no peito",

        breathingDifficulty: "nao",

        intensePain: "nao",
      }),
    )

    expect(result.level).not.toBe("red")
  })
})

describe("classifyRisk — LARANJA (UPA / urgência)", () => {
  it("falta de ar isolada (sem piora rápida nem dor intensa) → orange", () => {
    const result = classifyRisk(
      answers({
        breathingDifficulty: "sim",

        rapidWorsening: "nao",

        intensePain: "nao",
      }),
    )

    expect(result.level).toBe("orange")
  })

  it("dor no peito isolada (sem falta de ar nem dor intensa) → orange", () => {
    const result = classifyRisk(
      answers({
        symptom: "Dor no peito",

        breathingDifficulty: "nao",

        intensePain: "nao",
      }),
    )

    expect(result.level).toBe("orange")
  })

  it("dor intensa isolada → orange", () => {
    const result = classifyRisk(
      answers({
        intensePain: "sim",

        breathingDifficulty: "nao",
      }),
    )

    expect(result.level).toBe("orange")
  })

  it("febre + piora rápida → orange", () => {
    const result = classifyRisk(
      answers({
        fever: "sim",

        rapidWorsening: "sim",
      }),
    )

    expect(result.level).toBe("orange")
  })

  it("grupo de risco (idoso) + febre → orange", () => {
    const result = classifyRisk(
      answers({
        vulnerableGroups: ["Idoso (60 anos ou mais)"],

        fever: "sim",
      }),
    )

    expect(result.level).toBe("orange")
  })

  it("grupo de risco (gestante) + piora rápida → orange", () => {
    const result = classifyRisk(
      answers({
        vulnerableGroups: ["Gestante"],

        rapidWorsening: "sim",
      }),
    )

    expect(result.level).toBe("orange")
  })

  it("vômito/náusea recente + febre → orange (risco de desidratação)", () => {
    const result = classifyRisk(
      answers({
        symptom: "Vômito / Náusea",

        duration: "Menos de 6 horas",

        fever: "sim",
      }),
    )

    expect(result.level).toBe("orange")
  })

  it("diarreia recente + grupo de risco (criança) → orange", () => {
    const result = classifyRisk(
      answers({
        symptom: "Diarreia",

        duration: "Hoje (6–24h)",

        vulnerableGroups: ["Criança (menor de 5 anos)"],
      }),
    )

    expect(result.level).toBe("orange")
  })
})

describe("classifyRisk — AMARELO (prioritário)", () => {
  it("piora rápida isolada (sem febre, sem grupo de risco) → yellow", () => {
    const result = classifyRisk(
      answers({
        rapidWorsening: "sim",

        fever: "nao",
      }),
    )

    expect(result.level).toBe("yellow")
  })

  it("grupo de risco isolado, sem febre nem piora → yellow", () => {
    const result = classifyRisk(
      answers({
        vulnerableGroups: ["Idoso (60 anos ou mais)"],

        fever: "nao",

        rapidWorsening: "nao",
      }),
    )

    expect(result.level).toBe("yellow")
  })

  it("febre de início recente (< 24h), sem outros sinais → yellow", () => {
    const result = classifyRisk(
      answers({
        fever: "sim",

        duration: "Hoje (6–24h)",

        rapidWorsening: "nao",
      }),
    )

    expect(result.level).toBe("yellow")
  })

  it("doença crônica + febre → yellow", () => {
    const result = classifyRisk(
      answers({
        vulnerableGroups: [
          "Portador de doença crônica (diabetes, HAS, cardiopatia, DPOC...)",
        ],

        fever: "sim",

        rapidWorsening: "nao",
      }),
    )

    expect(result.level).toBe("yellow")
  })

  it("vômito/náusea recente, sem febre nem grupo de risco → yellow", () => {
    const result = classifyRisk(
      answers({
        symptom: "Vômito / Náusea",

        duration: "Menos de 6 horas",

        fever: "nao",
      }),
    )

    expect(result.level).toBe("yellow")
  })
})

describe("classifyRisk — VERDE (UBS)", () => {
  it("febre sem sinais de alarme → green", () => {
    const result = classifyRisk(
      answers({
        fever: "sim",

        duration: "2 a 3 dias", // fora da janela "recente" (24h)

        rapidWorsening: "nao",
      }),
    )

    expect(result.level).toBe("green")
  })

  it("dor abdominal sem sinais de alarme → green", () => {
    const result = classifyRisk(
      answers({
        symptom: "Dor abdominal",

        fever: "nao",

        duration: "2 a 3 dias",
      }),
    )

    expect(result.level).toBe("green")
  })

  it("doença crônica sem febre nem outros sinais → green", () => {
    const result = classifyRisk(
      answers({
        vulnerableGroups: [
          "Portador de doença crônica (diabetes, HAS, cardiopatia, DPOC...)",
        ],

        fever: "nao",

        rapidWorsening: "nao",
      }),
    )

    expect(result.level).toBe("green")
  })

  it("sintomas persistentes há vários dias, sem sinais de alarme → green", () => {
    const result = classifyRisk(
      answers({
        symptom: "Dor de cabeça",

        duration: "Mais de 1 semana",

        fever: "nao",
      }),
    )

    expect(result.level).toBe("green")
  })

  it("fallback: sintoma leve, recente, sem nenhum sinal de alarme → green", () => {
    const result = classifyRisk(
      answers({
        symptom: "Dor no corpo",

        duration: "Menos de 6 horas",

        fever: "nao",

        intensePain: "nao",

        breathingDifficulty: "nao",

        rapidWorsening: "nao",
      }),
    )

    expect(result.level).toBe("green")
  })

  it('nunca retorna um nível "cuidados em casa" — só UBS/UPA/Hospital', () => {
    // Guarda de regressão: garante que a remoção do nível "home care" não

    // volte por acidente. Testa uma amostra de cenários variados.

    const cenarios: Partial<TriageAnswers>[] = [
      { symptom: "Dor de cabeça", duration: "Menos de 6 horas", fever: "nao" },

      { symptom: "Tosse", duration: "Mais de 1 semana" },

      { fever: "sim", duration: "4 a 7 dias" },
    ]

    for (const cenario of cenarios) {
      const result = classifyRisk(answers(cenario))

      expect(["red", "orange", "yellow", "green"]).toContain(result.level)
    }
  })
})

describe("classifyRisk — sempre retorna ao menos um motivo (reasons)", () => {
  it("todo resultado inclui pelo menos uma explicação em texto", () => {
    const casos: Partial<TriageAnswers>[] = [
      { symptom: "Dor no peito", breathingDifficulty: "sim" }, // red

      { breathingDifficulty: "sim", rapidWorsening: "nao", intensePain: "nao" }, // orange

      { rapidWorsening: "sim", fever: "nao" }, // yellow

      { symptom: "Dor no corpo", fever: "nao", duration: "Menos de 6 horas" }, // green
    ]

    for (const caso of casos) {
      const result = classifyRisk(answers(caso))

      expect(result.reasons.length).toBeGreaterThan(0)

      expect(typeof result.reasons[0]).toBe("string")
    }
  })
})

describe("isTriageComplete — sintoma principal é sempre obrigatório", () => {
  it("todas as respostas obrigatórias preenchidas, com symptom selecionado → true", () => {
    const result = isTriageComplete(
      answers({
        symptom: "Febre",
        duration: "Hoje (6–24h)",
        fever: "sim",
        intensePain: "nao",
        breathingDifficulty: "nao",
        rapidWorsening: "nao",
        usingMedication: "nao",
      }),
    )

    expect(result).toBe(true)
  })

  it("symptomOther preenchido mas symptom vazio → false (não substitui mais a seleção)", () => {
    const result = isTriageComplete(
      answers({
        symptom: null,
        symptomOther: "Dor ao engolir, piora à noite",
        duration: "Hoje (6–24h)",
        fever: "sim",
        intensePain: "nao",
        breathingDifficulty: "nao",
        rapidWorsening: "nao",
        usingMedication: "nao",
      }),
    )

    expect(result).toBe(false)
  })

  it("nenhuma resposta preenchida → false", () => {
    expect(isTriageComplete(emptyTriageAnswers())).toBe(false)
  })
})

describe("classifyRisk — grupo de risco isolado NUNCA eleva sozinho a red", () => {
  // Guarda de regressão para a regra clínica: vulnerabilidade (idoso,
  // gestante, criança, etc.) baixa o limiar para escalar a gravidade, mas
  // não pula direto para emergência sem um sinal de alarme respiratório ou
  // cardíaco de verdade — senão o app super-triaria esses grupos em massa.
  it("idoso sozinho, com ou sem febre/piora rápida → nunca red", () => {
    const cenarios: Partial<TriageAnswers>[] = [
      { vulnerableGroups: ["Idoso (60 anos ou mais)"] },

      { vulnerableGroups: ["Idoso (60 anos ou mais)"], fever: "sim" },

      {
        vulnerableGroups: ["Idoso (60 anos ou mais)"],
        rapidWorsening: "sim",
      },

      {
        vulnerableGroups: ["Idoso (60 anos ou mais)"],
        fever: "sim",
        rapidWorsening: "sim",
      },
    ]

    for (const cenario of cenarios) {
      const result = classifyRisk(answers(cenario))

      expect(result.level).not.toBe("red")
    }
  })

  it("gestante com febre e piora rápida → orange (urgente), não red", () => {
    const result = classifyRisk(
      answers({
        vulnerableGroups: ["Gestante"],

        fever: "sim",

        rapidWorsening: "sim",
      }),
    )

    expect(result.level).toBe("orange")
  })

  it("todos os grupos de alto risco marcados ao mesmo tempo, sem sinal respiratório/cardíaco → nunca red", () => {
    const result = classifyRisk(
      answers({
        vulnerableGroups: [
          "Criança (menor de 5 anos)",
          "Idoso (60 anos ou mais)",
          "Gestante",
          "Puérpera (até 45 dias após parto)",
          "Imunossuprimido / transplantado",
        ],

        fever: "sim",

        rapidWorsening: "sim",
      }),
    )

    expect(result.level).not.toBe("red")
  })
})

describe("classifyRisk — doença crônica isolada", () => {
  it("doença crônica sem febre nem piora → green (não eleva sozinha)", () => {
    const result = classifyRisk(
      answers({
        vulnerableGroups: [
          "Portador de doença crônica (diabetes, HAS, cardiopatia, DPOC...)",
        ],

        fever: "nao",

        rapidWorsening: "nao",
      }),
    )

    expect(result.level).toBe("green")
  })

  it("doença crônica + falta de ar isolada → orange (pela regra geral de falta de ar)", () => {
    const result = classifyRisk(
      answers({
        vulnerableGroups: [
          "Portador de doença crônica (diabetes, HAS, cardiopatia, DPOC...)",
        ],

        breathingDifficulty: "sim",

        rapidWorsening: "nao",

        intensePain: "nao",
      }),
    )

    expect(result.level).toBe("orange")
  })
})