"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { signOut } from "next-auth/react";
import axios from "axios";

const ThemeToggle = dynamic(() => import("@/app/components/theme-toggle"), {
    ssr: false,
});

type TodoItem = {
    id: number;
    title: string;
    description: string | null;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
};

type TodoBoardProps = {
    initialTodos: TodoItem[];
    username: string;
};

const playPopSound = (isUndo = false) => {
    try {
        const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        
        const context = new AudioContextClass();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        // Soft triangle wave for pleasing tone
        oscillator.type = "triangle";
        
        const startFreq = isUndo ? 440 : 880;
        const endFreq = isUndo ? 220 : 440;

        oscillator.frequency.setValueAtTime(startFreq, context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(endFreq, context.currentTime + 0.12);

        gainNode.gain.setValueAtTime(0, context.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, context.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.12);

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.start();
        oscillator.stop(context.currentTime + 0.12);
    } catch (e) {}
};

export default function TodoBoard({ initialTodos, username }: TodoBoardProps) {
    const [todos, setTodos] = useState(initialTodos);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [isClient, setIsClient] = useState(false);
    const [isNavCompact, setIsNavCompact] = useState(false);
    const [navOffsetY, setNavOffsetY] = useState(0);
    const lastScrollYRef = useRef(0);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) {
            return;
        }

        const scrollContainer = document.getElementById("dashboard-scroll-container");

        if (!scrollContainer) {
            return;
        }

        const onScroll = () => {
            const currentY = scrollContainer.scrollTop;
            const isScrollingDown = currentY > lastScrollYRef.current;

            if (currentY < 24) {
                setIsNavCompact(false);
            } else if (isScrollingDown && currentY > 56) {
                setIsNavCompact(true);
            } else if (!isScrollingDown) {
                setIsNavCompact(false);
            }

            setNavOffsetY(Math.min(currentY * 0.16, 14));

            lastScrollYRef.current = currentY;
        };

        onScroll();

        scrollContainer.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            scrollContainer.removeEventListener("scroll", onScroll);
        };
    }, [isClient]);

    const navCompact = isClient && isNavCompact;

    const openTodos = useMemo(() => todos.filter((todo) => !todo.completed), [todos]);
    const completedTodos = useMemo(() => todos.filter((todo) => todo.completed), [todos]);
    const completionRate = todos.length === 0 ? 0 : Math.round((completedTodos.length / todos.length) * 100);

    const createTodo = async () => {
        setError("");

        if (!title.trim()) {
            setError("Please add a task title.");
            return;
        }

        setIsSaving(true);

        try {
            const { data: payload } = await axios.post<{ todo: TodoItem }>("/api/todos", {
                title,
                description,
            });

            setTodos((current) => [payload.todo, ...current]);
            setTitle("");
            setDescription("");
        } catch {
            setError("Could not create todo. Try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const toggleTodo = async (todo: TodoItem) => {
        // Play pleasing sound for both complete and undo
        playPopSound(todo.completed);

        try {
            const { data: payload } = await axios.patch<{ todo: TodoItem }>(`/api/todos/${todo.id}`, {
                completed: !todo.completed,
            });

            setTodos((current) => current.map((item) => (item.id === todo.id ? payload.todo : item)));
        } catch {
            setError("Could not update todo status.");
        }
    };

    const updateTodo = async (todo: TodoItem, fields: { title: string; description: string | null }) => {
        try {
            const { data: payload } = await axios.patch<{ todo: TodoItem }>(`/api/todos/${todo.id}`, fields);
            setTodos((current) => current.map((item) => (item.id === todo.id ? payload.todo : item)));
        } catch {
            setError("Could not save todo updates.");
        }
    };

    const deleteTodo = async (todoId: number) => {
        try {
            await axios.delete(`/api/todos/${todoId}`);
            setTodos((current) => current.filter((todo) => todo.id !== todoId));
        } catch {
            setError("Could not delete todo.");
        }
    };

    return (
        <main id="dashboard-scroll-container" className="relative h-screen overflow-y-auto overflow-x-hidden bg-[#edf4ff] text-[#0f172a] dark:bg-[#090c14] dark:text-[#d5d9e7]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(59,130,246,0.2),transparent_34%),radial-gradient(circle_at_82%_4%,rgba(14,165,233,0.16),transparent_28%),linear-gradient(180deg,#edf4ff_12%,#e3edff_100%)] dark:bg-[radial-gradient(circle_at_18%_0%,rgba(36,135,255,0.22),transparent_34%),radial-gradient(circle_at_82%_4%,rgba(10,180,255,0.16),transparent_28%),linear-gradient(180deg,#090c14_12%,#060912_100%)]" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.22),transparent_68%)] blur-xl dark:bg-[radial-gradient(circle_at_center,rgba(10,132,255,0.16),transparent_68%)]" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.22),transparent_68%)] blur-xl dark:bg-[radial-gradient(circle_at_center,rgba(10,132,255,0.16),transparent_68%)]" />

            <header
                style={{ transform: `translateY(${navOffsetY}px)` }}
                className={`fixed inset-x-0 top-0 z-40 border-b border-[#9bb9ea] bg-[#f4f8ffde] backdrop-blur-xl transition-all duration-300 ease-out dark:border-[#1f2f4e] dark:bg-[#080e1b]/88 ${
                    navCompact ? "py-0" : "py-1"
                }`}
            >
                <div
                    className={`mx-auto flex w-full max-w-[1600px] items-center justify-between px-4 transition-all duration-300 ease-out sm:px-6 lg:px-8 ${
                        navCompact ? "h-11 scale-[0.985]" : "h-14"
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <span
                            className={`inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-[#17b5ff] to-[#2f6df8] text-white shadow-[0_8px_18px_rgba(37,99,235,0.35)] transition-all duration-300 ${
                                navCompact ? "h-6 w-6" : "h-7 w-7"
                            }`}
                        >
                            <svg viewBox="0 0 24 24" aria-hidden="true" className={`${navCompact ? "h-3.5 w-3.5" : "h-4 w-4"} fill-current`}>
                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                            </svg>
                        </span>
                        <p
                            className={`font-semibold text-[#1e3a8a] transition-all duration-300 dark:text-[#edf3ff] ${
                                navCompact ? "text-[13px]" : "text-sm"
                            }`}
                        >
                            FlowList
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle className="hidden sm:inline-flex" />

                        <div className="hidden rounded-md border border-[#7ea3df] bg-[#e8f0ff] px-3 py-1.5 text-xs font-semibold text-[#1e3a8a] dark:border-[#304b7e] dark:bg-[#13213a] dark:text-[#e2ebff] sm:inline-flex">
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#2563eb] text-[10px] font-bold text-white dark:bg-[#3349ff]">
                                {username.slice(0, 1).toUpperCase()}
                            </span>
                            <span className="ml-2">{username}</span>
                        </div>

                        <button
                            type="button"
                            onClick={() => void signOut({ callbackUrl: "/signin" })}
                            className="rounded-md border border-[#7ea3df] bg-[#e8f0ff] px-3 py-1.5 text-xs font-semibold text-[#1e3a8a] transition hover:border-[#5f8ad3] hover:bg-[#dce8ff] dark:border-[#304b7e] dark:bg-[#13213a] dark:text-[#e2ebff] dark:hover:border-[#4f74bb] dark:hover:bg-[#1a2c4d]"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </header>

            <section className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-10 pt-20 sm:px-6 lg:px-8">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Total tasks" value={todos.length} accent="from-[#f59e0b]/25 to-[#f97316]/10" />
                    <StatCard label="Open" value={openTodos.length} accent="from-[#3b82f6]/25 to-[#2563eb]/10" />
                    <StatCard label="Completed" value={completedTodos.length} accent="from-[#10b981]/25 to-[#059669]/10" />
                    <StatCard label="Completion" value={`${completionRate}%`} accent="from-[#22d3ee]/25 to-[#0ea5e9]/10" />
                </div>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        void createTodo();
                    }}
                    className="mt-5 grid gap-3 rounded-2xl border border-[#bcd0f5] bg-[#f6faff]/90 p-4 transition hover:border-[#7ea7ea] hover:shadow-[0_14px_30px_rgba(37,99,235,0.16)] dark:border-[#2a3650] dark:bg-[#0c121f]/90 dark:hover:border-[#375894] lg:grid-cols-[1fr_1fr_auto]"
                >
                    <label htmlFor="new-todo-title" className="sr-only">
                        Task title
                    </label>
                    <input
                        id="new-todo-title"
                        name="title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Task title"
                        className="rounded-xl border border-[#b7caf0] bg-[#ffffff] px-4 py-3 text-sm text-[#0f172a] outline-none transition placeholder:text-[#64748b] focus:border-[#2563eb] dark:border-[#2d3d60] dark:bg-[#0f1628] dark:text-[#edf2ff] dark:placeholder:text-[#687491] dark:focus:border-[#339dff]"
                    />
                    <label htmlFor="new-todo-description" className="sr-only">
                        Description (optional)
                    </label>
                    <input
                        id="new-todo-description"
                        name="description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Description (optional)"
                        className="rounded-xl border border-[#b7caf0] bg-[#ffffff] px-4 py-3 text-sm text-[#0f172a] outline-none transition placeholder:text-[#64748b] focus:border-[#2563eb] dark:border-[#2d3d60] dark:bg-[#0f1628] dark:text-[#edf2ff] dark:placeholder:text-[#687491] dark:focus:border-[#339dff]"
                    />
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="rounded-xl bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(37,99,235,0.4)] transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSaving ? "Saving..." : "Add task"}
                    </button>
                </form>

                {error ? <p className="mt-3 text-sm text-[#dc2626] dark:text-[#ff8a7a]">{error}</p> : null}

                <section className="mt-5 grid gap-4 xl:grid-cols-2">
                    <TodoColumn
                        title="Open tasks"
                        todos={openTodos}
                        emptyText="No open tasks. Great momentum."
                        onToggle={toggleTodo}
                        onDelete={deleteTodo}
                        onSave={updateTodo}
                    />
                    <TodoColumn
                        title="Completed"
                        todos={completedTodos}
                        emptyText="Nothing completed yet. Start with one task."
                        onToggle={toggleTodo}
                        onDelete={deleteTodo}
                        onSave={updateTodo}
                    />
                </section>
            </section>
        </main>
    );
}

function StatCard({ label, value, accent }: { label: string; value: string | number; accent: string }) {
    return (
        <article className={`stat-card-glow rounded-xl border border-[#a9c1ec] bg-gradient-to-br ${accent} p-[1px] transition hover:border-[#5f89d2] hover:shadow-[0_14px_30px_rgba(24,94,224,0.18)] dark:border-[#24314b] dark:hover:border-[#3e5f9d]`}>
            <div className="rounded-[11px] bg-[#f5f9ff] px-4 py-3 dark:bg-[#0c121f]">
                <p className="text-xs uppercase tracking-[0.14em] text-[#5b7ab4] dark:text-[#90a0c4]">{label}</p>
                <p className="mt-1 text-3xl font-semibold text-[#0f172a] dark:text-[#ecf2ff]">{value}</p>
            </div>
        </article>
    );
}

