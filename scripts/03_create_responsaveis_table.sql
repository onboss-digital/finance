-- Create responsáveis table
CREATE TABLE IF NOT EXISTS public.responsaveis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  nome VARCHAR(100) NOT NULL UNIQUE,
  ativo BOOLEAN DEFAULT TRUE
);

-- Insert default responsáveis
INSERT INTO public.responsaveis (nome) VALUES
('Maria'),
('Carlos'),
('Diretor'),
('RH'),
('Compras'),
('Admin'),
('Financeiro'),
('Marketing')
ON CONFLICT (nome) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_responsaveis_ativo ON public.responsaveis(ativo);
