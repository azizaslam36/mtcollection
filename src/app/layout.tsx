import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { AnnouncementBar } from "@/components/sections/AnnouncementBar";
import { GA_MEASUREMENT_ID } from "@/lib/config";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mtcollection.in"),
  title: {
    default: "M&T Collection — Curated Fashion Deals",
    template: "%s | M&T Collection",
  },
  description:
    "M&T Collection curates fashion deals from trusted platforms like Flipkart and Myntra.",
  openGraph: {
    title: "M&T Collection",
    description:
      "Curated fashion deals from trusted platforms like Flipkart and Myntra.",
    siteName: "M&T Collection",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        {/* GA is only loaded when NEXT_PUBLIC_GA_ID is actually set —
            the site must work normally without it (Stage 2 spec #23).
            The ID itself comes from src/lib/config.ts, never hardcoded
            here or in any component. */}
        {GA_MEASUREMENT_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        ) : null}

        <AnnouncementBar />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
