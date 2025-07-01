/*
  Warnings:

  - You are about to drop the `Currency` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GeographicMarket` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MerchantStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MerchantVisibility` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Currency";

-- DropTable
DROP TABLE "GeographicMarket";

-- DropTable
DROP TABLE "MerchantStatus";

-- DropTable
DROP TABLE "MerchantVisibility";

-- CreateTable
CREATE TABLE "GeographicCountry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "currencySymbol" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeographicCountry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" UUID NOT NULL,
    "offerReference" TEXT NOT NULL,
    "imageUrl" TEXT,
    "merchantId" UUID NOT NULL,
    "offerType" TEXT NOT NULL,
    "voucherCode" TEXT,
    "status" TEXT,
    "merchantOfferUrl" TEXT,
    "offerClickUrl" TEXT,
    "offerHeadline" TEXT,
    "offerTitle" TEXT,
    "idealFeedsTitle" TEXT,
    "discountType" TEXT,
    "discountValue" DOUBLE PRECISION,
    "description" TEXT,
    "idealFeedsDesc" TEXT,
    "termsConditions" TEXT,
    "minCartValue" DOUBLE PRECISION,
    "brandRestrictions" TEXT,
    "userRestrictions" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "displayOrder" TEXT,
    "isExclusive" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isHotDeal" BOOLEAN NOT NULL DEFAULT false,
    "isNewsletter" BOOLEAN NOT NULL DEFAULT false,
    "country" TEXT,
    "currency" TEXT,
    "cashbackId" TEXT,
    "commission" DOUBLE PRECISION,
    "sharedCommission" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "ownerAgency" TEXT,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CurrentCategories" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_CurrentCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AddedCategories" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_AddedCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "GeographicCountry_name_key" ON "GeographicCountry"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GeographicCountry_currencyCode_key" ON "GeographicCountry"("currencyCode");

-- CreateIndex
CREATE UNIQUE INDEX "Offer_offerReference_key" ON "Offer"("offerReference");

-- CreateIndex
CREATE INDEX "_CurrentCategories_B_index" ON "_CurrentCategories"("B");

-- CreateIndex
CREATE INDEX "_AddedCategories_B_index" ON "_AddedCategories"("B");

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CurrentCategories" ADD CONSTRAINT "_CurrentCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CurrentCategories" ADD CONSTRAINT "_CurrentCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AddedCategories" ADD CONSTRAINT "_AddedCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AddedCategories" ADD CONSTRAINT "_AddedCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
