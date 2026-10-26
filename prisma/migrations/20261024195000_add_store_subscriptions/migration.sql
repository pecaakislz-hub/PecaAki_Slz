CREATE TYPE "PlanTier" AS ENUM ('STARTER', 'PRO', 'PREMIUM');
CREATE TYPE "BillingCycle" AS ENUM ('MONTHLY', 'ANNUALLY');
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PAST_DUE', 'CANCELED');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED');

ALTER TABLE "StoreSubscription" RENAME COLUMN "plan" TO "planTier";
ALTER TABLE "StoreSubscription" RENAME COLUMN "monthlyQuoteLimit" TO "monthlyQuota";
ALTER TABLE "StoreSubscription" RENAME COLUMN "periodStart" TO "currentPeriodStart";
ALTER TABLE "StoreSubscription" RENAME COLUMN "periodEnd" TO "currentPeriodEnd";
ALTER TABLE "StoreSubscription" ADD COLUMN "quotaUsed" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "StoreSubscription" ALTER COLUMN "planTier" DROP DEFAULT;
ALTER TABLE "StoreSubscription" ALTER COLUMN "billingCycle" DROP DEFAULT;
ALTER TABLE "StoreSubscription" ALTER COLUMN "status" DROP DEFAULT;

UPDATE "StoreSubscription" SET "planTier" = UPPER("planTier");
UPDATE "StoreSubscription" SET "billingCycle" = 'ANNUALLY' WHERE UPPER("billingCycle") IN ('YEARLY', 'ANNUALLY');
UPDATE "StoreSubscription" SET "billingCycle" = 'MONTHLY' WHERE UPPER("billingCycle") NOT IN ('ANNUALLY', 'YEARLY');
UPDATE "StoreSubscription" SET "status" = 'ACTIVE' WHERE UPPER("status") NOT IN ('ACTIVE', 'PAST_DUE', 'CANCELED');

ALTER TABLE "StoreSubscription" ALTER COLUMN "planTier" TYPE "PlanTier" USING "planTier"::"PlanTier";
ALTER TABLE "StoreSubscription" ALTER COLUMN "billingCycle" TYPE "BillingCycle" USING "billingCycle"::"BillingCycle";
ALTER TABLE "StoreSubscription" ALTER COLUMN "status" TYPE "SubscriptionStatus" USING "status"::"SubscriptionStatus";
ALTER TABLE "StoreSubscription" ALTER COLUMN "currentPeriodEnd" DROP NOT NULL;
ALTER TABLE "StoreSubscription" ALTER COLUMN "planTier" SET DEFAULT 'STARTER'::"PlanTier";
ALTER TABLE "StoreSubscription" ALTER COLUMN "billingCycle" SET DEFAULT 'MONTHLY'::"BillingCycle";
ALTER TABLE "StoreSubscription" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'::"SubscriptionStatus";

ALTER TABLE "CreditPurchase" DROP CONSTRAINT IF EXISTS "CreditPurchase_walletId_fkey";
ALTER TABLE "CreditPurchase" ADD COLUMN "storeProfileId" TEXT;
ALTER TABLE "CreditPurchase" ADD COLUMN "subscriptionId" TEXT;
ALTER TABLE "CreditPurchase" ADD COLUMN "planTier" "PlanTier";
ALTER TABLE "CreditPurchase" ADD COLUMN "billingCycle" "BillingCycle";
ALTER TABLE "CreditPurchase" ADD COLUMN "isExtraCredits" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "CreditPurchase" ADD COLUMN "quantity" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "CreditPurchase" ADD COLUMN "amount" DOUBLE PRECISION;
ALTER TABLE "CreditPurchase" ADD COLUMN "paymentMethod" TEXT;
ALTER TABLE "CreditPurchase" ADD COLUMN "externalTransactionId" TEXT;

ALTER TABLE "CreditPurchase" ALTER COLUMN "status" DROP DEFAULT;

UPDATE "CreditPurchase" cp
SET "storeProfileId" = cw."storeProfileId"
FROM "CreditWallet" cw
WHERE cp."walletId" = cw."id";
UPDATE "CreditPurchase" SET "quantity" = COALESCE("credits", 1), "amount" = COALESCE("totalPrice", "unitPrice" * COALESCE("credits", 1));
UPDATE "CreditPurchase" SET "status" = UPPER("status");
UPDATE "CreditPurchase" SET "status" = 'PENDING' WHERE UPPER("status") NOT IN ('PENDING', 'PAID', 'FAILED');

ALTER TABLE "CreditPurchase" ALTER COLUMN "storeProfileId" SET NOT NULL;
ALTER TABLE "CreditPurchase" ALTER COLUMN "amount" SET NOT NULL;
ALTER TABLE "CreditPurchase" ALTER COLUMN "status" TYPE "PaymentStatus" USING "status"::"PaymentStatus";
ALTER TABLE "CreditPurchase" ALTER COLUMN "status" SET DEFAULT 'PENDING'::"PaymentStatus";
ALTER TABLE "CreditPurchase" DROP COLUMN "walletId";
ALTER TABLE "CreditPurchase" DROP COLUMN "credits";
ALTER TABLE "CreditPurchase" DROP COLUMN "unitPrice";
ALTER TABLE "CreditPurchase" DROP COLUMN "totalPrice";

ALTER TABLE "CreditPurchase" ADD CONSTRAINT "CreditPurchase_storeProfileId_fkey" FOREIGN KEY ("storeProfileId") REFERENCES "StoreProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CreditPurchase" ADD CONSTRAINT "CreditPurchase_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "StoreSubscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX "CreditPurchase_storeProfileId_idx" ON "CreditPurchase"("storeProfileId");
CREATE INDEX "CreditPurchase_subscriptionId_idx" ON "CreditPurchase"("subscriptionId");

DROP TABLE "CreditWallet";
