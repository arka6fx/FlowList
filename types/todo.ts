export type TodoItem = {
    id: number;
    title: string;
    description: string | null;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
    userId: string;
};

export type TodoWithUser = TodoItem & {
    user: {
        username: string;
    };
};

export type CreateTodoInput = {
    title: string;
    description?: string;
};

export type UpdateTodoInput = {
    title?: string;
    description?: string | null;
    completed?: boolean;
};