-- CreateTable
CREATE TABLE "Merchant" (
    "id" UUID NOT NULL,
    "merchantName" TEXT,
    "merchantSeoName" TEXT,
    "description" TEXT,
    "translatedDescription" TEXT,
    "type" TEXT,
    "logoUrl" TEXT,
    "status" TEXT,
    "visibility" TEXT,
    "geographicMarket" TEXT,
    "networkId" UUID,
    "currency" TEXT,
    "staff" TEXT,
    "merchantUrl" TEXT,
    "affiliateUrl" TEXT,
    "isPriority" BOOLEAN NOT NULL DEFAULT false,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "pageTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT[],
    "pageHeading" TEXT,
    "howToOverviewImageUrl" TEXT,
    "overviewImageUrl" TEXT,
    "networkMerchantId" TEXT,
    "isCPTAvailable" BOOLEAN NOT NULL DEFAULT false,
    "androidAppUrl" TEXT,
    "iosAppUrl" TEXT,
    "windowsAppUrl" TEXT,
    "formState" TEXT NOT NULL DEFAULT 'draft',
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,

    CONSTRAINT "Merchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "networks" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "parameters" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "networks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HowToStep" (
    "id" TEXT NOT NULL,
    "merchantId" UUID NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "title" TEXT,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HowToStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MpuAd" (
    "id" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "htmlContent" TEXT,
    "order" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MpuAd_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "networks_name_key" ON "networks"("name");

-- CreateIndex
CREATE INDEX "MpuAd_targetType_targetId_idx" ON "MpuAd"("targetType", "targetId");

-- AddForeignKey
ALTER TABLE "Merchant" ADD CONSTRAINT "Merchant_networkId_fkey" FOREIGN KEY ("networkId") REFERENCES "networks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HowToStep" ADD CONSTRAINT "HowToStep_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
