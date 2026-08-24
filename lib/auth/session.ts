import { and, eq, gt } from "drizzle-orm";
import { cookies } from "next/headers";

import { db } from "@/lib/db";
import { authSessions, authUsers } from "@/drizzle/schema";

export const SESSION_COOKIE = "flowlist_session";
const SESSION_TTL_DAYS = 30;

const createToken = () => {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
};

export const createSession = async (userId: string) => {
    const token = createToken();
    const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

    await db.insert(authSessions).values({ id: token, userId, expiresAt });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        expires: expiresAt,
    });

    return token;
};

export const getSessionUser = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const [row] = await db
        .select({ id: authUsers.id, name: authUsers.name, email: authUsers.email })
        .from(authSessions)
        .innerJoin(authUsers, eq(authSessions.userId, authUsers.id))
        .where(and(eq(authSessions.id, token), gt(authSessions.expiresAt, new Date())))
        .limit(1);

    return row ?? null;
};

export const destroySession = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;

    if (token) {
        await db.delete(authSessions).where(eq(authSessions.id, token));
    }

    cookieStore.delete(SESSION_COOKIE);
};
