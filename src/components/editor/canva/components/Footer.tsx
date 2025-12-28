"use client";

import { Search, ZoomIn, ZoomOut } from "lucide-react";

export default function Footer() {
    return (
        <footer className="h-10 bg-white border-t border-gray-100 px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Certifix Editor v2.0 (Fabric Engine)</span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span>Hazır</span>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-gray-400 hover:text-[#005DFF] cursor-pointer transition-all">
                    <Search size={14} />
                    <span className="text-[11px] font-bold">Zoom: %85</span>
                </div>
            </div>
        </footer>
    );
}
