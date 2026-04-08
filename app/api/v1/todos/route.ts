import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/auth/current-user";

export async function GET() {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const todos = await prisma.todo.findMany({
        where: {
            userId: user.id,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return NextResponse.json({ todos });
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

    const todo = await prisma.todo.create({
        data: {
            title,
            description,
            userId: user.id,
        },
    });

    return NextResponse.json({ todo }, { status: 201 });
}
