import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Certifix | Güvenilir Dijital Sertifika Oluşturma ve Doğrulama",
  description: "Certifix.ai ile eğitim ve etkinlikleriniz için doğrulanabilir, paylaşıma hazır ve güvenilir dijital sertifikalar oluşturun.",
  keywords: ["dijital sertifika", "sertifika doğrulama", "online sertifika", "eğitim sertifikası", "blockchain sertifika"],
  authors: [{ name: "Certifix Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  icons: {
    icon: "/certifix-logo.png",
    apple: "/certifix-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
