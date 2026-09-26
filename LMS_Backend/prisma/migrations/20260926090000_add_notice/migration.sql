-- CreateTable
CREATE TABLE "Notice" (
    "id" TEXT NOT NULL,
    "tuitionClassId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notice_tuitionClassId_expiresAt_idx" ON "Notice"("tuitionClassId", "expiresAt");

-- AddForeignKey
ALTER TABLE "Notice" ADD CONSTRAINT "Notice_tuitionClassId_fkey" FOREIGN KEY ("tuitionClassId") REFERENCES "TuitionClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
