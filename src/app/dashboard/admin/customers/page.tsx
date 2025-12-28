"use client";

import React, { useState, useMemo } from 'react';
import {
    Search,
    Filter,
    MoreVertical,
    UserPlus,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Clock,
    X,
    Save,
    Trash2,
    Eye,
    Pencil,
    Shield,
    CreditCard,
    History,
    Mail
} from 'lucide-react';
import { cn } from "@/lib/utils";

type Customer = {
    id: number | string;
    name: string;
    company: string;
    email: string;
    status: 'Active' | 'Warning' | 'Inactive';
    usage: number;
    plan: 'Trial' | 'Basic' | 'Pro' | 'Enterprise';
    joined: string;
};

const API_URL = "/api";

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("All");

    // UI States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [activeRowMenu, setActiveRowMenu] = useState<number | string | null>(null);

    // Form States
    const [formData, setFormData] = useState<Partial<Customer>>({
        name: "", company: "", email: "", plan: "Basic", status: "Active", usage: 0
    });

    // Fetch Data
    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/users`);
            const data = await res.json();
            // Map backend fields to frontend if necessary
            const mappedData = data.map((u: any) => ({
                id: u.id,
                name: u.full_name,
                company: u.company_name,
                email: u.email,
                status: u.role === 'SUPER_ADMIN' ? 'Active' : 'Active', // Simplification
                usage: Math.floor(Math.random() * 100), // Random usage as backend doesn't have it yet
                plan: 'Basic', // Default plan
                joined: u.created_at?.split('T')[0] || '2024-01-01'
            }));
            setCustomers(mappedData);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchCustomers();
    }, []);

    // Filter Logic
    const filteredCustomers = useMemo(() => {
        return customers.filter(c => {
            const matchesSearch = (c.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                (c.company?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                (c.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());
            const matchesFilter = filterStatus === "All" || c.status === filterStatus;
            return matchesSearch && matchesFilter;
        });
    }, [customers, searchTerm, filterStatus]);

    // Handlers
    const handleAddCustomer = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    full_name: formData.name,
                    email: formData.email,
                    company_name: formData.company,
                    password: "password123" // Default password for new customers
                })
            });
            if (res.ok) {
                fetchCustomers();
                setIsAddModalOpen(false);
                resetForm();
            }
        } catch (error) {
            console.error("Add error:", error);
        }
    };

    const handleEditCustomer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCustomer) return;
        try {
            const res = await fetch(`${API_URL}/users/${selectedCustomer.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    full_name: formData.name,
                    email: formData.email,
                    company_name: formData.company,
                    role: formData.plan === 'Pro' ? 'USER' : 'USER' // Simplification
                })
            });
            if (res.ok) {
                fetchCustomers();
                setIsEditModalOpen(false);
                resetForm();
            }
        } catch (error) {
            console.error("Edit error:", error);
        }
    };

    const handleDeleteCustomer = async (id: number | string) => {
        if (confirm("Bu müşteriyi silmek istediğinize emin misiniz?")) {
            try {
                const res = await fetch(`${API_URL}/users/${id}`, { method: "DELETE" });
                if (res.ok) {
                    fetchCustomers();
                    setActiveRowMenu(null);
                }
            } catch (error) {
                console.error("Delete error:", error);
            }
        }
    };

    const resetForm = () => {
        setFormData({ name: "", company: "", email: "", plan: "Basic", status: "Active", usage: 0 });
        setSelectedCustomer(null);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Müşteri Yönetimi</h1>
                    <p className="text-slate-500 font-medium mt-1">Sistemdeki tüm kayıtlı kullanıcıların kullanım ve üyelik detaylarını yönetin.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsAddModalOpen(true); }}
                    className="bg-brand-blue text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-900 transition-all shadow-xl shadow-brand-blue/20"
                >
                    <UserPlus size={20} />
                    Yeni Müşteri Ekle
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Toplam Müşteri", value: customers.length, change: "+12%", icon: TrendingUp, color: "text-brand-blue" },
                    { label: "Aktif Kullanım", value: "85%", change: "+5%", icon: CheckCircle2, color: "text-brand-green" },
                    { label: "Kapasite Aşımı", value: customers.filter(c => c.usage > 90).length, change: "-2%", icon: AlertCircle, color: "text-amber-500" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-soft">
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn("p-3 rounded-2xl bg-slate-50", stat.color)}>
                                <stat.icon size={24} />
                            </div>
                            <span className="text-emerald-500 text-sm font-bold bg-emerald-50 px-3 py-1 rounded-full">{stat.change}</span>
                        </div>
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-3xl font-black text-slate-900 mt-1">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Filter & Search */}
            <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-soft flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Müşteri adı, şirket veya e-posta ile ara..."
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-brand-blue/5 outline-none font-medium text-slate-800 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-6 py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold border-none outline-none focus:ring-4 focus:ring-brand-blue/5 cursor-pointer appearance-none"
                    >
                        <option value="All">Tüm Durumlar</option>
                        <option value="Active">Aktif</option>
                        <option value="Warning">Kritik</option>
                        <option value="Inactive">Pasif</option>
                    </select>
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/30">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Müşteri / Şirket</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Durum</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Kullanım</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Plan</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Katılım</th>
                                <th className="px-8 py-6"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50/50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-12 h-12 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin" />
                                            <p className="font-bold text-slate-400 tracking-widest uppercase text-xs">Yükleniyor...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4 cursor-pointer" onClick={() => { setSelectedCustomer(customer); setIsDetailDrawerOpen(true); }}>
                                            <div className="w-12 h-12 bg-brand-blue/5 text-brand-blue rounded-2xl flex items-center justify-center font-black text-lg transition-transform group-hover:scale-110">
                                                {customer.name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 group-hover:text-brand-blue transition-colors">{customer.name}</p>
                                                <p className="text-slate-500 text-sm font-medium">{customer.company}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                            customer.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                customer.status === 'Warning' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                    'bg-slate-100 text-slate-600 border-slate-200'
                                        )}>
                                            {customer.status === 'Active' ? 'AKTİF' : customer.status === 'Warning' ? 'KRİTİK' : 'PASİF'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="w-full max-w-[120px]">
                                            <div className="flex justify-between text-[10px] font-black mb-1">
                                                <span className="text-slate-400">{customer.usage}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all duration-1000",
                                                        customer.usage > 90 ? "bg-red-500" :
                                                            customer.usage > 70 ? "bg-amber-500" :
                                                                "bg-brand-blue"
                                                    )}
                                                    style={{ width: `${customer.usage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="font-black text-slate-700 text-xs italic bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">{customer.plan}</span>
                                    </td>
                                    <td className="px-8 py-6 text-slate-500 font-medium">
                                        <div className="flex items-center gap-2 text-xs">
                                            <Clock size={14} className="text-slate-300" />
                                            {customer.joined}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right relative">
                                        <button
                                            onClick={() => setActiveRowMenu(activeRowMenu === customer.id ? null : (customer.id as any))}
                                            className="p-2 text-slate-400 hover:text-brand-blue hover:bg-brand-blue/5 rounded-xl transition-all"
                                        >
                                            <MoreVertical size={20} />
                                        </button>

                                        {/* Action Menu */}
                                        {activeRowMenu === customer.id && (
                                            <div className="absolute right-8 top-16 w-48 bg-white border border-slate-100 shadow-2xl rounded-2xl z-20 py-2 animate-in fade-in zoom-in-95 duration-200">
                                                <button
                                                    onClick={() => { setSelectedCustomer(customer); setIsDetailDrawerOpen(true); setActiveRowMenu(null); }}
                                                    className="w-full px-4 py-3 flex items-center gap-3 text-slate-600 hover:bg-slate-50 font-bold text-sm transition-colors"
                                                >
                                                    <Eye size={16} className="text-brand-blue" /> Detayları Gör
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedCustomer(customer); setFormData(customer); setIsDetailDrawerOpen(false); setIsEditModalOpen(true); setActiveRowMenu(null); }}
                                                    className="w-full px-4 py-3 flex items-center gap-3 text-slate-600 hover:bg-slate-50 font-bold text-sm transition-colors"
                                                >
                                                    <Pencil size={16} className="text-amber-500" /> Bilgileri Düzenle
                                                </button>
                                                <div className="h-px bg-slate-50 my-1" />
                                                <button
                                                    onClick={() => handleDeleteCustomer(customer.id)}
                                                    className="w-full px-4 py-3 flex items-center gap-3 text-red-500 hover:bg-red-50 font-bold text-sm transition-colors"
                                                >
                                                    <Trash2 size={16} /> Müşteriyi Sil
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-slate-400">
                                        <div className="space-y-4">
                                            <AlertCircle size={48} className="mx-auto opacity-20" />
                                            <p className="font-bold">Müşteri bulunamadı.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- Modals & Drawers --- */}

            {/* Add/Edit Modal Overlay */}
            {(isAddModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 leading-tight">
                                    {isAddModalOpen ? 'Yeni Müşteri Oluştur' : 'Müşteri Bilgilerini Güncelle'}
                                </h3>
                                <p className="text-slate-500 text-sm font-medium mt-1">Gerekli alanları doldurarak işlemi tamamlayın.</p>
                            </div>
                            <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={isAddModalOpen ? handleAddCustomer : handleEditCustomer} className="p-10 space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ad Soyad</label>
                                    <input
                                        type="text" required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all font-bold text-slate-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Şirket Adı</label>
                                    <input
                                        type="text" required
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all font-bold text-slate-700"
                                    />
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-Posta Adresi</label>
                                    <input
                                        type="email" required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all font-bold text-slate-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Paket Planı</label>
                                    <select
                                        value={formData.plan}
                                        onChange={(e) => setFormData({ ...formData, plan: e.target.value as any })}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all font-bold text-slate-700 appearance-none"
                                    >
                                        <option value="Trial">Trial</option>
                                        <option value="Basic">Basic</option>
                                        <option value="Pro">Pro</option>
                                        <option value="Enterprise">Enterprise</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hesap Durumu</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all font-bold text-slate-700 appearance-none"
                                    >
                                        <option value="Active">Aktif</option>
                                        <option value="Warning">Kritik (Kapasite)</option>
                                        <option value="Inactive">Pasif</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-brand-blue text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-brand-blue/20 hover:scale-[1.02] transition-all active:scale-95 leading-none">
                                <Save size={22} />
                                {isAddModalOpen ? 'Müşteriyi Kaydet' : 'Değişiklikleri Uygula'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Detail Drawer Side Overlay */}
            {isDetailDrawerOpen && selectedCustomer && (
                <div className="fixed inset-0 z-[80] flex justify-end bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300">
                    <div className="w-full max-w-lg bg-white h-screen shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-500 relative flex flex-col">
                        <button
                            onClick={() => setIsDetailDrawerOpen(false)}
                            className="absolute top-8 left-[-48px] bg-white p-3 rounded-l-2xl shadow-xl text-slate-400 hover:text-brand-blue transition-all"
                        >
                            <X size={24} />
                        </button>

                        <div className="p-10 space-y-12 flex-1">
                            {/* Drawer Header */}
                            <div className="text-center space-y-4">
                                <div className="w-24 h-24 bg-brand-blue/5 text-brand-blue rounded-[2.5rem] flex items-center justify-center font-black text-4xl mx-auto border-4 border-brand-blue/10">
                                    {selectedCustomer.name?.charAt(0) || '?'}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedCustomer.name}</h2>
                                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">{selectedCustomer.company}</p>
                                </div>
                                <div className="flex justify-center gap-2">
                                    <span className="px-3 py-1 bg-brand-blue/5 text-brand-blue rounded-full text-[10px] font-black tracking-widest uppercase border border-brand-blue/10">
                                        {selectedCustomer.plan}
                                    </span>
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border",
                                        selectedCustomer.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                    )}>
                                        {selectedCustomer.status}
                                    </span>
                                </div>
                            </div>

                            {/* Quick Stats in Drawer */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Kullanılan Alan</p>
                                    <p className="text-2xl font-black text-slate-900">{selectedCustomer.usage}%</p>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Sertifika Sayısı</p>
                                    <p className="text-2xl font-black text-slate-900">1,420</p>
                                </div>
                            </div>

                            {/* Contact & Info */}
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-100 pb-4 flex items-center gap-2">
                                    <Mail size={12} /> İrtibat Bilgileri
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 font-bold">E-Posta</span>
                                        <span className="text-slate-900 font-bold">{selectedCustomer.email}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 font-bold">Kayıt Tarihi</span>
                                        <span className="text-slate-900 font-bold">{selectedCustomer.joined}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-100 pb-4 flex items-center gap-2">
                                    <History size={12} /> Son Aktiviteler
                                </h4>
                                <div className="space-y-4">
                                    {[
                                        { action: "Sertifika Üretimi", detail: "54 adet sertifika oluşturuldu", time: "2 saat önce" },
                                        { action: "Profil Güncelleme", detail: "Şirket logosu güncellendi", time: "Dün 14:20" },
                                        { action: "Plan Yükseltme", detail: "Basic -> Pro geçiş yapıldı", time: "15 Haz 2024" },
                                    ].map((act, i) => (
                                        <div key={i} className="flex gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-default border border-transparent hover:border-slate-100">
                                            <div className="w-1.5 h-auto bg-brand-blue/20 rounded-full" />
                                            <div>
                                                <p className="text-sm font-black text-slate-900 leading-tight">{act.action}</p>
                                                <p className="text-xs text-slate-500 mt-1 font-medium">{act.detail}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">{act.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Drawer Actions */}
                        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex gap-4">
                            <button
                                onClick={() => { setFormData(selectedCustomer); setIsDetailDrawerOpen(false); setIsEditModalOpen(true); }}
                                className="flex-1 px-4 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold flex items-center justify-center gap-2 hover:border-brand-blue hover:text-brand-blue transition-all"
                            >
                                <Pencil size={18} /> Düzenle
                            </button>
                            <button className="flex-1 px-4 py-4 bg-brand-blue text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-900 transition-all shadow-lg shadow-brand-blue/10">
                                <Shield size={18} /> Kısıtla
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
