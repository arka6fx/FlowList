import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth/utils";
import { todos } from "@/drizzle/schema";

export async function GET() {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const db = await getDb();
    const userTodos = await db.select().from(todos).where(eq(todos.userId, auth.id)).orderBy(desc(todos.createdAt));

    return NextResponse.json({ todos: userTodos });
}

export async function POST(req: NextRequest) {
    const auth = await requireAuth();
    if (auth instanceof NextResponse) return auth;

    const body = (await req.json()) as { title?: unknown; description?: unknown };
    const rawTitle = typeof body.title === "string" ? body.title.trim() : "";
    const description = typeof body.description === "string" && body.description.trim() ? body.description.trim() : null;

    if (!rawTitle) {
        return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }

    const [todo] = await (await getDb())
        .insert(todos)
        .values({
            title: rawTitle,
            description,
            userId: auth.id,
            updatedAt: new Date(),
        })
        .returning();

    return NextResponse.json({ todo }, { status: 201 });
}
