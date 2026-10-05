-- Classes created before the approval workflow must stay usable.
-- New classes still default to isApproved = false.
UPDATE "TuitionClass" SET "isApproved" = true WHERE "isApproved" = false;
