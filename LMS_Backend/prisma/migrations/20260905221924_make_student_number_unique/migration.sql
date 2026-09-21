/*
  Warnings:

  - A unique constraint covering the columns `[studentNumber]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Student_tuitionClassId_studentNumber_key";

-- CreateIndex
CREATE UNIQUE INDEX "Student_studentNumber_key" ON "Student"("studentNumber");
