"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    ShieldCheck,
    ArrowRight,
    Layout as LayoutIcon,
    FileText,
    CheckCircle2,
    Zap,
    Lock,
    Globe,
    Loader2,
    Mail,
    Share2,
    Maximize,
    X,
    User,
    Menu,
    FileCheck,
    Server,
    Shield,
    Phone,
    MessageSquare,
    Calculator
} from "lucide-react";
import HeroScanner from "./HeroScanner";
import { cn } from "@/lib/utils";

export default function LandingPageClient() {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
    const [demoForm, setDemoForm] = useState({
        name: "",
        email: "",
        phone: "",
        question: ""
    });
    const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const generateCaptcha = () => {
        const n1 = Math.floor(Math.random() * 10) + 1;
        const n2 = Math.floor(Math.random() * 10) + 1;
        setCaptcha({ num1: n1, num2: n2, answer: "" });
    };

    useEffect(() => {
        fetch("http://localhost:5001/api/plans")
            .then(res => res.json())
            .then(data => {
                setPlans(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch plans:", err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (isDemoModalOpen) {
            generateCaptcha();
            setSubmitted(false);
        }
    }, [isDemoModalOpen]);

    const handleDemoSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (parseInt(captcha.answer) !== captcha.num1 + captcha.num2) {
            alert("Güvenlik doğrulaması hatalı! Lütfen tekrar deneyin.");
            generateCaptcha();
            return;
        }

        setIsSubmitting(true);
        // Mock API call
        setTimeout(() => {
            console.log("Demo talep formu:", demoForm);
            setIsSubmitting(false);
            setSubmitted(true);
            setTimeout(() => setIsDemoModalOpen(false), 2000);
        }, 1500);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { currentTarget, clientX, clientY } = e;
        const { left, top } = currentTarget.getBoundingClientRect();
        currentTarget.style.setProperty("--mouse-x", `${clientX - left}px`);
        currentTarget.style.setProperty("--mouse-y", `${clientY - top}px`);
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-brand-blue selection:text-white">
            {/* Navigation (unchanged) */}
            <nav className="fixed top-0 w-full z-[60] bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="relative w-8 h-8">
                            <Image src="/certifix-logo.png" alt="Certifix Logo" fill className="object-contain" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-[#1E3A8A]">Certifix</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex flex-1 items-center justify-end gap-10 text-sm font-semibold text-slate-500 mr-10">
                        <Link href="/nedir" className="text-brand-blue font-bold">Nedir?</Link>
                        <Link href="#features" className="hover:text-brand-blue transition-colors">Özellikler</Link>
                        <Link href="#security" className="hover:text-brand-blue transition-colors">Güvenlik</Link>
                        <Link href="#pricing" className="hover:text-brand-blue transition-colors">Fiyatlandırma</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/login"
                            className="hidden sm:block bg-[#1E3A8A] text-white text-sm font-bold px-6 py-2 rounded-xl hover:bg-slate-900 transition-all shadow-lg shadow-brand-blue/10"
                        >
                            Giriş Yap
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 text-slate-600 hover:text-[#1E3A8A] transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Drawer */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-100 animate-in slide-in-from-top duration-300 shadow-xl">
                        <div className="flex flex-col p-6 space-y-4 font-bold text-slate-600">
                            <Link
                                href="/nedir"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-brand-blue py-2"
                            >
                                Nedir?
                            </Link>
                            <Link
                                href="#features"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="hover:text-[#1E3A8A] py-2"
                            >
                                Özellikler
                            </Link>
                            <Link
                                href="#security"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="hover:text-[#1E3A8A] py-2"
                            >
                                Güvenlik
                            </Link>
                            <Link
                                href="#pricing"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="hover:text-[#1E3A8A] py-2"
                            >
                                Fiyatlandırma
                            </Link>
                            <hr className="border-slate-50" />
                            <Link
                                href="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-between text-[#1E3A8A] py-2"
                            >
                                Giriş Yap
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            <main>
                {/* Hero Section (unchanged) */}
                <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-20 px-6 overflow-hidden bg-white">
                    <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-brand-blue/[0.02] -z-10" />
                    <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-brand-blue/[0.03] rounded-full blur-[120px] -z-10" />

                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8 z-10 text-center lg:text-left">
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-brand-blue/5 border border-brand-blue/10">
                                <span className="flex h-2 w-2 rounded-full bg-brand-blue animate-pulse" />
                                <span className="text-[10px] font-bold text-brand-blue uppercase tracking-[0.2em]">Doğrulanabilir Dijital Sertifikalar</span>
                            </div>

                            <h1 className="text-4xl md:text-[3.5rem] font-[900] tracking-tight text-[#0F172A] leading-[1.1] md:leading-[1.2]">
                                Sertifikalarınız Artık <br className="hidden md:block" />
                                <span className="text-[#1E3A8A]">Sadece Bir Dosya Değil.</span>
                            </h1>

                            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 pr-8">
                                Certifix.ai ile eğitim ve etkinlikleriniz için doğrulanabilir, paylaşıma hazır ve güvenilir dijital sertifikalar oluşturun.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4 pt-8 justify-center lg:justify-start">
                                <button
                                    onClick={() => setIsDemoModalOpen(true)}
                                    className="w-full sm:w-auto px-8 py-4 bg-[#1E3A8A] text-white rounded-2xl font-black text-lg hover:bg-slate-900 transition-all shadow-[0_15px_30px_rgba(30,58,138,0.2)] hover:translate-y-[-2px] active:translate-y-0 flex items-center justify-center gap-3"
                                >
                                    Demo Talep Et
                                    <Zap size={20} fill="currentColor" />
                                </button>
                                <Link
                                    href="/login"
                                    className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-[#0F172A] rounded-2xl font-black text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
                                >
                                    Giriş Yap
                                    <ArrowRight size={20} strokeWidth={3} />
                                </Link>
                                <Link
                                    href="/verify"
                                    className="mt-4 sm:mt-0 sm:ml-4 text-slate-400 hover:text-brand-blue flex items-center gap-2 text-sm font-bold transition-colors group"
                                >
                                    <ShieldCheck size={18} className="text-[#10B981]" strokeWidth={2.5} />
                                    <span>Sertifika Sorgula</span>
                                    <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </Link>
                            </div>
                        </div>

                        <div className="lg:w-[110%] w-full relative lg:-mr-32 flex justify-center lg:justify-end perspective-[2000px]">
                            <div className="absolute inset-0 bg-brand-blue/5 rounded-full blur-[100px] -z-10 opacity-50" />

                            {/* Dashboard / HUD Visual Container */}
                            <div className="relative w-full max-w-[500px] aspect-square">

                                {/* 1. Central Production Hub */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] bg-white rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 p-6 z-20 animate-[float_6s_ease-in-out_infinite]">
                                    <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                                                <Zap size={16} fill="currentColor" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Production</div>
                                                <div className="text-sm font-black text-slate-900">Processing...</div>
                                            </div>
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-brand-blue w-[70%] rounded-full animate-[loading_2s_ease-in-out_infinite]"></div>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-bold text-slate-400">
                                            <span className="font-mono">ID: #Cert-8X29</span>
                                            <span>70%</span>
                                        </div>
                                        <div className="pt-2 flex gap-2 overflow-hidden opacity-50 grayscale transition-all hover:grayscale-0">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className="h-8 w-6 bg-slate-50 border border-slate-100 rounded shadow-sm"></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Speed Widget (Top Right) */}
                                <div className="absolute top-10 -right-4 w-40 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white z-30 animate-[float_5s_ease-in-out_infinite_1s]">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-amber-50 rounded-lg text-amber-500">
                                            <Zap size={18} fill="currentColor" />
                                        </div>
                                        <div className="text-2xl font-black text-slate-900">0.12s</div>
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Latency</div>
                                </div>

                                {/* 3. Security Widget (Bottom Left) */}
                                <div className="absolute bottom-20 -left-8 w-48 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white z-30 animate-[float_7s_ease-in-out_infinite_0.5s]">
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="p-2 bg-green-50 rounded-lg text-green-500">
                                            <ShieldCheck size={18} strokeWidth={2.5} />
                                        </div>
                                        <div className="text-sm font-black text-slate-900">AES-256</div>
                                    </div>
                                    <div className="text-[10px] font-bold text-green-600 uppercase tracking-widest pl-1">Encrypted</div>
                                </div>

                                {/* 4. Scale / Code Widget (Bottom Right) */}
                                <div className="absolute bottom-4 right-0 w-44 bg-[#0F172A] p-4 rounded-2xl shadow-2xl z-10 animate-[float_8s_ease-in-out_infinite_1.5s]">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                    </div>
                                    <div className="space-y-1.5 font-mono text-[8px] text-slate-400 leading-tight">
                                        <div className="flex justify-between"><span className="text-blue-400">GENERATE</span> <span>Creating...</span></div>
                                        <div className="pl-2 border-l border-slate-700">payload: <span className="text-green-400">True</span></div>
                                        <div className="pl-2 border-l border-slate-700">sign: <span className="text-purple-400">ECDSA</span></div>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between items-center text-white">
                                        <span className="text-[10px] font-bold">100k+</span>
                                        <Globe size={12} className="text-brand-blue" />
                                    </div>
                                </div>

                                {/* Background Geometric Shapes */}
                                <div className="absolute inset-0 border border-slate-100 rounded-full scale-90 border-dashed animate-[spin_60s_linear_infinite] -z-10 group-hover:border-brand-blue/20 transition-colors opacity-30"></div>
                                <div className="absolute inset-0 border border-slate-200 rounded-full scale-75 opacity-20 -z-10"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Security Section (unchanged style, just pass through) */}
                <section id="security" className="py-24 bg-slate-50 relative overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-blue/5 to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gradient-to-tr from-brand-blue/5 to-transparent pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-6 relative">
                        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue/10 text-brand-blue rounded-full text-xs font-bold uppercase tracking-widest">
                                <Shield size={14} fill="currentColor" className="opacity-80" />
                                Maksimum Güvenlik
                            </div>
                            <h2 className="text-4xl md:text-5xl font-[900] text-slate-900 tracking-tight">
                                Verileriniz Sertifikalarınızdan <br className="hidden md:block" />
                                <span className="text-brand-blue">Daha Değerli.</span>
                            </h2>
                            <p className="text-lg text-slate-500 font-medium">
                                En yüksek güvenlik standartlarını kullanarak kurumsal verilerinizi ve katılımcı gizliliğini her aşamada koruyoruz.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* Security Item 1 */}
                            <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                                <div className="w-14 h-14 bg-brand-blue/5 text-brand-blue rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                                    <Lock size={28} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-3">Uçtan Uca Şifreleme</h3>
                                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                    Tüm veri iletimi SSL/TLS sertifikaları ile şifrelenir. Veritabanımızdaki hassas bilgiler sektör standardı AES-256 ile korunur.
                                </p>
                            </div>

                            {/* Security Item 2 */}
                            <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                                <div className="w-14 h-14 bg-brand-blue/5 text-brand-blue rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                                    <FileCheck size={28} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-3">KVKK & GDPR Uyumu</h3>
                                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                    Sistemimiz KVKK ve GDPR yönetmeliklerine %100 uyumlu şekilde tasarlanmıştır. Veri işleme süreçlerimiz tamamen şeffaf ve yasaldır.
                                </p>
                            </div>

                            {/* Security Item 3 */}
                            <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                                <div className="w-14 h-14 bg-brand-blue/5 text-brand-blue rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                                    <Server size={28} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-3">Kesintisiz Altyapı</h3>
                                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                    Verileriniz yüksek erişilebilirlik sunan, izole edilmiş bulut sunucu mimarimizde barındırılır. Yedekleme sistemlerimizle veri kaybını önlüyoruz.
                                </p>
                            </div>

                            {/* Security Item 4 */}
                            <div className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                                <div className="w-14 h-14 bg-brand-blue/5 text-brand-blue rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                                    <Shield size={28} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-3">Akıllı Tehdit Koruması</h3>
                                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                    Sistemimiz sürekli olarak şüpheli etkinliklere karşı izlenir. Güvenlik duvarlarımız ve saldırı tespit sistemlerimizle verilerinizi koruyoruz.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section - SPOTLIGHT APPLIED */}
                <section id="features" className="py-24 px-6 bg-slate-50/50">
                    <div className="max-w-7xl mx-auto space-y-16">
                        <div className="text-center space-y-4">
                            <h2 className="text-[2.75rem] font-[900] text-[#0F172A] tracking-tight leading-tight">
                                Dijital Sertifikasyonun <br className="md:hidden" />
                                <span className="text-[#1E3A8A]">Tüm Gücü</span> Elinizde
                            </h2>
                            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
                                Certifix.ai, modern sertifikasyon süreçleri için ihtiyacınız olan tüm araçları tek bir platformda sunar.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Feature 1: Editor */}
                            <div
                                onMouseMove={handleMouseMove}
                                className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-soft hover:shadow-xl transition-all group relative overflow-hidden"
                            >
                                <div
                                    className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0"
                                    style={{
                                        background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(30, 58, 138, 0.08), transparent 40%)`
                                    }}
                                />
                                <div className="relative z-10 w-16 h-16 bg-blue-50 text-[#1E3A8A] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                    <LayoutIcon size={32} />
                                </div>
                                <h3 className="relative z-10 text-xl font-black text-slate-900 mb-4">Certifix Editor</h3>
                                <p className="relative z-10 text-slate-500 font-medium leading-relaxed">
                                    Online sertifika tasarım aracı. Görsel sürükle-bırak tasarım araçları ile saniyeler içinde profesyonel belgeler hazırlayın.
                                </p>
                            </div>

                            {/* Feature 2: Verification */}
                            <div
                                onMouseMove={handleMouseMove}
                                className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-soft hover:shadow-xl transition-all group relative overflow-hidden"
                            >
                                <div
                                    className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0"
                                    style={{
                                        background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(16, 185, 129, 0.08), transparent 40%)`
                                    }}
                                />
                                <div className="relative z-10 w-16 h-16 bg-green-50 text-[#10B981] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                    <ShieldCheck size={32} />
                                </div>
                                <h3 className="relative z-10 text-xl font-black text-slate-900 mb-4">Akıllı Doğrulama</h3>
                                <p className="relative z-10 text-slate-500 font-medium leading-relaxed">
                                    QR kod ile anında güvenilirlik teyidi. Sertifikalarınızın sahteciliğe karşı %100 korunmasını ve kolayca doğrulanmasını sağlayın.
                                </p>
                            </div>

                            {/* Feature 3: Vector Output */}
                            <div
                                onMouseMove={handleMouseMove}
                                className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-soft hover:shadow-xl transition-all group relative overflow-hidden"
                            >
                                <div
                                    className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0"
                                    style={{
                                        background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(147, 51, 234, 0.08), transparent 40%)`
                                    }}
                                />
                                <div className="relative z-10 w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                    <Maximize size={32} />
                                </div>
                                <h3 className="relative z-10 text-xl font-black text-slate-900 mb-4">Vektörel Çıktı</h3>
                                <p className="relative z-10 text-slate-500 font-medium leading-relaxed">
                                    Kayıpsız PDF ve yüksek çözünürlük desteği. Matbaa kalitesinde ve her boyutta kristal netliğinde çıktılar elde edin.
                                </p>
                            </div>

                            {/* Feature 4: LinkedIn */}
                            <div
                                onMouseMove={handleMouseMove}
                                className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-soft hover:shadow-xl transition-all group relative overflow-hidden"
                            >
                                <div
                                    className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0"
                                    style={{
                                        background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(2, 132, 199, 0.08), transparent 40%)`
                                    }}
                                />
                                <div className="relative z-10 w-16 h-16 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                    <Share2 size={32} />
                                </div>
                                <h3 className="relative z-10 text-xl font-black text-slate-900 mb-4">LinkedIn Paylaşımı</h3>
                                <p className="relative z-10 text-slate-500 font-medium leading-relaxed">
                                    Tek tıkla profil sertifikasyonu. Katılımcılarınızın başarılarını tüm profesyonel ağlarıyla saniyeler içinde paylaşmasını sağlayın.
                                </p>
                            </div>

                            {/* Feature 5: Email Automation */}
                            <div
                                onMouseMove={handleMouseMove}
                                className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-soft hover:shadow-xl transition-all group relative overflow-hidden"
                            >
                                <div
                                    className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0"
                                    style={{
                                        background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(245, 158, 11, 0.08), transparent 40%)`
                                    }}
                                />
                                <div className="relative z-10 w-16 h-16 bg-brand-amber/5 text-brand-amber rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                    <Mail size={32} />
                                </div>
                                <h3 className="relative z-10 text-xl font-black text-slate-900 mb-4">Akıllı E-Posta</h3>
                                <p className="relative z-10 text-slate-500 font-medium leading-relaxed">
                                    Otomatik ve takip edilebilir gönderim. Sertifikalarınızı katılımcılara ulaştırın ve açılma/indirme istatistiklerini izleyin.
                                </p>
                            </div>

                            {/* Feature 6: Security/Cloud */}
                            <div
                                onMouseMove={handleMouseMove}
                                className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-soft hover:shadow-xl transition-all group relative overflow-hidden"
                            >
                                <div
                                    className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0"
                                    style={{
                                        background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(100, 116, 139, 0.08), transparent 40%)`
                                    }}
                                />
                                <div className="relative z-10 w-16 h-16 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                    <Lock size={32} />
                                </div>
                                <h3 className="relative z-10 text-xl font-black text-slate-900 mb-4">Maksimum Güvenlik</h3>
                                <p className="relative z-10 text-slate-500 font-medium leading-relaxed">
                                    Verileriniz en yüksek güvenlik standartlarında, şifrelenmiş olarak saklanır. GDPR ve KVKK uyumlu altyapı.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section - SPOTLIGHT APPLIED */}
                <section id="pricing" className="py-24 px-6 bg-surface-gray">
                    <div className="max-w-7xl mx-auto space-y-16">
                        <div className="text-center space-y-4">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Kullanımınıza En Uygun Paketi Seçin</h2>
                            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
                                Basit bir etkinlikten, kurumsal ölçekli sertifikasyon süreçlerine kadar her seviye için bir çözümümüz var.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {loading ? (
                                <div className="col-span-full flex justify-center py-20">
                                    <Loader2 className="animate-spin text-brand-blue" size={48} />
                                </div>
                            ) : (
                                plans.map((plan, index) => (
                                    <div
                                        key={plan.id}
                                        onMouseMove={handleMouseMove}
                                        className={cn(
                                            "bg-white p-8 rounded-[2.5rem] border shadow-soft flex flex-col transition-all group relative overflow-hidden",
                                            plan.id === 'profesyonel' ? "border-2 border-brand-blue shadow-xl shadow-brand-blue/5 scale-105 z-10" : "border-slate-100 hover:border-brand-blue/20"
                                        )}
                                    >
                                        <div
                                            className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-0"
                                            style={{
                                                background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(30, 58, 138, 0.06), transparent 40%)`
                                            }}
                                        />
                                        {plan.id === 'profesyonel' && (
                                            <div className="absolute top-0 right-0 bg-brand-blue text-white text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-widest">
                                                POPÜLER
                                            </div>
                                        )}
                                        <div className="mb-8">
                                            <h3 className="text-xl font-bold text-slate-800">{plan.name}</h3>
                                            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
                                                {plan.type === 'one-time' ? 'Tek Seferlik Ödeme' : 'Aylık Abonelik'}
                                            </p>
                                        </div>
                                        <div className="mb-8">
                                            <span className="text-4xl font-black text-slate-900">
                                                {plan.price === 0 || plan.price === '0.00' ? "Teklif Alın" : `${Math.floor(Number(plan.price))}₺`}
                                            </span>
                                            {plan.type === 'subscription' && Number(plan.price) > 0 && (
                                                <span className="text-slate-400 text-sm font-bold ml-1">/ay</span>
                                            )}
                                        </div>
                                        <ul className="space-y-4 mb-10 flex-1">
                                            {plan.limits.trainings > 0 && (
                                                <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                                    <CheckCircle2 size={16} className="text-brand-blue" />
                                                    {plan.limits.trainings > 1000 ? 'Sınırsız' : `${plan.limits.trainings} Eğitim`}
                                                </li>
                                            )}
                                            {plan.limits.certificates_per_training > 0 && (
                                                <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                                    <CheckCircle2 size={16} className="text-brand-blue" />
                                                    {plan.limits.certificates_per_training > 1000 ? 'Sınırsız Sertifika' : `${plan.limits.certificates_per_training} Sertifika / Eğitim`}
                                                </li>
                                            )}
                                            {plan.features.linkedin_enabled && (
                                                <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                                    <CheckCircle2 size={16} className="text-brand-blue" /> LinkedIn Entegrasyonu
                                                </li>
                                            )}
                                            {index > 0 && (
                                                <li className="flex items-center gap-3 text-[11px] font-bold text-slate-400">
                                                    Bir alt paketin tüm özelliklerini içerir
                                                </li>
                                            )}
                                        </ul>
                                        <Link
                                            href="mailto:info@certifix.ai"
                                            className={cn(
                                                "w-full py-4 rounded-2xl font-bold text-sm text-center transition-all",
                                                plan.id === 'profesyonel'
                                                    ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/20 hover:bg-slate-900"
                                                    : "bg-slate-900 text-white hover:bg-brand-blue"
                                            )}
                                        >
                                            Bize Ulaşın
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-brand-blue text-white py-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-24 opacity-5">
                    <Globe size={400} strokeWidth={0.5} />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pt-12 border-t border-white/10">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="relative w-6 h-6 invert brightness-0">
                                    <Image src="/certifix-logo.png" alt="Certifix" fill />
                                </div>
                                <span className="font-bold text-xl uppercase tracking-tighter">Certifix</span>
                            </div>
                            <p className="text-white/50 text-sm leading-relaxed">Modern ve güvenli sertifikasyon altyapısı ile belgeleriniz artık daha değerli.</p>
                        </div>

                        <div>
                            <h4 className="font-bold mb-6">Hızlı Linkler</h4>
                            <ul className="space-y-4 text-white/50 text-sm font-medium">
                                <li><Link href="#features" className="hover:text-white transition-colors">Özellikler</Link></li>
                                <li><Link href="#security" className="hover:text-white transition-colors">Güvenlik</Link></li>
                                <li><Link href="/verify" className="hover:text-white transition-colors">Doğrulama</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-6">Yasal</h4>
                            <ul className="space-y-4 text-white/50 text-sm font-medium">
                                <li><Link href="/privacy" className="hover:text-white transition-colors">Gizlilik Politikası</Link></li>
                                <li><Link href="/terms" className="hover:text-white transition-colors">Kullanım Şartları</Link></li>
                                <li><Link href="/kvkk" className="hover:text-white transition-colors">KVKK Aydınlatma</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-6">İletişim</h4>
                            <p className="text-white/50 text-sm font-medium mb-4">Sorularınız mı var?</p>
                            <Link href="mailto:support@certifix.ai" className="text-lg font-bold hover:text-brand-amber transition-colors">
                                support@certifix.ai
                            </Link>
                        </div>
                    </div>

                    <div className="pt-12 mt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-white/30 text-[10px] font-bold uppercase tracking-widest">
                        <span>© 2026 Certifix Inc. All rights reserved.</span>
                        <div className="flex gap-8">
                            <Link href="#" className="hover:text-white">Twitter</Link>
                            <Link href="#" className="hover:text-white">LinkedIn</Link>
                            <Link href="#" className="hover:text-white">Instagram</Link>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Demo Request Modal */}
            {isDemoModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => setIsDemoModalOpen(false)}
                    />

                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
                        {submitted ? (
                            <div className="p-12 text-center space-y-6">
                                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900">Talebiniz Alındı!</h3>
                                <p className="text-slate-500 font-medium">Uzman ekibimiz en kısa sürede sizinle iletişime geçecektir.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleDemoSubmit} className="p-8 sm:p-10 space-y-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black text-slate-900">Demo Talep Formu</h3>
                                        <p className="text-sm font-medium text-slate-500">Certifix'i yakından tanıyın.</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsDemoModalOpen(false)}
                                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input
                                            required
                                            type="text"
                                            placeholder="Ad Soyad"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm font-medium"
                                            value={demoForm.name}
                                            onChange={e => setDemoForm({ ...demoForm, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input
                                            required
                                            type="email"
                                            placeholder="E-Posta Adresi"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm font-medium"
                                            value={demoForm.email}
                                            onChange={e => setDemoForm({ ...demoForm, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input
                                            required
                                            type="tel"
                                            placeholder="Telefon Numarası"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm font-medium"
                                            value={demoForm.phone}
                                            onChange={e => setDemoForm({ ...demoForm, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-4 top-4 text-slate-400" size={20} />
                                        <textarea
                                            required
                                            placeholder="Kısaca sorunuz veya mesajınız"
                                            rows={3}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm font-medium resize-none"
                                            value={demoForm.question}
                                            onChange={e => setDemoForm({ ...demoForm, question: e.target.value })}
                                        />
                                    </div>

                                    {/* Custom Captcha */}
                                    <div className="p-4 bg-brand-blue/5 rounded-2xl flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <Calculator className="text-brand-blue" size={20} />
                                            <span className="text-sm font-bold text-slate-700">
                                                {captcha.num1} + {captcha.num2} = ?
                                            </span>
                                        </div>
                                        <input
                                            required
                                            type="number"
                                            placeholder="Sonucu girin"
                                            className="w-24 px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-blue/20 outline-none text-sm font-bold text-center"
                                            value={captcha.answer}
                                            onChange={e => setCaptcha({ ...captcha, answer: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="w-full py-4 bg-[#1E3A8A] text-white rounded-2xl font-black text-lg hover:bg-slate-900 transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="animate-spin" size={24} />
                                    ) : (
                                        "Formu Gönder"
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
