import { desc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/current-user";
import TodoBoardShell from "@/components/todo/todo-board-shell";
import { todos } from "@/drizzle/schema";
import { LandingPage } from "@/components/landing/landing-page";

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
      const userTodos = await (await getDb()).select().from(todos).where(eq(todos.userId, user.id)).orderBy(desc(todos.createdAt));

    return <TodoBoardShell initialTodos={userTodos.map((todo) => ({ ...todo, createdAt: todo.createdAt.toISOString(), updatedAt: todo.updatedAt.toISOString() }))} username={user.name} />;
  }

  return <LandingPage />;
}
