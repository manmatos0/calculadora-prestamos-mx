const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const siteUrl = new URL((configuredUrl || "http://localhost:3000").replace(/\/+$/, "") + "/");
export const allowIndexing = Boolean(configuredUrl && siteUrl.protocol === "https:"
  && !["localhost", "127.0.0.1", "[::1]"].includes(siteUrl.hostname));
export const sitePageUrl = (path: string) => new URL(path.replace(/^\//, ""), siteUrl);
export const siteName = "Calculadora de Préstamos MX";
export const title = "Calculadora de Préstamos México | Simula tu Mensualidad";
export const description = "Calcula la mensualidad de tu préstamo en México. Conoce intereses, total estimado y tabla de amortización gratis.";
export const routes = ["/", "/metodologia", "/privacidad", "/terminos"] as const;
