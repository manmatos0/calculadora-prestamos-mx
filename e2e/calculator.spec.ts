import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("calcula y muestra capital, intereses y saldo final", async ({ page }) => {
  await expect(page.getByRole("status")).toContainText("Calcula tu mensualidad");
  await page.getByLabel("Monto del préstamo", { exact: true }).fill("1000");
  await page.getByLabel("Tasa nominal anual", { exact: true }).fill("12");
  await page.getByLabel("Plazo", { exact: true }).fill("2");
  await page.getByRole("button", { name: "Calcular mensualidad" }).click();
  await expect(page.getByRole("status")).toContainText("$507.51");
  await expect(page.getByRole("figure")).toContainText("$15.02");
  await page.getByText("Ver los 2 pagos").click();
  await expect(page.getByRole("table").locator("tbody tr").last().locator("td").last()).toHaveText("$0.00");
});

test("recalcula al editar y al mover el deslizador", async ({ page }) => {
  await page.getByRole("button", { name: "Calcular mensualidad" }).click();
  await page.getByLabel("Tasa nominal anual", { exact: true }).fill("0");
  await expect(page.getByRole("status")).toContainText("$4,166.67");
  await page.getByRole("slider", { name: "Plazo, control deslizante" }).press("ArrowRight");
  await expect(page.getByLabel("Plazo", { exact: true })).toHaveValue("25");
  await expect(page.getByRole("status")).toContainText("4,000.00");
  await expect(page.getByText("Ver los 25 pagos")).toBeVisible();
});

test("asocia los errores y permite corregirlos", async ({ page }) => {
  const amount = page.getByLabel("Monto del préstamo", { exact: true });
  await amount.fill("1");
  await page.getByRole("button", { name: "Calcular mensualidad" }).click();
  await expect(amount).toBeFocused();
  await expect(amount).toHaveAttribute("aria-invalid", "true");
  await expect(amount).toHaveAccessibleDescription(/El mínimo es/);
  await expect(page.getByRole("figure")).toHaveCount(0);
  await amount.fill("1000");
  await page.getByRole("button", { name: "Calcular mensualidad" }).click();
  await expect(page.getByRole("figure")).toBeVisible();
  await amount.fill("");
  await expect(page.getByRole("status")).toContainText("Corrige los campos");
});

test("restaura las entradas y el estado de inicio", async ({ page }) => {
  await page.getByLabel("Monto del préstamo", { exact: true }).fill("2000");
  await page.getByRole("button", { name: "Calcular mensualidad" }).click();
  await page.getByRole("button", { name: "Restaurar" }).click();
  await expect(page.getByLabel("Monto del préstamo", { exact: true })).toHaveValue("100000");
  await expect(page.getByLabel("Tasa nominal anual", { exact: true })).toHaveValue("24");
  await expect(page.getByLabel("Plazo", { exact: true })).toHaveValue("24");
  await expect(page.getByRole("status")).toContainText("Calcula tu mensualidad");
});

test("mantiene el orden responsive y encierra la tabla", async ({ page, isMobile }) => {
  const form = await page.getByRole("form").boundingBox();
  const result = await page.getByRole("region", { name: "Resultado de la simulación" }).boundingBox();
  expect(form).not.toBeNull();
  expect(result).not.toBeNull();
  if (isMobile) expect(result!.y).toBeGreaterThan(form!.y + form!.height);
  else expect(result!.x).toBeGreaterThan(form!.x + form!.width);
  await page.getByRole("button", { name: "Calcular mensualidad" }).click();
  await page.getByText("Ver los 24 pagos").click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
});

test("navega a metodología y páginas legales", async ({ page }) => {
  await page.getByRole("link", { name: "Metodología", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Metodología de cálculo");
  await page.getByRole("link", { name: "Privacidad", exact: true }).click();
  await expect(page).toHaveURL(/\/privacidad$/);
  await page.getByRole("link", { name: "Términos de uso", exact: true }).click();
  await expect(page).toHaveURL(/\/terminos$/);
  await page.getByRole("link", { name: "Calculadora", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Calculadora de préstamos en México");
});
