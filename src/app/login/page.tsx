"use client";

import React, { useState } from 'react';
import { ShieldCheck, Loader2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);

    // Initialize Remember Me state
    React.useEffect(() => {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            setEmail(rememberedEmail);
            setRememberMe(true);
        }
    }, []);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                // Handle Remember Me
                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }

                // Store user info (simplified)
                localStorage.setItem("user", JSON.stringify(data));

                if (data.role === 'SUPER_ADMIN') {
                    router.push("/dashboard/admin");
                } else {
                    router.push("/dashboard/user");
                }
            } else {
                setError(data.error || "Giriş başarısız.");
            }
        } catch (err) {
            setError("Sunucuya bağlanılamadı.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans">
            {/* Left Side: Visual & Content */}
            <div className="hidden lg:flex w-1/2 bg-brand-blue relative overflow-hidden flex-col justify-between p-16">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-brand-blue to-[#1e1e1e] pointer-events-none" />
                <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-white/[0.03] rounded-full blur-[120px] pointer-events-none" />

                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3 w-fit">
                        <div className="relative w-10 h-10 invert brightness-0">
                            <Image src="/certifix-logo.png" alt="Certifix Logo" fill className="object-contain" unoptimized />
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-white">Certifix</span>
                    </Link>
                </div>

                <div className="relative z-10 space-y-8">
                    <div className="relative w-full aspect-square max-w-[500px] mx-auto transition-transform duration-1000 hover:scale-105">
                        <Image
                            src="/auth-visual.png"
                            alt="Security Visual"
                            fill
                            className="object-contain drop-shadow-[0_50px_50px_rgba(0,0,0,0.3)]"
                            unoptimized
                        />
                    </div>
                    <div className="space-y-4 max-w-md">
                        <h2 className="text-4xl font-extrabold text-white leading-tight">Güvenliğiniz, Geleceğinizdir.</h2>
                        <p className="text-white/60 text-lg font-medium leading-relaxed">
                            Kriptografik altyapımız ile her sertifika global standartlarda korunur ve anında doğrulanır.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 pt-8 border-t border-white/10 flex items-center justify-between text-white/40 text-[10px] font-bold uppercase tracking-widest">
                    <span>© 2026 Certifix</span>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Destek</a>
                        <a href="#" className="hover:text-white transition-colors">Gizlilik</a>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-16 lg:p-24 bg-white relative">
                {/* Mobile Tablet Logo */}
                <div className="lg:hidden absolute top-12 left-12">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="relative w-8 h-8">
                            <Image src="/certifix-logo.png" alt="Certifix Logo" fill className="object-contain" unoptimized />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-brand-blue">Certifix</span>
                    </Link>
                </div>

                <div className="w-full max-w-[440px] space-y-12">
                    <div className="space-y-4 text-center lg:text-left">
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Tekrar Hoş Geldiniz</h1>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] ml-1">Kullanıcı Panelinize Erişin</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-3xl text-sm font-bold animate-in fade-in slide-in-from-top-2 duration-300">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-Posta Adresi</label>
                                <input
                                    type="email"
                                    name="email"
                                    autoComplete="username"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-6 py-5 bg-surface-gray border border-slate-100 rounded-3xl focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 lg:text-lg"
                                    placeholder="seyit@certifix.ai"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Şifre</label>
                                    <button type="button" className="text-[10px] font-black text-brand-blue uppercase tracking-widest hover:underline">Şifremi Unuttum</button>
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-6 py-5 bg-surface-gray border border-slate-100 rounded-3xl focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 lg:text-lg"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="flex items-center gap-3 ml-1">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-lg border-2 border-slate-200 bg-white checked:border-brand-blue checked:bg-brand-blue transition-all"
                                    />
                                    <svg
                                        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                                        width="12"
                                        height="12"
                                        viewBox="0 0 12 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M10 3L4.5 8.5L2 6"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                                <label htmlFor="remember" className="text-sm font-bold text-slate-600 cursor-pointer select-none">
                                    Beni Hatırla
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-blue text-white font-black py-6 rounded-3xl shadow-[0_20px_50px_rgba(30,58,138,0.3)] hover:bg-slate-900 transition-all flex items-center justify-center gap-3 disabled:opacity-80 text-xl tracking-tight leading-none overflow-hidden group relative"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {loading ? <Loader2 size={24} className="animate-spin" /> : 'Giriş Yap'}
                                {!loading && <ArrowRight size={24} className="transition-transform group-hover:translate-x-1" />}
                            </span>
                        </button>

                        <div className="text-center pt-4">
                            <p className="text-slate-500 font-bold text-sm">
                                Hesabınız yok mu?{' '}
                                <Link
                                    href="/register"
                                    className="text-brand-blue font-black hover:underline"
                                >
                                    Hemen Kayıt Ol
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
