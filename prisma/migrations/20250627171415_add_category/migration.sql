-- AlterTable
ALTER TABLE "HowToStep" ALTER COLUMN "description" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Category" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "translatedName" TEXT,
    "description" TEXT,
    "icon" TEXT,
    "country" TEXT,
    "pageTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT[],
    "parentId" UUID,
    "path" TEXT NOT NULL DEFAULT '',
    "level" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Category_path_idx" ON "Category"("path");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
