"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    CheckCircle2,
    ShieldCheck,
    Zap,
    Cloud,
    Sparkles,
    ShieldAlert,
    Clock,
    Share2,
    X,
    Menu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
    {
        id: "problem",
        tag: "Sorun",
        title: "Sertifika Süreçleri Neden Zor?",
        description: "Geleneksel sertifika süreçleri yavaş, maliyetli ve güvenilirlikten uzaktır.",
        points: [
            "Tasarım ve basım için haftalarca süren bekleyiş.",
            "Yüksek kargo ve operasyonel maliyetler.",
            "Sahte sertifikaların kolayca üretilebilmesi.",
            "Katılımcıların fiziksel belgeleri paylaşma zorluğu."
        ],
        icon: <ShieldAlert className="text-red-500" size={48} />,
        bg: "bg-red-50/50"
    },
    {
        id: "solution",
        tag: "Çözüm",
        title: "Certifix ile Dijital Devrim",
        description: "Tüm süreci saniyeler içine sığdıran, güvenli ve çevre dostu bir çözüm.",
        points: [
            "Kağıt israfına son veren %100 dijital yapı.",
            "Anında üretim ve anlık teslimat.",
            "QR kod ile saniyeler içinde doğrulama.",
            "Sonsuza kadar saklanabilir, kaybolmaz belgeler."
        ],
        icon: <Sparkles className="text-brand-blue" size={48} />,
        bg: "bg-blue-50/50"
    },
    {
        id: "how-it-works",
        tag: "Nasıl Çalışır?",
        title: "3 Basit Adımda Profesyonellik",
        description: "Karmaşık teknik detaylarla uğraşmanıza gerek yok.",
        points: [
            "1. Tasarla: Certifix Editor ile şablonunuzu oluşturun.",
            "2. Gönder: Katılımcı listesini yükleyin ve gönderin.",
            "3. Doğrula: Her belgeye özel QR kod ile güvenliği mühürleyin."
        ],
        icon: <Zap className="text-amber-500" size={48} />,
        bg: "bg-amber-50/50"
    },
    {
        id: "impact",
        tag: "Etki",
        title: "Değer Katın, Görünün.",
        description: "Sertifikalarınız sadece bir belge değil, markanızın elçisidir.",
        points: [
            "LinkedIn'de tek tıkla profesyonel paylaşım.",
            "Kurumsal kimliğinize uygun şık tasarımlar.",
            "Katılımcı memnuniyetini ve marka bilinirliğini artırın.",
            "Analitik araçları ile açılma ve indirme sayılarını izleyin."
        ],
        icon: <Share2 className="text-indigo-500" size={48} />,
        bg: "bg-indigo-50/50"
    }
];

