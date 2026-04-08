"use client";

import { useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import axios from "axios";

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

export default function TodoBoard({ initialTodos, username }: TodoBoardProps) {
    const [todos, setTodos] = useState(initialTodos);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    const openTodos = useMemo(() => todos.filter((todo) => !todo.completed).length, [todos]);
    const completedTodos = todos.length - openTodos;

    const createTodo = async () => {
        setError("");

        if (!title.trim()) {
            setError("Please add a title.");
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
        <main className="relative flex min-h-screen justify-center overflow-hidden bg-[#f7f3ec] px-5 py-10 sm:px-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(242,138,73,0.26),transparent_34%),radial-gradient(circle_at_82%_14%,rgba(255,189,122,0.22),transparent_30%),radial-gradient(circle_at_58%_92%,rgba(215,94,48,0.2),transparent_36%)]" />

            <section className="relative z-10 w-full max-w-5xl rounded-[30px] border border-[#8f4a1f2b] bg-[linear-gradient(165deg,rgba(255,255,255,0.84),rgba(255,247,232,0.94))] p-6 shadow-[0_24px_56px_rgba(124,59,24,0.16)] backdrop-blur sm:p-8">
                <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-[#92400e]">FlowList Dashboard</p>
                        <h1 className="mt-1 text-3xl font-semibold text-[#1e293b]">Welcome, {username}</h1>
                        <p className="mt-2 text-sm text-[#475569]">Plan faster and clear tasks with intention.</p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                            <span className="rounded-full border border-[#f0b06f] bg-[#ffe9cf] px-3 py-1 text-[#9a4b13]">Open {openTodos}</span>
                            <span className="rounded-full border border-[#89d5b4] bg-[#e8fff4] px-3 py-1 text-[#136143]">Done {completedTodos}</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => void signOut({ callbackUrl: "/signin" })}
                        className="rounded-xl border border-[#8f4a1f4a] bg-white/80 px-4 py-2 text-sm font-semibold text-[#1f2937] transition hover:-translate-y-0.5 hover:bg-[#fff5e5]"
                    >
                        Sign out
                    </button>
                </div>

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        void createTodo();
                    }}
                    className="grid gap-3 rounded-2xl border border-[#8f4a1f29] bg-white/90 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-center"
                >
                    <input
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Task title"
                        className="rounded-xl border border-[#c87b4e55] px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-[#df6b3f] focus:ring-2 focus:ring-[#f7bc7b]"
                    />
                    <input
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Description (optional)"
                        className="rounded-xl border border-[#c87b4e55] px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-[#df6b3f] focus:ring-2 focus:ring-[#f7bc7b]"
                    />
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="rounded-xl bg-[linear-gradient(120deg,#e4572e,#ca3f21)] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(196,72,32,0.34)] transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSaving ? "Saving..." : "Add"}
                    </button>
                </form>

                {error ? <p className="mt-3 text-sm text-[#c2410c]">{error}</p> : null}

                <ul className="mt-6 space-y-3">
                    {todos.map((todo) => (
                        <TodoRow
                            key={todo.id}
                            todo={todo}
                            onToggle={toggleTodo}
                            onDelete={deleteTodo}
                            onSave={updateTodo}
                        />
                    ))}
                </ul>

                {todos.length === 0 ? (
                    <div className="mt-8 rounded-2xl border border-dashed border-[#8f4a1f4f] bg-[#fff7eb] p-6 text-sm text-[#475569]">
                        No todos yet. Add your first task above.
                    </div>
                ) : null}
            </section>
        </main>
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
        <li className="rounded-2xl border border-[#8f4a1f29] bg-white/95 p-4 shadow-[0_8px_20px_rgba(83,37,14,0.08)]">
            <div className="flex items-start justify-between gap-3">
                <button
                    type="button"
                    onClick={() => void onToggle(todo)}
                    className={`mt-1 h-5 w-5 rounded-full border-2 transition ${
                        todo.completed ? "border-[#10b981] bg-[#10b981]" : "border-[#cbd5e1] bg-white"
                    }`}
                    aria-label="Toggle completed"
                />

                <div className="flex-1 space-y-1">
                    {isEditing ? (
                        <>
                            <input
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                className="w-full rounded-lg border border-[#c87b4e55] px-3 py-2 text-sm"
                            />
                            <textarea
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                rows={2}
                                className="w-full rounded-lg border border-[#c87b4e55] px-3 py-2 text-sm"
                            />
                        </>
                    ) : (
                        <>
                            <h3 className={`text-sm font-semibold ${todo.completed ? "text-[#94a3b8] line-through" : "text-[#1f2937]"}`}>
                                {todo.title}
                            </h3>
                            {todo.description ? <p className="text-sm text-[#64748b]">{todo.description}</p> : null}
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <button
                            type="button"
                            onClick={() => void saveEdits()}
                            className="rounded-lg bg-[linear-gradient(120deg,#e4572e,#ca3f21)] px-3 py-1.5 text-xs font-semibold text-white"
                        >
                            Save
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="rounded-lg border border-[#0f172a2f] px-3 py-1.5 text-xs font-semibold text-[#334155]"
                        >
                            Edit
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => void onDelete(todo.id)}
                        className="rounded-lg border border-[#fecaca] bg-[#fff1f2] px-3 py-1.5 text-xs font-semibold text-[#b91c1c]"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </li>
    );
}
