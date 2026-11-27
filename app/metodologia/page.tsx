import type { Metadata } from "next";
import { sitePageUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Metodología de amortización",
  description: "Fórmula, supuestos y redondeo de la calculadora de préstamos en México.",
  alternates: { canonical: sitePageUrl("/metodologia") },
};

export default function Methodology() {
  return <article className="copy">
    <h1>Metodología de cálculo</h1>
    <p>La simulación usa amortización francesa con tasa nominal anual fija, periodos mensuales iguales y pagos al final de cada mes.</p>
    <h2>Fórmula de la mensualidad</h2>
    <p>Si P es el capital y n el plazo en meses, la tasa mensual r se obtiene dividiendo la tasa anual porcentual entre 1,200.</p>
    <p><strong>Mensualidad = P × r / [1 − (1 + r)<sup>−n</sup>]</strong></p>
    <p>Si r es cero, la mensualidad es P dividido entre n.</p>
    <h2>Tabla y redondeo</h2>
    <ol>
      <li>Calculamos la cuota teórica con precisión decimal y la redondeamos a centavos. Medio centavo se redondea hacia arriba.</li>
      <li>Multiplicamos el saldo de cada periodo por la tasa mensual y redondeamos el interés a centavos.</li>
      <li>Aplicamos la diferencia entre la cuota y el interés al capital pendiente, hasta cubrir el saldo.</li>
      <li>En el último mes sumamos el saldo pendiente y el interés correspondiente para liquidar el crédito. Los totales se obtienen sumando las filas.</li>
    </ol>
    <p>Con tasas altas y plazos largos, la cuota redondeada puede igualar al interés del periodo. En ese escenario el saldo permanece pendiente hasta la última cuota, que puede ser considerablemente mayor.</p>
    <h2>Alcance de la simulación</h2>
    <p>Los importes se expresan en MXN. La estimación excluye CAT, IVA, seguros, comisiones y otros cargos. Cada institución puede aplicar calendarios y reglas de redondeo distintos.</p>
  </article>;
}
