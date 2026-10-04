-- CreateEnum
CREATE TYPE "ClassType" AS ENUM ('PHYSICAL', 'ONLINE');

-- AlterTable
ALTER TABLE "TuitionClass" ADD COLUMN "subject" TEXT,
ADD COLUMN "classType" "ClassType" NOT NULL DEFAULT 'PHYSICAL';

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN "phone" TEXT;
