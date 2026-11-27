import type { Metadata } from "next";
import { sitePageUrl } from "@/lib/site";
export const metadata: Metadata = { title: "Términos de uso", alternates: { canonical: sitePageUrl("/terminos") } };

export default function Terms() {
  return <article className="copy">
    <h1>Términos de uso</h1>
    <h2>Uso de la calculadora</h2>
    <p>La herramienta es independiente de las instituciones financieras. Sus resultados son estimaciones informativas. La herramienta no otorga créditos ni recibe solicitudes de préstamo.</p>
    <h2>Condiciones del crédito</h2>
    <p>La simulación usa los datos que ingreses y los supuestos descritos en la metodología. Las condiciones y los cargos de un préstamo dependen de la oferta y el contrato de la institución que lo otorga.</p>
  </article>;
}
