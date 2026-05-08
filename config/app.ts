export const appConfig = {
    name: "FlowList",
    description: "A beautiful todo application",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    environment: process.env.NODE_ENV ?? "development",
} as const;

export const authConfig = {
    baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    secret: process.env.BETTER_AUTH_SECRET ?? "dev-only-secret",
    trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"],
} as const;

export const databaseConfig = {
    maxConnections: Number(process.env.DB_MAX_CONNECTIONS) || 10,
    connectionTimeout: Number(process.env.DB_CONNECTION_TIMEOUT) || 5000,
} as const;