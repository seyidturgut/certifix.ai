import type { Metadata } from "next";
import LandingPageClient from "@/components/landing/LandingPageClient";

export const metadata: Metadata = {
  title: "Certifix | Dijital Sertifika Oluşturma ve Doğrulama Sistemi",
  description: "Certifix.ai ile eğitim ve etkinlikleriniz için doğrulanabilir, paylaşıma hazır ve güvenilir dijital sertifikalar oluşturun.",
  openGraph: {
    title: "Certifix | Dijital Sertifika Sistemi",
    description: "Doğrulanabilir dijital sertifikalar ve doğrulama altyapısı.",
    images: ["/hero-visual.png"],
    type: "website",
  }
};

export default function LandingPage() {
  return <LandingPageClient />;
}
