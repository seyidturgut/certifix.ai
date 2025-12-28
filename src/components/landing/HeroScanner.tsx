"use client";

import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Zap, Globe, Mail, FileSignature, QrCode, Cpu, Check } from 'lucide-react';

// --- Types ---
interface CardData {
    id: number;
    title: string;
    status: string;
    icon: React.ReactNode;
    codeSnippet: string;
    color: string;
    bg: string;
}

// --- Data: Certificate Lifecycle Steps ---
const CERT_STEPS: CardData[] = [
    {
        id: 1,
        title: "Taslak Oluşturma",
        status: "Hazırlanıyor",
        icon: <FileSignature size={32} />,
        codeSnippet: `const cert = {
  id: "temp_123",
  template: "modern_v2",
  recipient: "Seyid T.",
  issueDate: Date.now()
};`,
        color: "text-blue-600",
        bg: "bg-blue-50"
    },
    {
        id: 2,
        title: "QR Kod Üretimi",
        status: "İşleniyor",
        icon: <QrCode size={32} />,
        codeSnippet: `const qr = new QRCode({
  text: "https://certifix.ai/v/...",
  width: 512,
  height: 512,
  colorDark: "#000000",
});`,
        color: "text-indigo-600",
        bg: "bg-indigo-50"
    },
    {
        id: 3,
        title: "Dijital İmza",
        status: "İmzalanıyor",
        icon: <ShieldCheck size={32} />,
        codeSnippet: `async function sign(doc) {
  const privateKey = await getKey();
  const signature = crypto.sign(
    "sha256", doc, privateKey
  );
  return signature;
}`,
        color: "text-emerald-600",
        bg: "bg-emerald-50"
    },
    {
        id: 4,
        title: "Blockchain Kaydı",
        status: "Onaylanıyor",
        icon: <Cpu size={32} />,
        codeSnippet: `const tx = await contract.mint({
  to: "0x71C...",
  uri: "ipfs://QmHash...",
  gasLimit: 300000
});
await tx.wait();`,
        color: "text-amber-600",
        bg: "bg-amber-50"
    },
    {
        id: 5,
        title: "E-Posta Gönderimi",
        status: "İletiliyor",
        icon: <Mail size={32} />,
        codeSnippet: `await mailer.send({
  to: "user@example.com",
  subject: "Sertifikanız Hazır",
  template: "cert_delivery",
  attachment: pdfBuffer
});`,
        color: "text-rose-600",
        bg: "bg-rose-50"
    }
];

// Duplicate list for infinite scroll feel
const DISPLAY_CARDS = [...CERT_STEPS, ...CERT_STEPS, ...CERT_STEPS];

