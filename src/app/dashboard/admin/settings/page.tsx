"use client";

import React, { useState } from 'react';
import {
    Settings,
    Globe,
    Link as LinkIcon,
    Lock,
    Chrome,
    Shield,
    CheckCircle2,
    Save
} from 'lucide-react';
import { cn } from "@/lib/utils";

export default function TechnicalSettingsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Teknik Ayarlar</h1>
                <p className="text-slate-500 font-medium mt-1">Sistemin global entegrasyonlarını, Google servislerini ve güvenlik parametrelerini yönetin.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Analytics & Search Console */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-soft space-y-8">
                    <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                        <div className="p-3 bg-brand-blue/5 text-brand-blue rounded-2xl">
                            <Chrome size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Google Entegrasyonları</h3>
                            <p className="text-slate-500 text-sm font-medium">Analytics ve Search Console bağlantıları.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Google Analytics (G-ID)</label>
                            <input
                                type="text"
                                placeholder="G-XXXXXXXXXX"
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all font-bold text-slate-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Search Console Verification Tag</label>
                            <input
                                type="text"
                                placeholder="google-site-verification=..."
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all font-bold text-slate-700"
                            />
                        </div>
                    </div>
                </div>

                {/* Social Auth Config */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-soft space-y-8">
                    <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                        <div className="p-3 bg-brand-green/5 text-brand-green rounded-2xl">
                            <Lock size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Sosyal Giriş (OAuth 2.0)</h3>
                            <p className="text-slate-500 text-sm font-medium">Google ve LinkedIn login ayarları.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {[
                            { name: "Google Login", status: "Aktif", active: true },
                            { name: "LinkedIn Login", status: "Yapılandırılmadı", active: false },
                            { name: "Microsoft 365", status: "Yapılandırılmadı", active: false },
                        ].map((provider, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                <span className="font-bold text-slate-700">{provider.name}</span>
                                <div className="flex items-center gap-3">
                                    <span className={cn(
                                        "text-[10px] font-black uppercase tracking-widest",
                                        provider.active ? "text-emerald-500" : "text-slate-400"
                                    )}>{provider.status}</span>
                                    <button className="text-[10px] font-black text-brand-blue uppercase tracking-widest hover:underline">DÜZENLE</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Parameters */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-soft space-y-8">
                    <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                        <div className="p-3 bg-brand-amber/5 text-brand-amber rounded-2xl">
                            <Globe size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Sistem Parametreleri</h3>
                            <p className="text-slate-500 text-sm font-medium">Domain ve global çalışma modları.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {[
                            { label: "Bakım Modu", desc: "Sistemi tüm kullanıcılara kapatır.", active: false },
                            { label: "Yeni Kayıt Alımı", desc: "Yeni müşteri kaydını aktif/pasif yapar.", active: true },
                            { label: "Beta Özellikler", desc: "Tüm kullanıcılara beta kanalını açar.", active: false },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 border border-slate-50 rounded-2xl">
                                <div>
                                    <p className="font-bold text-slate-900 leading-none">{item.label}</p>
                                    <p className="text-slate-400 text-xs mt-2 font-medium">{item.desc}</p>
                                </div>
                                <div className={cn(
                                    "w-12 h-6 rounded-full relative transition-colors cursor-pointer",
                                    item.active ? "bg-brand-blue" : "bg-slate-200"
                                )}>
                                    <div className={cn(
                                        "w-4 h-4 bg-white rounded-full absolute top-1 transition-all",
                                        item.active ? "right-1" : "left-1"
                                    )} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Security & Shield */}
                <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white space-y-8 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <Shield size={250} strokeWidth={0.5} />
                    </div>
                    <div className="space-y-6 relative z-10">
                        <h3 className="text-2xl font-black">Güvenlik Protololleri</h3>
                        <p className="text-white/40 text-sm font-medium leading-relaxed">
                            Certifix, kurumların verilerini AES-256 ve SSL/TLS 1.3 standartlarında korur. Teknik ayarlar üzerinden güvenlik eşiklerini dinamik olarak yönetebilirsiniz.
                        </p>
                    </div>
                    <button className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 relative z-10">
                        <Save size={20} />
                        Değişiklikleri Uygula
                    </button>
                </div>
            </div>
        </div>
    );
}
