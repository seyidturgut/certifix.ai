"use client";

import { useState, useEffect } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import dynamic from "next/dynamic";

const CertificatePreview = dynamic(() => import("@/components/CertificatePreview"), { ssr: false });

interface EditCertificateModalProps {
    certificate: any;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedCert: any) => Promise<void>;
}

export default function EditCertificateModal({ certificate, isOpen, onClose, onSave }: EditCertificateModalProps) {
    const [formData, setFormData] = useState({
        recipient_name: "",
        recipient_email: "",
        program_name: "",
        issue_date: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (certificate) {
            setFormData({
                recipient_name: certificate.recipient_name,
                recipient_email: certificate.recipient_email || "",
                program_name: certificate.program_name || "",
                issue_date: certificate.issue_date ? certificate.issue_date.split('T')[0] : ""
            });
        }
    }, [certificate]);

    if (!isOpen || !certificate) return null;

    const handleSave = async () => {
        try {
            setLoading(true);
            await onSave({ ...certificate, ...formData });
            onClose();
        } catch (error) {
            console.error("Save error:", error);
            alert("Kaydedilirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Sertifika Düzenle</h2>
                        <p className="text-sm text-slate-500 font-medium">Katılımcı bilgilerini güncelleyin.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Form Section */}
                    <div className="w-1/3 p-6 border-r border-slate-100 bg-slate-50/50 overflow-y-auto">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Katılımcı Adı</label>
                                <input
                                    type="text"
                                    value={formData.recipient_name}
                                    onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue font-bold text-slate-700"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">E-Posta Adresi</label>
                                <input
                                    type="email"
                                    value={formData.recipient_email}
                                    onChange={(e) => setFormData({ ...formData, recipient_email: e.target.value })}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue font-medium text-slate-700"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Program / Etkinlik</label>
                                <input
                                    type="text"
                                    value={formData.program_name}
                                    onChange={(e) => setFormData({ ...formData, program_name: e.target.value })}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue font-medium text-slate-700"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Düzenlenme Tarihi</label>
                                <input
                                    type="date"
                                    value={formData.issue_date}
                                    onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue font-medium text-slate-700"
                                />
                            </div>

                            <div className="bg-blue-50 p-4 rounded-xl flex gap-3 text-brand-blue text-xs font-medium leading-relaxed">
                                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                <p>Burada yaptığınız değişiklikler sağ taraftaki önizlemede anında güncellenir. "Kaydet" butonuna bastığınızda kalıcı olarak uygulanır.</p>
                            </div>
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="flex-1 bg-slate-100 flex items-center justify-center p-8 relative overflow-hidden">
                        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-[600px] aspect-[1.414/1] relative">
                            {certificate?.design_json && (
                                <CertificatePreview
                                    designJson={certificate.design_json}
                                    orientation={certificate.orientation || 'landscape'}
                                    data={{
                                        recipientName: formData.recipient_name,
                                        issueDate: new Date(formData.issue_date).toLocaleDateString('tr-TR'),
                                        programName: formData.program_name,
                                        certificateId: certificate.id
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-white">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                    >
                        İptal
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-8 py-2.5 bg-brand-blue text-white rounded-xl font-bold shadow-lg shadow-brand-blue/20 hover:scale-[1.02] transition-transform flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <Save size={18} />
                        {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                    </button>
                </div>
            </div>
        </div>
    );
}
