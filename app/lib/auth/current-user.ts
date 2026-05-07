import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { auth } from "@/app/lib/auth";
import { db } from "@/app/lib/db";
import { authUsers } from "@/drizzle/schema";

export const getCurrentUser = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const userId = session?.user?.id;

    if (!userId) {
        return null;
    }

    const [user] = await db
        .select({ id: authUsers.id, username: authUsers.name, email: authUsers.email })
        .from(authUsers)
        .where(eq(authUsers.id, userId))
        .limit(1);

    return user ?? null;
};
