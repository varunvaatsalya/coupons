/*
  Warnings:

  - You are about to drop the column `country` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `metaDescription` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `metaKeywords` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `pageTitle` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `translatedName` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `affiliateUrl` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `geographicMarket` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `merchantSeoName` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `merchantUrl` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `metaDescription` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `metaKeywords` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `pageHeading` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `pageTitle` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `staff` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `translatedDescription` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Offer` table. All the data in the column will be lost.
  - Added the required column `countryId` to the `Offer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "country",
DROP COLUMN "description",
DROP COLUMN "metaDescription",
DROP COLUMN "metaKeywords",
DROP COLUMN "pageTitle",
DROP COLUMN "translatedName";

-- AlterTable
ALTER TABLE "Merchant" DROP COLUMN "affiliateUrl",
DROP COLUMN "currency",
DROP COLUMN "description",
DROP COLUMN "geographicMarket",
DROP COLUMN "merchantSeoName",
DROP COLUMN "merchantUrl",
DROP COLUMN "metaDescription",
DROP COLUMN "metaKeywords",
DROP COLUMN "pageHeading",
DROP COLUMN "pageTitle",
DROP COLUMN "staff",
DROP COLUMN "translatedDescription";

-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "country",
DROP COLUMN "currency",
ADD COLUMN     "countryId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "MerchantLocalization" (
    "id" UUID NOT NULL,
    "merchantId" UUID NOT NULL,
    "countryId" UUID NOT NULL,
    "merchantSeoName" TEXT,
    "description" TEXT,
    "translatedDescription" TEXT,
    "merchantUrl" TEXT,
    "affiliateUrl" TEXT,
    "pageTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT[],
    "pageHeading" TEXT,

    CONSTRAINT "MerchantLocalization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryLocalization" (
    "id" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "countryId" UUID NOT NULL,
    "translatedName" TEXT,
    "description" TEXT,
    "pageTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT[],

    CONSTRAINT "CategoryLocalization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MerchantCountries" (
    "A" TEXT NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_MerchantCountries_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CategoryCountries" (
    "A" UUID NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryCountries_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "MerchantLocalization_merchantId_countryId_key" ON "MerchantLocalization"("merchantId", "countryId");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryLocalization_categoryId_countryId_key" ON "CategoryLocalization"("categoryId", "countryId");

-- CreateIndex
CREATE INDEX "_MerchantCountries_B_index" ON "_MerchantCountries"("B");

-- CreateIndex
CREATE INDEX "_CategoryCountries_B_index" ON "_CategoryCountries"("B");

-- AddForeignKey
ALTER TABLE "MerchantLocalization" ADD CONSTRAINT "MerchantLocalization_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MerchantLocalization" ADD CONSTRAINT "MerchantLocalization_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "GeographicCountry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryLocalization" ADD CONSTRAINT "CategoryLocalization_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryLocalization" ADD CONSTRAINT "CategoryLocalization_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "GeographicCountry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "GeographicCountry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MerchantCountries" ADD CONSTRAINT "_MerchantCountries_A_fkey" FOREIGN KEY ("A") REFERENCES "GeographicCountry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MerchantCountries" ADD CONSTRAINT "_MerchantCountries_B_fkey" FOREIGN KEY ("B") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryCountries" ADD CONSTRAINT "_CategoryCountries_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryCountries" ADD CONSTRAINT "_CategoryCountries_B_fkey" FOREIGN KEY ("B") REFERENCES "GeographicCountry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
