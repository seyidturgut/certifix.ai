import {
    Users,
    CreditCard,
    Activity,
    TrendingUp,
    MoreVertical,
    CheckCircle2,
    XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminStats = [
    { name: "Toplam Kullanıcı", value: "482", icon: Users, change: "+8%", color: "text-brand-blue", bg: "bg-brand-blue/5" },
    { name: "Aylık Gelir", value: "₺24,500", icon: CreditCard, change: "+15%", color: "text-brand-green", bg: "bg-brand-green/5" },
    { name: "Sistem Sağlığı", value: "%99.9", icon: Activity, change: "+0.1%", color: "text-brand-amber", bg: "bg-brand-amber/5" },
];

const companies = [
    { name: "Acme Eğitim", email: "info@acme.com", plan: "Enterprise", status: "Aktif" },
    { name: "Global Akademi", email: "contact@global.edu", plan: "Professional", status: "Beklemede" },
    { name: "Teknoloji Enstitüsü", email: "admin@techinst.org", plan: "Starter", status: "Aktif" },
    { name: "Gelecek Bilim", email: "hello@future.sci", plan: "Professional", status: "Engellendi" },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-800">Sistem Genel Bakış 🛡️</h1>
                <p className="text-slate-500 font-medium">Certifix platformunun genel performans ve kullanıcı yönetimi.</p>
            </div>

            {/* Admin Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {adminStats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-soft">
                        <div className="flex items-center justify-between mb-6">
                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", stat.bg)}>
                                <stat.icon size={28} className={stat.color} />
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

            {/* User/Company Management */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-soft overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-xl font-extrabold text-slate-800">Kayıtlı Şirketler/Kullanıcılar</h3>
                    <div className="flex gap-4">
                        <button className="px-4 py-2 border border-slate-100 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all">Dışa Aktar</button>
                        <button className="px-4 py-2 bg-brand-blue text-white rounded-xl text-sm font-bold hover:bg-slate-900 transition-all shadow-lg shadow-brand-blue/10">Tümünü Yönet</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-gray text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                <th className="px-8 py-5">Şirket Adı</th>
                                <th className="px-8 py-5">Email</th>
                                <th className="px-8 py-5">Plan</th>
                                <th className="px-8 py-5">Durum</th>
                                <th className="px-8 py-5 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {companies.map((company, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-5 font-bold text-slate-700">{company.name}</td>
                                    <td className="px-8 py-5 text-slate-500 font-medium">{company.email}</td>
                                    <td className="px-8 py-5">
                                        <span className="text-sm font-bold text-brand-blue px-3 py-1 bg-brand-blue/5 rounded-lg border border-brand-blue/10">
                                            {company.plan}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            {company.status === "Aktif" && <CheckCircle2 size={16} className="text-brand-green" />}
                                            {company.status === "Beklemede" && <Activity size={16} className="text-brand-amber" />}
                                            {company.status === "Engellendi" && <XCircle size={16} className="text-red-500" />}
                                            <span className={cn(
                                                "text-[11px] font-bold uppercase tracking-wider",
                                                company.status === "Aktif" ? "text-brand-green" :
                                                    company.status === "Beklemede" ? "text-brand-amber" : "text-red-500"
                                            )}>
                                                {company.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="p-2 text-slate-400 hover:text-brand-blue transition-colors">
                                            <MoreVertical size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
