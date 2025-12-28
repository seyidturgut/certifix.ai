"use client";

import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { useEditor } from "./hooks/use-editor";
import { useAutoResize } from "./hooks/use-auto-resize";
import { useHistory } from "./hooks/use-history";
import Sidebar from "./components/Sidebar";
import SidebarPanel from "./components/SidebarPanel";
import Navbar from "./components/Navbar";
import Toolbar from "./components/Toolbar";
import Footer from "./components/Footer";

import { Editor } from "./types/editor";

interface CanvaEditorProps {
    orientation: 'landscape' | 'portrait';
    initialData?: any;
    onSave: (designJson: string) => void;
    onOrientationChange: (orientation: 'landscape' | 'portrait') => void;
    onBack: () => void;
    onReady?: (editor: Editor) => void;
}

export default function CanvaEditor({ orientation, initialData, onSave, onOrientationChange, onBack, onReady }: CanvaEditorProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [activeTab, setActiveTab] = useState("text");
    const { init, editor } = useEditor();
    const { autoResize } = useAutoResize({ canvas: editor?.canvas || null, container: containerRef.current });
    const { undo, redo, canUndo, canRedo } = useHistory({ canvas: editor?.canvas || null });

    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return;

        const canvas = new fabric.Canvas(canvasRef.current, {
            controlsAboveOverlay: true,
            preserveObjectStacking: true,
        });

        const initialWidth = orientation === 'landscape' ? 842 : 595;
        const initialHeight = orientation === 'landscape' ? 595 : 842;

        const workspace = new fabric.Rect({
            width: initialWidth,
            height: initialHeight,
            name: "clip",
            fill: "white",
            selectable: false,
            hasControls: false,
            shadow: new fabric.Shadow({
                color: "rgba(0,0,0,0.15)",
                blur: 30,
            }),
        });

        canvas.add(workspace);
        canvas.centerObject(workspace);
        canvas.clipPath = workspace;

        init({
            initialCanvas: canvas,
            initialContainer: containerRef.current,
        });

        return () => {
            canvas.dispose();
        };
    }, []);

    // Load initial data if provided
    useEffect(() => {
        if (editor && initialData) {
            editor.loadDesign(initialData);
        }
    }, [editor, initialData]);

    // Expose editor instance
    useEffect(() => {
        if (editor && onReady) {
            onReady(editor);
        }
    }, [editor, onReady]);

    // Update workspace on orientation change
    useEffect(() => {
        if (!editor) return;
        const workspace = editor.canvas.getObjects().find(o => o.name === "clip");
        if (workspace) {
            const width = orientation === 'landscape' ? 842 : 595;
            const height = orientation === 'landscape' ? 595 : 842;
            workspace.set({ width, height });
            editor.canvas.centerObject(workspace);
            editor.canvas.renderAll();
            autoResize();
        }
    }, [orientation, editor, autoResize]);

    return (
        <div className="h-full flex flex-col bg-[#F3F4F6] overflow-hidden select-none">
            <Navbar
                onSave={() => onSave(JSON.stringify(editor?.canvas.toJSON()))}
                onBack={onBack}
                onUndo={undo}
                onRedo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
            />
            <div className="flex-1 flex overflow-hidden">
                <Sidebar
                    editor={editor}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />
                <SidebarPanel
                    activeTab={activeTab}
                    onClose={() => setActiveTab("")}
                    editor={editor}
                />
                <main className="flex-1 flex flex-col relative overflow-hidden">
                    <Toolbar
                        editor={editor}
                        activeOrientation={orientation}
                        onOrientationChange={onOrientationChange}
                    />
                    <div
                        ref={containerRef}
                        className="flex-1 bg-slate-100 flex items-center justify-center p-8 overflow-hidden"
                    >
                        <canvas ref={canvasRef} />
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}
