type CalculatorEvent = "calculator_view" | "calculate_loan" | "calculation_error" |
  "view_amortization" | "reset_calculator";

export function track(event: CalculatorEvent) {
  const analytics = window as Window & { gtag?: (command: "event", name: CalculatorEvent) => void };
  analytics.gtag?.("event", event);
}
