/*
  Warnings:

  - Made the column `status` on table `Offer` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_merchantId_fkey";

-- AlterTable
ALTER TABLE "Offer" ALTER COLUMN "offerReference" DROP NOT NULL,
ALTER COLUMN "merchantId" DROP NOT NULL,
ALTER COLUMN "offerType" DROP NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'darft';

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
