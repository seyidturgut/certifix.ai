import { useState, useEffect } from "react";
import { X, Search, Square, Circle, Triangle, Type, ImageIcon, Palette, LayoutGrid } from "lucide-react";
import { Editor } from "../types/editor";

interface SidebarPanelProps {
    activeTab: string;
    onClose: () => void;
    editor: Editor | undefined;
}

export default function SidebarPanel({ activeTab, onClose, editor }: SidebarPanelProps) {
    const [designs, setDesigns] = useState<any[]>([]);
    const [assets, setAssets] = useState<any[]>([]);

    useEffect(() => {
        if (activeTab === "design") {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const user = JSON.parse(storedUser);
                fetch(`/api/designs?userId=${user.id}`)
                    .then(res => res.json())
                    .then(data => setDesigns(data))
                    .catch(err => console.error("Designs fetch error:", err));
            }
        }

        if (activeTab === "shapes" || activeTab === "images") {
            const type = activeTab === "shapes" ? "element" : "image";
            fetch(`/api/assets?type=${type}`)
                .then(res => res.json())
                .then(data => setAssets(data))
                .catch(err => console.error("Assets fetch error:", err));
        }
    }, [activeTab]);

    if (!activeTab) return null;

    const renderContent = () => {
        switch (activeTab) {
            case "design":
                const templates = designs.filter(d => d.is_template);
                const userDesigns = designs.filter(d => !d.is_template);

                return (
                    <div className="space-y-6">
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            <button className="flex-1 bg-white text-xs font-bold py-2 rounded-md shadow-sm">Tasarımlar</button>
                            <button className="flex-1 text-xs font-bold py-2 text-gray-500">Stiller</button>
                        </div>

                        {templates.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Hazır Şablonlar</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {templates.map((design) => (
                                        <div
                                            key={design.id}
                                            onClick={() => editor?.loadDesign(JSON.parse(design.design_json))}
                                            className="aspect-[1/1.4] bg-white rounded-lg border border-gray-200 hover:border-[#005DFF] cursor-pointer transition-all overflow-hidden flex flex-col shadow-sm group"
                                        >
                                            <div className="flex-1 bg-gray-50 flex items-center justify-center p-2">
                                                <LayoutGrid size={24} className="text-gray-200 group-hover:text-blue-200 transition-colors" />
                                            </div>
                                            <div className="p-2 border-t border-gray-100">
                                                <p className="text-[10px] font-bold text-gray-600 truncate">{design.name}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {userDesigns.length > 0 && (
                            <div className="space-y-3 pt-2">
                                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Kişisel Tasarımlarım</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {userDesigns.map((design) => (
                                        <div
                                            key={design.id}
                                            onClick={() => editor?.loadDesign(JSON.parse(design.design_json))}
                                            className="aspect-[1/1.4] bg-white rounded-lg border border-gray-200 hover:border-[#005DFF] cursor-pointer transition-all overflow-hidden flex flex-col shadow-sm group"
                                        >
                                            <div className="flex-1 bg-gray-50 flex items-center justify-center p-2">
                                                <LayoutGrid size={24} className="text-gray-200 group-hover:text-blue-200 transition-colors" />
                                            </div>
                                            <div className="p-2 border-t border-gray-100">
                                                <p className="text-[10px] font-bold text-gray-600 truncate">{design.name}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {designs.length === 0 && (
                            <div className="py-12 text-center space-y-2">
                                <p className="text-gray-400 text-xs font-bold">Henüz tasarım bulunamadı.</p>
                                <p className="text-[10px] text-gray-300">Harika bir tasarım yapıp kaydederek başlayın!</p>
                            </div>
                        )}
                    </div>
                );
            case "shapes":
                return (
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-700">Şekiller</h3>
                        <div className="grid grid-cols-3 gap-3">
                            <button onClick={() => editor?.addRect()} className="aspect-square bg-gray-50 rounded-xl flex flex-col items-center justify-center hover:bg-blue-50 hover:text-[#005DFF] border border-gray-100 transition-all gap-2 group">
                                <Square size={24} className="group-active:scale-90 transition-transform" />
                                <span className="text-[10px] font-bold uppercase">Kare</span>
                            </button>
                            <button onClick={() => editor?.addCircle()} className="aspect-square bg-gray-50 rounded-xl flex flex-col items-center justify-center hover:bg-blue-50 hover:text-[#005DFF] border border-gray-100 transition-all gap-2 group">
                                <Circle size={24} className="group-active:scale-90 transition-transform" />
                                <span className="text-[10px] font-bold uppercase">Daire</span>
                            </button>
                            <button onClick={() => editor?.addTriangle()} className="aspect-square bg-gray-50 rounded-xl flex flex-col items-center justify-center hover:bg-blue-50 hover:text-[#005DFF] border border-gray-100 transition-all gap-2 group">
                                <Triangle size={24} className="group-active:scale-90 transition-transform" />
                                <span className="text-[10px] font-bold uppercase">Üçgen</span>
                            </button>
                        </div>
                        <h3 className="text-sm font-bold text-gray-700 mt-6">Sistem Bileşenleri</h3>
                        <div className="grid grid-cols-4 gap-2">
                            {assets.map((asset) => (
                                <div
                                    key={asset.id}
                                    onClick={() => editor?.addImage(asset.content)}
                                    className="aspect-square bg-white border border-gray-100 rounded-lg p-1 hover:border-[#005DFF] cursor-pointer transition-all flex items-center justify-center group"
                                >
                                    <img src={asset.content} className="max-w-full max-h-full object-contain group-active:scale-90 transition-transform" alt={asset.name} />
                                </div>
                            ))}
                            {assets.length === 0 && (
                                <div className="col-span-4 py-4 text-center text-[10px] text-gray-400 font-medium">Henüz sistem bileşeni yok.</div>
                            )}
                        </div>
                    </div>
                );
            case "text":
                return (
                    <div className="space-y-4">
                        <button
                            onClick={() => editor?.addText("Yeni Metin")}
                            className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                        >
                            <Type size={18} />
                            Metin kutusu ekle
                        </button>

                        <div className="pt-4 space-y-3">
                            <button
                                onClick={() => editor?.addText("Bir başlık ekleyin")}
                                className="w-full h-16 bg-white border border-gray-200 rounded-xl text-left px-4 flex items-center hover:border-[#005DFF] hover:bg-blue-50 transition-all"
                            >
                                <span className="text-xl font-black text-gray-800">Başlık</span>
                            </button>
                            <button
                                onClick={() => editor?.addText("Bir alt başlık ekleyin")}
                                className="w-full h-14 bg-white border border-gray-200 rounded-xl text-left px-4 flex items-center hover:border-[#005DFF] hover:bg-blue-50 transition-all"
                            >
                                <span className="text-base font-bold text-gray-600">Alt Başlık</span>
                            </button>
                            <button
                                onClick={() => editor?.addText("Gövde metni ekleyin")}
                                className="w-full h-12 bg-white border border-gray-200 rounded-xl text-left px-4 flex items-center hover:border-[#005DFF] hover:bg-blue-50 transition-all"
                            >
                                <span className="text-xs font-medium text-gray-500">Gövde</span>
                            </button>
                        </div>
                    </div>
                );
            case "signature":
                return (
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-700">Kayıtlı İmzalar</h3>
                        <div
                            onClick={() => {
                                const storedUser = localStorage.getItem("user");
                                if (storedUser) {
                                    const user = JSON.parse(storedUser);
                                    if (user.signature_url) {
                                        editor?.addImage(user.signature_url);
                                    }
                                }
                            }}
                            className="w-full aspect-video bg-white border border-gray-200 rounded-xl flex items-center justify-center cursor-pointer hover:border-[#005DFF] hover:bg-blue-50 transition-all p-4"
                        >
                            {/* Signature preview would go here */}
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">
                                Varsayılan İmza<br />(Tıklayın)
                            </div>
                        </div>
                    </div>
                );
            case "data":
                return (
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-700">Akıllı Alanlar</h3>
                        <p className="text-[10px] text-gray-500 mb-4">Bu alanlar sertifika oluşturulurken otomatik olarak doldurulacaktır.</p>

                        <button
                            onClick={() => editor?.addSmartField("{{name}}")}
                            className="w-full bg-white border border-gray-200 p-4 rounded-xl text-left hover:border-[#005DFF] hover:bg-blue-50 transition-all group"
                        >
                            <span className="block text-xs font-black text-gray-800 group-hover:text-[#005DFF] mb-1">Katılımcı İsmi</span>
                            <span className="text-[10px] text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">{"{{name}}"}</span>
                        </button>

                        <button
                            onClick={() => editor?.addSmartField("{{date}}")}
                            className="w-full bg-white border border-gray-200 p-4 rounded-xl text-left hover:border-[#005DFF] hover:bg-blue-50 transition-all group"
                        >
                            <span className="block text-xs font-black text-gray-800 group-hover:text-[#005DFF] mb-1">Düzenlenme Tarihi</span>
                            <span className="text-[10px] text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">{"{{date}}"}</span>
                        </button>

                        <button
                            onClick={() => editor?.addSmartField("{{program}}")}
                            className="w-full bg-white border border-gray-200 p-4 rounded-xl text-left hover:border-[#005DFF] hover:bg-blue-50 transition-all group"
                        >
                            <span className="block text-xs font-black text-gray-800 group-hover:text-[#005DFF] mb-1">Program/Etkinlik Adı</span>
                            <span className="text-[10px] text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">{"{{program}}"}</span>
                        </button>

                        <button
                            onClick={() => editor?.addSmartField("{{id}}")}
                            className="w-full bg-white border border-gray-200 p-4 rounded-xl text-left hover:border-[#005DFF] hover:bg-blue-50 transition-all group"
                        >
                            <span className="block text-xs font-black text-gray-800 group-hover:text-[#005DFF] mb-1">Sertifika No</span>
                            <span className="text-[10px] text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">{"{{id}}"}</span>
                        </button>
                    </div>
                );
            case "images":
                return (
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-700">Sistem Görselleri</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {assets.map((asset) => (
                                <div
                                    key={asset.id}
                                    className="aspect-square bg-white rounded-lg border border-gray-200 hover:border-[#005DFF] transition-all flex items-center justify-center overflow-hidden group relative"
                                >
                                    <img src={asset.content} className="max-w-full max-h-full object-cover group-active:scale-90 transition-transform" alt={asset.name} />

                                    {/* Actions Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); editor?.addImage(asset.content); }}
                                            className="px-3 py-1.5 bg-white text-xs font-bold rounded-lg hover:bg-blue-50 text-gray-800 w-full"
                                        >
                                            Ekle
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); editor?.setBackgroundImage(asset.content); }}
                                            className="px-3 py-1.5 bg-white text-xs font-bold rounded-lg hover:bg-blue-50 text-gray-800 w-full"
                                        >
                                            Arka Plan
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {assets.length === 0 && (
                            <div className="py-8 text-center text-[10px] text-gray-400 font-medium">Henüz sistem görseli yok.</div>
                        )}
                        <label className="w-full bg-blue-50 text-[#005DFF] border border-blue-100 hover:bg-blue-100 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center cursor-pointer">
                            Kendi Görselini Yükle
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = async () => {
                                            try {
                                                const base64 = reader.result as string;
                                                const storedUser = localStorage.getItem("user");
                                                const userId = storedUser ? JSON.parse(storedUser).id : null;

                                                const res = await fetch("/api/assets", {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({
                                                        type: 'image',
                                                        name: file.name,
                                                        content: base64,
                                                        user_id: userId
                                                    })
                                                });

                                                if (!res.ok) {
                                                    const errorData = await res.json();
                                                    if (res.status === 403) {
                                                        alert(errorData.error || "Paket limitiniz doldu.");
                                                        return;
                                                    }
                                                    throw new Error(errorData.error || "Yükleme hatası");
                                                }

                                                // Refresh assets
                                                const refreshRes = await fetch(`/api/assets?type=image`);
                                                const data = await refreshRes.json();
                                                setAssets(data);
                                            } catch (err) {
                                                console.error("Upload error", err);
                                                alert("Görsel yüklenirken bir hata oluştu.");
                                            }
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                        </label>
                    </div>
                );
            default:
                return null;
        }
    };

    const tabTitles: Record<string, string> = {
        design: "Hazır Tasarımlar",
        shapes: "Bileşenler",
        text: "Metin",
        data: "Akıllı Alanlar",
        signature: "İmza",
        images: "Görseller"
    };

    return (
        <div className="w-[320px] bg-white border-r border-gray-200 flex flex-col z-30 shadow-[4px_0_12px_rgba(0,0,0,0.02)] h-full overflow-hidden shrink-0">
            <div className="p-4 flex items-center justify-between">
                <h2 className="text-base font-black text-gray-800 tracking-tight">{tabTitles[activeTab]}</h2>
                <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-all">
                    <X size={20} />
                </button>
            </div>

            <div className="px-4 pb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="İçerik arayın..."
                        className="w-full bg-gray-100 border-none rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium focus:ring-2 focus:ring-[#005DFF] transition-all outline-none"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-6 custom-scrollbar">
                {renderContent()}
            </div>
        </div>
    );
}
