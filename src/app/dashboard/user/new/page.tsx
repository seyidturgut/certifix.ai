import { Suspense } from "react";
import CertificateEditor from "@/components/editor/Editor";
import { Loader2 } from "lucide-react";

export default function CertificateBuilderPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
            </div>
        }>
            <CertificateEditor />
        </Suspense>
    );
}
