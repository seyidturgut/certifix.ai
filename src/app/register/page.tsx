"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        company_name: '',
        phone: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const [registrationEnabled, setRegistrationEnabled] = useState<boolean | null>(null);

    React.useEffect(() => {
        // Check system settings
        fetch('/api/admin/settings')
            .then(res => res.json())
            .then(data => {
                if (data.registration_enabled === false) {
                    setRegistrationEnabled(false);
                } else {
                    setRegistrationEnabled(true);
                }
            })
            .catch(err => console.error(err));
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    full_name: formData.full_name,
                    email: formData.email,
                    company_name: formData.company_name,
                    phone: formData.phone,
                    password: formData.password
                })
            });

            const data = await res.json();

            if (res.ok) {
                // Redirect to login after successful registration
                router.push("/login");
            } else {
                setError(data.error || "Kayıt başarısız.");
            }
        } catch (err) {
            setError("Sunucuya bağlanılamadı.");
        } finally {
            setLoading(false);
        }
    };

    if (registrationEnabled === false) {
        return (
            <div className="min-h-screen flex bg-white font-sans">
                {/* Left Side (Same as before) */}
                <div className="hidden lg:flex w-1/2 bg-brand-blue relative overflow-hidden flex-col justify-between p-16">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-brand-blue to-brand-green/20 pointer-events-none" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-brand-green/[0.05] rounded-full blur-[120px] pointer-events-none" />

                    <div className="relative z-10">
                        <Link href="/" className="flex items-center gap-3 w-fit">
                            <div className="relative w-10 h-10 invert brightness-0">
                                <Image src="/certifix-logo.png" alt="Certifix Logo" fill className="object-contain" unoptimized />
                            </div>
                            <span className="font-bold text-2xl tracking-tight text-white">Certifix</span>
                        </Link>
                    </div>

                    <div className="relative z-10 space-y-8">
                        <div className="relative w-full aspect-square max-w-[500px] mx-auto opacity-50 grayscale transition-all duration-1000">
                            <Image
                                src="/auth-visual.png"
                                alt="Security Visual"
                                fill
                                className="object-contain drop-shadow-[0_50px_50px_rgba(0,0,0,0.3)]"
                                unoptimized
                            />
                        </div>
                        <div className="space-y-4 max-w-md">
                            <h2 className="text-4xl font-extrabold text-white leading-tight">Şu an davetiye sistemiyle çalışıyoruz.</h2>
                            <p className="text-white/60 text-lg font-medium leading-relaxed">
                                Yeni üye alımları geçici bir süre için durdurulmuştur.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 pt-8 border-t border-white/10 flex items-center justify-between text-white/40 text-[10px] font-bold uppercase tracking-widest">
                        <span>© 2026 Certifix</span>
                    </div>
                </div>

                {/* Right Side: Closed Message */}
                <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-16 lg:p-24 bg-white relative">
                    <div className="w-full max-w-[440px] space-y-8 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShieldCheck size={40} className="text-slate-300" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Kayıtlar Kapalı</h1>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed">
                            Sistem yoğunluğunu yönetmek adına yeni üyelikleri şu an kabul etmiyoruz. Lütfen daha sonra tekrar deneyiniz veya mevcut hesabınızla giriş yapınız.
                        </p>

                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-brand-blue font-black text-lg hover:underline mt-8"
                        >
                            <ArrowLeft size={20} />
                            Giriş Ekranına Dön
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-white font-sans">
            {/* Left Side: Visual & Content */}
            <div className="hidden lg:flex w-1/2 bg-brand-blue relative overflow-hidden flex-col justify-between p-16">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-brand-blue to-brand-green/20 pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-brand-green/[0.05] rounded-full blur-[120px] pointer-events-none" />

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
                        <h2 className="text-4xl font-extrabold text-white leading-tight">Kurumsal Altyapı. Sınırsız Güven.</h2>
                        <p className="text-white/60 text-lg font-medium leading-relaxed">
                            Dakikalar içinde kaydolun, saniyeler içinde binlerce sertifikayı topluca üretin ve yönetin.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 pt-8 border-t border-white/10 flex items-center justify-between text-white/40 text-[10px] font-bold uppercase tracking-widest">
                    <span>© 2026 Certifix</span>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">KVKK</a>
                        <a href="#" className="hover:text-white transition-colors">Şartlar</a>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-16 lg:p-24 bg-white relative overflow-y-auto">
                {/* Mobile Tablet Logo */}
                <div className="lg:hidden absolute top-12 left-12">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="relative w-8 h-8">
                            <Image src="/certifix-logo.png" alt="Certifix Logo" fill className="object-contain" unoptimized />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-brand-blue">Certifix</span>
                    </Link>
                </div>

                <div className="w-full max-w-[440px] space-y-10 py-12 lg:py-0">
                    <div className="space-y-4 text-center lg:text-left">
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Kayıt Olun</h1>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] ml-1">Dijital Sertifikasyon Dünyasına Katılın</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-3xl text-sm font-bold animate-in fade-in slide-in-from-top-2 duration-300">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-5">
                        {[
                            { label: 'Ad Soyad', name: 'full_name', type: 'text', placeholder: 'Seyit Turgut' },
                            { label: 'E-Posta', name: 'email', type: 'email', placeholder: 'seyit@certifix.ai' },
                            { label: 'Şirket Adı', name: 'company_name', type: 'text', placeholder: 'Certifix A.Ş.' },
                            { label: 'Telefon', name: 'phone', type: 'tel', placeholder: '+90 5xx xxx xx xx' },
                            { label: 'Şifre', name: 'password', type: 'password', placeholder: '••••••••' }
                        ].map((field) => (
                            <div key={field.name} className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{field.label}</label>
                                <input
                                    type={field.type}
                                    name={field.name}
                                    required
                                    value={(formData as any)[field.name]}
                                    onChange={handleChange}
                                    className="w-full px-5 py-4 bg-surface-gray border border-slate-100 rounded-[22px] focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 lg:text-lg"
                                    placeholder={field.placeholder}
                                />
                            </div>
                        ))}

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-brand-blue text-white font-black py-6 rounded-3xl shadow-[0_20px_50px_rgba(30,58,138,0.3)] hover:bg-slate-900 transition-all flex items-center justify-center gap-3 disabled:opacity-80 text-xl tracking-tight leading-none group"
                            >
                                <span className="flex items-center gap-2">
                                    {loading ? <Loader2 size={24} className="animate-spin" /> : 'Kayıt Ol'}
                                    {!loading && <ArrowRight size={24} className="transition-transform group-hover:translate-x-1" />}
                                </span>
                            </button>
                        </div>

                        <div className="text-center">
                            <p className="text-slate-500 font-bold text-sm">
                                Zaten hesabınız var mı?{' '}
                                <Link
                                    href="/login"
                                    className="text-brand-blue font-black hover:underline"
                                >
                                    Giriş Yap
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
