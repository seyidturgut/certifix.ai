"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Award, Calendar, User, Search, Loader2, ShieldCheck, Lock, Download, Linkedin, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const LOADING_STEPS = [
    { message: "Doğrulama süreci başlatılıyor...", icon: Search },
    { message: "Sertifika numarası ve bütünlüğü kontrol ediliyor...", icon: Lock },
    { message: "İmza ve geçerlilik tarihi sorgulanıyor...", icon: ShieldCheck },
    { message: "Doğrulama tamamlandı!", icon: CheckCircle2 },
];

export default function VerifyPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const shareToken = searchParams.get('s');
    const [loadingStep, setLoadingStep] = useState(0);
    const [verificationComplete, setVerificationComplete] = useState(false);
    const [apiError, setApiError] = useState("");
    const [fetchedData, setFetchedData] = useState<any>(null);

    // Fetch data immediately but in background
    useEffect(() => {
        if (params.id) {
            const url = `http://localhost:5001/api/certificates/${params.id}${shareToken ? `?s=${shareToken}` : ''}`;
            fetch(url)
                .then(res => {
                    if (!res.ok) throw new Error("Sertifika bulunamadı");
                    return res.json();
                })
                .then(data => {
                    setFetchedData(data);
                })
                .catch(err => {
                    setApiError(err.message);
                });
        }
    }, [params.id]);

    // Handle staged animation
    useEffect(() => {
        if (loadingStep < LOADING_STEPS.length - 1) {
            const timeout = setTimeout(() => {
                setLoadingStep(prev => prev + 1);
            }, 800); // 800ms per step
            return () => clearTimeout(timeout);
        } else {
            // Animation finished, check if we have data
            if (fetchedData || apiError) {
                // Add a small delay for the final "Completed" message before showing result
                const timeout = setTimeout(() => {
                    setVerificationComplete(true);
                }, 1000);
                return () => clearTimeout(timeout);
            } else {
                // If animation finished but data is still loading, wait
                const checkData = setInterval(() => {
                    if (fetchedData || apiError) {
                        setVerificationComplete(true);
                        clearInterval(checkData);
                    }
                }, 500);
                return () => clearInterval(checkData);
            }
        }
    }, [loadingStep, fetchedData, apiError]);

    // Render Loading Screen
    if (!verificationComplete) {
        const CurrentIcon = LOADING_STEPS[loadingStep].icon;

        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-brand-blue/5 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                        {/* Spinning border */}
                        <div className="absolute inset-0 rounded-full border-4 border-brand-blue/20 border-t-brand-blue animate-spin"></div>
                        <CurrentIcon className="w-8 h-8 text-brand-blue animate-pulse" />
                    </div>

                    <h2 className="text-xl font-black text-slate-800 mb-2">
                        {LOADING_STEPS[loadingStep].message}
                    </h2>

                    {/* Progress indicators */}
                    <div className="flex justify-center gap-2 mt-6">
                        {LOADING_STEPS.map((_, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "w-3 h-3 rounded-full transition-all duration-300",
                                    index === loadingStep ? "bg-brand-blue scale-125" :
                                        index < loadingStep ? "bg-brand-blue/40" : "bg-slate-200"
                                )}
                            />
                        ))}
                    </div>

                    <p className="text-xs text-slate-400 mt-8 font-medium">Bu işlem güvenli bağlantı üzerinden yapılmaktadır.</p>
                </div>
            </div>
        );
    }

    // Render Error / Not Found
    if (apiError || !fetchedData) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-md w-full text-center animate-in shake">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-800 mb-2">Doğrulama Başarısız</h1>
                    <p className="text-slate-500 font-medium mb-6">
                        Sertifika bulunamadı veya geçersiz. Lütfen sertifika numarasını kontrol ediniz.
                    </p>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono text-sm text-slate-400 font-bold break-all">
                        {params.id}
                    </div>
                    <div className="mt-8">
                        <Link href="/" className="text-brand-blue font-bold hover:underline">
                            Ana Sayfaya Dön
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const certificate = fetchedData;
    const isValid = certificate.status === "valid";

    // Download handling
    const handleDownload = async () => {
        if (!certificate || !certificate.design_json) return;

        try {
            // Lazy load fabric to avoid huge bundle
            const jsPDF = (await import("jspdf")).default;

            // USE PRE-GENERATED IMAGE IF AVAILABLE (Server-Side Logic)
            if (certificate.preview_image) {
                const pdf = new jsPDF({
                    orientation: certificate.orientation === 'portrait' ? 'p' : 'l',
                    unit: 'pt',
                    format: 'a4'
                });

                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();

                pdf.addImage(certificate.preview_image, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`${certificate.recipient_name}-${certificate.id}.pdf`);
                return;
            }

            const { fabric } = await import("fabric");

            const json = typeof certificate.design_json === 'string'
                ? JSON.parse(certificate.design_json)
                : certificate.design_json;

            // Determine dimensions - default A4 landscape/portrait
            // A4 @ 72 DPI: 842x595 (Landscape), 595x842 (Portrait)
            // But we want higher res for print - use multiplier
            const multiplier = 2; // 2x resolution
            const width = (certificate.orientation === 'portrait' ? 595 : 842) * multiplier;
            const height = (certificate.orientation === 'portrait' ? 842 : 595) * multiplier;

            const canvas = new fabric.StaticCanvas(null, { width, height });

            // Scale objects manually if needed, or rely on original coordinate system
            // Assuming design was saved at 1x scale. We might need to scale context.
            // Simplified: Just render at standard A4 size first, let jspdf handle sizing.

            // Standard A4 sizes
            const stdWidth = certificate.orientation === 'portrait' ? 595 : 842;
            const stdHeight = certificate.orientation === 'portrait' ? 842 : 595;

            canvas.setWidth(stdWidth);
            canvas.setHeight(stdHeight);

            // Variable substitution logic
            if (json.objects) {
                json.objects.forEach((obj: any) => {
                    if (obj.type === 'i-text' || obj.type === 'text') {
                        if (obj.text) {
                            obj.text = obj.text
                                .replace(/{{name}}/g, certificate.recipient_name || "Katılımcı İsmi")
                                .replace(/{{date}}/g, certificate.issue_date ? new Date(certificate.issue_date).toLocaleDateString('tr-TR') : new Date().toLocaleDateString('tr-TR'))
                                .replace(/{{program}}/g, certificate.program_name || certificate.group_name || "Program Adı")
                                .replace(/{{id}}/g, certificate.id || "SERTIFIKA-NO-001");
                        }
                    }
                });
            }

            canvas.loadFromJSON(json, () => {
                // Ensure no viewport transform is messing us up
                canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
                canvas.setBackgroundColor('white', () => { });

                // Auto-scale content to fit standard A4
                const objects = canvas.getObjects();
                if (objects.length > 0) {
                    // Calculate bounds of all objects
                    const group = new fabric.Group(objects);
                    const groupWidth = group.width || stdWidth;
                    const groupHeight = group.height || stdHeight;

                    const scaleX = stdWidth / groupWidth;
                    const scaleY = stdHeight / groupHeight;
                    // Use the smaller scale to fit entirely, or if close enough, assume match
                    const scale = Math.min(scaleX, scaleY);

                    // If scale is significantly different, verify centers
                    // Actually, let's just create the group, center it, and ungroup
                    // But first we must remove objects from canvas to add to group? 
                    // Fabric's group constructor takes existing objects but doesn't remove them automatically from canvas if passed directly?
                    // Safer way:

                    // Destructive auto-fit:
                    canvas.clear();
                    group.scale(scale);
                    group.setPositionByOrigin(new fabric.Point(stdWidth / 2, stdHeight / 2), 'center', 'center');
                    canvas.add(group);

                    // We can ungroup if needed, but for rendering static image, group is fine
                }

                canvas.renderAll();
                const dataUrl = canvas.toDataURL({ format: 'png', multiplier: 2 }); // High res png

                const pdf = new jsPDF({
                    orientation: certificate.orientation === 'portrait' ? 'p' : 'l',
                    unit: 'pt',
                    format: 'a4'
                });

                pdf.addImage(dataUrl, 'PNG', 0, 0, stdWidth, stdHeight);
                pdf.save(`${certificate.recipient_name}-${certificate.id}.pdf`);
            });

        } catch (error) {
            console.error("PDF generation failed:", error);
            alert("Sertifika indirilirken bir hata oluştu.");
        }
    };

    const handleLinkedIn = () => {
        if (!certificate) return;

        const issueDate = new Date(certificate.issue_date);
        const startTask = "CERTIFICATION_NAME";
        const name = certificate.program_name || certificate.group_name || "Sertifika Programı";
        const organizationName = certificate.company_name || "Certifix";
        const issueYear = issueDate.getFullYear();
        const issueMonth = issueDate.getMonth() + 1;
        const certUrl = window.location.href;
        const certId = certificate.id;

        const url = `https://www.linkedin.com/profile/add?startTask=${startTask}&name=${encodeURIComponent(name)}&organizationName=${encodeURIComponent(organizationName)}&issueYear=${issueYear}&issueMonth=${issueMonth}&certUrl=${encodeURIComponent(certUrl)}&certId=${encodeURIComponent(certId)}`;

        window.open(url, '_blank');
    };

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-4 relative overflow-hidden animate-in fade-in duration-700 pb-20">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-blue/5 to-transparent -z-10" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-neon/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl -z-10" />

            <div className="w-full max-w-lg space-y-6">
                {/* Main Verification Card */}
                <div className="bg-white rounded-[2rem] shadow-2xl shadow-brand-blue/10 border border-slate-100 overflow-hidden relative">

                    {/* Status Banner */}
                    <div className={cn(
                        "w-full py-6 flex flex-col items-center justify-center gap-3",
                        isValid ? "bg-emerald-50/50" : "bg-red-50/50"
                    )}>
                        {/* Issuer Logo or Default */}
                        {certificate.brand_logo ? (
                            <div className="mb-2">
                                <img
                                    src={certificate.brand_logo}
                                    alt="Issuer Logo"
                                    className="h-16 object-contain"
                                />
                            </div>
                        ) : (
                            <div className="h-4"></div>
                        )}

                        <div className={cn(
                            "w-16 h-16 rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 duration-300",
                            isValid ? "bg-emerald-500 text-white shadow-emerald-200" : "bg-red-500 text-white shadow-red-200"
                        )}>
                            {isValid ? <CheckCircle2 size={32} strokeWidth={3} /> : <XCircle size={32} strokeWidth={3} />}
                        </div>

                        <div className="text-center">
                            <h2 className={cn("text-2xl font-black", isValid ? "text-slate-800" : "text-red-600")}>
                                {isValid ? "Geçerli Sertifika" : "Geçersiz Sertifika"}
                            </h2>
                            <p className="text-xs font-bold tracking-widest text-slate-400 uppercase mt-1">
                                {isValid ? "DOĞRULANDI" : "HATA / İPTAL"}
                            </p>
                        </div>
                    </div>

                    {/* Certificate Details */}
                    <div className="p-8 space-y-8">

                        {/* Recipient - Hero Section */}
                        <div className="text-center space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                <User size={14} />
                                Sertifika Sahibi
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 leading-tight break-words">
                                {certificate.recipient_name}
                            </h1>
                            {certificate.recipient_email && (
                                <p className="text-slate-400 font-medium text-sm">{certificate.recipient_email}</p>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-slate-100 w-full" />

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 rounded-2xl p-4 space-y-1 hover:bg-slate-100 transition-colors">
                                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                                    <Award size={14} />
                                    Program
                                </div>
                                <p className="font-bold text-slate-800 leading-snug text-sm">
                                    {certificate.program_name || certificate.group_name || "Program Belirtilmemiş"}
                                </p>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-4 space-y-1 hover:bg-slate-100 transition-colors">
                                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                                    <Calendar size={14} />
                                    Veriliş Tarihi
                                </div>
                                <p className="font-bold text-slate-800 leading-snug">
                                    {certificate.issue_date
                                        ? new Date(certificate.issue_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
                                        : "Tarih Belirtilmemiş"}
                                </p>
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="text-center pt-4">
                            {certificate.company_name && (
                                <p className="text-sm font-medium text-slate-500">
                                    Bu sertifika <span className="font-bold text-slate-700">{certificate.company_name}</span> tarafından verilmiştir.
                                </p>
                            )}
                            <p className="text-xs text-slate-400 mt-2 font-mono">
                                ID: {certificate.id}
                            </p>
                        </div>

                    </div>
                </div>

                {/* Actions Grid */}
                {isValid && certificate.access_level === 'owner' && (
                    <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-bottom-4 duration-500 delay-300">
                        <button
                            onClick={handleDownload}
                            className="col-span-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-blue text-white rounded-2xl font-bold shadow-lg shadow-brand-blue/20 hover:scale-[1.02] active:scale-95 transition-all text-sm"
                        >
                            <Download size={18} />
                            PDF İndir
                        </button>

                        {(certificate.package_id === 'profesyonel' || certificate.package_id === 'kurumsal') && (
                            <button
                                onClick={handleLinkedIn}
                                className="col-span-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0077b5] text-white rounded-2xl font-bold shadow-lg shadow-[#0077b5]/20 hover:scale-[1.02] active:scale-95 transition-all text-sm"
                            >
                                <Linkedin size={18} />
                                LinkedIn'e Ekle
                            </button>
                        )}

                        <button
                            disabled
                            className="col-span-2 flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 text-slate-400 rounded-2xl font-bold border border-slate-200 cursor-not-allowed text-sm group relative overflow-hidden"
                        >
                            <Printer size={18} />
                            Baskı Siparişi Ver
                            <div className="absolute top-2 right-2 bg-slate-200 text-slate-500 text-[9px] font-black uppercase px-2 py-0.5 rounded">Yakında</div>
                        </button>
                    </div>
                )}

                {/* Footer Branding */}
                <div className="mt-8 text-center space-y-2 opacity-50 hover:opacity-100 transition-opacity cursor-default">
                    <div className="flex items-center justify-center gap-2 text-slate-400 font-semibold">
                        <Search size={16} />
                        <span>Sertifika Doğrulama Sistemi</span>
                    </div>
                    <Link href="/" className="text-sm text-slate-300 font-medium hover:text-brand-blue transition-colors">
                        Powered by Certifix.ai
                    </Link>
                </div>
            </div>
        </div>
    );
}
