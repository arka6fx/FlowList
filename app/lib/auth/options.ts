import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import prisma from "@/app/lib/db";
import { verifyPassword } from "@/app/lib/auth/password";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                identifier: { label: "Username or Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.identifier || !credentials?.password) {
                    return null;
                }

                const identifier = credentials.identifier.trim();

                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            {
                                username: identifier,
                            },
                            {
                                email: identifier.toLowerCase(),
                            },
                        ],
                    },
                });

                if (!user || !user.password) {
                    return null;
                }

                const isValidPassword = await verifyPassword(credentials.password, user.password);

                if (!isValidPassword) {
                    return null;
                }

                return {
                    id: user.id.toString(),
                    name: user.username,
                    email: user.email,
                };
            },
        }),
    ],
    pages: {
        signIn: "/signin",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
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
