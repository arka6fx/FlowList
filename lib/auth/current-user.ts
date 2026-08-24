import { getSessionUser } from "./session";

export const getCurrentUser = async () => {
    return getSessionUser();
};
