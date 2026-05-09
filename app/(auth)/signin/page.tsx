"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { GlobeIcon, CheckIcon } from "lucide-react";

import { authClient } from "@/lib/auth/client";
import { caveat } from "@/app/lib/fonts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function SignIn() {
    const [isLoading, setIsLoading] = useState(false);

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
                        <p className="text-sm text-muted-foreground">Continue with Google to access your tasks.</p>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-4">
                        <ul className="flex flex-col gap-2">
                            {[
                                "Secure sign in with your Google account",
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

                        <motion.div whileTap={{ scale: 0.98 }}>
                            <Button
                                type="button"
                                disabled={isLoading}
                                onClick={() => void handleGoogleSignIn()}
                                className="w-full"
                                size="lg"
                            >
                                <GlobeIcon data-icon="inline-start" />
                                {isLoading ? "Connecting…" : "Continue with Google"}
                            </Button>
                        </motion.div>
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
