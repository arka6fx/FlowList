import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/app/providers";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
            className={cn("h-full antialiased", "font-sans", geist.variable)}
        >
            <body className="min-h-full flex flex-col">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
