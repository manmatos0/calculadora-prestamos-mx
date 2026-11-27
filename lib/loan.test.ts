import Decimal from "decimal.js";
import { describe, expect, it } from "vitest";
import { calculateLoan, loanSchema } from "./loan";

describe("Amortización", () => {
  it("reconcilia tres cuotas a tasa cero", () => {
    const result = calculateLoan({ principal: 1000, annualRate: 0, termMonths: 3 });
    expect(result.rows.map(({ paid }) => paid)).toEqual(["333.33", "333.33", "333.34"]);
    expect(result.interest).toBe("0.00");
  });

  it("coincide con el caso manual de dos meses al 1% mensual", () => {
    const result = calculateLoan({ principal: 1000, annualRate: 12, termMonths: 2 });
    expect(result.monthlyPayment).toBe("507.51");
    expect(result.rows).toEqual([
      { month: 1, paid: "507.51", interest: "10.00", principal: "497.51", balance: "502.49" },
      { month: 2, paid: "507.51", interest: "5.02", principal: "502.49", balance: "0.00" },
    ]);
    expect(result.total).toBe("1015.02");
  });

  it("redondea hacia arriba exactamente en medio centavo", () => {
    const result = calculateLoan({ principal: 1000.01, annualRate: 0, termMonths: 2 });
    expect(result.rows.map(({ paid }) => paid)).toEqual(["500.01", "500.00"]);
  });

  it.each([[1000.5, 12, 1], [1000, 150, 360], [10000000, 0.01, 360], [100000, 24, 24]])(
    "reconcilia importes para %s, %s%% y %s meses", (principal, annualRate, termMonths) => {
      const result = calculateLoan({ principal, annualRate, termMonths });
      const sum = (key: "paid" | "interest" | "principal") =>
        result.rows.reduce((acc, row) => acc.plus(row[key]), new Decimal(0)).toFixed(2);
      expect(result.rows).toHaveLength(termMonths);
      expect(result.rows.at(-1)?.balance).toBe("0.00");
      expect(sum("principal")).toBe(principal.toFixed(2));
      expect(sum("paid")).toBe(result.total);
      expect(sum("interest")).toBe(result.interest);
    },
  );
});

describe("Validación", () => {
  const valid = { principal: "1000.01", annualRate: "0.25", termMonths: "360" };
  it("admite decimales y límites", () => {
    expect(loanSchema.parse(valid)).toEqual({ principal: 1000.01, annualRate: 0.25, termMonths: 360 });
    expect(loanSchema.safeParse({ principal: "10000000", annualRate: "150", termMonths: "1" }).success).toBe(true);
  });
  it.each([
    { principal: "" }, { principal: "999.99" }, { principal: "10000000.01" },
    { annualRate: "-1" }, { annualRate: "150.01" }, { annualRate: "1.234" },
    { termMonths: "1.5" }, { termMonths: "0" }, { termMonths: "361" }, { principal: "1e4" },
  ])("rechaza %j", (override) => {
    expect(loanSchema.safeParse({ ...valid, ...override }).success).toBe(false);
  });
});
