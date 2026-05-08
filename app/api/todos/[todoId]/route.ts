import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { requireAuth, parseId } from "@/lib/auth/utils";
import { todos } from "@/drizzle/schema";

export async function GET(_: NextRequest, context: { params: Promise<{ todoId: string }> }) {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const { todoId: rawTodoId } = await context.params;
    const todoId = parseId(rawTodoId);

    if (!todoId) {
        return NextResponse.json({ message: "Invalid todo id" }, { status: 400 });
    }

    const [todo] = await db
        .select()
        .from(todos)
        .where(and(eq(todos.id, todoId), eq(todos.userId, auth.id)))
        .limit(1);

    if (!todo) {
        return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ todo });
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ todoId: string }> }) {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const { todoId: rawTodoId } = await context.params;
    const todoId = parseId(rawTodoId);

    if (!todoId) {
        return NextResponse.json({ message: "Invalid todo id" }, { status: 400 });
    }

    const [existingTodo] = await db
        .select({ id: todos.id })
        .from(todos)
        .where(and(eq(todos.id, todoId), eq(todos.userId, auth.id)))
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
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const { todoId: rawTodoId } = await context.params;
    const todoId = parseId(rawTodoId);

    if (!todoId) {
        return NextResponse.json({ message: "Invalid todo id" }, { status: 400 });
    }

    const [existingTodo] = await db
        .select({ id: todos.id })
        .from(todos)
        .where(and(eq(todos.id, todoId), eq(todos.userId, auth.id)))
        .limit(1);

    if (!existingTodo) {
        return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    await db.delete(todos).where(eq(todos.id, existingTodo.id));

    return NextResponse.json({ message: "Todo deleted" });
}
