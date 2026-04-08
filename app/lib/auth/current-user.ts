import { getServerSession } from "next-auth";

import prisma from "@/app/lib/db";
import { authOptions } from "@/app/lib/auth/options";

export const getCurrentUser = async () => {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return null;
    }

    const userId = Number(session.user.id);

    if (Number.isNaN(userId)) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    return user;
};
