CREATE TABLE "StoreSubscription" (
  "id" TEXT NOT NULL,
  "storeProfileId" TEXT NOT NULL,
  "plan" TEXT NOT NULL DEFAULT 'STARTER',
  "billingCycle" TEXT NOT NULL DEFAULT 'MONTHLY',
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "monthlyQuoteLimit" INTEGER NOT NULL DEFAULT 5,
  "extraCredits" INTEGER NOT NULL DEFAULT 0,
  "periodStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "periodEnd" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "StoreSubscription_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "StoreSubscription_storeProfileId_key" ON "StoreSubscription"("storeProfileId");

CREATE TABLE "CreditWallet" (
  "id" TEXT NOT NULL,
  "storeProfileId" TEXT NOT NULL,
  "balance" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CreditWallet_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "CreditWallet_storeProfileId_key" ON "CreditWallet"("storeProfileId");

CREATE TABLE "CreditPurchase" (
  "id" TEXT NOT NULL,
  "walletId" TEXT NOT NULL,
  "credits" INTEGER NOT NULL,
  "unitPrice" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
  "totalPrice" DOUBLE PRECISION NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CreditPurchase_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "CreditPurchase_walletId_idx" ON "CreditPurchase"("walletId");

ALTER TABLE "StoreSubscription" ADD CONSTRAINT "StoreSubscription_storeProfileId_fkey" FOREIGN KEY ("storeProfileId") REFERENCES "StoreProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CreditWallet" ADD CONSTRAINT "CreditWallet_storeProfileId_fkey" FOREIGN KEY ("storeProfileId") REFERENCES "StoreProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CreditPurchase" ADD CONSTRAINT "CreditPurchase_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "CreditWallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
