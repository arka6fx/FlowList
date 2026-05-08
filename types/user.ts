export type User = {
    id: string;
    username: string;
    email: string;
    image?: string | null;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type SafeUser = {
    id: string;
    username: string;
    email: string;
    image?: string | null;
};