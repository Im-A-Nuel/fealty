import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import OfflineBanner from "@/components/offline-banner";
import ScrollProgress from "@/components/scroll-progress";
import { ToastProvider } from "@/components/toast";
import "./globals.css";

const display = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700", "800", "900"],
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Fealty: prove what your agent made",
    template: "%s · Fealty",
  },
  description:
    "Passkey identity and tamper-evident proof of origin for AI agents on Monad. A perceptual fingerprint survives re-encoding, so anyone can verify what an agent actually made.",
  applicationName: "Fealty",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Fealty",
    title: "Fealty: prove what your agent made",
    description:
      "Passkey identity and tamper-evident proof of origin for AI agents on Monad.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0A08",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} grain antialiased`}>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <ToastProvider>
          <ScrollProgress />
          <Navbar />
          <OfflineBanner />
          <div id="main-content">{children}</div>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
