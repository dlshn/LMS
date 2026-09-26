-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "tuitionClassId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Note_tuitionClassId_uploadedAt_idx" ON "Note"("tuitionClassId", "uploadedAt");

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_tuitionClassId_fkey" FOREIGN KEY ("tuitionClassId") REFERENCES "TuitionClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
