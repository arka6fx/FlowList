const { Client } = require("pg");

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    await client.query("BEGIN");

    await client.query(`
      INSERT INTO "user" ("id", "name", "email", "email_verified", "image", "created_at", "updated_at")
      SELECT
        'legacy_' || u."id"::text,
        u."username",
        lower(u."email"),
        true,
        NULL,
        NOW(),
        NOW()
      FROM "User" u
      LEFT JOIN "user" au ON lower(au."email") = lower(u."email")
      WHERE au."id" IS NULL
    `);

    await client.query('ALTER TABLE "Todo" ADD COLUMN IF NOT EXISTS "userId_new" text');

    await client.query(`
      UPDATE "Todo" t
      SET "userId_new" = au."id"
      FROM "User" u
      JOIN "user" au ON lower(au."email") = lower(u."email")
      WHERE t."userId"::text = u."id"::text
    `);

    const check = await client.query('SELECT count(*)::int AS c FROM "Todo" WHERE "userId_new" IS NULL');

    if (check.rows[0].c > 0) {
      throw new Error(`Unmapped todos: ${check.rows[0].c}`);
    }

    await client.query('ALTER TABLE "Todo" DROP CONSTRAINT IF EXISTS "Todo_userId_fkey"');
    await client.query('DROP INDEX IF EXISTS "Todo_userId_idx"');
    await client.query('ALTER TABLE "Todo" DROP COLUMN "userId"');
    await client.query('ALTER TABLE "Todo" RENAME COLUMN "userId_new" TO "userId"');
    await client.query('ALTER TABLE "Todo" ALTER COLUMN "userId" SET NOT NULL');
    await client.query(
      'ALTER TABLE "Todo" ADD CONSTRAINT "Todo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE',
    );
    await client.query('CREATE INDEX "Todo_userId_idx" ON "Todo" USING btree ("userId")');
    await client.query('DROP TABLE IF EXISTS "User"');

    await client.query("COMMIT");
    console.log("Unified User -> user and migrated Todo.userId");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
