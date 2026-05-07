"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Caveat } from "next/font/google";

import { authClient } from "@/app/lib/auth/client";

const caveat = Caveat({
    subsets: ["latin"],
    weight: ["600", "700"],
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

const playCatSound = (isCompleted: boolean) => {
    try {
        const audioWindow = window as Window & {
            AudioContext?: typeof AudioContext;
            webkitAudioContext?: typeof AudioContext;
        };
        const AudioContextClass = audioWindow.AudioContext || audioWindow.webkitAudioContext;

        if (!AudioContextClass) {
            return;
        }

        const context = new AudioContextClass();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.type = "triangle";

        const start = isCompleted ? 820 : 620;
        const mid = isCompleted ? 980 : 520;
        const end = isCompleted ? 740 : 420;

        oscillator.frequency.setValueAtTime(start, context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(mid, context.currentTime + 0.06);
        oscillator.frequency.exponentialRampToValueAtTime(end, context.currentTime + 0.16);

        gainNode.gain.setValueAtTime(0.0001, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.18);

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.start();
        oscillator.stop(context.currentTime + 0.19);
    } catch {
        // ignore audio errors
    }
};

export default function TodoBoard({ initialTodos, username }: TodoBoardProps) {
    const [todos, setTodos] = useState(initialTodos);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [toast, setToast] = useState("");
    const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (toastTimerRef.current) {
                clearTimeout(toastTimerRef.current);
            }
        };
    }, []);

    const openTodos = useMemo(() => todos.filter((todo) => !todo.completed), [todos]);
    const completedTodos = useMemo(() => todos.filter((todo) => todo.completed), [todos]);

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
        playCatSound(false);
        setToast("Task added");
        setTitle("");
        setDescription("");

        if (toastTimerRef.current) {
            clearTimeout(toastTimerRef.current);
        }

        toastTimerRef.current = setTimeout(() => {
            setToast("");
        }, 900);
        } catch {
            setError("Could not create todo. Try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const toggleTodo = async (todo: TodoItem) => {
        const nextCompleted = !todo.completed;
        playCatSound(nextCompleted);

        setTodos((current) =>
            current.map((item) =>
                item.id === todo.id
                    ? {
                          ...item,
                          completed: nextCompleted,
                      }
                    : item,
            ),
        );

        try {
            const { data: payload } = await axios.patch<{ todo: TodoItem }>(`/api/todos/${todo.id}`, {
                completed: nextCompleted,
            });
            setTodos((current) => current.map((item) => (item.id === todo.id ? payload.todo : item)));
            setToast(nextCompleted ? "Task marked as completed" : "Task moved back to To Do");

            if (toastTimerRef.current) {
                clearTimeout(toastTimerRef.current);
            }

            toastTimerRef.current = setTimeout(() => {
                setToast("");
            }, 900);
        } catch {
            setTodos((current) =>
                current.map((item) =>
                    item.id === todo.id
                        ? {
                              ...item,
                              completed: todo.completed,
                          }
                        : item,
                ),
            );
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
        <main className="min-h-screen bg-[#211f24] text-[#f8f1f2]">
            {toast ? (
                <div className="toast-cat fixed right-4 top-4 z-50 rounded-xl border border-[#8d4451] bg-[#6c3240] px-4 py-2 text-sm font-semibold text-[#ffe8ec] shadow-[0_12px_24px_rgba(0,0,0,0.35)]">
                    {toast}
                </div>
            ) : null}
            <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pt-8">
                <header className="mb-6 rounded-3xl border border-[#713743] bg-[radial-gradient(circle_at_top_left,#522531_0%,#291f28_55%,#1f1d22_100%)] p-4 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.16em] text-[#d28f99]">FlowList Activity</p>
                            <h1 className={`${caveat.className} text-2xl font-semibold text-[#ffe4e8] sm:text-3xl`}>Hey, {username}</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    void authClient.signOut({
                                        fetchOptions: {
                                            onSuccess: () => {
                                                window.location.href = "/signin";
                                            },
                                        },
                                    })
                                }
                                className="rounded-xl border border-[#8d4451] bg-[#6c3240] px-3 py-2 text-xs font-semibold text-[#ffe8ec] transition hover:bg-[#7a3a48]"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </header>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        void createTodo();
                    }}
                    className="mb-6 grid gap-3 rounded-2xl border border-[#6e3642] bg-[#2b232a] p-4 md:grid-cols-[1fr_1fr_auto]"
                >
                    <input
                        name="title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Task title"
                        className="rounded-xl border border-[#75404c] bg-[#3a2a32] px-4 py-3 text-sm text-[#fff2f4] outline-none placeholder:text-[#c6949d] focus:border-[#cd5f74]"
                    />
                    <input
                        name="description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Description (optional)"
                        className="rounded-xl border border-[#75404c] bg-[#3a2a32] px-4 py-3 text-sm text-[#fff2f4] outline-none placeholder:text-[#c6949d] focus:border-[#cd5f74]"
                    />
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="rounded-xl bg-gradient-to-r from-[#c14f63] to-[#98384b] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSaving ? "Saving..." : "Add task"}
                    </button>
                </form>

                {error ? <p className="mb-4 text-sm text-[#ff9cab]">{error}</p> : null}

                <section className="grid gap-4 sm:grid-cols-2">
                    <TodoColumn title="To Do" todos={openTodos} onToggle={toggleTodo} onDelete={deleteTodo} onSave={updateTodo} />
                    <TodoColumn title="Done" todos={completedTodos} onToggle={toggleTodo} onDelete={deleteTodo} onSave={updateTodo} />
                </section>
            </div>
        </main>
    );
}

