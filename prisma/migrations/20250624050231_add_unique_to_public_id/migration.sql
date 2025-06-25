/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `ImageAsset` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ImageAsset_publicId_key" ON "ImageAsset"("publicId");
