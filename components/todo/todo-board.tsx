"use client";

import { useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { PlusIcon, Trash2Icon, PencilIcon, LogOutIcon } from "lucide-react";

import { caveat } from "@/app/lib/fonts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

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
        if (!AudioContextClass) return;
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
        oscillator.onended = () => void context.close();
    } catch {
        // ignore audio errors
    }
};

export default function TodoBoard({ initialTodos, username }: TodoBoardProps) {
    const [todos, setTodos] = useState(initialTodos);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);

    const openTodos = useMemo(() => todos.filter((t) => !t.completed), [todos]);
    const completedTodos = useMemo(() => todos.filter((t) => t.completed), [todos]);

    const createTodo = async () => {
        if (!title.trim()) {
            toast.error("Please enter a task title.");
            return;
        }
        setIsSaving(true);
        try {
            const { data } = await axios.post<{ todo: TodoItem }>("/api/todos", { title, description });
            setTodos((curr) => [data.todo, ...curr]);
            playCatSound(false);
            toast.success("Task added");
            setTitle("");
            setDescription("");
        } catch {
            toast.error("Could not create task. Try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const toggleTodo = async (todo: TodoItem) => {
        const next = !todo.completed;
        playCatSound(next);
        setTodos((curr) => curr.map((t) => (t.id === todo.id ? { ...t, completed: next } : t)));
        try {
            const { data } = await axios.patch<{ todo: TodoItem }>(`/api/todos/${todo.id}`, { completed: next });
            setTodos((curr) => curr.map((t) => (t.id === todo.id ? data.todo : t)));
            toast(next ? "Task completed ✓" : "Task moved back to To Do");
        } catch {
            setTodos((curr) => curr.map((t) => (t.id === todo.id ? { ...t, completed: todo.completed } : t)));
            toast.error("Could not update task status.");
        }
    };

    const updateTodo = async (todo: TodoItem, fields: { title: string; description: string | null }) => {
        try {
            const { data } = await axios.patch<{ todo: TodoItem }>(`/api/todos/${todo.id}`, fields);
            setTodos((curr) => curr.map((t) => (t.id === todo.id ? data.todo : t)));
            toast.success("Task updated");
        } catch {
            toast.error("Could not save updates.");
        }
    };

    const deleteTodo = async (todoId: number) => {
        setTodos((curr) => curr.filter((t) => t.id !== todoId));
        try {
            await axios.delete(`/api/todos/${todoId}`);
            toast("Task deleted");
        } catch {
            toast.error("Could not delete task.");
        }
    };

    const handleSignOut = async () => {
        setIsSigningOut(true);
        try {
            await fetch("/api/auth/signout", { method: "POST" });
        } finally {
            window.location.href = "/signin";
        }
    };

    return (
        <main className="min-h-screen bg-background text-foreground">
            <div className="mx-auto w-full max-w-5xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
                <motion.header
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="mb-6 rounded-2xl border border-border bg-[radial-gradient(circle_at_top_left,#522531_0%,#291f28_55%,#1f1d22_100%)] p-5"
                >
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-widest text-muted-foreground">FlowList</p>
                            <h1 className={cn(caveat.className, "text-2xl font-semibold text-accent-foreground sm:text-3xl")}>
                                Hey, {username}
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="hidden sm:flex">
                                {openTodos.length} open · {completedTodos.length} done
                            </Badge>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={isSigningOut}
                                onClick={() => void handleSignOut()}
                            >
                                <LogOutIcon data-icon="inline-start" />
                                {isSigningOut ? "Signing out…" : "Sign out"}
                            </Button>
                        </div>
                    </div>
                </motion.header>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
                    className="mb-6"
                >
                    <form onSubmit={(e) => { e.preventDefault(); void createTodo(); }}>
                        <Card>
                            <CardContent className="pt-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                                    <div className="flex flex-1 flex-col gap-2">
                                        <Input
                                            name="title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Task title"
                                            className="h-9 bg-[var(--color-input-bg)]"
                                        />
                                        <Input
                                            name="description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Description (optional)"
                                            className="h-9 bg-[var(--color-input-bg)]"
                                        />
                                    </div>
                                    <motion.div whileTap={{ scale: 0.97 }}>
                                        <Button
                                            type="submit"
                                            disabled={isSaving}
                                            size="lg"
                                            className="w-full sm:w-auto"
                                        >
                                            <PlusIcon data-icon="inline-start" />
                                            {isSaving ? "Adding…" : "Add task"}
                                        </Button>
                                    </motion.div>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </motion.div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <TodoColumn
                        title="To Do"
                        todos={openTodos}
                        onToggle={toggleTodo}
                        onDelete={deleteTodo}
                        onSave={updateTodo}
                        delay={0.15}
                    />
                    <TodoColumn
                        title="Done"
                        todos={completedTodos}
                        onToggle={toggleTodo}
                        onDelete={deleteTodo}
                        onSave={updateTodo}
                        delay={0.2}
                    />
                </div>
            </div>
        </main>
    );
}

type TodoColumnProps = {
    title: string;
    todos: TodoItem[];
    delay: number;
    onToggle: (todo: TodoItem) => Promise<void>;
    onDelete: (todoId: number) => Promise<void>;
    onSave: (todo: TodoItem, fields: { title: string; description: string | null }) => Promise<void>;
};

function TodoColumn({ title, todos, delay, onToggle, onDelete, onSave }: TodoColumnProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: "easeOut" }}
        >
            <Card className="h-full">
                <CardHeader className="border-b pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-accent-foreground">{title}</CardTitle>
                        <Badge variant="secondary">{todos.length}</Badge>
                    </div>
                </CardHeader>
                <CardContent className="pt-3">
                    <ul className="flex flex-col gap-2">
                        <AnimatePresence initial={false}>
                            {todos.map((todo, i) => (
                                <TodoRow
                                    key={todo.id}
                                    todo={todo}
                                    index={i}
                                    onToggle={onToggle}
                                    onDelete={onDelete}
                                    onSave={onSave}
                                />
                            ))}
                        </AnimatePresence>
                        {todos.length === 0 && (
                            <motion.li
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="rounded-lg bg-secondary/50 px-3 py-2.5 text-sm text-muted-foreground"
                            >
                                No tasks here yet.
                            </motion.li>
                        )}
                    </ul>
                </CardContent>
            </Card>
        </motion.div>
    );
}

