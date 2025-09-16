/*
  Warnings:

  - You are about to drop the column `country` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `metaDescription` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `metaKeywords` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `pageTitle` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `translatedName` on the `Category` table. All the data in the column will be lost.
  - The primary key for the `GeographicCountry` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `HomeSectionItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `affiliateUrl` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `geographicMarket` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `isPremium` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `isPriority` on the `Merchant` table. All the data in the column will be lost.
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
  - Changed the type of `id` on the `GeographicCountry` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `HomeSectionItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `countryId` to the `Offer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT', 'OTHER');

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "country",
DROP COLUMN "description",
DROP COLUMN "metaDescription",
DROP COLUMN "metaKeywords",
DROP COLUMN "pageTitle",
DROP COLUMN "translatedName";

-- AlterTable
ALTER TABLE "GeographicCountry" DROP CONSTRAINT "GeographicCountry_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "GeographicCountry_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "HomeSectionItem" DROP CONSTRAINT "HomeSectionItem_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "HomeSectionItem_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Merchant" DROP COLUMN "affiliateUrl",
DROP COLUMN "currency",
DROP COLUMN "description",
DROP COLUMN "geographicMarket",
DROP COLUMN "isPremium",
DROP COLUMN "isPriority",
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
    "isPriority" BOOLEAN NOT NULL DEFAULT false,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
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
CREATE TABLE "Folder" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" UUID NOT NULL,
    "folderId" UUID NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "fileType" "FileType" NOT NULL,
    "size" INTEGER,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "mimeType" TEXT,
    "keywords" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MerchantCountries" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_MerchantCountries_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CategoryCountries" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_CategoryCountries_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "MerchantLocalization_merchantId_countryId_key" ON "MerchantLocalization"("merchantId", "countryId");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryLocalization_categoryId_countryId_key" ON "CategoryLocalization"("categoryId", "countryId");

-- CreateIndex
CREATE UNIQUE INDEX "Folder_name_key" ON "Folder"("name");

-- CreateIndex
CREATE UNIQUE INDEX "File_fileName_key" ON "File"("fileName");

-- CreateIndex
CREATE UNIQUE INDEX "File_filePath_key" ON "File"("filePath");

-- CreateIndex
CREATE UNIQUE INDEX "File_fileId_key" ON "File"("fileId");

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
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MerchantCountries" ADD CONSTRAINT "_MerchantCountries_A_fkey" FOREIGN KEY ("A") REFERENCES "GeographicCountry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MerchantCountries" ADD CONSTRAINT "_MerchantCountries_B_fkey" FOREIGN KEY ("B") REFERENCES "Merchant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryCountries" ADD CONSTRAINT "_CategoryCountries_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryCountries" ADD CONSTRAINT "_CategoryCountries_B_fkey" FOREIGN KEY ("B") REFERENCES "GeographicCountry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
