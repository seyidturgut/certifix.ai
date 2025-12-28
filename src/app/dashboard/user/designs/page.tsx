"use client";

import { useState, useEffect } from "react";
import {
    FileText,
    Search,
    Filter,
    Layout,
    Trash2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import dynamic from "next/dynamic";

const CertificatePreview = dynamic(() => import("@/components/CertificatePreview"), { ssr: false });

export default function UserDesignsPage() {
    const [designs, setDesigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    const API_URL = "/api";

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            fetchDesigns(user.id);
        }
    }, []);

    const fetchDesigns = async (userId: string) => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/designs?userId=${userId}`);
            const data = await res.json();
            setDesigns(data.filter((d: any) => !d.is_template));
        } catch (error) {
            console.error("Fetch designs error:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredDesigns = designs.filter(design =>
        design.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white border border-slate-100 rounded-2xl text-brand-blue shadow-sm">
                        <Layout size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Tasarımlarım</h1>
                        <p className="text-slate-500 font-medium">Kayıtlı tasarımlarınızı buradan düzenleyin.</p>
                    </div>
                </div>
                <button
                    onClick={() => router.push("/dashboard/user/new")}
                    className="bg-brand-blue text-white px-8 py-4 rounded-3xl font-black shadow-lg shadow-brand-blue/20 hover:bg-slate-900 transition-all flex items-center gap-3 text-lg"
                >
                    <FileText size={22} />
                    Yeni Tasarım Oluştur
                </button>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-soft space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Tasarım adı ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-surface-gray border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue transition-all font-bold text-slate-800 placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {loading ? (
                        <div className="col-span-full py-20 text-center text-slate-400 font-bold">Yükleniyor...</div>
                    ) : filteredDesigns.length === 0 ? (
                        <div className="col-span-full py-20 text-center space-y-4">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                                <Layout size={32} />
                            </div>
                            <div>
                                <p className="text-slate-500 font-bold text-lg">Henüz tasarımınız yok.</p>
                                <p className="text-slate-400 text-sm">Harika bir sertifika tasarlayarak başlayın!</p>
                            </div>
                        </div>
                    ) : (
                        filteredDesigns.map((design) => (
                            <div
                                key={design.id}
                                className="group relative aspect-[1.4/1] bg-white border border-slate-100 rounded-[2rem] hover:border-brand-blue/30 hover:shadow-xl transition-all overflow-hidden cursor-pointer"
                                onClick={() => router.push(`/dashboard/user/new?loadingDesign=${design.id}`)}
                            >
                                {/* Preview Area - Using the same logic as the Wizard for perfect alignment */}
                                <div className="absolute inset-0 w-full h-full">
                                    {design.design_json ? (
                                        <div className="w-full h-full transform scale-100 origin-center group-hover:scale-105 transition-transform duration-500">
                                            <CertificatePreview
                                                designJson={typeof design.design_json === 'string' ? design.design_json : JSON.stringify(design.design_json)}
                                                orientation={design.orientation || 'landscape'}
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full text-slate-200">
                                            <Layout size={48} />
                                        </div>
                                    )}
                                </div>

                                {/* Actions Overlay (Delete) */}
                                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            if (confirm("Bu tasarımı silmek istediğinize emin misiniz?")) {
                                                try {
                                                    await fetch(`/api/designs/${design.id}`, { method: 'DELETE' });
                                                    setDesigns(prev => prev.filter(d => d.id !== design.id));
                                                } catch (err) { console.error(err); }
                                            }
                                        }}
                                        className="p-3 bg-white/90 backdrop-blur-sm rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl border border-white/20"
                                        title="Tasarımı Sil"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                {/* Label Area - EXACT MATCH to Wizard Screenshot */}
                                <div className="absolute bottom-0 left-0 right-0 bg-white p-3 text-center border-t border-slate-100 z-10">
                                    <span className="text-sm font-bold text-slate-700 truncate block w-full">
                                        {design.name}
                                    </span>
                                    <div className="flex items-center justify-center gap-2 mt-1">
                                        <span className="text-[10px] font-black text-brand-blue/40 uppercase tracking-widest">{design.orientation === 'landscape' ? 'Yatay' : 'Dikey'}</span>
                                        <span className="text-slate-200">•</span>
                                        <span className="text-[10px] font-bold text-slate-300">{new Date(design.created_at).toLocaleDateString('tr-TR')}</span>
                                    </div>
                                </div>

                                {/* Hover Overlay for "Düzenle" text hint */}
                                <div className="absolute inset-0 bg-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                    <div className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-full shadow-2xl border border-white/50 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <span className="text-brand-blue font-black text-xs uppercase tracking-widest">Düzenle</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
