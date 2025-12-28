"use client";

import { LayoutGrid, Type, Trash2, Maximize2 } from "lucide-react";
import { Editor } from "../types/editor";

interface ToolbarProps {
    editor: Editor | undefined;
    activeOrientation: 'landscape' | 'portrait';
    onOrientationChange: (val: 'landscape' | 'portrait') => void;
}

export default function Toolbar({ editor, activeOrientation, onOrientationChange }: ToolbarProps) {
    if (!editor) return null;

    return (
        <div className="h-[52px] bg-white border-b border-gray-200 px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => editor.delete()}
                    className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-all"
                    title="Sil"
                >
                    <Trash2 size={18} />
                </button>
                <div className="h-6 w-[1px] bg-gray-200" />
                <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
                    <button
                        onClick={() => onOrientationChange('landscape')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeOrientation === 'landscape' ? 'bg-white text-[#005DFF] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        A4 YATAY
                    </button>
                    <button
                        onClick={() => onOrientationChange('portrait')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeOrientation === 'portrait' ? 'bg-white text-[#005DFF] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        A4 DİKEY
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Opasite</span>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        defaultValue="1"
                        onChange={(e) => editor.changeOpacity(parseFloat(e.target.value))}
                        className="w-24 accent-[#005DFF]"
                    />
                </div>
            </div>
        </div>
    );
}
