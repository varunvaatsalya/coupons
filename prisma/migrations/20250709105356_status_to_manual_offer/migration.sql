/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Offer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "createdBy",
DROP COLUMN "status",
ADD COLUMN     "createdById" UUID,
ADD COLUMN     "createdByRole" TEXT,
ADD COLUMN     "statusManual" TEXT DEFAULT 'draft';

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
