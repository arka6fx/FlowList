"use client";

import { useSyncExternalStore } from "react";

import TodoBoard from "@/app/components/todo-board";

type TodoItem = {
    id: number;
    title: string;
    description: string | null;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
};

type TodoBoardShellProps = {
    initialTodos: TodoItem[];
    username: string;
};

export default function TodoBoardShell({ initialTodos, username }: TodoBoardShellProps) {
    const mounted = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false,
    );

    if (!mounted) {
        return (
            <main className="min-h-screen bg-[#edf4ff] dark:bg-[#090c14]" aria-hidden="true" />
        );
    }

    return <TodoBoard initialTodos={initialTodos} username={username} />;
}
