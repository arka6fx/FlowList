import argon2 from "argon2";

export const hashPassword = async (password: string) => {
    return argon2.hash(password, {
        type: argon2.argon2id,
    });
};

export const verifyPassword = async (password: string, hashedPassword: string) => {
    if (!hashedPassword.startsWith("$argon2")) {
        return false;
    }

    try {
        return await argon2.verify(hashedPassword, password);
    } catch {
        return false;
    }
};
