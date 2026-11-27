import type { Metadata } from "next";
import Link from "next/link";
import { Calculator } from "@/components/calculator";
import { description, siteName, sitePageUrl, title } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: sitePageUrl("/") },
  openGraph: { title, description, siteName, url: sitePageUrl("/"), locale: "es_MX", type: "website" },
};

export default function Home() {
  return <>
    <section className="hero">
      <h1>Calculadora de préstamos <span>en México</span></h1>
      <p>Estima tu mensualidad en pesos mexicanos y revisa cuánto pagarías de capital e intereses durante el plazo de tu préstamo.</p>
    </section>
    <Calculator />
    <div className="copy" data-ad-placement="after-calculator">
      <section aria-labelledby="como">
        <h2 id="como">Cómo se calcula tu mensualidad</h2>
        <p>Este simulador divide la tasa nominal anual entre 12. Cada mes aplica esa tasa al saldo pendiente y destina el resto del pago a reducir el capital. Conforme baja el saldo, disminuye el interés del siguiente periodo.</p>
        <Link href="/metodologia">Consultar la metodología de cálculo</Link>
      </section>
      <section aria-labelledby="preguntas">
        <h2 id="preguntas">Preguntas frecuentes</h2>
        <details><summary>¿Qué necesito para simular un crédito personal?</summary><p>Ten a la mano el monto que recibirías, la tasa nominal anual fija y el plazo expresado en meses. Puedes modificar los valores de ejemplo para comparar escenarios.</p></details>
        <details><summary>¿La tasa nominal anual es lo mismo que el CAT?</summary><p>La tasa nominal anual se usa para calcular el interés sobre el saldo. El CAT es un indicador de costo que considera otros conceptos del crédito. La calculadora usa la tasa nominal anual y excluye los cargos adicionales.</p></details>
        <details><summary>¿Qué cambia si elijo un plazo más largo?</summary><p>Con el mismo monto y una tasa positiva, un plazo más largo suele reducir la mensualidad y aumentar los intereses totales. Revisa el total pagado y el desglose mensual al comparar alternativas.</p></details>
      </section>
    </div>
  </>;
}
