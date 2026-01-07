-- Create lancamentos table with all required fields
CREATE TABLE IF NOT EXISTS public.lancamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  data DATE NOT NULL,
  mes INTEGER NOT NULL,
  ano INTEGER NOT NULL,
  
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada', 'saida')),
  categoria VARCHAR(100) NOT NULL,
  subcategoria VARCHAR(100),
  descricao TEXT NOT NULL,
  responsavel VARCHAR(100) NOT NULL,
  
  valor DECIMAL(15, 2) NOT NULL CHECK (valor > 0),
  status VARCHAR(20) DEFAULT 'concluido' CHECK (status IN ('pendente', 'concluido', 'cancelado')),
  
  notas TEXT,
  documento VARCHAR(100),
  
  user_id UUID,
  
  CONSTRAINT positive_valor CHECK (valor > 0)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_lancamentos_data ON public.lancamentos(data);
CREATE INDEX IF NOT EXISTS idx_lancamentos_mes_ano ON public.lancamentos(mes, ano);
CREATE INDEX IF NOT EXISTS idx_lancamentos_tipo ON public.lancamentos(tipo);
CREATE INDEX IF NOT EXISTS idx_lancamentos_categoria ON public.lancamentos(categoria);
CREATE INDEX IF NOT EXISTS idx_lancamentos_responsavel ON public.lancamentos(responsavel);
CREATE INDEX IF NOT EXISTS idx_lancamentos_status ON public.lancamentos(status);

-- Create metas table for revenue/expense targets
CREATE TABLE IF NOT EXISTS public.metas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  mes INTEGER NOT NULL,
  ano INTEGER NOT NULL,
  
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada', 'saida')),
  categoria VARCHAR(100),
  
  valor_meta DECIMAL(15, 2) NOT NULL,
  valor_realizado DECIMAL(15, 2) DEFAULT 0,
  
  UNIQUE(mes, ano, tipo, categoria)
);

CREATE INDEX IF NOT EXISTS idx_metas_periodo ON public.metas(mes, ano);

-- Create categorias table
CREATE TABLE IF NOT EXISTS public.categorias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  nome VARCHAR(100) NOT NULL UNIQUE,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada', 'saida')),
  descricao TEXT,
  cor VARCHAR(7),
  ativo BOOLEAN DEFAULT TRUE
);

-- Insert default categories
INSERT INTO public.categorias (nome, tipo, cor) VALUES
-- Entradas
('Vendas', 'entrada', '#10b981'),
('Serviços', 'entrada', '#06b6d4'),
('Investimentos', 'entrada', '#3b82f6'),
('Devolução', 'entrada', '#8b5cf6'),
('Outras Entradas', 'entrada', '#14b8a6'),

-- Saídas
('Salários', 'saida', '#ef4444'),
('Fornecedores', 'saida', '#f97316'),
('Aluguel', 'saida', '#ec4899'),
('Utilidades', 'saida', '#f59e0b'),
('Impostos', 'saida', '#6366f1'),
('Marketing', 'saida', '#d946ef'),
('Operacional', 'saida', '#84cc16'),
('Outras Saídas', 'saida', '#64748b')
ON CONFLICT (nome) DO NOTHING;