type TodoColumnProps = {
    title: string;
    todos: TodoItem[];
    emptyText: string;
    onToggle: (todo: TodoItem) => Promise<void>;
    onDelete: (todoId: number) => Promise<void>;
    onSave: (todo: TodoItem, fields: { title: string; description: string | null }) => Promise<void>;
};

function TodoColumn({ title, todos, emptyText, onToggle, onDelete, onSave }: TodoColumnProps) {
    return (
        <section className="rounded-2xl border border-[#b8cdf2] bg-[#f6faff]/92 transition hover:border-[#6f98dd] hover:shadow-[0_16px_34px_rgba(24,94,224,0.2)] dark:border-[#24314b] dark:bg-[#0b101b]/92 dark:hover:border-[#3a5b96]">
            <header className="border-b border-[#c9d9f4] px-4 py-3 dark:border-[#1c2a45]">
                <h3 className="font-semibold text-[#1e3a8a] dark:text-[#eef2ff]">{title}</h3>
            </header>
            <div className="max-h-[38rem] overflow-auto px-4 py-4">
                {todos.length === 0 ? <p className="text-sm text-[#64748b] dark:text-[#7f8aa8]">{emptyText}</p> : null}
                <ul className="space-y-3">
                    {todos.map((todo) => (
                        <TodoRow key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} onSave={onSave} />
                    ))}
                </ul>
            </div>
        </section>
    );
}

