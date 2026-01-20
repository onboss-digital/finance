-- Desabilitar RLS temporariamente na tabela lancamentos
-- Isso permite que o app funcione sem a coluna user_id

-- Desabilitar RLS na tabela
ALTER TABLE public.lancamentos DISABLE ROW LEVEL SECURITY;

-- Remover todas as políticas RLS existentes (se houver)
DROP POLICY IF EXISTS "lancamentos_select_all" ON public.lancamentos;
DROP POLICY IF EXISTS "lancamentos_insert_all" ON public.lancamentos;
DROP POLICY IF EXISTS "lancamentos_update_all" ON public.lancamentos;
DROP POLICY IF EXISTS "lancamentos_delete_all" ON public.lancamentos;

-- Confirmar que RLS foi desabilitado
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'lancamentos';
