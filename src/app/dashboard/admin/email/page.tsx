"use client";

import React, { useState } from 'react';
import {
    Mail,
    Key,
    Send,
    CheckCircle2,
    AlertCircle,
    Settings,
    Layout as LayoutIcon,
    Bell
} from 'lucide-react';
import { cn } from "@/lib/utils";

export default function EmailSettingsPage() {
    const [apiKey, setApiKey] = useState("xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState<null | 'success' | 'error'>(null);

    const handleTestConnection = () => {
        setIsTesting(true);
        setTestResult(null);
        setTimeout(() => {
            setIsTesting(false);
            setTestResult('success');
        }, 1500);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">E-Posta & Bildirim Ayarları</h1>
                <p className="text-slate-500 font-medium mt-1">Sistem genelindeki e-posta gönderimlerini Brevo (tümleşik) API ile yönetin.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Brevo API Config */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-soft space-y-8">
                        <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                            <div className="p-3 bg-brand-blue/5 text-brand-blue rounded-2xl">
                                <Key size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Brevo API Yapılandırması</h3>
                                <p className="text-slate-500 text-sm font-medium">Sistem maillerinin gönderilmesi için gereklidir.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Brevo V3 API Key</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all font-mono text-sm"
                                        placeholder="xkeysib-..."
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button
                                    onClick={handleTestConnection}
                                    disabled={isTesting}
                                    className="px-8 py-4 bg-white border-2 border-slate-100 text-slate-800 rounded-2xl font-bold flex items-center justify-center gap-2 hover:border-brand-blue hover:text-brand-blue transition-all disabled:opacity-50"
                                >
                                    {isTesting ? <Settings className="animate-spin" size={20} /> : <Send size={20} />}
                                    Bağlantıyı Test Et
                                </button>
                                <button className="px-8 py-4 bg-brand-blue text-white rounded-2xl font-bold shadow-lg shadow-brand-blue/20 hover:bg-slate-900 transition-all">
                                    Ayarları Kaydet
                                </button>
                            </div>

                            {testResult === 'success' && (
                                <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
                                    <CheckCircle2 size={20} />
                                    <p className="text-sm font-bold">Brevo API bağlantısı başarıyla kuruldu!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Email Templates */}
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-soft space-y-8">
                        <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                            <div className="p-3 bg-brand-green/5 text-brand-green rounded-2xl">
                                <LayoutIcon size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">E-Posta Şablonları</h3>
                                <p className="text-slate-500 text-sm font-medium">Kullanıcılara giden otomatik mailleri düzenleyin.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { name: "Hoş Geldin Mesajı", trigger: "Yeni Kayıt", id: "12" },
                                { name: "Şifre Sıfırlama", trigger: "Şifremi Unuttum", id: "05" },
                                { name: "Sertifika Hazır", trigger: "Yeni Sertifika", id: "42" },
                                { name: "Kota Uyarısı", trigger: "Kullanım %90+", id: "08" },
                            ].map((template, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-white rounded-xl shadow-sm">
                                            <Mail size={18} className="text-slate-400 group-hover:text-brand-blue" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{template.name}</p>
                                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{template.trigger}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-black text-slate-400 group-hover:text-brand-blue">DÜZENLE</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Notifications & Log */}
                <div className="space-y-8 font-sans">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-soft space-y-6">
                        <div className="flex items-center gap-3">
                            <Bell size={20} className="text-brand-blue" />
                            <h3 className="font-bold text-slate-900">Hızlı Ayarlar</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: "Yeni Kayıt Bildirimi", active: true },
                                { label: "Kapasite Aşımları", active: true },
                                { label: "Haftalık Rapor", active: false },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-slate-600">{item.label}</span>
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

                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Send size={120} strokeWidth={0.5} />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <h3 className="font-bold text-lg">Son Gönderimler</h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="flex items-center gap-4 text-xs">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                                        <div className="space-y-1">
                                            <p className="font-bold text-white/90">seyit@certifix.ai</p>
                                            <p className="text-white/40 font-medium">Hoş geldin maili gönderildi — 2dk önce</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
