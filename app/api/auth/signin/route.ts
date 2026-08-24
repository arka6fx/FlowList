import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";
import { authUsers } from "@/drizzle/schema";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";

const signInSchema = z.object({
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => null);
    const parsed = signInSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase();
    const [user] = await db
        .select({ id: authUsers.id, name: authUsers.name, email: authUsers.email, passwordHash: authUsers.passwordHash })
        .from(authUsers)
        .where(eq(authUsers.email, email))
        .limit(1);

    if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
        return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    await createSession(user.id);

    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
}
