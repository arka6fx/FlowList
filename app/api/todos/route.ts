import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

import { db } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/auth/current-user";
import { todos } from "@/app/lib/db/schema";

export async function GET() {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userTodos = await db.select().from(todos).where(eq(todos.userId, user.id)).orderBy(desc(todos.createdAt));

    return NextResponse.json({ todos: userTodos });
}

export async function POST(req: NextRequest) {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const title = body.title?.trim();
    const description = body.description?.trim() || null;

    if (!title) {
        return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }

    const [todo] = await db
        .insert(todos)
        .values({
            title,
            description,
            userId: user.id,
            updatedAt: new Date(),
        })
        .returning();

    return NextResponse.json({ todo }, { status: 201 });
}
