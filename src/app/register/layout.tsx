import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kayıt Ol | Certifix",
    robots: {
        index: false,
        follow: false,
    },
};

export default function RegisterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
