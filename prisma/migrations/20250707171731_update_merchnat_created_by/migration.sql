/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Merchant` table. All the data in the column will be lost.
  - Made the column `status` on table `Merchant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Merchant" DROP COLUMN "createdBy",
ADD COLUMN     "createdById" UUID,
ADD COLUMN     "createdByRole" TEXT,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'draft';

-- AlterTable
ALTER TABLE "Offer" ALTER COLUMN "status" SET DEFAULT 'draft';

-- AddForeignKey
ALTER TABLE "Merchant" ADD CONSTRAINT "Merchant_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