export default function NedirPageClient() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    // Removed auto-slide timer
    useEffect(() => {
        // Static page, no automatic transition
    }, []);

    return (
        <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden font-sans">
            {/* Simple Navigation */}
            <nav className="fixed top-0 w-full z-[60] bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="relative w-8 h-8">
                            <Image src="/certifix-logo.png" alt="Certifix Logo" fill className="object-contain" unoptimized />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-[#1E3A8A]">Certifix</span>
                    </Link>

                    <div className="hidden md:flex flex-1 items-center justify-end gap-10 text-sm font-semibold text-slate-500 mr-10">
                        <Link href="/nedir" className="text-brand-blue font-bold">Nedir?</Link>
                        <Link href="/#features" className="hover:text-brand-blue transition-colors">Özellikler</Link>
                        <Link href="/#security" className="hover:text-brand-blue transition-colors">Güvenlik</Link>
                        <Link href="/#pricing" className="hover:text-brand-blue transition-colors">Fiyatlandırma</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/login"
                            className="hidden sm:block bg-[#1E3A8A] text-white text-sm font-bold px-6 py-2 rounded-xl hover:bg-slate-900 transition-all shadow-lg shadow-brand-blue/10"
                        >
                            Giriş Yap
                        </Link>

                        <button
                            className="md:hidden p-2 text-slate-600 hover:text-[#1E3A8A] transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Nav */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-100 p-6 shadow-xl"
                        >
                            <div className="flex flex-col gap-4 font-bold text-slate-600">
                                <Link href="/nedir" className="text-brand-blue" onClick={() => setIsMobileMenuOpen(false)}>Nedir?</Link>
                                <Link href="/#features" onClick={() => setIsMobileMenuOpen(false)}>Özellikler</Link>
                                <Link href="/#security" onClick={() => setIsMobileMenuOpen(false)}>Güvenlik</Link>
                                <Link href="/#pricing" onClick={() => setIsMobileMenuOpen(false)}>Fiyatlandırma</Link>
                                <Link href="/login" className="text-[#1E3A8A]" onClick={() => setIsMobileMenuOpen(false)}>Giriş Yap</Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            <main className="pt-16 min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 relative">
                {/* Background Decorations */}
                <div className="absolute top-1/4 -left-20 w-80 h-80 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-6xl w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[500px]"
                        >
                            {/* Left Content */}
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <span className="inline-block px-4 py-1 bg-[#1E3A8A]/10 text-[#1E3A8A] rounded-full text-xs font-black uppercase tracking-widest">
                                        {slides[currentSlide].tag}
                                    </span>
                                    <h1 className="text-4xl md:text-6xl font-[900] text-slate-900 leading-tight tracking-tight">
                                        {slides[currentSlide].title.split(" ").map((word, i) => (
                                            <span key={i} className={i === slides[currentSlide].title.split(" ").length - 1 ? "text-[#1E3A8A]" : ""}>
                                                {word}{" "}
                                            </span>
                                        ))}
                                    </h1>
                                    <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
                                        {slides[currentSlide].description}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {slides[currentSlide].points.map((point, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-green-50 text-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                <CheckCircle2 size={16} strokeWidth={3} />
                                            </div>
                                            <span className="text-slate-700 font-bold">{point}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4 flex flex-wrap gap-4">
                                    <Link
                                        href="/#pricing"
                                        className="px-8 py-4 bg-[#1E3A8A] text-white rounded-2xl font-black flex items-center gap-2 hover:bg-slate-900 transition-all shadow-xl shadow-brand-blue/20"
                                    >
                                        Hemen Başla
                                        <ArrowRight size={20} />
                                    </Link>
                                    <button
                                        onClick={nextSlide}
                                        className="px-8 py-4 bg-white border border-slate-100 text-slate-600 rounded-2xl font-black flex items-center gap-2 hover:bg-slate-50 transition-all"
                                    >
                                        Sonraki Adım
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Right Content / Visual */}
                            <div className={`relative aspect-square lg:aspect-auto h-full min-h-[400px] rounded-[3rem] ${slides[currentSlide].bg} flex items-center justify-center overflow-hidden border border-slate-100 shadow-inner`}>
                                <motion.div
                                    initial={{ scale: 0.8, rotate: -10 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ duration: 1, type: "spring" }}
                                    className="bg-white p-12 rounded-[2.5rem] shadow-2xl relative"
                                >
                                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-brand-blue">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div className="text-center space-y-4">
                                        {slides[currentSlide].icon}
                                        <div className="space-y-2">
                                            <div className="h-2 w-32 bg-slate-100 rounded-full mx-auto" />
                                            <div className="h-2 w-24 bg-slate-50 rounded-full mx-auto" />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Background Accents */}
                                <div className="absolute top-10 left-10 w-4 h-4 rounded-full bg-brand-blue opacity-20 animate-pulse" />
                                <div className="absolute bottom-10 right-10 w-6 h-6 rounded-full bg-brand-blue opacity-10" />
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Pagination Indicators */}
                    <div className="mt-12 flex items-center justify-center gap-3">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentSlide(i)}
                                className={`h-2 transition-all duration-300 rounded-full ${i === currentSlide ? "w-10 bg-[#1E3A8A]" : "w-2 bg-slate-200"}`}
                                aria-label={`Slide ${i + 1}`}
                            />
                        ))}
                    </div>

                    {/* Navigation Arrows */}
                    <div className="hidden lg:block">
                        <button
                            onClick={prevSlide}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-[#1E3A8A] hover:border-[#1E3A8A] hover:bg-blue-50 transition-all shadow-lg z-20"
                            aria-label="Önceki slide"
                        >
                            <ChevronLeft size={28} />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-[#1E3A8A] hover:border-[#1E3A8A] hover:bg-blue-50 transition-all shadow-lg z-20"
                            aria-label="Sonraki slide"
                        >
                            <ChevronRight size={28} />
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer-like CTA */}
            <div className="bg-slate-900 text-white p-8 sm:p-12 text-center">
                <div className="max-w-4xl mx-auto space-y-6">
                    <h2 className="text-3xl font-[900]">Geleceğin Sertifikasyonunu Bugün Başlatın.</h2>
                    <p className="text-slate-400 font-medium">Binlerce kurumsal firmanın güvendiği altyapımıza dahil olun.</p>
                    <div className="flex justify-center gap-4">
                        <Link href="/login" className="px-8 py-3 bg-[#1E3A8A] rounded-xl font-bold hover:bg-blue-700 transition-colors">Ücretsiz Hesap Oluştur</Link>
                        <Link href="/#pricing" className="px-8 py-3 bg-white/10 rounded-xl font-bold hover:bg-white/20 transition-colors border border-white/10">Fiyatları Gör</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
