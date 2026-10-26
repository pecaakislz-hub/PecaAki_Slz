-- Proteção de assinaturas e compras por loja.
-- auth.uid() é UUID no Supabase; StoreProfile.userId é TEXT no schema Prisma.
-- O cast explícito evita comparação entre tipos incompatíveis.
-- A role service_role mantém bypass padrão do RLS para o backend/Prisma.

ALTER TABLE "StoreSubscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CreditPurchase" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "store_subscription_select_own" ON "StoreSubscription";
DROP POLICY IF EXISTS "store_subscription_update_own" ON "StoreSubscription";
DROP POLICY IF EXISTS "credit_purchase_select_own" ON "CreditPurchase";
DROP POLICY IF EXISTS "credit_purchase_update_own" ON "CreditPurchase";

CREATE POLICY "store_subscription_select_own"
  ON "StoreSubscription"
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM "StoreProfile" sp
      WHERE sp."id" = "StoreSubscription"."storeProfileId"
        AND sp."userId" = (auth.uid())::text
    )
  );

CREATE POLICY "store_subscription_update_own"
  ON "StoreSubscription"
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM "StoreProfile" sp
      WHERE sp."id" = "StoreSubscription"."storeProfileId"
        AND sp."userId" = (auth.uid())::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM "StoreProfile" sp
      WHERE sp."id" = "StoreSubscription"."storeProfileId"
        AND sp."userId" = (auth.uid())::text
    )
  );

CREATE POLICY "credit_purchase_select_own"
  ON "CreditPurchase"
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM "StoreProfile" sp
      WHERE sp."id" = "CreditPurchase"."storeProfileId"
        AND sp."userId" = (auth.uid())::text
    )
  );

CREATE POLICY "credit_purchase_update_own"
  ON "CreditPurchase"
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM "StoreProfile" sp
      WHERE sp."id" = "CreditPurchase"."storeProfileId"
        AND sp."userId" = (auth.uid())::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM "StoreProfile" sp
      WHERE sp."id" = "CreditPurchase"."storeProfileId"
        AND sp."userId" = (auth.uid())::text
    )
  );
