import { relations } from "drizzle-orm/relations";
import { user, todo } from "./schema";

export const todoRelations = relations(todo, ({one}) => ({
	user: one(user, {
		fields: [todo.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	todos: many(todo),
}));