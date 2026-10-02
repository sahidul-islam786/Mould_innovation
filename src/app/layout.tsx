import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/footer/Footer";
import { CtaBand } from "@/components/sections/CtaBand";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Cursor } from "@/components/motion/Cursor";
import { company } from "@/data/company";

// One family; the width axis gives the expanded display cut (spec 6.2).
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(company.siteUrl),
  title: { default: "Mould Innovation — Go Further with AI", template: "%s | Mould Innovation" },
  // Hero sub-line from the live home page.
  description:
    "Full-stack AI services and products that automate work, grow revenue, and delight customers—built in India, deployed worldwide.",
  openGraph: { siteName: "Mould Innovation", type: "website", locale: "en_IN" },
};

export const viewport: Viewport = { themeColor: "#0b0b0c" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <CtaBand />
        <Footer />
        <div aria-hidden className="grain" />
        <Cursor />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: company.legalName,
              url: company.siteUrl,
              email: company.email,
              telephone: company.phone,
              address: { "@type": "PostalAddress", streetAddress: "Lords 605, 7/1 Lord Sinha Road", addressLocality: "Kolkata", postalCode: "700071", addressCountry: "IN" },
              sameAs: company.social.map((s) => s.href),
            }),
          }}
        />
      </body>
    </html>
  );
}
