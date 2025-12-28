"use client";

import React, { useState } from 'react';
import {
    HardDrive,
    Database,
    ShieldCheck,
    RotateCcw,
    Download,
    RefreshCw,
    AlertTriangle,
    CheckCircle2,
    Calendar
} from 'lucide-react';
import { cn } from "@/lib/utils";

export default function SystemMonitoringPage() {
    const [isBackingUp, setIsBackingUp] = useState(false);

    const handleBackup = () => {
        setIsBackingUp(true);
        setTimeout(() => setIsBackingUp(false), 2000);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Sistem & Yedekleme</h1>
                <p className="text-slate-500 font-medium mt-1">Sunucu kapasitesi, veritabanı sağlığı ve yedekleme süreçlerini gerçek zamanlı izleyin.</p>
            </div>

            {/* Capacity Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-soft space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-brand-blue/5 text-brand-blue rounded-2xl">
                                <HardDrive size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Sunucu Depolama</h3>
                                <p className="text-slate-500 text-sm font-medium">Toplam medya ve sertifika dosyaları.</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-black text-slate-900">428.5 MB</p>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">/ 2,048 MB</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden flex">
                            <div className="h-full bg-brand-blue rounded-full transition-all duration-1000" style={{ width: '21%' }} />
                        </div>
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                            <div className="flex items-center gap-2 text-brand-blue">
                                <div className="w-2 h-2 rounded-full bg-brand-blue" />
                                <span>Kullanılan: 428 MB</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                                <div className="w-2 h-2 rounded-full bg-slate-200" />
                                <span>Boş: 1.6 GB</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-soft space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-brand-green/5 text-brand-green rounded-2xl">
                                <Database size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Veritabanı Durumu</h3>
                                <p className="text-slate-500 text-sm font-medium">MySQL performans ve indeks sağlığı.</p>
                            </div>
                        </div>
                        <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-xs font-black uppercase tracking-widest">
                            SAĞLIKLI
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl">
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Toplam Sorgu</p>
                            <p className="text-lg font-black text-slate-900">842K</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl">
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Ort. Yanıt</p>
                            <p className="text-lg font-black text-slate-900">12ms</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Backup Management */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-soft overflow-hidden">
                <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Yedekleme Yönetimi</h3>
                            <p className="text-slate-500 text-sm font-medium">Günlük otomatik yedekler ve manuel kurtarma noktaları.</p>
                        </div>
                    </div>
                    <button
                        onClick={handleBackup}
                        disabled={isBackingUp}
                        className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-bold flex items-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
                    >
                        {isBackingUp ? <RefreshCw className="animate-spin" size={20} /> : <RotateCcw size={20} />}
                        Şimdi Yedekle
                    </button>
                </div>

                <div className="p-10 space-y-6">
                    <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl text-amber-700">
                        <AlertTriangle size={20} />
                        <p className="text-sm font-bold">Son otomatik yedekleme 4 saat önce başarıyla tamamlandı.</p>
                    </div>

                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Geçmiş Yedekler</p>
                        {[
                            { name: "Daily_Backup_2024_06_27.sql", size: "124 MB", date: "Bugün 04:00", type: "Auto" },
                            { name: "Pre_Migration_Backup.zip", size: "382 MB", date: "Dün 22:15", type: "Manual" },
                            { name: "System_State_Final.sql", size: "118 MB", date: "25 Haz 2024", type: "Auto" },
                        ].map((backup, i) => (
                            <div key={i} className="group flex items-center justify-between p-6 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white rounded-xl shadow-sm">
                                        <Download size={18} className="text-slate-400 group-hover:text-brand-blue" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{backup.name}</p>
                                        <div className="flex items-center gap-4 mt-1">
                                            <span className="text-[10px] font-black text-brand-blue bg-brand-blue/5 px-2 py-0.5 rounded-full uppercase italic tracking-tighter">{backup.type}</span>
                                            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                                <Calendar size={12} /> {backup.date}
                                            </span>
                                            <span className="text-xs text-slate-400 font-medium">{backup.size}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="text-[10px] font-black text-brand-blue uppercase tracking-widest p-2 hover:bg-brand-blue hover:text-white rounded-xl transition-all">
                                    İNDİR
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
