import type { Metadata } from "next";
import { sitePageUrl } from "@/lib/site";
export const metadata: Metadata = { title: "Privacidad", alternates: { canonical: sitePageUrl("/privacidad") } };

export default function Privacy() {
  return <article className="copy">
    <h1>Privacidad</h1>
    <h2>Datos de la simulación</h2>
    <p>El monto, la tasa y el plazo se procesan en tu navegador. La aplicación conserva las entradas en memoria mientras usas la calculadora. Al recargar se restauran los valores de ejemplo.</p>
    <h2>Analítica y publicidad</h2>
    <p>Esta versión no carga Google Analytics ni publicidad. El servicio de alojamiento podrá registrar datos técnicos de las visitas según su propia configuración.</p>
  </article>;
}
