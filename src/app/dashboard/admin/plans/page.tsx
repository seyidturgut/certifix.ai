"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Check, X, Shield, Zap, Layout, HardDrive, FileText, Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface Plan {
    id: string;
    name: string;
    price: number;
    yearly_price: number | null;
    type: 'one-time' | 'subscription' | 'contract';
    description: string;
    limits: {
        trainings: number;
        certificates_per_training: number;
        designs: number;
        assets: number;
        storage_mb: number;
    };
    features: {
        footer_required: boolean;
        linkedin_enabled: boolean;
        status_management?: boolean;
        white_label?: boolean;
        api_access?: boolean;
    };
    is_active: boolean;
}

export default function AdminPlansPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<Plan>>({});
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await fetch("/api/admin/plans");
            const data = await res.json();
            setPlans(data);
        } catch (err) {
            console.error("Fetch plans failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (planData: any, isNew: boolean) => {
        setLoading(true);
        try {
            const url = isNew
                ? "/api/admin/plans"
                : `/api/admin/plans/${planData.id}`;

            const res = await fetch(url, {
                method: isNew ? "POST" : "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(planData)
            });

            if (res.ok) {
                setMessage({ type: "success", text: isNew ? "Yeni paket oluşturuldu." : "Paket güncellendi." });
                fetchPlans();
                setEditingPlan(null);
                setIsAddModalOpen(false);
            } else {
                setMessage({ type: "error", text: "İşlem başarısız oldu." });
            }
        } catch (err) {
            setMessage({ type: "error", text: "Sunucu hatası." });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage({ type: "", text: "" }), 3000);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu paketi silmek istediğinize emin misiniz?")) return;
        try {
            const res = await fetch(`/api/admin/plans/${id}`, { method: "DELETE" });
            if (res.ok) {
                setMessage({ type: "success", text: "Paket silindi." });
                fetchPlans();
            }
        } catch (err) {
            setMessage({ type: "error", text: "Silme hatası." });
        }
    };

    const openEdit = (plan: Plan) => {
        setEditingPlan(plan);
        setFormData(plan);
    };

    const openAdd = () => {
        setEditingPlan(null);
        setFormData({
            id: "",
            name: "",
            price: 0,
            yearly_price: 0,
            type: "subscription",
            description: "",
            limits: {
                trainings: 5,
                certificates_per_training: 100,
                designs: 3,
                assets: 15,
                storage_mb: 500
            },
            features: {
                footer_required: true,
                linkedin_enabled: false
            },
            is_active: true
        });
        setIsAddModalOpen(true);
    };

    if (loading && plans.length === 0) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="animate-spin text-brand-blue" size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Paket Yönetimi</h1>
                    <p className="text-slate-500 font-medium">Sistemdeki tüm abonelik paketlerini ve limitlerini yönetin.</p>
                </div>
                <button
                    onClick={openAdd}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-2xl font-bold shadow-lg shadow-brand-blue/20 hover:scale-[1.02] transition-all"
                >
                    <Plus size={20} />
                    Yeni Paket Oluştur
                </button>
            </div>

            {message.text && (
                <div className={cn(
                    "p-4 rounded-2xl text-sm font-bold animate-in fade-in slide-in-from-top-2",
                    message.type === "success" ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
                )}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div key={plan.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group">
                        <div className="p-8 space-y-6 flex-1">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                                        {!plan.is_active && <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded text-[10px] font-black uppercase">Pasif</span>}
                                    </div>
                                    <p className="text-sm text-slate-400 font-medium">{plan.id}</p>
                                </div>
                                <div className="p-3 bg-brand-blue/5 rounded-2xl text-brand-blue">
                                    <Zap size={24} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-3xl font-black text-slate-900">
                                    {plan.price === 0 ? "Özel" : `${plan.price} ₺`}
                                    <span className="text-sm text-slate-400 font-bold ml-1">/ay</span>
                                </p>
                                {plan.yearly_price && <p className="text-sm text-brand-green font-bold">Yıllık: {plan.yearly_price} ₺</p>}
                            </div>

                            <div className="space-y-3 pt-4 border-t border-slate-50">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 font-medium">Eğitim Sayısı</span>
                                    <span className="font-bold text-slate-900">{plan.limits.trainings > 1000 ? "Sınırsız" : plan.limits.trainings}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 font-medium">Sertifika / Eğitim</span>
                                    <span className="font-bold text-slate-900">{plan.limits.certificates_per_training > 1000 ? "Sınırsız" : plan.limits.certificates_per_training}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 font-medium">Depolama</span>
                                    <span className="font-bold text-slate-900">{plan.limits.storage_mb >= 1024 ? `${plan.limits.storage_mb / 1024} GB` : `${plan.limits.storage_mb} MB`}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-2">
                                {plan.features.linkedin_enabled && <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold">LinkedIn</span>}
                                {plan.features.white_label && <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded-lg text-[10px] font-bold">White Label</span>}
                                {plan.features.footer_required && <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-bold">Mandatory Footer</span>}
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                            <button
                                onClick={() => openEdit(plan)}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white text-slate-700 rounded-xl font-bold shadow-sm hover:shadow-md hover:bg-slate-50 transition-all text-sm"
                            >
                                <Edit2 size={16} />
                                Düzenle
                            </button>
                            <button
                                onClick={() => handleDelete(plan.id)}
                                className="p-2.5 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-100 transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit / Add Modal */}
            {(editingPlan || isAddModalOpen) && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setEditingPlan(null); setIsAddModalOpen(false); }} />
                    <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">{isAddModalOpen ? "Yeni Paket Oluştur" : "Paketi Düzenle"}</h2>
                                <p className="text-sm text-slate-500 font-medium">Lütfen paket bilgilerini ve limitlerini girin.</p>
                            </div>
                            <button
                                onClick={() => { setEditingPlan(null); setIsAddModalOpen(false); }}
                                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto flex-1 space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Paket Kimliği (slug)</label>
                                    <input
                                        type="text"
                                        disabled={!!editingPlan}
                                        value={formData.id}
                                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all font-bold disabled:opacity-50"
                                        placeholder="baslangic_v2"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Paket Adı</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all font-bold"
                                        placeholder="Başlangıç Plus"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Aylık Fiyat (₺)</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Yıllık Fiyat (₺)</label>
                                    <input
                                        type="number"
                                        value={formData.yearly_price || 0}
                                        onChange={(e) => setFormData({ ...formData, yearly_price: Number(e.target.value) })}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all font-bold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                                    <HardDrive size={18} className="text-brand-blue" />
                                    Limitler
                                </h4>
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase">Eğitim</label>
                                        <input
                                            type="number"
                                            value={formData.limits?.trainings}
                                            onChange={(e) => setFormData({ ...formData, limits: { ...formData.limits!, trainings: Number(e.target.value) } })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase">Sertifika/Eğt</label>
                                        <input
                                            type="number"
                                            value={formData.limits?.certificates_per_training}
                                            onChange={(e) => setFormData({ ...formData, limits: { ...formData.limits!, certificates_per_training: Number(e.target.value) } })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase">Tasarımlar</label>
                                        <input
                                            type="number"
                                            value={formData.limits?.designs}
                                            onChange={(e) => setFormData({ ...formData, limits: { ...formData.limits!, designs: Number(e.target.value) } })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase">Storage (MB)</label>
                                        <input
                                            type="number"
                                            value={formData.limits?.storage_mb}
                                            onChange={(e) => setFormData({ ...formData, limits: { ...formData.limits!, storage_mb: Number(e.target.value) } })}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                                    <Shield size={18} className="text-brand-blue" />
                                    Özellikler
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { key: "footer_required", label: "Zorunlu Footer" },
                                        { key: "linkedin_enabled", label: "LinkedIn Paylaşımı" },
                                        { key: "white_label", label: "White Label" },
                                        { key: "api_access", label: "API Erişimi" },
                                        { key: "status_management", label: "Durum Yönetimi" },
                                    ].map((feat) => (
                                        <label key={feat.key} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={(formData.features as any)?.[feat.key]}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    features: { ...formData.features!, [feat.key]: e.target.checked }
                                                })}
                                                className="w-5 h-5 rounded-lg border-slate-300 text-brand-blue focus:ring-brand-blue transition-all"
                                            />
                                            <span className="font-bold text-slate-700">{feat.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                            <button
                                onClick={() => { setEditingPlan(null); setIsAddModalOpen(false); }}
                                className="px-8 py-4 bg-white text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all border border-slate-200"
                            >
                                İptal
                            </button>
                            <button
                                onClick={() => handleSave(formData, isAddModalOpen)}
                                disabled={loading}
                                className="px-12 py-4 bg-brand-blue text-white rounded-2xl font-black shadow-xl shadow-brand-blue/20 hover:bg-slate-900 transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