type TodoRowProps = {
    todo: TodoItem;
    onToggle: (todo: TodoItem) => Promise<void>;
    onDelete: (todoId: number) => Promise<void>;
    onSave: (todo: TodoItem, fields: { title: string; description: string | null }) => Promise<void>;
};

function TodoRow({ todo, onToggle, onDelete, onSave }: TodoRowProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(todo.title);
    const [description, setDescription] = useState(todo.description ?? "");

    const saveEdits = async () => {
        if (!title.trim()) {
            return;
        }

        await onSave(todo, {
            title,
            description: description.trim() ? description : null,
        });

        setIsEditing(false);
    };

    return (
        <li className="rounded-xl border border-[#bfd2f2] bg-[#ffffff] p-3 transition hover:border-[#6f97dd] hover:shadow-[0_10px_22px_rgba(24,94,224,0.2)] dark:border-[#23314d] dark:bg-[#0e1525] dark:hover:border-[#3a5a93]">
            <div className="flex items-start justify-between gap-3">
                <button
                    type="button"
                    onClick={() => void onToggle(todo)}
                    className={`mt-1 h-5 w-5 rounded-full border-2 transition ${
                        todo.completed ? "border-[#34d399] bg-[#10b981]" : "border-[#7f95be] bg-transparent dark:border-[#4a5d83]"
                    }`}
                    aria-label="Toggle completed"
                />

                <div className="flex-1 space-y-1">
                    {isEditing ? (
                        <>
                            <input
                                name="edit-title"
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                className="w-full rounded-lg border border-[#bfd1f2] bg-[#f7fbff] px-3 py-2 text-sm text-[#0f172a] dark:border-[#33486e] dark:bg-[#101a2c] dark:text-[#edf2ff]"
                            />
                            <textarea
                                name="edit-description"
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                rows={2}
                                className="w-full rounded-lg border border-[#bfd1f2] bg-[#f7fbff] px-3 py-2 text-sm text-[#0f172a] dark:border-[#33486e] dark:bg-[#101a2c] dark:text-[#edf2ff]"
                            />
                        </>
                    ) : (
                        <>
                            <h4 className={`text-sm font-semibold ${todo.completed ? "text-[#8ca0c7] line-through dark:text-[#7e8db2]" : "text-[#0f172a] dark:text-[#e8eeff]"}`}>
                                {todo.title}
                            </h4>
                            {todo.description ? <p className="text-sm text-[#64748b] dark:text-[#8d9bbb]">{todo.description}</p> : null}
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <button
                            type="button"
                            onClick={() => void saveEdits()}
                            className="rounded-md bg-gradient-to-r from-[#e4572e] to-[#ca3f21] px-3 py-1.5 text-xs font-semibold text-white"
                        >
                            Save
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="rounded-md border border-[#7ea1dd] px-3 py-1.5 text-xs font-semibold text-[#1e3a8a] dark:border-[#3c4f74] dark:text-[#dbe5ff]"
                        >
                            Edit
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => void onDelete(todo.id)}
                        className="rounded-md border border-[#f5b7c3] bg-[#fff0f4] px-3 py-1.5 text-xs font-semibold text-[#be123c] dark:border-[#6a3140] dark:bg-[#2a1420] dark:text-[#ffa1b5]"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </li>
    );
}
