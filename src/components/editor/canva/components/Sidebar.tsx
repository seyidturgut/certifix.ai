"use client";

import { Square, Type, ImageIcon, Palette, Layout, LayoutGrid, Database } from "lucide-react";
import { Editor } from "../types/editor";

interface SidebarProps {
    editor: Editor | undefined;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export default function Sidebar({ editor, activeTab, onTabChange }: SidebarProps) {
    const tabs = [
        { id: "design", label: "Hazır Tasarımlar", icon: Layout },
        { id: "shapes", label: "Bileşenler", icon: Square },
        { id: "text", label: "Metin", icon: Type },
        { id: "images", label: "Görseller", icon: ImageIcon },
        { id: "data", label: "Veri", icon: Database },
        { id: "signature", label: "İmza", icon: Palette },
    ];

    return (
        <aside className="w-[80px] bg-[#FFFFFF] border-r border-gray-200 flex flex-col items-center py-4 gap-2 z-40">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(activeTab === tab.id ? "" : tab.id)}
                    className={`flex flex-col items-center gap-1.5 w-[72px] py-3 rounded-xl transition-all group ${activeTab === tab.id ? 'bg-blue-50 text-[#005DFF]' : 'hover:bg-gray-50 text-gray-400 hover:text-[#005DFF]'
                        }`}
                >
                    <tab.icon size={22} className={`${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
                    <span className="text-[9px] font-bold uppercase tracking-tighter text-center leading-none px-0.5">{tab.label}</span>
                </button>
            ))}
        </aside>
    );
}
