import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

import * as schema from "@/drizzle/schema";

export const getDb = async () => {
    const { env } = await getCloudflareContext({ async: true });
    return drizzle(env.DB, { schema });
};
