"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

export default function SignUp() {
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    const handleGoogleSignUp = async () => {
        setIsLoading(true);

        try {
            await signIn("google", {
                callbackUrl: "/",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#ebf2ff] bg-[linear-gradient(rgba(30,58,138,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.08)_1px,transparent_1px)] bg-size-[28px_28px] px-5 py-10 selection:bg-[#93c5fd80] selection:text-[#0f172a] dark:bg-[#070d19] dark:bg-[linear-gradient(rgba(56,189,248,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.08)_1px,transparent_1px)]">
            <div className="pointer-events-none absolute -top-12 right-0 h-72 w-72 rounded-full bg-[#60a5fa]/40 blur-3xl dark:bg-[#1d4ed8]/45" />
            <div className="pointer-events-none absolute -bottom-16 left-0 h-80 w-80 rounded-full bg-[#38bdf8]/30 blur-3xl dark:bg-[#0ea5e9]/35" />

            <div className="relative w-full max-w-md rounded-[28px] border border-[#1e3a8a26] bg-[#f8fbff]/92 p-7 shadow-[0_24px_50px_rgba(30,64,175,0.16)] backdrop-blur dark:border-white/10 dark:bg-[#0b1324]/90 dark:shadow-[0_22px_54px_rgba(2,8,24,0.6)] sm:p-8">
                <p className="mb-3 inline-flex rounded-full border border-[#93c5fd] bg-[#e0edff] px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-[#1d4ed8]">
                    Get started
                </p>
                <h1 className="text-3xl font-semibold text-[#1e293b] dark:text-white">Create your FlowList account</h1>
                <p className="mt-2 text-sm text-[#475569] dark:text-white/60">Use Google to create your account in one step.</p>

                <ul className="mt-4 space-y-2 text-sm text-[#475569] dark:text-white/60">
                    <li className="flex items-center gap-2">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#dbeafe] text-xs font-bold text-[#1d4ed8] dark:bg-blue-500/20 dark:text-blue-400">
                            ✓
                        </span>
                        No password setup required
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#dbeafe] text-xs font-bold text-[#1d4ed8] dark:bg-blue-500/20 dark:text-blue-400">
                            ✓
                        </span>
                        Start planning tasks in seconds
                    </li>
                </ul>

                <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => {
                        void handleGoogleSignUp();
                    }}
                    className="mt-7 w-full rounded-xl bg-[linear-gradient(120deg,#2563eb,#1d4ed8)] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(37,99,235,0.34)] transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {isLoading ? "Connecting Google..." : "Sign up with Google"}
                </button>

                <p className="mt-5 text-center text-sm text-[#475569] dark:text-white/60">
                    Already have an account?{" "}
                    <Link href="/signin" className="font-semibold text-[#1d4ed8] hover:underline dark:text-blue-400">
                        Sign in
                    </Link>
                </p>

                <p className="mt-2 text-center text-sm text-[#64748b]">
                    <Link href="/" className="font-medium text-blue-400 hover:underline">
                        ← Go back to landing page
                    </Link>
                </p>
            </div>
        </main>
    );
}
