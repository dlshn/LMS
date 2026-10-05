-- Lets the super admin suspend a class without deleting its data.
ALTER TABLE "TuitionClass" ADD COLUMN "isSuspended" BOOLEAN NOT NULL DEFAULT false;
