-- Create categorias table with colors for better UX
CREATE TABLE IF NOT EXISTS public.categorias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  nome VARCHAR(100) NOT NULL UNIQUE,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada', 'saida')),
  descricao TEXT,
  cor VARCHAR(7) DEFAULT '#06b6d4',
  ativo BOOLEAN DEFAULT TRUE,
  
  CONSTRAINT nome_not_empty CHECK (LENGTH(TRIM(nome)) > 0)
);

-- Insert comprehensive list of default categories with colors
INSERT INTO public.categorias (nome, tipo, cor, descricao) VALUES
-- Entradas (Receitas)
('Vendas', 'entrada', '#10b981', 'Receita de vendas de produtos'),
('Serviços', 'entrada', '#06b6d4', 'Receita de prestação de serviços'),
('Investimentos', 'entrada', '#3b82f6', 'Aportes de capital e investimentos'),
('Devolução', 'entrada', '#8b5cf6', 'Devoluções e reembolsos'),
('Outras Entradas', 'entrada', '#14b8a6', 'Outras receitas não categorizadas'),

-- Saídas (Despesas)
('Salários', 'saida', '#ef4444', 'Folha de pagamento e salários'),
('Fornecedores', 'saida', '#f97316', 'Compras de materiais e fornecedores'),
('Aluguel', 'saida', '#ec4899', 'Aluguel de imóvel/espaço'),
('Utilidades', 'saida', '#f59e0b', 'Água, energia, internet, etc'),
('Impostos', 'saida', '#6366f1', 'Impostos e contribuições'),
('Marketing', 'saida', '#d946ef', 'Publicidade e marketing'),
('Operacional', 'saida', '#84cc16', 'Despesas operacionais gerais'),
('Outras Saídas', 'saida', '#64748b', 'Outras despesas não categorizadas')
ON CONFLICT (nome) DO NOTHING;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_categorias_tipo ON public.categorias(tipo);
CREATE INDEX IF NOT EXISTS idx_categorias_ativo ON public.categorias(ativo);
