"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
    LayoutDashboard,
    FileText,
    Users,
    Settings,
    LogOut,
    ShieldCheck,
    PlusCircle,
    HardDrive,
    Activity,
    Mail,
    Layout
} from "lucide-react";
import { cn } from "@/lib/utils";

const userItems = [
    { name: "Genel Bakış", icon: LayoutDashboard, href: "/dashboard/user" },
    { name: "Tasarımlar", icon: Layout, href: "/dashboard/user/designs" },
    { name: "Verilen Sertifikalar", icon: FileText, href: "/dashboard/user/certificates" },
    { name: "Profil Ayarları", icon: Settings, href: "/dashboard/profile" },
];

const adminItems = [
    { name: "Yönetim Paneli", icon: LayoutDashboard, href: "/dashboard/admin" },
    { name: "Müşteri Yönetimi", icon: Users, href: "/dashboard/admin/customers" },
    { name: "Paket Yönetimi", icon: Layout, href: "/dashboard/admin/plans" },
    { name: "Varlık Yönetimi", icon: HardDrive, href: "/dashboard/admin/assets" },
    { name: "Kullanım Analizi", icon: ShieldCheck, href: "/dashboard/admin/analytics" },
    { name: "E-Posta (Brevo)", icon: FileText, href: "/dashboard/admin/email" },
    { name: "Sistem & Yedek", icon: LayoutDashboard, href: "/dashboard/admin/system" },
    { name: "Teknik Ayarlar", icon: Settings, href: "/dashboard/admin/settings" },
];

import { useRouter } from "next/navigation";

// ... existing items ...

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const isAdmin = pathname.startsWith("/dashboard/admin");
    const items = isAdmin ? adminItems : userItems;

    const handleLogout = () => {
        localStorage.removeItem("user");
        router.push("/");
    };

    return (
        <div className="w-72 h-screen bg-brand-blue text-white flex flex-col fixed left-0 top-0">
            {/* ... logo section ... */}
            <div className="p-8 flex items-center gap-3">
                <div className="w-8 h-8 relative invert brightness-0">
                    <Image src="/certifix-logo.png" alt="Certifix" fill className="object-contain" />
                </div>
                <span className="font-bold text-2xl tracking-tighter">Certifix</span>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-2">
                {items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 group font-semibold",
                                isActive
                                    ? "bg-white text-brand-blue shadow-xl shadow-black/20"
                                    : "text-white/60 hover:text-white hover:bg-white/10"
                            )}
                        >
                            <item.icon size={22} className={cn(isActive ? "text-brand-blue" : "text-white/40 group-hover:text-white")} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-white/10">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 px-6 py-4 w-full text-white/60 hover:text-white transition-colors font-semibold group rounded-2xl hover:bg-white/5"
                >
                    <LogOut size={22} className="text-white/40 group-hover:text-white" />
                    Çıkış Yap
                </button>
            </div>
        </div>
    );
}