export default function HeroScanner() {
    const streamRef = useRef<HTMLDivElement>(null);
    const [scannerPosition, setScannerPosition] = useState(0);

    useEffect(() => {
        // Animation Logic for Infinite Scroll & Scanner Interaction
        const container = streamRef.current;
        if (!container) return;

        let animationFrameId: number;
        let position = -1000; // Start offset
        const speed = 1.5; // Pixels per frame
        const cardWidth = 320; // Width + Gap (280 + 40)
        const totalWidth = cardWidth * DISPLAY_CARDS.length;

        // Auto-scroll function
        const animate = () => {
            position += speed;

            // Infinite Loop Reset
            if (position > 0) {
                position = - (totalWidth / 3); // Reset to first third set closer to "real" start
            }

            if (container) {
                container.style.transform = `translateX(${position}px)`;

                // Update Clipping Masks for "Scan Effect"
                updateClipping(container);
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        const updateClipping = (cont: HTMLDivElement) => {
            const scannerX = cont.parentElement?.getBoundingClientRect().width! / 2 || window.innerWidth / 2;
            const scannerWidth = 4; // Thin laser line

            const cardNodes = cont.querySelectorAll('.scanner-card-wrapper');

            cardNodes.forEach((node) => {
                const el = node as HTMLElement;
                const rect = el.getBoundingClientRect();

                // If card is intersecting with the center scanner line
                if (rect.left < scannerX && rect.right > scannerX) {
                    // Calculate percentage of card that is "past" the scanner
                    const distancePastScanner = scannerX - rect.left;
                    const percentage = (distancePastScanner / rect.width) * 100;

                    // Update custom properties for the clip-path
                    el.style.setProperty('--clip-pos', `${percentage}%`);
                    el.setAttribute('data-scanning', 'true');
                } else {
                    el.removeAttribute('data-scanning');
                    // Reset based on side
                    if (rect.right < scannerX) {
                        el.style.setProperty('--clip-pos', '100%'); // Fully scanned (Show Code)
                    } else {
                        el.style.setProperty('--clip-pos', '0%'); // Not scanned yet (Show Normal)
                    }
                }
            });
        };

        const handleResize = () => {
            // Recalculate center if needed
        };

        window.addEventListener('resize', handleResize);
        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="relative w-full h-[400px] overflow-hidden rounded-[2.5rem] bg-[#0A0F1C] border border-slate-800 shadow-2xl flex items-center justify-center group/scanner">

            {/* Background Grid/Noise (Simplified) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(30,58,138,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />

            {/* The Scanner Line (Center) */}
            <div className="absolute left-1/2 top-10 bottom-10 w-[2px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent z-40 shadow-[0_0_20px_rgba(34,211,238,0.8)]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-cyan-500/30 flex items-center justify-center animate-pulse">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,1)]" />
                </div>
            </div>

            {/* Cards Stream Container */}
            <div ref={streamRef} className="flex gap-10 absolute left-1/2 items-center will-change-transform">
                {DISPLAY_CARDS.map((card, i) => (
                    <div
                        key={i}
                        className="scanner-card-wrapper relative w-[280px] h-[200px] shrink-0 rounded-2xl perspective-1000"
                        style={{ '--clip-pos': '0%' } as React.CSSProperties}
                    >
                        {/* 1. Normal State Logic (Visual Card) */}
                        <div
                            className="card-normal absolute inset-0 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-xl border border-slate-200 z-10"
                            style={{ clipPath: 'inset(0 0 0 var(--clip-pos))' }}
                        >
                            <div className="flex items-start justify-between">
                                <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                                    {card.icon}
                                </div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">
                                    ADIM {card.id}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-lg font-black text-slate-800 leading-tight">{card.title}</h4>
                                <p className="text-sm font-medium text-slate-500 mt-1">{card.status}</p>
                            </div>
                        </div>

                        {/* 2. Scanned/Code State Logic (ASCII/Tech Card) */}
                        <div
                            className="card-code absolute inset-0 bg-slate-900 rounded-2xl p-6 flex flex-col shadow-xl border border-cyan-500/30 overflow-hidden"
                            style={{ clipPath: 'inset(0 calc(100% - var(--clip-pos)) 0 0)' }}
                        >
                            {/* Matrix/Glitch Overlay */}
                            <div className="absolute inset-0 bg-cyan-500/5 z-0 pointer-events-none" />

                            <div className="relative z-10 font-mono text-[10px] text-cyan-400 leading-relaxed opacity-80 overflow-hidden h-full">
                                {card.codeSnippet}
                            </div>

                            <div className="absolute bottom-4 right-4 z-10">
                                <div className="flex items-center gap-1.5 text-cyan-400 text-[10px] font-bold uppercase tracking-widest">
                                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                                    Verifying
                                </div>
                            </div>
                        </div>

                        {/* Scanner Beam Effect (Only visible when actively scanning) */}
                        <div className="absolute inset-y-0 w-[4px] bg-cyan-400/50 blur-[4px] z-50 pointer-events-none"
                            style={{ left: 'var(--clip-pos)', opacity: 0.8 }}
                        />
                    </div>
                ))}
            </div>

            {/* Foreground / HUD Elements (Static) */}
            <div className="absolute bottom-4 left-6 z-50 flex items-center gap-2 text-cyan-500/60 font-mono text-[10px]">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                SYSTEM: ONLINE
            </div>
            <div className="absolute top-4 right-6 z-50 font-mono text-[10px] text-slate-500">
                latency: 12ms
            </div>
        </div>
    );
}
