"use client";

import axios from "axios";
import Link from "next/link";
import { useRef } from "react";

export default function SignIn() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleSignIn = async () => {
        const username = usernameRef.current?.value ?? "";
        const password = passwordRef.current?.value ?? "";

        await axios.post("http://localhost:3000/api/v1/signin", {
            username,
            password,
        });
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#f7f4ea] px-5 py-10">
            <div className="w-full max-w-md rounded-3xl border border-[#0f172a1f] bg-[#fffcf1] p-7 shadow-[0_18px_42px_rgba(15,23,42,0.14)] sm:p-8">
                <p className="mb-3 inline-flex rounded-full border border-[#ffb86a] bg-[#ffe4c9] px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-[#934012]">
                    Welcome back
                </p>
                <h1 className="text-3xl font-semibold text-[#1e293b]">Sign in to FlowList</h1>
                <p className="mt-2 text-sm text-[#475569]">
                    Continue where you left off and plan your day in minutes.
                </p>

                <form className="mt-7 space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-1.5">
                        <label htmlFor="username" className="text-sm font-medium text-[#334155]">
                            Username
                        </label>
                        <input
                            ref={usernameRef}
                            id="username"
                            type="text"
                            placeholder="Enter username"
                            className="w-full rounded-xl border border-[#0f172a2e] bg-white px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-[#e4572e] focus:ring-2 focus:ring-[#f9b36f]"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="password" className="text-sm font-medium text-[#334155]">
                            Password
                        </label>
                        <input
                            ref={passwordRef}
                            id="password"
                            type="password"
                            placeholder="Enter password"
                            className="w-full rounded-xl border border-[#0f172a2e] bg-white px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-[#e4572e] focus:ring-2 focus:ring-[#f9b36f]"
                        />
                    </div>

                    <button
                        type="submit"
                        onClick={handleSignIn}
                        className="mt-1 w-full rounded-xl bg-[#e4572e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c94623]"
                    >
                        Sign in
                    </button>
                </form>

                <p className="mt-5 text-center text-sm text-[#475569]">
                    New here?{" "}
                    <Link href="/signup" className="font-semibold text-[#b94828] hover:underline">
                        Create an account
                    </Link>
                </p>
            </div>
        </main>
    );
}
