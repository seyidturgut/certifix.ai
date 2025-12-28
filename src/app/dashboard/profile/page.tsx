"use client";

import { useState, useEffect, useRef } from "react";
import { User, Mail, Lock, Camera, Save, Shield, Bell, Signature as SignatureIcon, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("personal");
    const [user, setUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        company_name: "",
        phone: ""
    });
    const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        confirm: ""
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const signatureInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);

            // Initial form data from local storage
            setFormData({
                full_name: parsedUser.full_name || "",
                email: parsedUser.email || "",
                company_name: parsedUser.company_name || "",
                phone: parsedUser.phone || ""
            });

            // Fetch fresh data from server
            fetch(`/api/users/${parsedUser.id}`)
                .then(res => {
                    if (res.ok) return res.json();
                    throw new Error("Failed to fetch user");
                })
                .then(freshUser => {
                    // Merge local (auth) data with fresh profile data
                    // Note: API returns password but we deleted it in backend
                    const mergedUser = { ...parsedUser, ...freshUser };
                    setUser(mergedUser);
                    localStorage.setItem("user", JSON.stringify(mergedUser));

                    setFormData({
                        full_name: freshUser.full_name || "",
                        email: freshUser.email || "",
                        company_name: freshUser.company_name || "",
                        phone: freshUser.phone || ""
                    });
                })
                .catch(err => console.error("Could not fetch fresh user data", err));
        }
    }, []);

    const handleSaveProfile = async () => {
        if (!user) return;
        setLoading(true);
        setMessage({ type: "", text: "" });
        try {
            const res = await fetch(`/api/users/${user.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    signature_url: user.signature_url,
                    profile_image: user.profile_image,
                    brand_logo: user.brand_logo
                })
            });
            if (res.ok) {
                const updatedUser = { ...user, ...formData };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setUser(updatedUser);
                setMessage({ type: "success", text: "Profil bilgileriniz başarıyla güncellendi." });
            } else {
                const errorData = await res.json().catch(() => ({ error: "Bilinmeyen hata" }));
                setMessage({ type: "error", text: `Güncelleme hatası: ${errorData.error || res.statusText}` });
                console.error("Profile update failed:", res.status, errorData);
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: "error", text: "Sunucuya bağlanılamadı. Lütfen bağlantınızı kontrol edin." });
        } finally {
            setLoading(false);
        }
    };

    const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const updatedUser = { ...user, signature_url: base64String };
                setUser(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser));
                // We could also call handleSaveProfile here to persist immediately
            };
            reader.readAsDataURL(file);
        }
    };

    const removeSignature = () => {
        const updatedUser = { ...user, signature_url: null };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    const tabs = [
        { id: "personal", name: "Kişisel Bilgiler", icon: User },
        { id: "security", name: "Güvenlik", icon: Shield },
        { id: "notifications", name: "Bildirimler", icon: Bell },
    ];

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Profil Ayarları</h1>
                <p className="text-slate-500 font-medium">Hesap bilgilerinizi ve güvenlik tercihlerinizi buradan yönetin.</p>
            </div>

            {message.text && (
                <div className={cn(
                    "p-4 rounded-2xl text-sm font-bold animate-in fade-in slide-in-from-top-2",
                    message.type === "success" ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
                )}>
                    {message.text}
                </div>
            )}

            <div className="flex gap-8">
                {/* Sidebar Tabs */}
                <div className="w-64 flex flex-col gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all",
                                activeTab === tab.id
                                    ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/20"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <tab.icon size={20} />
                            {tab.name}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 max-w-3xl">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        {activeTab === "personal" && (
                            <div className="p-8 space-y-8 animate-in slide-in-from-right-4 duration-300">
                                {/* Profile Header & Photo */}
                                <div className="flex items-center gap-6 pb-6 border-b border-slate-50">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-200 transition-colors border-2 border-dashed border-slate-200 overflow-hidden">
                                            {user?.profile_image ? (
                                                <img src={user.profile_image} alt="Profil" className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={40} />
                                            )}
                                        </div>
                                        <label className="absolute -bottom-2 -right-2 p-2 bg-brand-blue text-white rounded-xl shadow-lg hover:scale-110 transition-transform cursor-pointer">
                                            <Camera size={16} />
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        if (file.size > 2 * 1024 * 1024) {
                                                            setMessage({ type: "error", text: "Dosya boyutu 2MB'dan küçük olmalıdır." });
                                                            return;
                                                        }
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            const base64 = reader.result as string;
                                                            setUser({ ...user, profile_image: base64 });
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">Profil Bilgileri</h3>
                                        <p className="text-sm text-slate-500">Kişisel bilgilerinizi ve profil fotoğrafınızı güncelleyin.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Ad Soyad</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="text"
                                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all font-medium"
                                                value={formData.full_name}
                                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">E-Posta Adresi</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="email"
                                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all font-medium"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Telefon</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="+90 555 000 0000"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all font-medium"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Şirket Adı</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all font-medium"
                                                value={formData.company_name}
                                                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Brand Logo Upload */}
                                    <div className="space-y-4 col-span-2 pt-4 border-t border-slate-100">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                                    Marka Logosu
                                                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-black uppercase">Sertifikada Görünür</span>
                                                </h4>
                                                <p className="text-xs text-slate-500 mt-1">Sertifikalarınızda sol üst köşede yer alacak logo.</p>
                                            </div>
                                            <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all text-sm cursor-pointer">
                                                <Upload size={16} />
                                                Logo Yükle
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            if (file.size > 2 * 1024 * 1024) {
                                                                setMessage({ type: "error", text: "Logo boyutu 2MB'dan küçük olmalıdır." });
                                                                return;
                                                            }
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                const base64 = reader.result as string;
                                                                setUser({ ...user, brand_logo: base64 });
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                        {user?.brand_logo && (
                                            <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center relative group">
                                                <img src={user.brand_logo} alt="Logo" className="max-h-20 object-contain" />
                                                <button
                                                    onClick={() => setUser({ ...user, brand_logo: null })}
                                                    className="absolute top-2 right-2 p-1 bg-red-100 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Signature Upload */}
                                    <div className="space-y-4 col-span-2 pt-4 border-t border-slate-100">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                                    Yetkili İmza
                                                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-black uppercase">Sertifikada Görünür</span>
                                                </h4>
                                                <p className="text-xs text-slate-500 mt-1">Sertifikaların altında yer alacak yetkili imzası.</p>
                                            </div>
                                            <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all text-sm cursor-pointer">
                                                <Upload size={16} />
                                                İmza Yükle
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                const base64 = reader.result as string;
                                                                setUser({ ...user, signature_url: base64 });
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                        {user?.signature_url && (
                                            <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center relative group">
                                                <img src={user.signature_url} alt="İmza" className="max-h-20 object-contain mix-blend-multiply" />
                                                <button
                                                    onClick={() => setUser({ ...user, signature_url: null })}
                                                    className="absolute top-2 right-2 p-1 bg-red-100 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={loading}
                                        className="flex items-center gap-2 px-8 py-3 bg-brand-blue text-white rounded-xl font-bold shadow-lg shadow-brand-blue/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                                    >
                                        <Save size={18} />
                                        {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === "security" && (
                            <div className="p-8 space-y-8 animate-in slide-in-from-right-4 duration-300">
                                <div className="space-y-6">
                                    <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                                        <Shield className="text-amber-600 shrink-0" size={24} />
                                        <div>
                                            <h4 className="font-bold text-amber-900 text-sm">Güvenlik Önerisi</h4>
                                            <p className="text-amber-700 text-xs mt-1 leading-relaxed">Güçlü bir şifre kullanmak, hesabınızın güvenliğini artırır. Şifrenizde harf, rakam ve özel karakterlere yer verin.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Mevcut Şifre</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input
                                                    type="password"
                                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700">Yeni Şifre</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                    <input
                                                        type="password"
                                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all font-medium"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-700">Yeni Şifre (Tekrar)</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                    <input
                                                        type="password"
                                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all font-medium"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button className="flex items-center gap-2 px-8 py-3 bg-brand-blue text-white rounded-xl font-bold shadow-lg shadow-brand-blue/20 hover:scale-[1.02] transition-all">
                                        <Lock size={18} />
                                        Şifreyi Güncelle
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === "notifications" && (
                            <div className="p-8 space-y-8 animate-in slide-in-from-right-4 duration-300">
                                <div className="space-y-4">
                                    {[
                                        { title: "Yeni Sertifika Bildirimleri", desc: "Yeni bir sertifika oluşturulduğunda e-posta al." },
                                        { title: "Sistem Duyuruları", desc: "Uygulama güncellemeleri ve önemli haberlerden haberdar ol." },
                                        { title: "Müşteri Aktiviteleri", desc: "Müşterilerinizin sertifika işlemlerini takip edin." },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div>
                                                <h4 className="font-bold text-slate-900">{item.title}</h4>
                                                <p className="text-sm text-slate-500">{item.desc}</p>
                                            </div>
                                            <div className="w-12 h-6 bg-brand-blue rounded-full relative cursor-pointer">
                                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm" />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button className="flex items-center gap-2 px-8 py-3 bg-brand-blue text-white rounded-xl font-bold shadow-lg shadow-brand-blue/20 hover:scale-[1.02] transition-all">
                                        <Save size={18} />
                                        Tercihleri Kaydet
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
