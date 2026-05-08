import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { requireAuth, parseId } from "@/lib/auth/utils";
import { todos } from "@/drizzle/schema";

export async function GET() {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const userTodos = await db.select().from(todos).where(eq(todos.userId, auth.id)).orderBy(desc(todos.createdAt));

    return NextResponse.json({ todos: userTodos });
}

export async function POST(req: NextRequest) {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

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
            userId: auth.id,
            updatedAt: new Date(),
        })
        .returning();

    return NextResponse.json({ todo }, { status: 201 });
}
