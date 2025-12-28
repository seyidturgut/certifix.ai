"use client";

import { ChevronLeft, Undo2, Redo2, Download } from "lucide-react";

interface NavbarProps {
    onSave: () => void;
    onBack: () => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

export default function Navbar({ onSave, onBack, onUndo, onRedo, canUndo, canRedo }: NavbarProps) {
    return (
        <nav className="h-[68px] bg-[#FFFFFF] border-b border-gray-200 px-4 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.05)] z-50">
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-gray-700 font-semibold transition-all"
                >
                    <ChevronLeft size={20} />
                    <span>Geri</span>
                </button>
                <div className="h-6 w-[1px] bg-gray-200" />
                <div className="flex items-center gap-1">
                    <button
                        onClick={onUndo}
                        disabled={!canUndo}
                        className="p-2 hover:bg-gray-50 rounded-lg text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        title="Geri Al (Ctrl+Z)"
                    >
                        <Undo2 size={20} />
                    </button>
                    <button
                        onClick={onRedo}
                        disabled={!canRedo}
                        className="p-2 hover:bg-gray-50 rounded-lg text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        title="İleri Al (Ctrl+Y)"
                    >
                        <Redo2 size={20} />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <span className="text-xs text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full uppercase tracking-tight">
                    Bulut Kaydı Aktif
                </span>
                <button
                    onClick={onSave}
                    className="flex items-center gap-2 bg-[#005DFF] hover:bg-[#004ECC] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                    <Download size={18} />
                    Tasarımı Kaydet
                </button>
            </div>
        </nav>
    );
}