type TodoColumnProps = {
    title: string;
    todos: TodoItem[];
    onToggle: (todo: TodoItem) => Promise<void>;
    onDelete: (todoId: number) => Promise<void>;
    onSave: (todo: TodoItem, fields: { title: string; description: string | null }) => Promise<void>;
};

function TodoColumn({ title, todos, onToggle, onDelete, onSave }: TodoColumnProps) {
    return (
        <section className="rounded-3xl border border-[#6f3642] bg-[#3d2b33] p-4 sm:p-5">
            <header className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#ffe7eb]">{title}</h2>
                <span className="rounded-full bg-[#6d3240] px-2.5 py-1 text-xs font-semibold text-[#ffe9ee]">{todos.length}</span>
            </header>
            <ul className="space-y-3">
                {todos.map((todo) => (
                    <TodoRow key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} onSave={onSave} />
                ))}
                {todos.length === 0 ? <li className="rounded-xl bg-[#4a333c] px-3 py-2 text-sm text-[#e3b7be]">No tasks here.</li> : null}
            </ul>
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
        <li className="rounded-2xl border border-[#8a4251] bg-[#9f4657] p-3 text-[#fff5f7]">
            <div className="flex items-start gap-3">
                <button
                    type="button"
                    onClick={() => void onToggle(todo)}
                    className={`mt-1 h-5 w-5 rounded border-2 ${todo.completed ? "border-[#fdd9df] bg-[#5c2733]" : "border-[#ffe7ec] bg-transparent"}`}
                    aria-label="Toggle completed"
                />

                <div className="min-w-0 flex-1">
                    {isEditing ? (
                        <div className="space-y-2">
                            <input
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                className="w-full rounded-lg border border-[#d18493] bg-[#7f3746] px-3 py-2 text-sm text-[#fff7f8]"
                            />
                            <textarea
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                rows={2}
                                className="w-full rounded-lg border border-[#d18493] bg-[#7f3746] px-3 py-2 text-sm text-[#fff7f8]"
                            />
                        </div>
                    ) : (
                        <>
                            <p className={`text-base font-semibold ${todo.completed ? "line-through opacity-70" : ""}`}>{todo.title}</p>
                            {todo.description ? <p className="mt-1 text-sm text-[#ffe5ea]">{todo.description}</p> : null}
                        </>
                    )}
                </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
                {isEditing ? (
                    <button
                        type="button"
                        onClick={() => void saveEdits()}
                        className="rounded-lg bg-[#5f2733] px-3 py-1.5 text-xs font-semibold text-[#fff3f5]"
                    >
                        Save
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="rounded-lg border border-[#f0b7c1] bg-[#b9576a] px-3 py-1.5 text-xs font-semibold text-white"
                    >
                        Edit
                    </button>
                )}

                <button
                    type="button"
                    onClick={() => void onDelete(todo.id)}
                    className="rounded-lg border border-[#f3c0c8] bg-[#d66b7e] px-3 py-1.5 text-xs font-semibold text-white"
                >
                    Delete
                </button>
            </div>
        </li>
    );
}
