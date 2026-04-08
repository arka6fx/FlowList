import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/auth/current-user";

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

    const todo = await prisma.todo.findFirst({
        where: {
            id: todoId,
            userId: user.id,
        },
    });

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

    const existingTodo = await prisma.todo.findFirst({
        where: {
            id: todoId,
            userId: user.id,
        },
    });

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

    const todo = await prisma.todo.update({
        where: {
            id: existingTodo.id,
        },
        data: {
            ...(title !== undefined ? { title } : {}),
            ...(description !== undefined ? { description } : {}),
            ...(completed !== undefined ? { completed } : {}),
        },
    });

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

    const existingTodo = await prisma.todo.findFirst({
        where: {
            id: todoId,
            userId: user.id,
        },
    });

    if (!existingTodo) {
        return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    await prisma.todo.delete({
        where: {
            id: existingTodo.id,
        },
    });

    return NextResponse.json({ message: "Todo deleted" });
}
