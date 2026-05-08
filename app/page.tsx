import Link from "next/link";
import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/current-user";
import { caveat } from "@/app/lib/fonts";
import TodoBoardShell from "@/components/todo/todo-board-shell";
import { todos } from "@/drizzle/schema";

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    const userTodos = await db.select().from(todos).where(eq(todos.userId, user.id)).orderBy(desc(todos.createdAt));

    return <TodoBoardShell initialTodos={userTodos.map((todo) => ({ ...todo, createdAt: todo.createdAt.toISOString(), updatedAt: todo.updatedAt.toISOString() }))} username={user.username} />;
  }

  return (
    <main className="min-h-screen scroll-smooth bg-[#211f24] text-[#f8f1f2]">
      <div className="mx-auto w-full max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-8 lg:pt-10">
        <header className="sticky top-3 z-40 mb-6 rounded-2xl border border-[#8a4a58]/55 bg-[linear-gradient(135deg,rgba(74,43,53,0.72),rgba(37,29,36,0.62))] px-4 py-3 shadow-[0_12px_30px_rgba(8,6,8,0.35)] backdrop-blur-xl sm:px-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className={`${caveat.className} text-2xl font-semibold text-[#ffe7eb]`}>FlowList</p>
            <div className="flex flex-wrap items-center gap-2">
              <nav className={`${caveat.className} flex items-center gap-2 text-base font-semibold text-[#f0c0ca] sm:text-lg`}>
                <a href="#overview" className="rounded-lg px-2 py-1 transition hover:bg-[#3a2a32] hover:text-[#ffe5ea]">Overview</a>
                <a href="#features" className="rounded-lg px-2 py-1 transition hover:bg-[#3a2a32] hover:text-[#ffe5ea]">Features</a>
                <a href="#why" className="rounded-lg px-2 py-1 transition hover:bg-[#3a2a32] hover:text-[#ffe5ea]">Why FlowList</a>
                <a href="#footer" className="rounded-lg px-2 py-1 transition hover:bg-[#3a2a32] hover:text-[#ffe5ea]">Contact</a>
              </nav>
              <Link href="/signin" className={`${caveat.className} rounded-lg border border-[#7f3b49] px-3 py-1.5 text-base font-semibold text-[#ffd9e1] transition hover:bg-[#3a2a32] sm:text-lg`}>Sign in</Link>
              <Link href="/signup" className={`${caveat.className} rounded-lg bg-[linear-gradient(120deg,#c14f63,#98384b)] px-3 py-1.5 text-base font-semibold text-white transition hover:brightness-110 sm:text-lg`}>Sign up</Link>
            </div>
          </div>
        </header>

        <section id="overview" className="rounded-3xl border border-[#713743] bg-[radial-gradient(circle_at_top_left,#542833_0%,#2a2029_55%,#1f1d22_100%)] p-6 shadow-[0_18px_40px_rgba(10,8,10,0.35)] sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="inline-flex rounded-full border border-[#8d4451] bg-[#6c3240] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#ffe4e8]">Daily focus system</p>
              <p className={`${caveat.className} mt-3 text-2xl text-[#ffcad4] sm:text-3xl`}>Less noise. More done.</p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#ffe8ec] sm:text-5xl">FlowList helps you finish what matters, every day.</h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#ddb5bc] sm:text-lg">
                Plan fast, track progress, and keep momentum with a clean task board built for deep work. FlowList gives you just enough structure to stay consistent without feeling cluttered.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/signup" className="rounded-xl bg-[linear-gradient(120deg,#c14f63,#98384b)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-110">
                  Start free
                </Link>
                <Link href="/signin" className="rounded-xl border border-[#8d4451] bg-[#362730] px-5 py-3 text-sm font-semibold text-[#ffdce2] transition hover:bg-[#412e38]">
                  Sign in
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-[#7a3b49] bg-[#3a2b33] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-[#f3c5ce]">Today preview</p>
              <p className={`${caveat.className} mt-2 text-xl text-[#ffd7de]`}>A small plan for a big day</p>
              <ul className="mt-4 space-y-3 text-sm text-[#ffe8ec]">
                <li className="rounded-xl border border-[#8b4252] bg-[#9b4658] px-3 py-2">Design homepage polish and CTA flow</li>
                <li className="rounded-xl border border-[#8b4252] bg-[#9b4658] px-3 py-2">Review overdue items and close two tasks</li>
                <li className="rounded-xl border border-[#8b4252] bg-[#9b4658] px-3 py-2">Ship updates before end of day</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="features" className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-[#6d3440] bg-[#2b232a] p-5">
            <h2 className="text-lg font-semibold text-[#ffe6eb]">Organize Quickly</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#d9aeb7]">Add tasks in seconds, keep descriptions concise, and avoid losing context while switching between priorities.</p>
          </article>
          <article className="rounded-2xl border border-[#6d3440] bg-[#2b232a] p-5">
            <h2 className="text-lg font-semibold text-[#ffe6eb]">Track Progress</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#d9aeb7]">Use your open vs completed lanes to see exactly where your day stands and what needs attention next.</p>
          </article>
          <article className="rounded-2xl border border-[#6d3440] bg-[#2b232a] p-5">
            <h2 className="text-lg font-semibold text-[#ffe6eb]">Stay Consistent</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#d9aeb7]">FlowList keeps your workflow intentional so you can build routines and ship meaningful work with less friction.</p>
          </article>
        </section>

        <section id="why" className="mt-6 rounded-2xl border border-[#6d3440] bg-[#2b232a] p-5 sm:p-6">
          <h3 className="text-xl font-semibold text-[#ffe7eb]">Why people stick with FlowList</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <p className="rounded-xl bg-[#382a32] px-4 py-3 text-sm text-[#e4bcc4]">The board is calm, readable, and easy to trust when your day gets busy.</p>
            <p className="rounded-xl bg-[#382a32] px-4 py-3 text-sm text-[#e4bcc4]">Tasks stay simple: add, update, finish, and move on without friction.</p>
            <p className="rounded-xl bg-[#382a32] px-4 py-3 text-sm text-[#e4bcc4]">Works smoothly on phone and desktop, so your planning never breaks.</p>
            <p className="rounded-xl bg-[#382a32] px-4 py-3 text-sm text-[#e4bcc4]">Built to help you complete meaningful work, not just collect checkboxes.</p>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-[#6d3440] bg-[#2b232a] p-5 sm:p-6">
          <h3 className="text-xl font-semibold text-[#ffe7eb]">How FlowList fits your day</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <article className="rounded-xl bg-[#382a32] p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[#d89ea9]">Morning</p>
              <p className="mt-2 text-sm text-[#f0ced4]">Capture your top priorities before distractions appear.</p>
            </article>
            <article className="rounded-xl bg-[#382a32] p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[#d89ea9]">Midday</p>
              <p className="mt-2 text-sm text-[#f0ced4]">Update progress quickly so you always know what is next.</p>
            </article>
            <article className="rounded-xl bg-[#382a32] p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[#d89ea9]">Evening</p>
              <p className="mt-2 text-sm text-[#f0ced4]">Close finished tasks and roll over only what still matters.</p>
            </article>
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-[#6d3440] bg-[#2b232a] p-5 sm:p-6">
            <h3 className="text-xl font-semibold text-[#ffe7eb]">Designed for momentum</h3>
            <p className="mt-3 text-sm leading-relaxed text-[#ddb2bb]">FlowList gives you a focused rhythm: fewer decisions, cleaner priorities, and better follow-through. Instead of juggling tools, you stay in one simple loop from planning to completion.</p>
            <ul className="mt-4 space-y-2 text-sm text-[#efc6ce]">
              <li>• Keep important tasks visible</li>
              <li>• Reduce context switching</li>
              <li>• Build a weekly completion habit</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-[#6d3440] bg-[#2b232a] p-5 sm:p-6">
            <h3 className="text-xl font-semibold text-[#ffe7eb]">Made for real-life planning</h3>
            <p className="mt-3 text-sm leading-relaxed text-[#ddb2bb]">Some days are packed, some are unpredictable. FlowList stays flexible so you can adapt fast, make clean updates, and still end the day with clarity.</p>
            <ul className="mt-4 space-y-2 text-sm text-[#efc6ce]">
              <li>• Works great for personal and work tasks</li>
              <li>• Quick edits when plans change</li>
              <li>• A clear done-state that feels rewarding</li>
            </ul>
          </article>
        </section>

        <section className="mt-6 rounded-2xl border border-[#6d3440] bg-[linear-gradient(130deg,#3f2b34,#2b232a)] p-6 text-center sm:p-8">
          <h3 className="text-2xl font-semibold text-[#ffe9ee]">Ready to plan your next focused day?</h3>
          <p className={`${caveat.className} mt-2 text-2xl text-[#ffd1d9] sm:text-3xl`}>Start now, thank yourself tonight.</p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#dfb5be] sm:text-base">Join FlowList and turn scattered tasks into a clear path you can actually finish.</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Link href="/signup" className="rounded-xl bg-[linear-gradient(120deg,#c14f63,#98384b)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-110">Create account</Link>
            <Link href="/signin" className="rounded-xl border border-[#8d4451] bg-[#362730] px-5 py-3 text-sm font-semibold text-[#ffdce2] transition hover:bg-[#412e38]">I already have one</Link>
          </div>
        </section>

        <footer id="footer" className="mt-8 border-t border-[#5f2e39] pt-5 text-center text-xs text-[#b88b95] sm:text-sm">
          <p>© {new Date().getFullYear()} FlowList. Built for focused planning and calm execution.</p>
          <p className="mt-1">Built with care for people who want clarity, consistency, and calm progress.</p>
        </footer>
      </div>
    </main>
  );
}
