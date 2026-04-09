import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import Providers from "@/app/providers";

const sora = Sora({
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "FlowList",
    description: "A focused todo app for planning your day with clarity.",
    metadataBase: new URL("https://flowlist.vercel.app"),
    applicationName: "FlowList",
    keywords: ["FlowList", "todo app", "task manager", "productivity", "next.js"],
    manifest: "/manifest.json",
    icons: {
        icon: "/icon.svg",
        apple: "/icon.svg",
    },
    openGraph: {
        title: "FlowList",
        description: "Plan tasks, track progress, and stay focused with FlowList.",
        url: "https://flowlist.vercel.app",
        siteName: "FlowList",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "FlowList",
        description: "Plan tasks, track progress, and stay focused with FlowList.",
    },
    alternates: {
        canonical: "/",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className="h-full antialiased"
        >
            <body className={`${sora.className} min-h-full flex flex-col`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
