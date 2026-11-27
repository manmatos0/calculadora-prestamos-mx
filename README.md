# Calculadora de Préstamos MX

Simulador de mensualidades en pesos mexicanos con amortización francesa. Está orientado a personas que quieren comparar escenarios de crédito personal. La especificación adjunta se utilizó como PRD.

## Ejecutar y verificar

Requiere Node.js 22.12 o posterior y npm. Ejecuta estos comandos desde el directorio del proyecto.

```sh
npm ci
npm run dev
```

Abre http://localhost:3000. Para verificar la compilación de producción y las pruebas, ejecuta estos comandos.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium --no-shell
npm run test:e2e
```

Playwright inicia la compilación de producción en el puerto 3100 y prueba Chromium en escritorio y con el perfil móvil Pixel 7. En Windows, puedes usar Chrome instalado con `$env:PLAYWRIGHT_CHANNEL = "chrome"; npm run test:e2e` en PowerShell. Define `PLAYWRIGHT_BASE_URL` si ya tienes una compilación de producción servida en otro puerto.

## Estructura

- `app/` contiene la portada, la metodología, las páginas legales y la configuración de SEO.
- `components/` contiene formulario, resultados, gráfico y tabla. El gráfico se carga cuando hay un cálculo válido.
- `lib/` contiene límites, validación, motor financiero, pruebas unitarias, configuración del sitio y eventos.
- `e2e/` contiene pruebas de la interacción y el diseño responsive.

## Supuestos

El primer cálculo requiere una acción explícita. Después, una entrada válida actualiza los tres resultados; una inválida los oculta. Restaurar devuelve el ejemplo y vuelve al estado previo al primer cálculo. El monto y la tasa aceptan hasta dos decimales mediante punto decimal; el plazo es entero.

La tabla aplica el interés mensual al saldo de cada periodo y redondea a centavos con ROUND_HALF_UP. La última cuota liquida el saldo exacto. En escenarios de tasa alta y plazo largo, la cuota ordinaria redondeada puede cubrir únicamente interés. En ese caso, el último pago puede subir de forma considerable. La interfaz muestra el último pago siempre que difiera de la cuota ordinaria. El caso independiente de $1,000 al 12% por dos meses usa $10.00 de interés en el primer mes y $5.02 en el segundo. El ejemplo de $1,000 a tasa cero por tres meses reconcilia con dos cuotas de $333.33 y una de $333.34.

La estimación excluye CAT, IVA, comisiones, seguros y otros cargos. No contempla pagos anticipados, periodicidades distintas de la mensual ni calendarios de días reales.

Los cinco eventos de GA4 tienen un punto de integración en `lib/analytics.ts`. El adaptador se limita a enviar nombres de eventos cuando existe `gtag`. La aplicación no instala la etiqueta. La ubicación futura para anuncios está después del simulador, marcada con `data-ad-placement`, sin reserva visible de espacio.

## Despliegue y pendientes

1. Define `NEXT_PUBLIC_SITE_URL` como el origen público HTTPS antes de compilar. Sin esa variable la compilación local bloquea la indexación. Verifica canonical, Open Graph, robots.txt y sitemap.xml en el dominio final.
2. Compila con `npm run build` y usa un alojamiento compatible con Next.js o ejecuta `npm start`. Sirve la aplicación por HTTPS.
3. Completa los datos del responsable, contacto y tratamiento de registros del alojamiento en la página de privacidad según el despliegue real. Actualiza esa página antes de activar analítica o publicidad.
4. Completa la revisión WCAG 2.2 AA con tecnologías de asistencia y dispositivos reales antes de publicar. Los escenarios de Playwright cubren teclado, errores asociados, resultados y diseño en dos perfiles.

Para la siguiente iteración, prueba la comprensión de la cuota final ajustada con usuarios y valida el descubrimiento de la página con Search Console después del despliegue.

En un entorno Windows restringido, si Next.js devuelve `EPERM` al crear directorios durante el prerender, vuelve a compilar desde PowerShell con `$env:UV_THREADPOOL_SIZE = '1'; npm run build`.

## GitHub Pages

El flujo Publicar en GitHub Pages compila y despliega la exportación estática con cada actualización de `main`. En GitHub, selecciona **Settings → Pages → Build and deployment → Source → GitHub Actions**. La dirección publicada aparece en el entorno `github-pages` al finalizar el despliegue.
