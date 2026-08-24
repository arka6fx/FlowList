"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckIcon, LoaderIcon } from "lucide-react";

import { caveat } from "@/app/lib/fonts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function SignIn() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleEmailSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);
        const email = String(formData.get("email") ?? "").trim();
        const password = String(formData.get("password") ?? "");

        try {
            const res = await fetch("/api/auth/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const data = (await res.json().catch(() => null)) as { message?: string } | null;
                setError(data?.message ?? "Invalid email or password.");
                return;
            }

            router.push("/");
            router.refresh();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 py-10">
            <div className="pointer-events-none absolute -top-16 left-0 size-72 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 right-0 size-80 rounded-full bg-primary/15 blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="relative w-full max-w-sm"
            >
                <Card className="shadow-[0_24px_50px_rgba(12,8,10,0.5)]">
                    <CardHeader className="gap-1">
                        <p className={cn(
                            caveat.className,
                            "inline-flex w-fit rounded-full border border-border bg-secondary px-3 py-1 text-xs uppercase tracking-widest text-accent-foreground"
                        )}>
                            Welcome back
                        </p>
                        <h1 className={cn(caveat.className, "text-3xl font-semibold text-accent-foreground")}>
                            Sign in to FlowList
                        </h1>
                        <p className="text-sm text-muted-foreground">Sign in with your email to access your tasks.</p>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-4">
                        <ul className="flex flex-col gap-2">
                            {[
                                "Your tasks stay synced across devices",
                                "Instantly continue your existing todo board",
                            ].map((item) => (
                                <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary">
                                        <CheckIcon className="size-3 text-primary" />
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <form onSubmit={handleEmailSignIn} className="flex flex-col gap-3">
                            <Input
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                autoComplete="email"
                                required
                                disabled={isLoading}
                            />
                            <Input
                                name="password"
                                type="password"
                                placeholder="Password"
                                autoComplete="current-password"
                                required
                                minLength={8}
                                disabled={isLoading}
                            />

                            {error && (
                                <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                    {error}
                                </p>
                            )}

                            <motion.div whileTap={{ scale: 0.98 }}>
                                <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                                    {isLoading && <LoaderIcon data-icon="inline-start" className="animate-spin" />}
                                    {isLoading ? "Signing in…" : "Sign in"}
                                </Button>
                            </motion.div>
                        </form>
                    </CardContent>

                    <CardFooter className="justify-center">
                        <p className="text-sm text-muted-foreground">
                            New here?{" "}
                            <Link href="/signup" className="font-semibold text-accent-foreground hover:underline">
                                Create an account
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </main>
    );
}
