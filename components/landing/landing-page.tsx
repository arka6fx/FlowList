"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ZapIcon, LayoutListIcon, RefreshCwIcon, ArrowRightIcon, CheckIcon } from "lucide-react";

import { caveat } from "@/app/lib/fonts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

const features = [
    {
        icon: ZapIcon,
        title: "Organize Quickly",
        description: "Add tasks in seconds, keep descriptions concise, and avoid losing context while switching between priorities.",
    },
    {
        icon: LayoutListIcon,
        title: "Track Progress",
        description: "Use your open vs completed lanes to see exactly where your day stands and what needs attention next.",
    },
    {
        icon: RefreshCwIcon,
        title: "Stay Consistent",
        description: "FlowList keeps your workflow intentional so you can build routines and ship meaningful work with less friction.",
    },
];

const daySlots = [
    { time: "Morning", copy: "Capture your top priorities before distractions appear." },
    { time: "Midday", copy: "Update progress quickly so you always know what is next." },
    { time: "Evening", copy: "Close finished tasks and roll over only what still matters." },
];

const whyItems = [
    "The board is calm, readable, and easy to trust when your day gets busy.",
    "Tasks stay simple: add, update, finish, and move on without friction.",
    "Works smoothly on phone and desktop, so your planning never breaks.",
    "Built to help you complete meaningful work, not just collect checkboxes.",
];

export function LandingPage() {
    return (
        <main className="min-h-screen scroll-smooth bg-background text-foreground">
            <div className="mx-auto w-full max-w-5xl px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pt-8">
                {/* Sticky nav */}
                <motion.header
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="sticky top-3 z-40 mb-8 rounded-2xl border border-border bg-[linear-gradient(135deg,rgba(74,43,53,0.85),rgba(37,29,36,0.8))] px-4 py-3 shadow-lg backdrop-blur-xl sm:px-5"
                >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className={cn(caveat.className, "text-2xl font-semibold text-accent-foreground")}>FlowList</p>
                        <div className="flex flex-wrap items-center gap-2">
                            <nav className="hidden items-center gap-1 sm:flex">
                                {["#overview", "#features", "#why"].map((href, i) => (
                                    <a
                                        key={href}
                                        href={href}
                                        className="rounded-lg px-2.5 py-1 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-accent-foreground"
                                    >
                                        {["Overview", "Features", "Why FlowList"][i]}
                                    </a>
                                ))}
                            </nav>
                            <Separator orientation="vertical" className="hidden h-5 sm:block" />
                            <Button variant="outline" size="sm" nativeButton={false} render={<Link href="/signin" />}>
                                Sign in
                            </Button>
                            <Button size="sm" nativeButton={false} render={<Link href="/signup" />}>
                                Sign up
                            </Button>
                        </div>
                    </div>
                </motion.header>

                {/* Hero */}
                <section id="overview" className="mb-6 overflow-hidden rounded-3xl border border-border bg-[radial-gradient(circle_at_top_left,#542833_0%,#2a2029_55%,#1f1d22_100%)] p-6 shadow-xl sm:p-8 lg:p-10">
                    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                        <motion.div
                            variants={stagger}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-col gap-4"
                        >
                            <motion.div variants={fadeUp}>
                                <Badge variant="secondary">Daily focus system</Badge>
                            </motion.div>
                            <motion.p
                                variants={fadeUp}
                                className={cn(caveat.className, "text-2xl text-muted-foreground sm:text-3xl")}
                            >
                                Less noise. More done.
                            </motion.p>
                            <motion.h1
                                variants={fadeUp}
                                className="text-4xl font-semibold leading-tight text-accent-foreground sm:text-5xl"
                            >
                                FlowList helps you finish what matters, every day.
                            </motion.h1>
                            <motion.p
                                variants={fadeUp}
                                className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
                            >
                                Plan fast, track progress, and keep momentum with a clean task board built for deep work.
                            </motion.p>
                            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                                <Button size="lg" nativeButton={false} render={<Link href="/signup" />}>
                                    Start free
                                    <ArrowRightIcon data-icon="inline-end" />
                                </Button>
                                <Button variant="outline" size="lg" nativeButton={false} render={<Link href="/signin" />}>
                                    Sign in
                                </Button>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
                        >
                            <Card>
                                <CardHeader>
                                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Today preview</p>
                                    <p className={cn(caveat.className, "text-xl text-accent-foreground")}>A small plan for a big day</p>
                                </CardHeader>
                                <CardContent>
                                    <ul className="flex flex-col gap-2">
                                        {[
                                            "Design homepage polish and CTA flow",
                                            "Review overdue items and close two tasks",
                                            "Ship updates before end of day",
                                        ].map((task, i) => (
                                            <motion.li
                                                key={task}
                                                initial={{ opacity: 0, x: -8 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: 0.4 + i * 0.08 }}
                                                className="flex items-center gap-2 rounded-lg border border-border bg-secondary/80 px-3 py-2 text-sm text-accent-foreground"
                                            >
                                                <span className="size-2 shrink-0 rounded-full bg-primary" />
                                                {task}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </section>

                {/* Features */}
                <section id="features" className="mb-6">
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-60px" }}
                        className="grid gap-4 md:grid-cols-3"
                    >
                        {features.map(({ icon: Icon, title, description }) => (
                            <motion.div key={title} variants={fadeUp}>
                                <Card className="h-full">
                                    <CardHeader>
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15">
                                            <Icon className="size-4 text-primary" />
                                        </div>
                                        <CardTitle>{title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription>{description}</CardDescription>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* Why FlowList */}
                <motion.section
                    id="why"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5 }}
                    className="mb-6"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Why people stick with FlowList</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {whyItems.map((item) => (
                                    <div key={item} className="flex items-start gap-2 rounded-lg bg-secondary/50 px-4 py-3 text-sm text-muted-foreground">
                                        <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.section>

                {/* Day timeline */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5 }}
                    className="mb-6"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">How FlowList fits your day</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-3">
                                {daySlots.map(({ time, copy }) => (
                                    <div key={time} className="rounded-xl bg-secondary/50 p-4">
                                        <Badge variant="outline" className="mb-2">{time}</Badge>
                                        <p className="text-sm text-muted-foreground">{copy}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.section>

                {/* CTA banner */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 overflow-hidden rounded-3xl border border-border bg-[linear-gradient(130deg,#3f2b34,#2b232a)] p-6 text-center sm:p-8"
                >
                    <h2 className="text-2xl font-semibold text-accent-foreground">Ready to plan your next focused day?</h2>
                    <p className={cn(caveat.className, "mt-2 text-2xl text-muted-foreground sm:text-3xl")}>
                        Start now, thank yourself tonight.
                    </p>
                    <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                        Join FlowList and turn scattered tasks into a clear path you can actually finish.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                            <Button size="lg" nativeButton={false} render={<Link href="/signup" />}>
                                Create account
                                <ArrowRightIcon data-icon="inline-end" />
                            </Button>
                        </motion.div>
                        <Button variant="outline" size="lg" nativeButton={false} render={<Link href="/signin" />}>
                            I already have one
                        </Button>
                    </div>
                </motion.section>

                <footer id="footer" className="border-t border-border pt-5 text-center text-xs text-muted-foreground sm:text-sm">
                    <p>© {new Date().getFullYear()} FlowList. Built for focused planning and calm execution.</p>
                </footer>
            </div>
        </main>
    );
}
