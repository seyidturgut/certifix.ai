"use client";

import React from 'react';
import {
    BarChart3,
    Users,
    FileText,
    Zap,
    ArrowUpRight,
    ArrowDownRight,
    Globe,
    Activity
} from 'lucide-react';
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Kullanım Analizi</h1>
                <p className="text-slate-500 font-medium mt-1">Sistem genelindeki aktiviteyi, sertifika üretim trendlerini ve kullanıcı büyümesini izleyin.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Yeni Kayıt", value: "84", change: "+12.5%", trend: "up", icon: Users, color: "text-brand-blue" },
                    { label: "Sertifika Üretimi", value: "54.2K", change: "+18.2%", trend: "up", icon: FileText, color: "text-brand-green" },
                    { label: "Aktif Oturumlar", value: "1,240", change: "-2.4%", trend: "down", icon: Activity, color: "text-amber-500" },
                    { label: "Doğrulama İsteği", value: "128K", change: "+24.1%", trend: "up", icon: Zap, color: "text-brand-blue" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-soft">
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn("p-3 rounded-2xl bg-slate-50", stat.color)}>
                                <stat.icon size={22} />
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full",
                                stat.trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                            )}>
                                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {stat.change}
                            </div>
                        </div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Main Visualizations (Mock Layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-soft space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xl font-bold text-slate-900">Sertifika Üretim Trendi</h3>
                        <div className="flex gap-2">
                            {['7G', '30G', '12A'].map((p) => (
                                <button key={p} className={cn(
                                    "px-4 py-1.5 rounded-xl text-xs font-bold",
                                    p === '30G' ? "bg-brand-blue text-white" : "bg-slate-50 text-slate-500"
                                )}>{p}</button>
                            ))}
                        </div>
                    </div>

                    {/* Mock Chart Area */}
                    <div className="h-64 w-full flex items-end justify-between gap-4 pt-4">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 50, 75, 60, 95].map((h, i) => (
                            <div key={i} className="flex-1 space-y-2 group cursor-pointer">
                                <div
                                    className="w-full bg-brand-blue/10 rounded-t-xl group-hover:bg-brand-blue transition-all duration-500 relative"
                                    style={{ height: `${h}%` }}
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {h}K
                                    </div>
                                </div>
                                <div className="text-[10px] font-bold text-slate-300 text-center uppercase tracking-tighter">Ay {i + 1}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-soft space-y-8">
                    <h3 className="text-xl font-bold text-slate-900">Coğrafi Dağılım</h3>
                    <div className="space-y-6">
                        {[
                            { country: "Türkiye", color: "bg-brand-blue", value: 65 },
                            { country: "Azerbaycan", color: "bg-brand-green", value: 15 },
                            { country: "Almanya", color: "bg-amber-500", value: 10 },
                            { country: "Diğer", color: "bg-slate-400", value: 10 },
                        ].map((item, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-slate-600 uppercase tracking-widest">{item.country}</span>
                                    <span className="text-slate-400">{item.value}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.value}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 flex justify-center">
                        <div className="w-32 h-32 relative">
                            {/* Circular Progress Mock */}
                            <div className="absolute inset-0 border-[12px] border-slate-50 rounded-full" />
                            <div className="absolute inset-0 border-[12px] border-l-brand-blue border-r-brand-blue border-t-brand-blue border-transparent rounded-full rotate-45" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Globe size={24} className="text-slate-300" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Popular Templates Table-like View */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-soft space-y-8">
                <div className="flex items-center gap-3">
                    <BarChart3 size={24} className="text-brand-blue" />
                    <h3 className="text-xl font-bold text-slate-900">En Çok Kullanılan Taslaklar</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { name: "Modern Kurumsal", usage: "12,402", growth: "+15%" },
                        { name: "Akademik Başarı", usage: "8,290", growth: "+8%" },
                        { name: "Etkinlik Katılım", usage: "15,840", growth: "+22%" },
                    ].map((template, i) => (
                        <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100/50 hover:bg-white hover:border-brand-blue/20 hover:shadow-xl transition-all group">
                            <p className="font-black text-slate-900 text-lg mb-1">{template.name}</p>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-400 text-sm font-semibold">{template.usage} kez kullanıldı</span>
                                <span className="text-brand-green text-[10px] font-black italic">{template.growth}</span>
                            </div>
                            <div className="mt-4 flex -space-x-3">
                                {[1, 2, 3, 4].map(x => (
                                    <div key={x} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-slate-50" />
                                ))}
                                <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400">+12</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
