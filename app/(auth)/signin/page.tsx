"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignIn() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleCredentialsSignIn = async () => {
        setError("");
        setIsLoading(true);

        const result = await signIn("credentials", {
            identifier,
            password,
            redirect: false,
            callbackUrl: "/",
        });

        setIsLoading(false);

        if (!result || result.error) {
            setError("Invalid username/email or password");
            return;
        }

        window.location.href = result.url ?? "/";
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#ffe4bd_0,#f9e7ca_26%,#f6ecdb_54%,#f3eadf_100%)] px-5 py-10">
            <div className="pointer-events-none absolute -top-16 left-0 h-72 w-72 rounded-full bg-[#ff8c5a]/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-[#f8c67c]/30 blur-3xl" />

            <div className="relative w-full max-w-md rounded-[28px] border border-[#7c3b181f] bg-[linear-gradient(160deg,rgba(255,255,255,0.86),rgba(255,247,231,0.96))] p-7 shadow-[0_24px_50px_rgba(124,59,24,0.18)] backdrop-blur sm:p-8">
                <p className="mb-3 inline-flex rounded-full border border-[#ffb86a] bg-[#ffe4c9] px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-[#934012]">
                    Welcome back
                </p>
                <h1 className="text-3xl font-semibold text-[#1e293b]">Sign in to FlowList</h1>
                <p className="mt-2 text-sm text-[#475569]">
                    Continue where you left off and plan your day in minutes.
                </p>

                <form
                    className="mt-7 space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        void handleCredentialsSignIn();
                    }}
                >
                    <div className="space-y-1.5">
                        <label htmlFor="identifier" className="text-sm font-medium text-[#334155]">
                            Username or email
                        </label>
                        <input
                            value={identifier}
                            onChange={(event) => setIdentifier(event.target.value)}
                            id="identifier"
                            type="text"
                            placeholder="Enter username or email"
                            className="w-full rounded-xl border border-[#c87b4e55] bg-white/90 px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-[#df6b3f] focus:ring-2 focus:ring-[#f7bc7b]"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="password" className="text-sm font-medium text-[#334155]">
                            Password
                        </label>
                        <input
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            id="password"
                            type="password"
                            placeholder="Enter password"
                            className="w-full rounded-xl border border-[#c87b4e55] bg-white/90 px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-[#df6b3f] focus:ring-2 focus:ring-[#f7bc7b]"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-1 w-full rounded-xl bg-[linear-gradient(120deg,#e4572e,#ca3f21)] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(196,72,32,0.32)] transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isLoading ? "Signing in..." : "Sign in"}
                    </button>

                    {error ? <p className="text-sm text-[#c2410c]">{error}</p> : null}
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
