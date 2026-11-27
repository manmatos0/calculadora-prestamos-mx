import type { Metadata } from "next";
import Link from "next/link";
import "@fontsource-variable/inter";
import "./globals.css";
import { allowIndexing, description, siteName, siteUrl, title } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: { default: title, template: "%s | " + siteName },
  description,
  robots: { index: allowIndexing, follow: true },
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es-MX"><body>
    <a className="skip" href="#contenido">Saltar al contenido</a>
    <header><div className="shell header-row">
      <Link href="/" className="brand"><span aria-hidden="true" className="brand-icon">$</span>{siteName}</Link>
      <nav aria-label="Principal"><Link href="/#calculadora">Calculadora</Link><Link href="/metodologia">Metodología</Link></nav>
    </div></header>
    <main id="contenido" className="shell" tabIndex={-1}>{children}</main>
    <footer><div className="shell footer-row">
      <p>{siteName}</p>
      <nav aria-label="Información legal"><Link href="/privacidad">Privacidad</Link><Link href="/terminos">Términos de uso</Link></nav>
    </div></footer>
  </body></html>;
}
