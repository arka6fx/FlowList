export const appConfig = {
    name: "FlowList",
    description: "A beautiful todo application",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    environment: process.env.NODE_ENV ?? "development",
} as const;

export const authConfig = {
    baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    secret: process.env.BETTER_AUTH_SECRET ?? "dev-only-secret",
    trustedOrigins: [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        process.env.NEXT_PUBLIC_APP_URL ?? "https://flowlist.arkagarai292.workers.dev",
    ],
} as const;