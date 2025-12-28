"use client";

import { useState, useEffect } from "react";
import {
    Layout,
    Upload,
    FileText,
    Users,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    ChevronLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const CertificatePreview = dynamic(() => import("@/components/CertificatePreview"), { ssr: false });

export default function IssueCertificatePage() {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [designs, setDesigns] = useState<any[]>([]);
    const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
    const [recipients, setRecipients] = useState<{ name: string, email?: string }[]>([]);
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [manualEntry, setManualEntry] = useState("");
    const [groupName, setGroupName] = useState("");
    const [programName, setProgramName] = useState(""); // New state for program name
    const [issuing, setIssuing] = useState(false);

    // Recipient Management States
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");

    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            // Fetch templates AND user designs
            Promise.all([
                fetch(`/api/designs?userId=${user.id}`).then(res => res.json())
            ]).then(([allDesigns]) => {
                setDesigns(allDesigns);
            });
        }
    }, []);

    const [validationError, setValidationError] = useState<string | null>(null);

    const downloadExampleCSV = () => {
        const csvContent = "Ad Soyad,E-Posta\nAhmet Yılmaz,ahmet@example.com\nAyşe Demir,ayse@example.com";
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'ornek_liste.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setValidationError(null);
        if (file) {
            setCsvFile(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                const lines = text.split('\n');
                const parsed: { name: string, email?: string }[] = [];
                let hasError = false;

                // Simple header check (optional, but good for UX)
                // We assume first line might be header, but we'll try to detect data

                lines.forEach((line, index) => {
                    const trimmedLine = line.trim();
                    if (!trimmedLine) return;

                    // Skip potential header row if it contains "email" or "post"
                    if (index === 0 && (trimmedLine.toLowerCase().includes('email') || trimmedLine.toLowerCase().includes('post'))) {
                        return;
                    }

                    const parts = trimmedLine.split(',');
                    // We expect at least "Name, Email"
                    // If split by comma gives < 2 parts, it might be just name? User requirement says Email is mandatory.
                    if (parts.length < 2) {
                        hasError = true;
                        return;
                    }

                    const name = parts[0]?.trim();
                    const email = parts[1]?.trim();

                    if (name && email && email.includes('@')) {
                        parsed.push({ name, email });
                    } else {
                        hasError = true;
                    }
                });

                if (hasError && parsed.length === 0) {
                    setValidationError("Yüklenen dosyada geçerli kayıt bulunamadı. Lütfen 'Ad Soyad, E-Posta' formatına dikkat edin.");
                    setRecipients([]);
                } else if (hasError) {
                    setValidationError("Bazı satırlar hatalı olduğu için atlandı. Lütfen formatı kontrol edin.");
                    setRecipients(parsed);
                } else {
                    setRecipients(parsed);
                }
            };
            reader.readAsText(file);
        }
    };

    const bulkAddRecipients = () => {
        setValidationError(null);
        if (!manualEntry.trim()) return;

        const lines = manualEntry.split('\n');
        const parsed: { name: string, email?: string }[] = [];
        let hasError = false;

        lines.forEach(line => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return;

            const parts = trimmedLine.split(',');
            if (parts.length < 2) {
                hasError = true;
                return;
            }

            const name = parts[0]?.trim();
            const email = parts[1]?.trim();

            if (name && email && email.includes('@')) {
                parsed.push({ name, email });
            } else {
                hasError = true;
            }
        });

        if (parsed.length > 0) {
            setRecipients(prev => [...prev, ...parsed]);
            setManualEntry("");
        }

        if (hasError) {
            setValidationError("Bazı satırlar hatalı formatta (Ad Soyad, E-Posta) olduğu için eklenmedi.");
        }
    };

    const addRecipient = () => {
        if (!newName.trim() || !newEmail.trim() || !newEmail.includes('@')) {
            setValidationError("Lütfen geçerli bir isim ve e-posta adresi girin.");
            return;
        }
        setRecipients(prev => [...prev, { name: newName.trim(), email: newEmail.trim() }]);
        setNewName("");
        setNewEmail("");
        setValidationError(null);
    };

    const removeRecipient = (index: number) => {
        setRecipients(prev => prev.filter((_, i) => i !== index));
    };

    const startEdit = (index: number) => {
        setEditingIndex(index);
        setEditName(recipients[index].name);
        setEditEmail(recipients[index].email || "");
    };

    const saveEdit = () => {
        if (!editName.trim() || !editEmail.trim() || !editEmail.includes('@')) {
            setValidationError("Lütfen geçerli bir isim ve e-posta adresi girin.");
            return;
        }
        const updated = [...recipients];
        updated[editingIndex!] = { name: editName.trim(), email: editEmail.trim() };
        setRecipients(updated);
        setEditingIndex(null);
        setValidationError(null);
    };

    const handleIssue = async () => {
        if (!selectedDesign || recipients.length === 0) return;

        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;
        const user = JSON.parse(storedUser);

        const design = designs.find(d => d.id === selectedDesign);
        if (!design) return;

        setIssuing(true);
        try {
            // Import fabric for image generation
            const { fabric } = await import("fabric");

            // Batch create certificates
            const json = typeof design.design_json === 'string'
                ? JSON.parse(design.design_json)
                : design.design_json;

            // Determine dimensions
            const width = json.width || (design.orientation === 'portrait' ? 595 : 842);
            const height = json.height || (design.orientation === 'portrait' ? 842 : 595);

            // Sequential or parallel? parallel is fine if we check first, but the backend checks each.
            // For a better UX, we'll try to issue and if any fail with 403, we stop.
            for (const recipient of recipients) {
                const certId = `CRT-${Math.floor(Math.random() * 899999) + 100000}`;
                const issueDate = new Date().toISOString().split('T')[0];
                const progName = programName || design.name;

                const canvas = new fabric.StaticCanvas(null, { width: 10000, height: 10000 });

                let certJsonStr = JSON.stringify(json);
                certJsonStr = certJsonStr
                    .replace(/{{name}}/g, recipient.name || "Katılımcı İsmi")
                    .replace(/{{date}}/g, new Date().toLocaleDateString('tr-TR'))
                    .replace(/{{program}}/g, progName)
                    .replace(/{{id}}/g, certId);

                const certJson = JSON.parse(certJsonStr);

                await new Promise<void>((resolve) => {
                    canvas.loadFromJSON(certJson, () => {
                        canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
                        canvas.setBackgroundColor('white', () => { });
                        canvas.renderAll();
                        resolve();
                    });
                });

                let workspace = canvas.getObjects().find(obj => obj.name === "clip");
                if (!workspace) {
                    workspace = canvas.getObjects().find(obj => obj.type === 'rect' && (obj.getScaledWidth() > 400));
                }

                const exportOptions: any = {
                    format: 'jpeg',
                    quality: 1,
                    multiplier: 3
                };

                if (workspace) {
                    exportOptions.left = workspace.left;
                    exportOptions.top = workspace.top;
                    exportOptions.width = workspace.getScaledWidth();
                    exportOptions.height = workspace.getScaledHeight();
                }

                const previewImage = canvas.toDataURL(exportOptions);
                canvas.dispose();

                const certData = {
                    id: certId,
                    user_id: user.id,
                    recipient_name: recipient.name,
                    recipient_email: recipient.email,
                    program_name: progName,
                    issue_date: issueDate,
                    design_json: design.design_json,
                    orientation: design.orientation,
                    group_name: groupName || null,
                    preview_image: previewImage
                };

                const res = await fetch("/api/certificates", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(certData)
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    if (res.status === 403) {
                        alert(`Limit Hatası: ${errorData.error}\nİşlem durduruldu.`);
                        setIssuing(false);
                        return; // Stop processing rest
                    }
                    throw new Error(errorData.error || "Sertifika oluşturulamadı.");
                }
            }

            router.push("/dashboard/user/certificates");
        } catch (error) {
            console.error("Issuing error:", error);
            alert("Sertifika oluşturulurken hata oluştu.");
        } finally {
            setIssuing(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors font-bold text-sm">
                    <ChevronLeft size={16} />
                    Geri Dön
                </button>
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Yeni Katılım Sertifikası Ekle</h1>
                <p className="text-slate-500 font-medium mt-2">Adım adım toplu sertifika oluşturun.</p>
            </div>

            {/* Steps Indicator */}
            <div className="flex items-center gap-4">
                <div className={cn("flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest", step >= 1 ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-400")}>
                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">1</span>
                    Tasarım Seç
                </div>
                <div className="w-8 h-0.5 bg-slate-100" />
                <div className={cn("flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest", step >= 2 ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-400")}>
                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">2</span>
                    Katılımcı Listesi
                </div>
                <div className="w-8 h-0.5 bg-slate-100" />
                <div className={cn("flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest", step >= 3 ? "bg-brand-blue text-white" : "bg-slate-100 text-slate-400")}>
                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">3</span>
                    Onayla
                </div>
            </div>

            {/* Step 1: Design Selection & Group Name */}
            {step === 1 && (
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-soft">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">1. Etkinlik Detayları</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-2">Etkinlik veya Grup İsmi</label>
                                <input
                                    type="text"
                                    placeholder="Örn: React Bootcamp 2024"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    className="w-full p-4 bg-surface-gray border border-slate-100 rounded-2xl font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-2">Program Başlığı (Sertifikada Görünecek)</label>
                                <input
                                    type="text"
                                    placeholder="Örn: İleri Seviye Frontend Eğitimi"
                                    value={programName}
                                    onChange={(e) => setProgramName(e.target.value)}
                                    className="w-full p-4 bg-surface-gray border border-slate-100 rounded-2xl font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue transition-all"
                                />
                                <p className="text-xs text-slate-400 mt-2 ml-1">
                                    * Bu alan boş bırakılırsa tasarım ismi kullanılır. Sertifika doğrulama sayfasında "Program" alanında görünür.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-soft">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">2. Bir Tasarım Seçin</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {designs.map(design => (
                                <div
                                    key={design.id}
                                    onClick={() => setSelectedDesign(design.id)}
                                    className={cn(
                                        "cursor-pointer group relative aspect-[1.4/1] bg-slate-50 rounded-2xl border-2 transition-all overflow-hidden flex flex-col items-center justify-center",
                                        selectedDesign === design.id ? "border-brand-blue ring-4 ring-brand-blue/10" : "border-transparent hover:border-slate-200"
                                    )}
                                >
                                    <div className="absolute inset-0 w-full h-full pointer-events-none">
                                        {design.design_json ? (
                                            <div className="w-full h-full transform scale-100 origin-center opacity-80 group-hover:opacity-100 transition-opacity">
                                                <CertificatePreview
                                                    designJson={typeof design.design_json === 'string' ? design.design_json : JSON.stringify(design.design_json)}
                                                    orientation={design.orientation || 'landscape'}
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-slate-300">
                                                <Layout size={32} className="mb-2" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-2 text-center border-t border-slate-100 z-10">
                                        <span className={cn("text-xs font-bold transition-colors truncate block w-full", selectedDesign === design.id ? "text-brand-blue" : "text-slate-600")}>
                                            {design.name}
                                        </span>
                                    </div>

                                    {selectedDesign === design.id && (
                                        <div className="absolute top-2 right-2 text-brand-blue z-20 bg-white rounded-full p-0.5 shadow-sm">
                                            <CheckCircle2 size={20} className="fill-brand-blue text-white" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Step 2: Recipients */}
            {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-soft space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Single Add & CSV */}
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                        <Users size={18} className="text-brand-blue" />
                                        Katılımcı Ekle
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            placeholder="Ad Soyad"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-brand-blue/10 outline-none"
                                        />
                                        <input
                                            type="email"
                                            placeholder="E-Posta"
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-brand-blue/10 outline-none"
                                        />
                                    </div>
                                    <button
                                        onClick={addRecipient}
                                        className="w-full py-3 bg-brand-blue text-white rounded-xl font-bold text-sm hover:bg-slate-900 transition-all shadow-lg shadow-brand-blue/10"
                                    >
                                        Listeye Ekle
                                    </button>
                                </div>

                                <div className="pt-6 border-t border-slate-50 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                            <Upload size={18} className="text-brand-blue" />
                                            Toplu Yükleme (CSV)
                                        </h3>
                                        <button
                                            onClick={downloadExampleCSV}
                                            className="text-[10px] text-brand-blue font-black hover:underline flex items-center gap-1 uppercase tracking-tighter"
                                        >
                                            <FileText size={12} />
                                            Örnek İndir
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept=".csv,.txt"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            id="csv-upload"
                                        />
                                        <label
                                            htmlFor="csv-upload"
                                            className="flex items-center justify-center w-full p-4 border-2 border-dashed border-slate-100 rounded-2xl hover:bg-slate-50 cursor-pointer transition-all gap-3 bg-slate-50/50"
                                        >
                                            <Upload size={20} className="text-slate-400" />
                                            <span className="text-xs font-bold text-slate-500">
                                                {csvFile ? csvFile.name : "CSV veya Text dosyası yükle"}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Bulk Entry Textarea */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <FileText size={18} className="text-brand-blue" />
                                    Hızlı Yapıştır (Bulk)
                                </h3>
                                <textarea
                                    value={manualEntry}
                                    onChange={(e) => setManualEntry(e.target.value)}
                                    placeholder="Ahmet Yılmaz, ahmet@mail.com&#10;Ayşe Demir, ayse@mail.com"
                                    className="w-full h-[180px] p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-brand-blue/10 outline-none resize-none leading-relaxed"
                                />
                                <button
                                    onClick={bulkAddRecipients}
                                    className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
                                >
                                    Yukarıdaki Listeyi Çözümle ve Ekle
                                </button>
                            </div>
                        </div>

                        {validationError && (
                            <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="text-red-600" size={20} />
                                <span className="text-sm font-bold text-red-700">{validationError}</span>
                            </div>
                        )}
                    </div>

                    {/* Recipient List Table */}
                    {recipients.length > 0 && (
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-soft overflow-hidden">
                            <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <Users size={18} className="text-brand-blue" />
                                    Katılımcı Listesi ({recipients.length})
                                </h3>
                                <button
                                    onClick={() => setRecipients([])}
                                    className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
                                >
                                    Tümünü Temizle
                                </button>
                            </div>
                            <div className="max-h-[400px] overflow-y-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="sticky top-0 bg-white/80 backdrop-blur-md z-10">
                                        <tr>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">No</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Ad Soyad</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">E-Posta</th>
                                            <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {recipients.map((rec, idx) => (
                                            <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 text-xs font-bold text-slate-400">#{idx + 1}</td>
                                                <td className="px-6 py-4">
                                                    {editingIndex === idx ? (
                                                        <input
                                                            type="text"
                                                            value={editName}
                                                            onChange={(e) => setEditName(e.target.value)}
                                                            className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold focus:ring-2 focus:ring-brand-blue/10 outline-none"
                                                        />
                                                    ) : (
                                                        <span className="text-sm font-bold text-slate-700">{rec.name}</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {editingIndex === idx ? (
                                                        <input
                                                            type="email"
                                                            value={editEmail}
                                                            onChange={(e) => setEditEmail(e.target.value)}
                                                            className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold focus:ring-2 focus:ring-brand-blue/10 outline-none"
                                                        />
                                                    ) : (
                                                        <span className="text-sm font-medium text-slate-500">{rec.email}</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {editingIndex === idx ? (
                                                            <>
                                                                <button onClick={saveEdit} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                                                    <CheckCircle2 size={16} />
                                                                </button>
                                                                <button onClick={() => setEditingIndex(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
                                                                    <ChevronLeft size={16} />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button onClick={() => startEdit(idx)} className="p-2 text-brand-blue hover:bg-brand-blue/5 rounded-lg transition-colors">
                                                                    <FileText size={16} />
                                                                </button>
                                                                <button onClick={() => removeRecipient(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                                    <AlertCircle size={16} />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-soft text-center py-16">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-blue animate-pulse">
                        <FileText size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 mb-2">Sertifikalar Oluşturulmaya Hazır</h2>
                    <p className="text-slate-500 font-medium max-w-md mx-auto">
                        "{designs.find(d => d.id === selectedDesign)?.name}" tasarımı kullanılarak<br />
                        <strong className="text-slate-800">{recipients.length} katılımcı</strong> için sertifika oluşturulacak.
                    </p>
                </div>
            )}

            {/* Navigation Actions */}
            <div className="flex justify-between pt-4">
                {step > 1 && (
                    <button
                        onClick={() => setStep(prev => prev - 1 as any)}
                        className="px-8 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                    >
                        Geri
                    </button>
                )}
                <div className="flex-1" />
                {step < 3 ? (
                    <button
                        onClick={() => {
                            if (step === 1 && selectedDesign) setStep(2);
                            if (step === 2 && recipients.length > 0) setStep(3);
                        }}
                        disabled={(step === 1 && !selectedDesign) || (step === 2 && recipients.length === 0)}
                        className="px-10 py-4 bg-brand-blue text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-900 transition-all shadow-xl shadow-brand-blue/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                    >
                        Devam Et
                        <ArrowRight size={16} />
                    </button>
                ) : (
                    <button
                        onClick={handleIssue}
                        disabled={issuing}
                        className="px-12 py-4 bg-green-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-green-600 transition-all shadow-xl shadow-green-500/20 disabled:opacity-50 flex items-center gap-3"
                    >
                        {issuing ? "Oluşturuluyor..." : "Sertifikaları Oluştur ve Bitir"}
                        <CheckCircle2 size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}
