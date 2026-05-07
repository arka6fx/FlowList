"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { authClient } from "@/app/lib/auth/client";
import { caveat } from "@/app/lib/fonts";

export default function SignIn() {
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    const handleGoogleSignIn = async () => {
        setIsLoading(true);

        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#211f24] px-5 py-10">
            <div className="pointer-events-none absolute -top-16 left-0 h-72 w-72 rounded-full bg-[#7b3a49]/35 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-[#5b2a36]/30 blur-3xl" />

            <div className="relative w-full max-w-md rounded-[28px] border border-[#713743] bg-[#2b232a]/95 p-7 shadow-[0_24px_50px_rgba(12,8,10,0.5)] backdrop-blur sm:p-8">
                <p className={`${caveat.className} mb-3 inline-flex rounded-full border border-[#8d4451] bg-[#6c3240] px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-[#ffe4e8]`}>
                    Welcome back
                </p>
                <h1 className={`${caveat.className} text-3xl font-semibold text-[#ffe4e8]`}>Sign in to FlowList</h1>
                <p className="mt-2 text-sm text-[#d8a9b2]">Continue with Google to access your tasks.</p>

                <ul className="mt-4 space-y-2 text-sm text-[#e6bcc4]">
                    <li className="flex items-center gap-2">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#6c3240] text-xs font-bold text-[#ffdce2]">
                            ✓
                        </span>
                        Secure sign in with your Google account
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#6c3240] text-xs font-bold text-[#ffdce2]">
                            ✓
                        </span>
                        Instantly continue your existing todo board
                    </li>
                </ul>

                <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => {
                        void handleGoogleSignIn();
                    }}
                    className="mt-7 w-full rounded-xl bg-[linear-gradient(120deg,#c14f63,#98384b)] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(64,20,32,0.4)] transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {isLoading ? "Connecting Google..." : "Continue with Google"}
                </button>

                <p className="mt-5 text-center text-sm text-[#d8a9b2]">
                    New here?{" "}
                    <Link href="/signup" className="font-semibold text-[#ffe6eb] hover:underline">
                        Create an account
                    </Link>
                </p>
            </div>
        </main>
    );
}
