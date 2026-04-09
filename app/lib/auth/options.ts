import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import prisma from "@/app/lib/db";

const normalizeUsername = (value: string) => {
    const normalized = value
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_+|_+$/g, "")
        .slice(0, 20);

    return normalized || "flowlist_user";
};

const buildUniqueUsername = async (seed: string) => {
    const base = normalizeUsername(seed);

    let counter = 0;

    while (true) {
        const candidate = counter === 0 ? base : `${base}_${counter}`.slice(0, 30);

        const existingCandidate = await prisma.user.findUnique({
            where: {
                username: candidate,
            },
        });

        if (!existingCandidate) {
            return candidate;
        }

        counter += 1;
    }
};

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

const providers =
    googleClientId && googleClientSecret
        ? [
              GoogleProvider({
                  clientId: googleClientId,
                  clientSecret: googleClientSecret,
              }),
          ]
        : [];

export const authOptions: NextAuthOptions = {
    providers,
    pages: {
        signIn: "/signin",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider !== "google") {
                return false;
            }

            const email = user.email?.toLowerCase();

            if (!email) {
                return false;
            }

            const existingUser = await prisma.user.findUnique({
                where: {
                    email,
                },
            });

            if (existingUser) {
                user.id = String(existingUser.id);
                user.name = existingUser.username;
                user.email = existingUser.email;
                return true;
            }

            const usernameSeed = user.name?.trim() || email.split("@")[0] || "flowlist_user";
            const username = await buildUniqueUsername(usernameSeed);

            const createdUser = await prisma.user.create({
                data: {
                    username,
                    email,
                },
            });

            user.id = String(createdUser.id);
            user.name = createdUser.username;
            user.email = createdUser.email;

            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.userId = user.id;
                token.username = user.name ?? null;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user && token.userId) {
                session.user.id = String(token.userId);
                session.user.username = token.username ?? session.user.name ?? "";
            }

            return session;
        },
    },
};
