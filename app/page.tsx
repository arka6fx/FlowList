import Link from "next/link";

import prisma from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/auth/current-user";
import TodoBoardShell from "@/app/components/todo-board-shell";

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    const todos = await prisma.todo.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return <TodoBoardShell initialTodos={todos.map((todo) => ({ ...todo, createdAt: todo.createdAt.toISOString(), updatedAt: todo.updatedAt.toISOString() }))} username={user.username} />;
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#ebf2ff] bg-[linear-gradient(rgba(30,58,138,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.08)_1px,transparent_1px)] bg-size-[28px_28px] px-5 py-14 text-[#0f172a] selection:bg-[#93c5fd80] selection:text-[#0f172a] dark:bg-[#070d19] dark:bg-[linear-gradient(rgba(56,189,248,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.08)_1px,transparent_1px)] dark:text-[#dbeafe] sm:px-8">
      <div className="pointer-events-none absolute -left-24 top-16 h-56 w-56 rounded-full bg-[#60a5fa]/40 blur-3xl dark:bg-[#1d4ed8]/45" />
      <div className="pointer-events-none absolute -right-20 bottom-20 h-60 w-60 rounded-full bg-[#38bdf8]/30 blur-3xl dark:bg-[#0ea5e9]/35" />

      <section className="relative z-10 w-full max-w-5xl rounded-3xl border border-[#1e3a8a26] bg-[#f8fbff]/92 p-6 shadow-[0_22px_48px_rgba(30,58,138,0.14)] backdrop-blur dark:border-[#1e3a8a66] dark:bg-[#0b1324]/90 dark:shadow-[0_22px_54px_rgba(2,8,24,0.6)] md:p-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-5">
            <p className="inline-flex w-fit rounded-full border border-[#93c5fd] bg-[#dbeafe] px-3 py-1 font-mono text-xs uppercase tracking-[0.24em] text-[#1d4ed8] dark:border-[#1d4ed8] dark:bg-[#102341] dark:text-[#93c5fd]">
              Focus better
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-[#0f172a] dark:text-[#eff6ff] sm:text-5xl">
              Capture{" "}
              <span
                className="inline-block px-2 pb-0.5 pt-1 text-[#1e40af] dark:text-[#93c5fd]"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 100' preserveAspectRatio='none'%3E%3Cpath d='M1 16 Q24 6 50 13 Q74 5 101 12 Q132 3 161 11 Q182 7 199 4 L199 86 Q181 97 157 91 Q132 99 103 92 Q73 99 46 92 Q20 100 1 94 Z' fill='rgba(96,165,250,0.26)'/%3E%3C/svg%3E\")",
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                }}
              >
                tasks quickly
              </span>
              , finish your day calmly.
            </h1>
            <p className="text-base leading-relaxed text-[#334155] dark:text-[#a7b9dc] sm:text-lg">
              FlowList keeps your to-dos clean and intentional with priorities,
              simple planning, and a rhythm that helps you follow through.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/signup"
                className="rounded-xl bg-[linear-gradient(120deg,#2563eb,#1d4ed8)] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,0.35)] transition hover:-translate-y-0.5 hover:brightness-110"
              >
                Sign up free
              </Link>
              <Link
                href="/signin"
                className="rounded-xl border border-[#1e3a8a38] px-5 py-3 text-sm font-semibold text-[#1e3a8a] transition hover:-translate-y-0.5 hover:bg-[#e8f1ff] dark:border-[#34518a] dark:text-[#bfdbfe] dark:hover:bg-[#13223f]"
              >
                Sign in
              </Link>
            </div>
          </div>

          <div className="w-full max-w-sm rounded-2xl border border-[#1e3a8a24] bg-white p-5 shadow-[0_12px_28px_rgba(30,58,138,0.12)] transition hover:shadow-[0_16px_34px_rgba(37,99,235,0.2)] dark:border-[#263d69] dark:bg-[#0f1b31] dark:shadow-[0_12px_30px_rgba(2,8,24,0.55)] dark:hover:shadow-[0_16px_34px_rgba(59,130,246,0.22)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#475569] dark:text-[#a7b9dc]">
                Today
              </h2>
              <span className="rounded-lg bg-[#e0ecff] px-2 py-1 font-mono text-xs text-[#1e40af] dark:bg-[#10274d] dark:text-[#93c5fd]">
                3 tasks
              </span>
            </div>
            <ul className="space-y-3 text-sm text-[#1e293b] dark:text-[#dbeafe]">
              <li className="flex items-center gap-3 rounded-xl bg-[#edf4ff] px-3 py-2 dark:bg-[#122745]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#2563eb]" />
                Buy groceries for dinner
              </li>
              <li className="flex items-center gap-3 rounded-xl bg-[#edf4ff] px-3 py-2 dark:bg-[#122745]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#0ea5e9]" />
                Call mom in the evening
              </li>
              <li className="flex items-center gap-3 rounded-xl bg-[#edf4ff] px-3 py-2 dark:bg-[#122745]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#22d3ee]" />
                30-minute walk after lunch
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
