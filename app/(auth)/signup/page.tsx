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
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#c7dcff_0,#d9e8ff_24%,#e8efff_52%,#eef3ff_100%)] px-5 py-10">
            <div className="pointer-events-none absolute -top-12 right-0 h-72 w-72 rounded-full bg-[#5ea0ff]/28 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 left-0 h-80 w-80 rounded-full bg-[#8ad4ff]/34 blur-3xl" />

            <div className="relative w-full max-w-md rounded-[28px] border border-[#1d4ed81a] bg-[linear-gradient(160deg,rgba(255,255,255,0.9),rgba(239,246,255,0.96))] p-7 shadow-[0_24px_50px_rgba(30,64,175,0.16)] backdrop-blur sm:p-8">
                <p className="mb-3 inline-flex rounded-full border border-[#93c5fd] bg-[#e0edff] px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-[#1d4ed8]">
                    Get started
                </p>
                <h1 className="text-3xl font-semibold text-[#1e293b]">Create your FlowList account</h1>
                <p className="mt-2 text-sm text-[#475569]">Use Google to create your account in one step.</p>

                <ul className="mt-4 space-y-2 text-sm text-[#475569]">
                    <li className="flex items-center gap-2">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#dbeafe] text-xs font-bold text-[#1d4ed8]">
                            ✓
                        </span>
                        No password setup required
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#dbeafe] text-xs font-bold text-[#1d4ed8]">
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

                <p className="mt-5 text-center text-sm text-[#475569]">
                    Already have an account?{" "}
                    <Link href="/signin" className="font-semibold text-[#1d4ed8] hover:underline">
                        Sign in
                    </Link>
                </p>

                <p className="mt-2 text-center text-sm text-[#64748b]">
                    <Link href="/" className="font-medium text-[#1e40af] hover:underline">
                        ← Go back to landing page
                    </Link>
                </p>
            </div>
        </main>
    );
}
