import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";
import { authUsers } from "@/drizzle/schema";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";

const signUpSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(64),
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => null);
    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase();
    const [existing] = await db
        .select({ id: authUsers.id })
        .from(authUsers)
        .where(eq(authUsers.email, email))
        .limit(1);

    if (existing) {
        return NextResponse.json({ message: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await hashPassword(parsed.data.password);
    const userId = crypto.randomUUID();

    await db.insert(authUsers).values({
        id: userId,
        name: parsed.data.name,
        email,
        passwordHash,
    });

    await createSession(userId);

    return NextResponse.json(
        { user: { id: userId, name: parsed.data.name, email } },
        { status: 201 },
    );
}
