"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Search, UserCircle, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function TopNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        router.push("/");
    };

    return (
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-40">
            <div className="flex items-center gap-3 mr-8">
                <div className="relative w-8 h-8">
                    <Image src="/certifix-logo.png" alt="Certifix Logo" fill className="object-contain" />
                </div>
                <span className="font-bold text-xl tracking-tight text-brand-blue">Certifix</span>
            </div>

            <div className="flex-1 flex items-center bg-surface-gray px-4 py-2.5 rounded-xl max-w-md border border-slate-100 group focus-within:border-brand-blue transition-all">
                <Search size={18} className="text-slate-400 mr-2" />
                <input
                    type="text"
                    placeholder="Sertifika veya kullanıcı ara..."
                    className="bg-transparent border-none outline-none text-sm w-full font-medium"
                />
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2.5 text-slate-400 hover:text-brand-blue hover:bg-brand-blue/5 rounded-xl transition-all">
                    <Bell size={22} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-brand-amber rounded-full border-2 border-white" />
                </button>

                <div className="h-8 w-px bg-slate-100" />

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-3 cursor-pointer group"
                    >
                        <div className="text-right flex flex-col">
                            <span className="text-sm font-bold text-slate-800 group-hover:text-brand-blue transition-colors">
                                {user?.full_name || "Seyit Turgut"}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {user?.role === 'SUPER_ADMIN' ? 'Süper Admin' : 'Kurumsal Kullanıcı'}
                            </span>
                        </div>
                        <div className={cn(
                            "w-10 h-10 rounded-xl border flex items-center justify-center transition-all overflow-hidden",
                            isOpen
                                ? "bg-brand-blue/10 border-brand-blue text-brand-blue"
                                : "bg-slate-100 border-slate-200 text-slate-400 group-hover:border-brand-blue group-hover:text-brand-blue"
                        )}>
                            {user?.profile_image ? (
                                <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <UserCircle size={24} />
                            )}
                        </div>
                    </button>

                    {isOpen && (
                        <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200/50 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="px-4 py-3 border-b border-slate-50 mb-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hesap</p>
                            </div>

                            <Link
                                href="/dashboard/profile"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-brand-blue hover:bg-brand-blue/5 transition-colors"
                            >
                                <User size={18} />
                                Profil Ayarları
                            </Link>

                            <Link
                                href="/dashboard/admin/settings"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-brand-blue hover:bg-brand-blue/5 transition-colors"
                            >
                                <Settings size={18} />
                                Sistem Ayarları
                            </Link>

                            <div className="my-1 border-t border-slate-50" />

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-colors"
                            >
                                <LogOut size={18} />
                                Çıkış Yap
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

import { cn } from "@/lib/utils";
