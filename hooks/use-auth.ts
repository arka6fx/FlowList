"use client";

import { useEffect, useState } from "react";

type SessionUser = {
    id: string;
    name: string;
    email: string;
};

export type AuthUser = SessionUser;

async function fetchSession(): Promise<SessionUser | null> {
    try {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        if (!res.ok) return null;
        const data = (await res.json()) as { user: SessionUser | null };
        return data.user ?? null;
    } catch {
        return null;
    }
}

export function useAuth() {
    const [user, setUser] = useState<SessionUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        fetchSession().then((data) => {
            if (!cancelled) {
                setUser(data);
                setIsLoading(false);
            }
        });
        return () => {
            cancelled = true;
        };
    }, []);

    return { user, isLoading };
}

export async function getSession() {
    return fetchSession();
}