type TodoRowProps = {
    todo: TodoItem;
    index: number;
    onToggle: (todo: TodoItem) => Promise<void>;
    onDelete: (todoId: number) => Promise<void>;
    onSave: (todo: TodoItem, fields: { title: string; description: string | null }) => Promise<void>;
};

function TodoRow({ todo, index, onToggle, onDelete, onSave }: TodoRowProps) {
    const [editTitle, setEditTitle] = useState(todo.title);
    const [editDesc, setEditDesc] = useState(todo.description ?? "");
    const [open, setOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!editTitle.trim()) return;
        setIsSaving(true);
        await onSave(todo, { title: editTitle, description: editDesc.trim() || null });
        setIsSaving(false);
        setOpen(false);
    };

    const handleOpenChange = (next: boolean) => {
        if (next) {
            setEditTitle(todo.title);
            setEditDesc(todo.description ?? "");
        }
        setOpen(next);
    };

    return (
        <motion.li
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -12, transition: { duration: 0.18 } }}
            transition={{ duration: 0.25, delay: index * 0.04, ease: "easeOut" }}
            className="rounded-xl border border-border bg-secondary/80 p-3"
        >
            <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                    <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => void onToggle(todo)}
                        aria-label="Toggle completed"
                    />
                </div>
                <div className="min-w-0 flex-1">
                    <p className={cn(
                        "text-sm font-medium leading-snug text-accent-foreground",
                        todo.completed && "line-through opacity-60"
                    )}>
                        {todo.title}
                    </p>
                    {todo.description && (
                        <p className="mt-0.5 text-xs text-muted-foreground">{todo.description}</p>
                    )}
                </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
                <Separator className="flex-1" />
                <div className="flex gap-1.5">
                    <Dialog open={open} onOpenChange={handleOpenChange}>
                        <DialogTrigger
                            render={
                                <Button variant="ghost" size="icon-xs">
                                    <PencilIcon />
                                    <span className="sr-only">Edit task</span>
                                </Button>
                            }
                        />
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Edit task</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col gap-3">
                                <Input
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    placeholder="Task title"
                                    className="h-9 bg-[var(--color-input-bg)]"
                                />
                                <Textarea
                                    value={editDesc}
                                    onChange={(e) => setEditDesc(e.target.value)}
                                    placeholder="Description (optional)"
                                    rows={3}
                                    className="bg-[var(--color-input-bg)]"
                                />
                            </div>
                            <DialogFooter showCloseButton>
                                <Button
                                    onClick={() => void handleSave()}
                                    disabled={isSaving || !editTitle.trim()}
                                >
                                    {isSaving ? "Saving…" : "Save changes"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <motion.div whileTap={{ scale: 0.9 }}>
                        <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => void onDelete(todo.id)}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                            <Trash2Icon />
                            <span className="sr-only">Delete task</span>
                        </Button>
                    </motion.div>
                </div>
            </div>
        </motion.li>
    );
}