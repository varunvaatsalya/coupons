/*
  Warnings:

  - A unique constraint covering the columns `[folderId,fileName]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "File_fileName_key";

-- CreateIndex
CREATE UNIQUE INDEX "File_folderId_fileName_key" ON "File"("folderId", "fileName");
