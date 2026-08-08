import { defineConfig } from 'vitest/config'

// Config mínima: os testes de src/lib/triage.ts são lógica pura (sem DOM),
// então não precisamos de 'jsdom' nem de setup extra por enquanto. Se no
// futuro vocês testarem componentes React, aí sim vale adicionar
// `environment: 'jsdom'` e a dependência `jsdom` no package.json.
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
})