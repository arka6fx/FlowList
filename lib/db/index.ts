import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

import * as schema from "@/drizzle/schema";

export const db = drizzle(getCloudflareContext().env.DB, { schema });
