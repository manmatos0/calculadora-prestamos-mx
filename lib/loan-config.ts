export const limits = {
  principal: { min: 1000, max: 10000000, initial: 100000, step: 0.01, sliderStep: 1000 },
  annualRate: { min: 0, max: 150, initial: 24, step: 0.01, sliderStep: 0.01 },
  termMonths: { min: 1, max: 360, initial: 24, step: 1, sliderStep: 1 },
} as const;

export type Field = keyof typeof limits;
export const fields = Object.keys(limits) as Field[];

export const defaults = {
  principal: String(limits.principal.initial),
  annualRate: String(limits.annualRate.initial),
  termMonths: String(limits.termMonths.initial),
};
