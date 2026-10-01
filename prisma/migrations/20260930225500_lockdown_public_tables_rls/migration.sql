-- PeçaAki SLZ: as tabelas de negócio são acessadas exclusivamente por APIs
-- server-side/Prisma. O navegador usa Supabase apenas para Auth.
-- RLS + REVOKE formam uma defesa em profundidade contra o acesso público.

DO $$
DECLARE
  table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'User',
    'StoreProfile',
    'Vehicle',
    'QuoteRequest',
    'Proposal',
    'Notification',
    'Purchase',
    'Review',
    'WhatsAppMessage'
  ] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
    EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon, authenticated', table_name);
    EXECUTE format(
      'DROP POLICY IF EXISTS "deny_public_access" ON public.%I',
      table_name
    );
    EXECUTE format(
      'CREATE POLICY "deny_public_access" ON public.%I AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false) WITH CHECK (false)',
      table_name
    );
  END LOOP;
END $$;

-- Novas tabelas públicas não devem herdar privilégios de leitura/escrita.
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated;
