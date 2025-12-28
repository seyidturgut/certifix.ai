"use client";

import { useState, useEffect } from "react";
import {
    FileText,
    CheckCircle2,
    Clock,
    TrendingUp,
    Download,
    Share2,
    MoreVertical
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const stats = [
    { name: "Oluşturulan Sertifikalar", value: "1,248", icon: FileText, change: "+12%", color: "text-brand-blue", bg: "bg-brand-blue/5" },
    { name: "Aktif Sertifikalar", value: "1,200", icon: CheckCircle2, iconColor: "text-brand-green", change: "+5%", color: "text-brand-green", bg: "bg-brand-green/5" },
    { name: "Bekleyen Doğrulamalar", value: "48", icon: Clock, change: "-2%", color: "text-brand-amber", bg: "bg-brand-amber/5" },
];

const recentCertificates = [
    { id: "CRT-9921", student: "Zeynep Demir", date: "12 Ocak 2026", status: "Geçerli" },
    { id: "CRT-9922", student: "Caner Yıldız", date: "14 Ocak 2026", status: "Geçerli" },
    { id: "CRT-9923", student: "Elif Aydın", date: "15 Ocak 2026", status: "İptal Edildi" },
    { id: "CRT-9924", student: "Mert Korkmaz", date: "16 Ocak 2026", status: "Geçerli" },
];

export default function CustomerDashboard() {
    const [user, setUser] = useState<any>(null);
    const [statsData, setStatsData] = useState<any>(null);
    const [recentCerts, setRecentCerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const API_URL = "/api";

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchDashboardData(parsedUser.id);
        }
    }, []);

    const fetchDashboardData = async (userId: string) => {
        try {
            setLoading(true);
            // Fetch Stats
            const statsRes = await fetch(`${API_URL}/users/${userId}/stats`);
            const stats = await statsRes.json();
            setStatsData(stats);

            // Fetch Recent Certificates
            const certsRes = await fetch(`${API_URL}/certificates?userId=${userId}`);
            const certs = await certsRes.json();
            setRecentCerts(certs.slice(0, 5)); // Show only last 5
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const dashboardStats = [
        { name: "Oluşturulan Sertifikalar", value: statsData?.total_certificates || 0, icon: FileText, change: "+0%", color: "text-brand-blue", bg: "bg-brand-blue/5" },
        { name: "Aktif Sertifikalar", value: statsData?.active_certificates || 0, icon: CheckCircle2, iconColor: "text-brand-green", change: "+0%", color: "text-brand-green", bg: "bg-brand-green/5" },
        { name: "İptal Edilenler", value: statsData?.revoked_certificates || 0, icon: Clock, change: "0%", color: "text-brand-amber", bg: "bg-brand-amber/5" },
    ];

    return (
        <div className="space-y-10 focus:outline-none">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800">
                        Hoş Geldin, {(user?.full_name?.split(' ')[0]) || "Seyit"} 👋
                    </h1>
                    <p className="text-slate-500 font-medium">İşte bugün sertifikasyon panelinde neler oluyor.</p>
                </div>
                <button
                    onClick={() => router.push("/dashboard/user/new")}
                    className="bg-brand-blue text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-900 transition-all flex items-center gap-2 shadow-lg shadow-brand-blue/20"
                >
                    <FileText size={20} />
                    Yeni Sertifika Oluştur
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {dashboardStats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-soft">
                        <div className="flex items-center justify-between mb-6">
                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", stat.bg)}>
                                <stat.icon size={28} className={stat.iconColor || stat.color} />
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
                                <TrendingUp size={14} className="text-brand-green" />
                                {stat.change}
                            </div>
                        </div>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mb-1">{stat.name}</p>
                        <h3 className="text-4xl font-extrabold text-brand-blue tracking-tight">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Recent Certificates Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-soft overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-xl font-extrabold text-slate-800">Son Oluşturulan Sertifikalar</h3>
                    <button
                        onClick={() => router.push("/dashboard/user/certificates")}
                        className="text-brand-blue font-bold text-sm hover:underline"
                    >
                        Tümünü Gör
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-gray text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                <th className="px-8 py-5">Sertifika ID</th>
                                <th className="px-8 py-5">Katılımcı</th>
                                <th className="px-8 py-5">Tarih</th>
                                <th className="px-8 py-5">Durum</th>
                                <th className="px-8 py-5 text-right">Eylemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {recentCerts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-10 text-center text-slate-400 font-medium">
                                        {loading ? "Yükleniyor..." : "Henüz sertifika oluşturulmamış."}
                                    </td>
                                </tr>
                            ) : (
                                recentCerts.map((cert) => (
                                    <tr key={cert.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5 font-mono text-sm text-brand-blue font-bold">{cert.id}</td>
                                        <td className="px-8 py-5 font-bold text-slate-700">{cert.recipient_name}</td>
                                        <td className="px-8 py-5 text-slate-500 font-medium">{cert.issue_date?.split('T')[0]}</td>
                                        <td className="px-8 py-5">
                                            <span className={cn(
                                                "px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider",
                                                cert.status === "valid" ? "bg-brand-green/10 text-brand-green" : "bg-red-50 text-red-500"
                                            )}>
                                                {cert.status === 'valid' ? 'GEÇERLİ' : 'GEÇERSİZ'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 text-slate-400 hover:text-brand-blue hover:bg-white rounded-lg shadow-sm">
                                                    <Download size={18} />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-brand-blue hover:bg-white rounded-lg shadow-sm">
                                                    <Share2 size={18} />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-brand-blue hover:bg-white rounded-lg shadow-sm">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Helper to use CN utility inside the component for clean copy-paste if needed
import { cn } from "@/lib/utils";
