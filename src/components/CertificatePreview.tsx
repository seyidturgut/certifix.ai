"use client";

import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";

import { cn } from "@/lib/utils";

interface CertificatePreviewProps {
    designJson: any;
    orientation: 'landscape' | 'portrait';
    data?: {
        recipientName?: string;
        issueDate?: string;
        programName?: string;
        certificateId?: string;
    };
    className?: string; // Class for the OUTER container
    style?: React.CSSProperties;
}

export default function CertificatePreview({ designJson, orientation, data, className, style }: CertificatePreviewProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    // Constants for A4 at 96 DPI (approx) or whatever the Editor uses
    // The previous logic used 842x595 which is A4 @ 72 DPI (Standard Fabric default)
    const ORIGINAL_WIDTH = orientation === 'landscape' ? 842 : 595;
    const ORIGINAL_HEIGHT = orientation === 'landscape' ? 595 : 842;

    useEffect(() => {
        if (!containerRef.current) return;

        const handleResize = () => {
            if (!containerRef.current) return;
            const containerWidth = containerRef.current.clientWidth;
            const containerHeight = containerRef.current.clientHeight;

            if (containerWidth === 0 || containerHeight === 0) return;

            const scaleX = containerWidth / ORIGINAL_WIDTH;
            const scaleY = containerHeight / ORIGINAL_HEIGHT;

            // Use Math.min to contain, or Math.max to cover. Usually previews want 'contain'.
            // However, since we set the aspect ratio of the container to match A4 in many places,
            // they should be close.
            setScale(Math.min(scaleX, scaleY));
        };

        handleResize(); // Initial

        const observer = new ResizeObserver(handleResize);
        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, [orientation, ORIGINAL_WIDTH, ORIGINAL_HEIGHT]);


    useEffect(() => {
        if (!canvasRef.current || !designJson) return;

        const canvas = new fabric.StaticCanvas(canvasRef.current, {
            width: ORIGINAL_WIDTH,
            height: ORIGINAL_HEIGHT,
            renderOnAddRemove: false
        });

        // SAFETY FIX: Override renderAll AND clear to prevent "ctx is null" error
        const originalRender = canvas.renderAll.bind(canvas);
        const originalClear = canvas.clear.bind(canvas);

        (canvas as any).renderAll = () => {
            if (!(canvas as any).contextContainer) return canvas;
            return originalRender();
        };

        (canvas as any).clear = () => {
            if (!(canvas as any).contextContainer) return canvas;
            return originalClear();
        };

        // Load design
        const json = typeof designJson === 'string' ? JSON.parse(designJson) : designJson;

        // Variable substitution logic
        if (json.objects) {
            json.objects.forEach((obj: any) => {
                if (obj.type === 'i-text' || obj.type === 'text') {
                    if (obj.text) {
                        obj.text = obj.text
                            .replace(/{{name}}/g, data?.recipientName || "Katılımcı İsmi")
                            .replace(/{{date}}/g, data?.issueDate || new Date().toLocaleDateString('tr-TR'))
                            .replace(/{{program}}/g, data?.programName || "Program Adı")
                            .replace(/{{id}}/g, data?.certificateId || "SERTIFIKA-NO-001");
                    }
                }
            });
        }

        let isMounted = true;

        canvas.loadFromJSON(json, () => {
            if (!isMounted) return;

            // 1. Identify workspace
            let workspace = canvas.getObjects().find((o) => o.name === "clip");

            // FALLBACK for preview
            if (!workspace) {
                workspace = canvas.getObjects().find(obj => obj.type === 'rect' && (obj.width || 0) > 400);
            }

            if (workspace) {
                const l = workspace.left || 0;
                const t = workspace.top || 0;
                const w = workspace.getScaledWidth();
                const h = workspace.getScaledHeight();

                // Set canvas size to match the paper (workspace)
                canvas.setDimensions({ width: w, height: h });

                // Shift viewport to look exactly at the workspace coordinates 
                canvas.setViewportTransform([1, 0, 0, 1, -l, -t]);
                canvas.setBackgroundColor('white', () => { });
            } else {
                // Total fallback
                canvas.setDimensions({ width: ORIGINAL_WIDTH, height: ORIGINAL_HEIGHT });
                canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
                canvas.setBackgroundColor('white', () => { });
            }

            canvas.renderAll();
        });

        return () => {
            isMounted = false;
            canvas.dispose();
        };
    }, [designJson, orientation, data, ORIGINAL_WIDTH, ORIGINAL_HEIGHT]);

    return (
        <div
            ref={containerRef}
            className={cn("relative w-full h-full overflow-hidden flex items-center justify-center", className)}
            style={style}
        >
            <div
                style={{
                    width: ORIGINAL_WIDTH,
                    height: ORIGINAL_HEIGHT,
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                    flexShrink: 0
                }}
            >
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
}
