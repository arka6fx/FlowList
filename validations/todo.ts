import { z } from "zod";

export const createTodoSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title too long"),
    description: z.string().max(500, "Description too long").optional(),
});

export const updateTodoSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title too long").optional(),
    description: z.string().max(500, "Description too long").nullable().optional(),
    completed: z.boolean().optional(),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;