import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNavbar } from "@/components/dashboard/TopNavbar";
import { Metadata } from "next";

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-surface-gray flex">
            <Sidebar />
            <div className="flex-1 ml-72 flex flex-col">
                <TopNavbar />
                <main className="p-10 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
