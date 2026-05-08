import { NextResponse } from "next/server";

import { getCurrentUser } from "./current-user";

export const requireAuth = async () => {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return user;
};

export const parseId = (value: string): number | null => {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
};