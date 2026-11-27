import Decimal from "decimal.js";
import { z } from "zod";
import { limits, type Field } from "./loan-config";

const D = Decimal.clone({ precision: 64, rounding: Decimal.ROUND_HALF_UP });
const money = (amount: Decimal) => amount.toDecimalPlaces(2, D.ROUND_HALF_UP);
const numbers = new Intl.NumberFormat("es-MX");
export const formatMXN = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

function input(field: Field) {
  const { min, max, step } = limits[field];
  const pattern = step === 1 ? /^\d+$/ : /^(?:\d+(?:\.\d{1,2})?|\.\d{1,2})$/;
  return z.string().trim().min(1, "Completa este campo.")
    .regex(pattern, step === 1 ? "Escribe un número entero de meses." : "Escribe un número con hasta dos decimales.")
    .transform(Number)
    .pipe(z.number().min(min, `El mínimo es ${numbers.format(min)}.`)
      .max(max, `El máximo es ${numbers.format(max)}.`));
}

export const loanSchema = z.object({
  principal: input("principal"),
  annualRate: input("annualRate"),
  termMonths: input("termMonths"),
});

type LoanInput = z.output<typeof loanSchema>;

export function calculateLoan({ principal, annualRate, termMonths }: LoanInput) {
  const capital = new D(principal);
  const rate = new D(annualRate).div(1200);
  const payment = money(rate.isZero()
    ? capital.div(termMonths)
    : capital.times(rate).div(new D(1).minus(rate.plus(1).pow(-termMonths))));

  let balance = capital;
  let interestTotal = new D(0);
  let total = new D(0);
  const rows = Array.from({ length: termMonths }, (_, index) => {
    const month = index + 1;
    const interest = money(balance.times(rate));
    const principalPaid = month === termMonths ? balance
      : D.min(balance, D.max(0, payment.minus(interest)));
    const paid = principalPaid.plus(interest);
    balance = balance.minus(principalPaid);
    interestTotal = interestTotal.plus(interest);
    total = total.plus(paid);
    return { month, paid: paid.toFixed(2), interest: interest.toFixed(2),
      principal: principalPaid.toFixed(2), balance: balance.toFixed(2) };
  });

  return { monthlyPayment: payment.toFixed(2), principal: capital.toFixed(2),
    total: total.toFixed(2), interest: interestTotal.toFixed(2), rows };
}

export type LoanResult = ReturnType<typeof calculateLoan>;
