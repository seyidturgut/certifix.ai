"use client";

import { useState, useEffect } from "react";
import {
    FileText,
    Search,
    Filter,
    Download,
    Share2,
    MoreVertical,
    CheckCircle2,
    XCircle,
    Plus,
    Users,
    Edit,
    Trash2,
    ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import EditCertificateModal from "@/components/EditCertificateModal";

export default function UserCertificatesPage() {
    const [certificates, setCertificates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingCertificate, setEditingCertificate] = useState<any>(null);
    const [viewMode, setViewMode] = useState<'groups' | 'list'>('groups');
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const router = useRouter();

    const API_URL = "http://localhost:5001/api";

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            fetchCertificates(user.id);
        }
    }, []);

    const fetchCertificates = async (userId: string) => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/certificates?userId=${userId}`);
            const data = await res.json();
            setCertificates(data);
        } catch (error) {
            console.error("Fetch certificates error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCertificate = async (updatedCert: any) => {
        try {
            const res = await fetch(`${API_URL}/certificates/${updatedCert.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    recipient_name: updatedCert.recipient_name,
                    recipient_email: updatedCert.recipient_email,
                    program_name: updatedCert.program_name,
                    issue_date: updatedCert.issue_date
                })
            });

            if (res.ok) {
                setCertificates(prev => prev.map(c => c.id === updatedCert.id ? updatedCert : c));
            } else {
                alert("Güncelleme başarısız oldu.");
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("Bir hata oluştu.");
        }
    };

    // Grouping Logic
    const groups = certificates.reduce((acc: any, cert: any) => {
        const groupName = cert.group_name || "Genel / Gruplanmamış";
        if (!acc[groupName]) {
            acc[groupName] = {
                name: groupName,
                count: 0,
                program: cert.program_name,
                lastDate: cert.issue_date,
                certs: []
            };
        }
        acc[groupName].count += 1;
        acc[groupName].certs.push(cert);
        // Keep the latest date
        if (new Date(cert.issue_date) > new Date(acc[groupName].lastDate)) {
            acc[groupName].lastDate = cert.issue_date;
        }
        return acc;
    }, {});

    const groupsList = Object.values(groups);

    const filteredGroups = groupsList.filter((g: any) =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.program.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredCertificates = certificates.filter(cert => {
        if (selectedGroup) {
            const groupName = cert.group_name || "Genel / Gruplanmamış";
            if (groupName !== selectedGroup) return false;
        }
        return (
            cert.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.recipient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.program_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white border border-slate-100 rounded-2xl text-brand-blue shadow-sm">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                            {viewMode === 'groups' ? 'Verilen Sertifikalar' : selectedGroup}
                        </h1>
                        <p className="text-slate-500 font-medium">
                            {viewMode === 'groups'
                                ? 'Sertifikalarınızı etkinlik veya grup bazlı yönetin.'
                                : `${selectedGroup} grubundaki katılımcılar listeleniyor.`}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {viewMode === 'list' && (
                        <button
                            onClick={() => { setViewMode('groups'); setSelectedGroup(null); }}
                            className="bg-white border border-slate-100 text-slate-600 px-6 py-4 rounded-3xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
                        >
                            <ArrowLeft size={18} />
                            Gruplara Dön
                        </button>
                    )}
                    <button
                        onClick={() => router.push("/dashboard/user/certificates/issue")}
                        className="bg-brand-blue text-white px-6 py-4 rounded-3xl font-black shadow-lg shadow-brand-blue/20 hover:bg-slate-900 transition-all flex items-center gap-3 text-sm"
                    >
                        <Plus size={18} />
                        Yeni Katılım Sertifikası Ekle
                    </button>
                </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-soft space-y-8">
                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder={viewMode === 'groups' ? "Etkinlik veya program ara..." : "Sertifika ID, katılımcı veya program ara..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-surface-gray border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue transition-all font-bold text-slate-800 placeholder:text-slate-400"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 text-center text-slate-300 font-black text-xl animate-pulse">Yükleniyor...</div>
                ) : viewMode === 'groups' ? (
                    /* GROUPS VIEW */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredGroups.length === 0 ? (
                            <div className="col-span-full py-20 text-center text-slate-400 font-bold">Bulunamadı.</div>
                        ) : (
                            filteredGroups.map((group: any) => (
                                <div
                                    key={group.name}
                                    onClick={() => { setSelectedGroup(group.name); setViewMode('list'); setSearchTerm(""); }}
                                    className="group relative bg-white border border-slate-100 rounded-[2rem] p-6 hover:border-brand-blue/30 hover:shadow-xl transition-all cursor-pointer overflow-hidden"
                                >
                                    <div className="relative z-10 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div className="p-3 bg-brand-blue/5 text-brand-blue rounded-2xl">
                                                <Users size={24} />
                                            </div>
                                            <div className="bg-brand-blue text-white w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shadow-lg shadow-brand-blue/20">
                                                {group.count}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-800 line-clamp-1">{group.name}</h3>
                                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1 line-clamp-1">{group.program}</p>
                                        </div>
                                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Son Sertifika</span>
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{new Date(group.lastDate).toLocaleDateString('tr-TR')}</span>
                                        </div>
                                    </div>
                                    {/* Decoration */}
                                    <div className="absolute -bottom-6 -right-6 text-slate-50 transform rotate-12 opacity-0 group-hover:opacity-10 scale-150 transition-all duration-500">
                                        <FileText size={100} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    /* LIST VIEW */
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-gray text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                    <th className="px-8 py-5">Sertifika ID</th>
                                    <th className="px-8 py-5">Katılımcı</th>
                                    <th className="px-8 py-5">Eğitim / Program</th>
                                    <th className="px-8 py-5">Tarih</th>
                                    <th className="px-8 py-5">Durum</th>
                                    <th className="px-8 py-5 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredCertificates.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-bold">Hiç sertifika bulunamadı.</td>
                                    </tr>
                                ) : (
                                    filteredCertificates.map((cert) => (
                                        <tr key={cert.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-5 font-mono text-sm text-brand-blue font-bold">{cert.id}</td>
                                            <td className="px-8 py-5">
                                                <div className="font-bold text-slate-700">{cert.recipient_name}</div>
                                                <div className="text-[10px] font-medium text-slate-400">{cert.recipient_email}</div>
                                            </td>
                                            <td className="px-8 py-5 font-medium text-slate-500">{cert.program_name}</td>
                                            <td className="px-8 py-5 text-slate-400 font-bold text-sm">{cert.issue_date?.split('T')[0]}</td>
                                            <td className="px-8 py-5">
                                                <div className={cn(
                                                    "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider",
                                                    cert.status === 'valid' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                                                )}>
                                                    {cert.status === 'valid' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                                    {cert.status === 'valid' ? 'Geçerli' : 'İptal Edildi'}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button
                                                        onClick={() => {
                                                            const url = `${window.location.origin}/verify/${cert.id}${cert.share_token ? `?s=${cert.share_token}` : ''}`;
                                                            navigator.clipboard.writeText(url);
                                                            alert("Doğrulama linki kopyalandı!");
                                                        }}
                                                        title="Doğrulama Linkini Kopyala"
                                                        className="p-2.5 text-slate-400 hover:text-brand-blue hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-100 transition-all"
                                                    >
                                                        <Share2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingCertificate(cert)}
                                                        title="Düzenle"
                                                        className="p-2.5 text-slate-400 hover:text-emerald-500 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-100 transition-all"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (confirm("Bu sertifikayı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) {
                                                                try {
                                                                    const res = await fetch(`${API_URL}/certificates/${cert.id}`, { method: 'DELETE' });
                                                                    if (res.ok) {
                                                                        setCertificates(prev => prev.filter(c => c.id !== cert.id));
                                                                    } else {
                                                                        const errorData = await res.json();
                                                                        alert(`Silme işlemi başarısız: ${errorData.error || 'Bilinmeyen bir hata oluştu.'}`);
                                                                    }
                                                                } catch (err) {
                                                                    console.error(err);
                                                                    alert("Bağlantı hatası: Sunucuya ulaşılamadı.");
                                                                }
                                                            }
                                                        }}
                                                        title="Sil"
                                                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-100 transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <EditCertificateModal
                certificate={editingCertificate}
                isOpen={!!editingCertificate}
                onClose={() => setEditingCertificate(null)}
                onSave={handleUpdateCertificate}
            />
        </div>
    );
}
