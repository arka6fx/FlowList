import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/app/lib/db";
import { authAccounts, authSessions, authUsers, authVerifications } from "@/drizzle/schema";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const baseURL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
const secret = process.env.BETTER_AUTH_SECRET ?? "dev-only-secret-change-me";

export const auth = betterAuth({
    baseURL,
    secret,
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: authUsers,
            session: authSessions,
            account: authAccounts,
            verification: authVerifications,
        },
    }),
    socialProviders:
        googleClientId && googleClientSecret
            ? {
                  google: {
                      clientId: googleClientId,
                      clientSecret: googleClientSecret,
                  },
              }
            : {},
    trustedOrigins: [baseURL],
});
