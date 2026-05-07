import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/auth/current-user";
import { todos } from "@/app/lib/db/schema";

const parseTodoId = (value: string) => {
    const todoId = Number(value);

    if (!Number.isInteger(todoId) || todoId <= 0) {
        return null;
    }

    return todoId;
};

export async function GET(_: NextRequest, context: { params: Promise<{ todoId: string }> }) {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { todoId: rawTodoId } = await context.params;
    const todoId = parseTodoId(rawTodoId);

    if (!todoId) {
        return NextResponse.json({ message: "Invalid todo id" }, { status: 400 });
    }

    const [todo] = await db
        .select()
        .from(todos)
        .where(and(eq(todos.id, todoId), eq(todos.userId, user.id)))
        .limit(1);

    if (!todo) {
        return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ todo });
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ todoId: string }> }) {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { todoId: rawTodoId } = await context.params;
    const todoId = parseTodoId(rawTodoId);

    if (!todoId) {
        return NextResponse.json({ message: "Invalid todo id" }, { status: 400 });
    }

    const [existingTodo] = await db
        .select({ id: todos.id })
        .from(todos)
        .where(and(eq(todos.id, todoId), eq(todos.userId, user.id)))
        .limit(1);

    if (!existingTodo) {
        return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    const body = await req.json();
    const title = typeof body.title === "string" ? body.title.trim() : undefined;
    const description =
        typeof body.description === "string" ? body.description.trim() : body.description === null ? null : undefined;
    const completed = typeof body.completed === "boolean" ? body.completed : undefined;

    if (title !== undefined && !title) {
        return NextResponse.json({ message: "Title cannot be empty" }, { status: 400 });
    }

    const [todo] = await db
        .update(todos)
        .set({
            ...(title !== undefined ? { title } : {}),
            ...(description !== undefined ? { description } : {}),
            ...(completed !== undefined ? { completed } : {}),
            updatedAt: new Date(),
        })
        .where(eq(todos.id, existingTodo.id))
        .returning();

    return NextResponse.json({ todo });
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ todoId: string }> }) {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { todoId: rawTodoId } = await context.params;
    const todoId = parseTodoId(rawTodoId);

    if (!todoId) {
        return NextResponse.json({ message: "Invalid todo id" }, { status: 400 });
    }

    const [existingTodo] = await db
        .select({ id: todos.id })
        .from(todos)
        .where(and(eq(todos.id, todoId), eq(todos.userId, user.id)))
        .limit(1);

    if (!existingTodo) {
        return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    await db.delete(todos).where(eq(todos.id, existingTodo.id));

    return NextResponse.json({ message: "Todo deleted" });
}
