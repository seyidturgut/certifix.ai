"use client";

import { useState, useEffect } from "react";
import {
    Image as ImageIcon,
    Plus,
    Trash2,
    Shapes,
    Layout as LayoutIcon,
    Upload,
    CheckCircle2,
    XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Asset {
    id: string;
    type: 'template' | 'element' | 'image';
    name: string;
    content: string;
    created_at: string;
}

export default function AdminAssetsPage() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [activeType, setActiveType] = useState<'template' | 'element' | 'image'>('image');

    const [selectedAssets, setSelectedAssets] = useState<string[]>([]);

    const [newName, setNewName] = useState("");
    const [newFiles, setNewFiles] = useState<FileList | null>(null);

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        try {
            const res = await fetch("http://localhost:5001/api/assets");
            const data = await res.json();
            setAssets(data);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFiles || newFiles.length === 0) return;

        setUploading(true);
        try {
            const promises = Array.from(newFiles).map(file => {
                return new Promise<void>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = async () => {
                        const base64Content = reader.result as string;
                        try {
                            const res = await fetch("http://localhost:5001/api/assets", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    type: activeType,
                                    name: file.name.split('.')[0], // Use filename as default name
                                    content: base64Content
                                })
                            });
                            if (res.ok) resolve();
                            else reject(res.statusText);
                        } catch (err) {
                            reject(err);
                        }
                    };
                    reader.onerror = () => reject(reader.error);
                    reader.readAsDataURL(file);
                });
            });

            await Promise.all(promises);

            setNewName("");
            setNewFiles(null);
            // Reset file input
            const fileInput = document.getElementById('asset-file') as HTMLInputElement;
            if (fileInput) fileInput.value = "";

            fetchAssets();
        } catch (error) {
            console.error("Upload error:", error);
            alert("Bazı dosyalar yüklenirken hata oluştu.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu varlığı silmek istediğinize emin misiniz?")) return;
        try {
            const res = await fetch(`http://localhost:5001/api/assets/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                fetchAssets();
                setSelectedAssets(prev => prev.filter(aId => aId !== id));
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedAssets.length === 0) return;
        if (!confirm(`${selectedAssets.length} adet varlığı silmek istediğinize emin misiniz?`)) return;

        try {
            await Promise.all(selectedAssets.map(id =>
                fetch(`http://localhost:5001/api/assets/${id}`, { method: "DELETE" })
            ));
            fetchAssets();
            setSelectedAssets([]);
        } catch (error) {
            console.error("Bulk delete error:", error);
        }
    };

    const toggleSelection = (id: string) => {
        setSelectedAssets(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const filteredAssets = assets.filter(a => a.type === activeType);

    return (
        <div className="max-w-7xl mx-auto py-10 space-y-10 px-4">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">Varlık Yönetimi 📁</h1>
                    <p className="text-slate-500 font-medium">Tüm kullanıcılar için hazır şablon, bileşen ve görsel yönetimi.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Upload Form */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-soft">
                        <h3 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-3">
                            <Plus className="text-brand-blue" />
                            Yeni Varlık Ekle
                        </h3>

                        <form onSubmit={handleFileUpload} className="space-y-6">
                            <div>
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Varlık Türü</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['image', 'element', 'template'] as const).map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setActiveType(t)}
                                            className={cn(
                                                "py-3 rounded-2xl text-[10px] font-black uppercase tracking-tight transition-all border",
                                                activeType === t
                                                    ? "bg-brand-blue text-white border-brand-blue shadow-lg shadow-brand-blue/20"
                                                    : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100"
                                            )}
                                        >
                                            {t === 'image' && "Görsel"}
                                            {t === 'element' && "Bileşen"}
                                            {t === 'template' && "Şablon"}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Varlık Adı</label>
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Örn: Modern Altın Çerçeve"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-blue/20 outline-none transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Dosyalar Seç (Çoklu)</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        onChange={(e) => setNewFiles(e.target.files)}
                                        className="hidden"
                                        id="asset-file"
                                        accept="image/*"
                                        multiple
                                        required
                                    />
                                    <label
                                        htmlFor="asset-file"
                                        className="w-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] p-10 cursor-pointer hover:bg-slate-50 transition-all group"
                                    >
                                        {newFiles && newFiles.length > 0 ? (
                                            <div className="flex flex-col items-center gap-3">
                                                <CheckCircle2 className="text-brand-green" size={32} />
                                                <span className="text-xs font-bold text-slate-600 max-w-full truncate px-4">{newFiles.length} dosya seçildi</span>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="text-slate-300 group-hover:text-brand-blue transition-colors mb-3" size={32} />
                                                <span className="text-xs font-bold text-slate-400">Dosyaları Buraya Bırakın veya Seçin</span>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={uploading}
                                className="w-full py-5 bg-brand-blue text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-900 transition-all shadow-xl shadow-brand-blue/20 disabled:opacity-50"
                            >
                                {uploading ? "Yükleniyor..." : "Seçilenleri Sisteme Kaydet"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Asset List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-soft overflow-hidden h-full flex flex-col">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <h3 className="text-xl font-extrabold text-slate-800">
                                Kayıtlı {activeType === 'image' ? 'Görseller' : activeType === 'element' ? 'Bileşenler' : 'Şablonlar'}
                            </h3>
                            <div className="flex items-center gap-3">
                                {selectedAssets.length > 0 && (
                                    <button
                                        onClick={handleBulkDelete}
                                        className="px-4 py-2 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                                    >
                                        <Trash2 size={14} />
                                        {selectedAssets.length} Sil
                                    </button>
                                )}
                                <span className="px-4 py-1.5 bg-slate-50 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {filteredAssets.length} Toplam
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 p-8 overflow-y-auto">
                            {loading ? (
                                <div className="flex items-center justify-center h-full text-slate-400 font-bold">Yükleniyor...</div>
                            ) : filteredAssets.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-300 space-y-4 py-20">
                                    <XCircle size={64} className="opacity-20" />
                                    <span className="font-bold">Bu kategoride henüz varlık yok.</span>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredAssets.map((asset) => (
                                        <div
                                            key={asset.id}
                                            onClick={() => toggleSelection(asset.id)}
                                            className={cn(
                                                "group relative aspect-square bg-slate-50 rounded-[2rem] overflow-hidden border transition-all p-4 cursor-pointer",
                                                selectedAssets.includes(asset.id)
                                                    ? "border-brand-blue ring-2 ring-brand-blue/20"
                                                    : "border-slate-100 hover:border-brand-blue/30"
                                            )}
                                        >
                                            {selectedAssets.includes(asset.id) && (
                                                <div className="absolute top-3 right-3 z-10 text-brand-blue bg-white rounded-full p-0.5 shadow-md">
                                                    <CheckCircle2 size={20} className="fill-brand-blue text-white" />
                                                </div>
                                            )}
                                            <div className="w-full h-full relative group">
                                                <img
                                                    src={asset.content}
                                                    alt={asset.name}
                                                    className="w-full h-full object-contain mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity"
                                                />
                                            </div>
                                            <div className="absolute inset-x-0 bottom-0 bg-white/90 backdrop-blur-md p-4 translate-y-full group-hover:translate-y-0 transition-transform flex items-center justify-between">
                                                <div className="truncate flex-1 pr-4">
                                                    <p className="text-[10px] font-black text-slate-800 truncate leading-none mb-1">{asset.name}</p>
                                                    <p className="text-[8px] font-bold text-slate-400">{new Date(asset.created_at).toLocaleDateString('tr-TR')}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleDelete(asset.id)}
                                                    className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
