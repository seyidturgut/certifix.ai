"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const CanvaEditor = dynamic(() => import("./canva/CanvaEditor"), { ssr: false });

export default function Editor() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const loadingDesignId = searchParams.get('loadingDesign');
    const editCertificateId = searchParams.get('editCertificate');
    const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');
    const [initialData, setInitialData] = useState<any>(null);
    const editorRef = useRef<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveModalOpen, setSaveModalOpen] = useState(false);
    const [designName, setDesignName] = useState("");
    const [currentDesignId, setCurrentDesignId] = useState<string | null>(loadingDesignId);
    const [pendingDesignJson, setPendingDesignJson] = useState<string | null>(null);
    const [userPlan, setUserPlan] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            fetch(`/api/users/${user.id}/usage`)
                .then(res => res.json())
                .then(data => setUserPlan(data))
                .catch(err => console.error("Error fetching user plan:", err));
        }
    }, []);

    useEffect(() => {
        if (loadingDesignId) {
            fetch(`/api/designs/${loadingDesignId}`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.design_json) {
                        const json = typeof data.design_json === 'string' ? JSON.parse(data.design_json) : data.design_json;
                        setInitialData(json);
                        if (data.orientation) setOrientation(data.orientation);
                        if (data.name) setDesignName(data.name);
                        setCurrentDesignId(data.id);
                    }
                })
                .catch(err => console.error("Error loading design:", err));
        } else if (editCertificateId) {
            // ... (keep certificate loading logic same)
            fetch(`/api/certificates/${editCertificateId}`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.design_json) {
                        const json = typeof data.design_json === 'string' ? JSON.parse(data.design_json) : data.design_json;
                        setInitialData(json);
                        if (data.orientation) setOrientation(data.orientation);
                        // For certificates, we might not set designName or currentDesignId to treat it as a new template unless we want to overwrite
                    }
                })
                .catch(err => console.error("Error loading certificate:", err));
        }
    }, [loadingDesignId, editCertificateId]);

    const handleSaveRequest = (designJson: string) => {
        setPendingDesignJson(designJson);
        setSaveModalOpen(true);
    };

    const confirmSave = async () => {
        if (!editorRef.current || !editorRef.current.canvas) {
            alert("Editor is not ready.");
            return;
        }

        try {
            setIsSaving(true);
            const storedUser = localStorage.getItem("user");
            if (!storedUser) {
                alert("User not logged in.");
                return;
            }
            const user = JSON.parse(storedUser);

            // 1. Import fabric dynamically
            const { fabric } = await import("fabric");

            // 2. Export current state JSON
            const canvasJson = editorRef.current.canvas.toJSON();

            // 3. Create a HUGE static canvas for precise rendering
            const tempCanvas = new fabric.StaticCanvas(null, { width: 10000, height: 10000 });

            await new Promise<void>((resolve) => {
                tempCanvas.loadFromJSON(canvasJson, () => {
                    tempCanvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
                    tempCanvas.setBackgroundColor('white', () => { });
                    tempCanvas.renderAll();
                    resolve();
                });
            });

            // 4. Find the workspace (clip)
            let workspace = tempCanvas.getObjects().find((obj: any) => obj.name === "clip");

            // Fallback for workspace
            if (!workspace) {
                workspace = tempCanvas.getObjects().find((obj: any) => obj.type === 'rect' && (obj.getScaledWidth() > 400));
            }

            const exportOptions: any = {
                format: 'jpeg' as const,
                quality: 0.8,
                multiplier: 0.5
            };

            if (workspace) {
                exportOptions.left = workspace.left;
                exportOptions.top = workspace.top;
                exportOptions.width = workspace.getScaledWidth();
                exportOptions.height = workspace.getScaledHeight();
            } else {
                console.warn("Thumbnail workspace 'clip' not found, using canvas bounds fallback.");
                exportOptions.width = 1000;
                exportOptions.height = 1000;
            }

            const thumbnail = tempCanvas.toDataURL(exportOptions);

            // Cleanup memory
            tempCanvas.dispose();

            // 5. Inject Footer if required by plan
            const canvas = editorRef.current.canvas;
            if (userPlan?.plan?.features?.footer_required) {
                const workspace = canvas.getObjects().find((obj: any) => obj.name === "clip");
                const footerText = "Bu sertifika certifix.ai ile doğrulanmıştır.";

                // Check if footer already exists
                const existingFooter = canvas.getObjects().find((obj: any) => obj.text === footerText);

                if (!existingFooter && workspace) {
                    const textObj = new fabric.IText(footerText, {
                        left: workspace.left + workspace.getScaledWidth() / 2,
                        top: workspace.top + workspace.getScaledHeight() - 30,
                        fontSize: 12,
                        fontFamily: 'Inter',
                        fill: '#94a3b8',
                        originX: 'center',
                        selectable: false, // Make it non-removable/selectable if possible, or just fixed
                        name: 'mandatory_footer'
                    });
                    canvas.add(textObj);
                    canvas.renderAll();
                }
            }

            const isUpdate = !!currentDesignId;
            const idToSave = currentDesignId || `DSG-${Math.floor(Math.random() * 89999) + 10000}`;

            const designData = {
                id: idToSave,
                user_id: user.id,
                name: designName || `Tasarım - ${new Date().toLocaleDateString('tr-TR')}`,
                design_json: JSON.stringify(canvas.toJSON()), // Use updated canvas JSON (with footer if added)
                is_template: user.role === 'SUPER_ADMIN',
                orientation: orientation,
                thumbnail: thumbnail // Include thumbnail
            };

            const url = isUpdate
                ? `/api/designs/${idToSave}`
                : "/api/designs";

            const method = isUpdate ? "PUT" : "POST";

            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(designData)
            });

            if (!res.ok) {
                const errorData = await res.json();
                if (res.status === 403) {
                    alert(errorData.error || "Paket limitiniz doldu. Lütfen paketinizi yükseltin.");
                    return;
                }
                throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
            }

            const result = await res.json();
            if (!isUpdate) {
                setCurrentDesignId(result.id); // Update currentDesignId if it was a new save
            }

            alert("Tasarım kaydedildi!");
            // Redirect to designs page
            router.push("/dashboard/user/designs");
        } catch (error) {
            console.error("Saving error:", error);
            alert("Kaydedilirken bir hata oluştu.");
        } finally {
            setIsSaving(false);
            setSaveModalOpen(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col overflow-hidden">
            <CanvaEditor
                onReady={(editor) => { editorRef.current = editor; }}
                orientation={orientation}
                initialData={initialData}
                onSave={handleSaveRequest}
                onOrientationChange={setOrientation}
                onBack={() => router.back()}
            />

            {/* Save Modal */}
            {saveModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-black text-slate-800 mb-2">Tasarımı Kaydet</h2>
                        <p className="text-slate-500 font-medium mb-6">Tasarımınız için bir isim belirleyin.</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-2">Tasarım Adı</label>
                                <input
                                    type="text"
                                    value={designName}
                                    onChange={(e) => setDesignName(e.target.value)}
                                    placeholder="Örn: Katılım Sertifikası 2024"
                                    className="w-full p-4 bg-surface-gray border border-slate-100 rounded-2xl font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue transition-all"
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setSaveModalOpen(false)}
                                    disabled={isSaving}
                                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors disabled:opacity-50"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={confirmSave}
                                    disabled={isSaving || !designName.trim()}
                                    className="flex-1 py-4 bg-brand-blue text-white rounded-2xl font-bold hover:bg-slate-900 transition-colors shadow-lg shadow-brand-blue/20 disabled:opacity-50 flex justify-center items-center gap-2"
                                >
                                    {isSaving ? (
                                        <>Kaydediliyor...</>
                                    ) : (
                                        <>{currentDesignId ? 'Güncelle' : 'Kaydet'}</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
