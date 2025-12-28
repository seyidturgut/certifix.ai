"use client";

import { useState, useEffect } from "react";
import {
    CreditCard,
    ShieldCheck,
    Zap,
    Layout,
    Users,
    Database,
    ArrowUpRight,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function UsagePage() {
    const [usageData, setUsageData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            fetch(`/api/users/${user.id}/usage`)
                .then(res => res.json())
                .then(data => {
                    setUsageData(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Usage fetch error:", err);
                    setLoading(false);
                });
        }
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
            </div>
        );
    }

    if (!usageData) return null;

    const { plan, usage } = usageData;

    const stats = [
        {
            label: "Eğitim Sayısı",
            current: usage.trainings,
            limit: plan.limits.trainings,
            icon: Zap,
            color: "text-amber-500",
            bg: "bg-amber-50"
        },
        {
            label: "Toplam Sertifika",
            current: usage.certificates,
            limit: plan.id === 'tek_egitim' ? plan.limits.certificates_per_training : 'Sınırsız', // Usually per training
            icon: Users,
            color: "text-brand-blue",
            bg: "bg-blue-50"
        },
        {
            label: "Kayıtlı Tasarımlar",
            current: usage.designs,
            limit: plan.limits.designs,
            icon: Layout,
            color: "text-purple-500",
            bg: "bg-purple-50"
        },
        {
            label: "Depolama Kullanımı",
            current: `${usage.storage_mb} MB`,
            limit: `${plan.limits.storage_mb} MB`,
            icon: Database,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
            percentage: (usage.storage_mb / plan.limits.storage_mb) * 100
        }
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Paket & Kullanım</h1>
                    <p className="text-slate-500 font-medium mt-2">Mevcut paketiniz ve kullanım detaylarınız.</p>
                </div>

                <div className="bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-soft flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-blue/5 rounded-2xl flex items-center justify-center text-brand-blue">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aktif Paket</p>
                        <p className="text-lg font-black text-slate-800 capitalize">{plan.name}</p>
                    </div>
                    <button className="ml-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-brand-blue transition-all">
                        Yükselt
                    </button>
                </div>
            </div>

            {/* Usage Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stats.map((stat, idx) => {
                    const isUnlimited = typeof stat.limit === 'string' && stat.limit === 'Sınırsız';
                    const percentage = stat.percentage || (isUnlimited ? 0 : (Number(stat.current) / Number(stat.limit)) * 100);

                    return (
                        <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-soft space-y-4">
                            <div className="flex items-center justify-between">
                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                                    <stat.icon size={20} />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-end justify-between">
                                    <p className="text-3xl font-black text-slate-800">{stat.current}</p>
                                    <p className="text-sm font-bold text-slate-400">/ {stat.limit}</p>
                                </div>
                                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full transition-all duration-1000", percentage > 90 ? "bg-red-500" : "bg-brand-blue")}
                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Plan Details & Features */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Zap size={200} />
                </div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-black">{plan.name} Paketinin Keyfini Çıkarın</h2>
                        <p className="text-slate-400 font-medium leading-relaxed">
                            Mevcut paketinizle profesyonel sertifikalar oluşturmaya devam edebilirsiniz.
                            Daha yüksek limitler ve LinkedIn entegrasyonu gibi özellikler için dilediğiniz zaman paketinizi yükseltebilirsiniz.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {plan.features.linkedin_enabled && (
                                <span className="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-blue-500/20">
                                    LinkedIn Entegrasyonu
                                </span>
                            )}
                            <span className="px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-green-500/20">
                                QR Kod Doğrulama
                            </span>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm space-y-6">
                        <h3 className="text-lg font-bold">Plan Özellikleri</h3>
                        <div className="space-y-4">
                            {[
                                `${plan.limits.trainings} Aktif Eğitim`,
                                `${plan.limits.certificates_per_training} Sertifika / Eğitim`,
                                `${plan.limits.designs} Tasarım Şablonu`,
                                "Ömür Boyu Doğrulama Desteği"
                            ].map((feat, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle2 size={16} className="text-brand-blue" />
                                    <span className="text-sm font-medium text-slate-300">{feat}</span>
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all">
                            Tüm Planları Karşılaştır
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
