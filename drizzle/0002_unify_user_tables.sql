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
WHERE au."id" IS NULL;

ALTER TABLE "Todo" ADD COLUMN "userId_new" text;

UPDATE "Todo" t
SET "userId_new" = au."id"
FROM "User" u
JOIN "user" au ON lower(au."email") = lower(u."email")
WHERE t."userId" = u."id";

ALTER TABLE "Todo" DROP CONSTRAINT IF EXISTS "Todo_userId_fkey";
DROP INDEX IF EXISTS "Todo_userId_idx";

ALTER TABLE "Todo" DROP COLUMN "userId";
ALTER TABLE "Todo" RENAME COLUMN "userId_new" TO "userId";
ALTER TABLE "Todo" ALTER COLUMN "userId" SET NOT NULL;

ALTER TABLE "Todo"
  ADD CONSTRAINT "Todo_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "Todo_userId_idx" ON "Todo" USING btree ("userId");

DROP TABLE IF EXISTS "User";
