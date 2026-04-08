"use client";

import Link from "next/link";
import axios from "axios";
import { useRef, useState } from "react";
import { signIn } from "next-auth/react";

export default function SignUp() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async () => {
        setError("");
        setIsLoading(true);

        const username = usernameRef.current?.value ?? "";
        const email = emailRef.current?.value ?? "";
        const password = passwordRef.current?.value ?? "";

        try {
            await axios.post("/api/v1/signup", {
                username,
                email,
                password,
            });

            await signIn("credentials", {
                identifier: email,
                password,
                callbackUrl: "/",
            });
        } catch {
            setError("Could not create account. Check username/email and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#ffe4bd_0,#f9e7ca_26%,#f6ecdb_54%,#f3eadf_100%)] px-5 py-10">
            <div className="pointer-events-none absolute -top-12 right-0 h-72 w-72 rounded-full bg-[#ff8c5a]/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 left-0 h-80 w-80 rounded-full bg-[#f8c67c]/30 blur-3xl" />

            <div className="relative w-full max-w-md rounded-[28px] border border-[#7c3b181f] bg-[linear-gradient(160deg,rgba(255,255,255,0.86),rgba(255,247,231,0.96))] p-7 shadow-[0_24px_50px_rgba(124,59,24,0.18)] backdrop-blur sm:p-8">
                <p className="mb-3 inline-flex rounded-full border border-[#ffb86a] bg-[#ffe4c9] px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-[#934012]">
                    Get started
                </p>
                <h1 className="text-3xl font-semibold text-[#1e293b]">Create your FlowList account</h1>
                <p className="mt-2 text-sm text-[#475569]">
                    Set up your account and start organizing tasks with clarity.
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
                            placeholder="Choose a username"
                            className="w-full rounded-xl border border-[#c87b4e55] bg-white/90 px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-[#df6b3f] focus:ring-2 focus:ring-[#f7bc7b]"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="email" className="text-sm font-medium text-[#334155]">
                            Email
                        </label>
                        <input
                            ref={emailRef}
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            className="w-full rounded-xl border border-[#c87b4e55] bg-white/90 px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-[#df6b3f] focus:ring-2 focus:ring-[#f7bc7b]"
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
                            placeholder="Create a password"
                            className="w-full rounded-xl border border-[#c87b4e55] bg-white/90 px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-[#df6b3f] focus:ring-2 focus:ring-[#f7bc7b]"
                        />
                    </div>

                    <button
                        type="submit"
                        onClick={handleSignUp}
                        disabled={isLoading}
                        className="mt-1 w-full rounded-xl bg-[linear-gradient(120deg,#e4572e,#ca3f21)] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(196,72,32,0.32)] transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isLoading ? "Creating account..." : "Create account"}
                    </button>

                    {error ? <p className="text-sm text-[#c2410c]">{error}</p> : null}
                </form>

                <p className="mt-5 text-center text-sm text-[#475569]">
                    Already have an account?{" "}
                    <Link href="/signin" className="font-semibold text-[#b94828] hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </main>
    );
}
