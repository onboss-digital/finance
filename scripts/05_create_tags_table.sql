-- Create tags table for product/project classification
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  nome VARCHAR(100) NOT NULL UNIQUE,
  descricao TEXT,
  cor VARCHAR(7) DEFAULT '#06b6d4',
  ativo BOOLEAN DEFAULT TRUE
);

-- Add tag_id column to lancamentos table
ALTER TABLE public.lancamentos ADD COLUMN IF NOT EXISTS tag_id UUID REFERENCES public.tags(id) ON DELETE SET NULL;

-- Create index for tag filtering
CREATE INDEX IF NOT EXISTS idx_lancamentos_tag ON public.lancamentos(tag_id);

-- Insert default tags (example products/projects)
INSERT INTO public.tags (nome, descricao, cor) VALUES
('SnapHubb', 'Operação/Projeto SnapHubb', '#06b6d4'),
('Lumpic', 'Operação/Projeto Lumpic', '#10b981'),
('Administrativo', 'Despesas administrativas gerais', '#f59e0b'),
('Investimentos', 'Investimentos e novos projetos', '#8b5cf6')
ON CONFLICT (nome) DO NOTHING;
