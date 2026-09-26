-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "tuitionClassId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "youtubeUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Video_tuitionClassId_createdAt_idx" ON "Video"("tuitionClassId", "createdAt");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_tuitionClassId_fkey" FOREIGN KEY ("tuitionClassId") REFERENCES "TuitionClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
