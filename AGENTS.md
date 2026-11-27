# Calculadora de Préstamos MX

- Mantén el motor puro en `lib/loan.ts` y los límites en `lib/loan-config.ts`.
- Calcula con decimal.js y redondea a centavos con ROUND_HALF_UP. Verifica los totales y la liquidación con Vitest.
- Mantén los datos de simulación en el navegador. Envía exclusivamente nombres de eventos a la integración de analítica.
- Comprueba lint, tipos, pruebas unitarias, build y Playwright antes de entregar cambios.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
