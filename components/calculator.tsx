"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "./ui/button";
import { defaults, fields, limits, type Field } from "@/lib/loan-config";
import { calculateLoan, formatMXN, loanSchema } from "@/lib/loan";
import { track } from "@/lib/analytics";

const CostChart = dynamic(() => import("./cost-chart"), { ssr: false });
const labels = { principal: "Monto del préstamo", annualRate: "Tasa nominal anual", termMonths: "Plazo" };
const units = { principal: "MXN", annualRate: "%", termMonths: "meses" };
const number = new Intl.NumberFormat("es-MX");
const currency = (value: string) => formatMXN.format(Number(value));
const rangeLabel = (field: Field, value: number) =>
  field === "principal" ? "$" + number.format(value) : number.format(value) + (field === "annualRate" ? "%" : " meses");

export function Calculator() {
  const [values, setValues] = useState(defaults);
  const [submitted, setSubmitted] = useState(false);
  const [started, setStarted] = useState(false);
  const viewed = useRef(false);
  const parsed = loanSchema.safeParse(values);
  const result = started && parsed.success ? calculateLoan(parsed.data) : null;
  const errors = parsed.success ? {} : parsed.error.flatten().fieldErrors;
  const last = result?.rows.at(-1);

  useEffect(() => {
    if (viewed.current) return;
    viewed.current = true;
    track("calculator_view");
  }, []);

  function change(field: Field, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (started && parsed.success && !loanSchema.safeParse(next).success) track("calculation_error");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (!parsed.success) {
      track("calculation_error");
      const field = fields.find((key) => errors[key]);
      if (field) document.getElementById(field)?.focus();
      return;
    }
    setStarted(true);
    track("calculate_loan");
  }

  function reset() {
    setValues(defaults);
    setSubmitted(false);
    setStarted(false);
    track("reset_calculator");
  }

  return <>
    <div className="workspace" id="calculadora">
      <form className="panel form-panel" onSubmit={submit} noValidate aria-labelledby="form-title">
        <h2 id="form-title">Datos del préstamo</h2>
        <p className="panel-intro">Ajusta los valores según el crédito que quieras simular.</p>
        {fields.map((field) => {
          const { min, max, initial, sliderStep } = limits[field];
          const error = submitted ? errors[field]?.[0] : undefined;
          const amount = Number(values[field]);
          const sliderValue = values[field].trim() && Number.isFinite(amount)
            ? Math.max(min, Math.min(max, amount)) : initial;
          return <div className="field" key={field}>
            <label htmlFor={field}>{labels[field]}</label>
            <div className="input-wrap">
              <input id={field} value={values[field]} onChange={(e) => change(field, e.target.value)}
                inputMode={field === "termMonths" ? "numeric" : "decimal"} autoComplete="off"
                aria-invalid={Boolean(error)} aria-describedby={field + "-range" + (error ? " " + field + "-error" : "")}
                required />
              <span aria-hidden="true">{units[field]}</span>
            </div>
            <input className="slider" type="range" min={min} max={max} step={sliderStep} value={sliderValue}
              aria-label={labels[field] + ", control deslizante"} aria-valuetext={rangeLabel(field, sliderValue)}
              onChange={(e) => change(field, e.target.value)} />
            <div className="range-labels" id={field + "-range"}>
              <span>{rangeLabel(field, min)}</span><span>{rangeLabel(field, max)}</span>
            </div>
            {error && <p className="error" id={field + "-error"}>{error}</p>}
          </div>;
        })}
        <div className="actions">
          <Button type="submit" className="grow">Calcular mensualidad</Button>
          <Button type="button" variant="ghost" onClick={reset}>Restaurar</Button>
        </div>
      </form>

      <section className="panel results-panel" aria-labelledby="results-title">
        <h2 id="results-title">Resultado de la simulación</h2>
        <div className="payment" role="status" aria-atomic="true">
          <span>Mensualidad estimada</span>
          {result ? <strong>{currency(result.monthlyPayment)} <small>MXN</small></strong>
            : <p>{started ? "Corrige los campos marcados para actualizar la simulación." : "Calcula tu mensualidad para ver el resultado."}</p>}
        </div>
        <dl className="breakdown">
          <div><dt>Capital</dt><dd>{result ? currency(result.principal) : "—"}</dd></div>
          <div><dt>Intereses</dt><dd>{result ? currency(result.interest) : "—"}</dd></div>
          <div><dt>Total pagado</dt><dd>{result ? currency(result.total) : "—"}</dd></div>
        </dl>
        {result && <CostChart result={result} />}
        {result && last?.paid !== result.monthlyPayment &&
          <p className="panel-intro">Última cuota ajustada para liquidar el saldo: <strong>{currency(last!.paid)} MXN</strong>.</p>}
        <p className="notice">Estimación con tasa nominal fija. Excluye CAT, IVA, comisiones, seguros y otros cargos.</p>
      </section>
    </div>

    <section className="panel amortization" aria-labelledby="amortization-title">
      <h2 id="amortization-title">Tabla de amortización</h2>
      <p className="panel-intro">Consulta cuánto de cada pago reduce tu deuda y cuánto corresponde a intereses.</p>
      {result ? <details onToggle={(event) => { if (event.currentTarget.open) track("view_amortization"); }}>
        <summary>Ver los {result.rows.length} pagos</summary>
        <div className="table-scroll" tabIndex={0} role="region" aria-label="Pagos mensuales">
          <table>
            <caption className="sr-only">Desglose mensual en pesos mexicanos</caption>
            <thead><tr><th scope="col">Mes</th><th scope="col">Pago</th><th scope="col">Capital</th>
              <th scope="col">Intereses</th><th scope="col">Saldo</th></tr></thead>
            <tbody>{result.rows.map((row) => <tr key={row.month}>
              <th scope="row">{row.month}</th><td>{currency(row.paid)}</td><td>{currency(row.principal)}</td>
              <td>{currency(row.interest)}</td><td>{currency(row.balance)}</td>
            </tr>)}</tbody>
            <tfoot><tr><th scope="row">Total</th><td>{currency(result.total)}</td><td>{currency(result.principal)}</td>
              <td>{currency(result.interest)}</td><td>{currency("0")}</td></tr></tfoot>
          </table>
        </div>
      </details> : <p className="text-slate-600">La tabla estará disponible después de un cálculo válido.</p>}
    </section>
  </>;
}
