import { foreignKey, index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const authUsers = sqliteTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
});

export const authSessions = sqliteTable(
    "session",
    {
        id: text("id").primaryKey(),
        userId: text("user_id")
            .notNull()
            .references(() => authUsers.id, { onDelete: "cascade" }),
        expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
        createdAt: integer("created_at", { mode: "timestamp" })
            .notNull()
            .$defaultFn(() => new Date()),
    },
    (table) => [index("session_userId_idx").on(table.userId)],
);

export const todos = sqliteTable(
    "Todo",
    {
        id: integer("id").primaryKey({ autoIncrement: true }),
        title: text("title").notNull(),
        description: text("description"),
        completed: integer("completed", { mode: "boolean" }).notNull().default(false),
        createdAt: integer("createdAt", { mode: "timestamp_ms" })
            .notNull()
            .$defaultFn(() => new Date()),
        updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
            .notNull()
            .$defaultFn(() => new Date()),
        userId: text("userId").notNull(),
    },
    (table) => [
        index("Todo_userId_idx").on(table.userId),
        foreignKey({
            columns: [table.userId],
            foreignColumns: [authUsers.id],
            name: "Todo_userId_fkey",
        })
            .onDelete("cascade")
            .onUpdate("cascade"),
    ],
);
