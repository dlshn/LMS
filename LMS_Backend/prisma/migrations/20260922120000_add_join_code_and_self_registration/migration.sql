-- Add TuitionClass.joinCode as nullable first so existing rows can be
-- backfilled with a generated value, then tighten it to NOT NULL + UNIQUE.
ALTER TABLE "TuitionClass" ADD COLUMN "joinCode" TEXT;

UPDATE "TuitionClass"
SET "joinCode" = upper(substr(md5(random()::text || clock_timestamp()::text || "id"), 1, 6))
WHERE "joinCode" IS NULL;

ALTER TABLE "TuitionClass" ALTER COLUMN "joinCode" SET NOT NULL;

CREATE UNIQUE INDEX "TuitionClass_joinCode_key" ON "TuitionClass"("joinCode");

-- Students are now created by their admin as a roster entry only
-- (studentNumber + fullName). username/passwordHash are filled in later
-- when the student self-registers with the class join code.
ALTER TABLE "Student" ALTER COLUMN "username" DROP NOT NULL;
ALTER TABLE "Student" ALTER COLUMN "passwordHash" DROP NOT NULL;
ALTER TABLE "Student" ADD COLUMN "isActivated" BOOLEAN NOT NULL DEFAULT false;

-- Backfill: any student that already has login credentials under the old
-- flow is already effectively activated.
UPDATE "Student" SET "isActivated" = true WHERE "username" IS NOT NULL;
