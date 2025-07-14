-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "navbarOrder" INTEGER;

-- CreateTable
CREATE TABLE "CarouselImage" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "position" DOUBLE PRECISION,
    "largeUrl" TEXT NOT NULL,
    "mediumUrl" TEXT NOT NULL,
    "smallUrl" TEXT NOT NULL,
    "largeId" TEXT NOT NULL,
    "mediumId" TEXT NOT NULL,
    "smallId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarouselImage_pkey" PRIMARY KEY ("id")
);
