"use client";

import { useEffect, useState } from "react";

import { authClient } from "@/lib/auth/client";

type SessionUser = {
    id: string;
    email: string;
    name: string;
    image?: string | null;
};

export function useAuth() {
    const [user, setUser] = useState<SessionUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        authClient.getSession().then((data: unknown) => {
            const result = data as { user?: SessionUser; session?: { user: SessionUser } } | null;
            if (result?.session?.user) {
                const userData = result.session.user;
                setUser({
                    id: userData.id,
                    email: userData.email,
                    name: userData.name ?? "",
                    image: userData.image,
                });
            } else {
                setUser(null);
            }
            setIsLoading(false);
        }).catch(() => {
            setUser(null);
            setIsLoading(false);
        });
    }, []);

    return { user, isLoading };
}

export async function getSession() {
    try {
        const data = await authClient.getSession() as { session?: { user: SessionUser } } | null;
        if (data?.session?.user) {
            const userData = data.session.user;
            return {
                id: userData.id,
                email: userData.email,
                name: userData.name ?? "",
                image: userData.image,
            } as SessionUser;
        }
        return null;
    } catch {
        return null;
    }
}