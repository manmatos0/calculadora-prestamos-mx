"use client";

import { Pie, PieChart } from "recharts";
import { formatMXN, type LoanResult } from "@/lib/loan";

export default function CostChart({ result }: { result: LoanResult }) {
  const capital = Number(result.principal);
  const interest = Number(result.interest);
  const data = [
    { name: "Capital", value: capital, fill: "#315dd5" },
    { name: "Intereses", value: interest, fill: "#a6c1ff" },
  ];
  return <figure className="cost-chart">
    <div aria-hidden="true" className="donut">
      <PieChart width={120} height={120} accessibilityLayer={false}>
        <Pie data={data} dataKey="value" innerRadius={43} outerRadius={58}
          startAngle={90} endAngle={-270} stroke="none" isAnimationActive={false} />
      </PieChart>
    </div>
    <figcaption>
      <h3>Composición del pago total</h3>
      {data.map(({ name, value, fill }) => <p key={name}>
        <span className="swatch" style={{ background: fill }} /> {name} <strong>{formatMXN.format(value)}</strong>
      </p>)}
    </figcaption>
  </figure>;
}
