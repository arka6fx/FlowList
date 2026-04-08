import Link from "next/link";

import TodoBoard from "@/app/components/todo-board";
import prisma from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/auth/current-user";

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

    return <TodoBoard initialTodos={todos.map((todo) => ({ ...todo, createdAt: todo.createdAt.toISOString(), updatedAt: todo.updatedAt.toISOString() }))} username={user.username} />;
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f4ea] bg-[linear-gradient(rgba(15,23,42,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.08)_1px,transparent_1px)] bg-size-[28px_28px] px-5 py-14 selection:bg-[#efb76880] selection:text-[#1e293b] sm:px-8">
      <div className="pointer-events-none absolute -left-24 top-16 h-56 w-56 rounded-full bg-[#f9b36f]/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-20 h-60 w-60 rounded-full bg-[#ff8a70]/40 blur-3xl" />

      <section className="relative z-10 w-full max-w-5xl rounded-3xl border border-[#0f172a1f] bg-[#fffcf1]/92 p-6 shadow-[0_22px_48px_rgba(15,23,42,0.14)] backdrop-blur md:p-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-5">
            <p className="inline-flex w-fit rounded-full border border-[#ffb86a] bg-[#ffe4c9] px-3 py-1 font-mono text-xs uppercase tracking-[0.24em] text-[#934012]">
              Focus better
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-[#1e293b] sm:text-5xl">
              Capture{" "}
              <span
                className="inline-block px-2 pb-0.5 pt-1 text-[#b75a16]"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 100' preserveAspectRatio='none'%3E%3Cpath d='M1 16 Q24 6 50 13 Q74 5 101 12 Q132 3 161 11 Q182 7 199 4 L199 86 Q181 97 157 91 Q132 99 103 92 Q73 99 46 92 Q20 100 1 94 Z' fill='rgba(244,186,96,0.24)'/%3E%3C/svg%3E\")",
                  backgroundSize: "100% 100%",
                  backgroundRepeat: "no-repeat",
                }}
              >
                tasks quickly
              </span>
              , finish your day calmly.
            </h1>
            <p className="text-base leading-relaxed text-[#334155] sm:text-lg">
              FlowList keeps your to-dos clean and intentional with priorities,
              simple planning, and a rhythm that helps you follow through.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/signup"
                className="rounded-xl bg-[#e4572e] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#c94623]"
              >
                Sign up free
              </Link>
              <Link
                href="/signin"
                className="rounded-xl border border-[#0f172a2f] px-5 py-3 text-sm font-semibold text-[#1f2937] transition hover:-translate-y-0.5 hover:bg-[#f3ebdc]"
              >
                Sign in
              </Link>
            </div>
          </div>

          <div className="w-full max-w-sm rounded-2xl border border-[#0f172a24] bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.1)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#475569]">
                Today
              </h2>
              <span className="rounded-lg bg-[#fef1dd] px-2 py-1 font-mono text-xs text-[#92400e]">
                3 tasks
              </span>
            </div>
            <ul className="space-y-3 text-sm text-[#1e293b]">
              <li className="flex items-center gap-3 rounded-xl bg-[#f8f2e4] px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#e4572e]" />
                Finalize landing page copy
              </li>
              <li className="flex items-center gap-3 rounded-xl bg-[#f8f2e4] px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
                Plan sprint priorities
              </li>
              <li className="flex items-center gap-3 rounded-xl bg-[#f8f2e4] px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#10b981]" />
                Review done checklist
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
