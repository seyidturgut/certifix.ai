import { Metadata } from "next";
import NedirPageClient from "@/components/landing/NedirPageClient";

export const metadata: Metadata = {
    title: "Certifix Nedir? | Dijital Sertifika Çözümleri",
    description: "Certifix.ai nedir, nasıl çalışır ve hangi sorunları çözer? Dijital sertifika süreçlerimizi keşfedin.",
};

export default function NedirPage() {
    return <NedirPageClient />;
}
