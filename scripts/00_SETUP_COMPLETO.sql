-- ============================================================
-- SETUP COMPLETO DO BANCO SUPABASE
-- Execute TODOS os comandos na ordem exata
-- ============================================================

-- ============================================================
-- 1. CRIAR TABELA: CATEGORIAS
-- ============================================================
DROP TABLE IF EXISTS public.categorias CASCADE;

CREATE TABLE public.categorias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  nome VARCHAR(100) NOT NULL UNIQUE,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada', 'saida')),
  cor VARCHAR(7) DEFAULT '#06b6d4',
  ativo BOOLEAN DEFAULT TRUE,
  
  CONSTRAINT nome_not_empty CHECK (LENGTH(TRIM(nome)) > 0)
);

-- Criar índices para categorias
CREATE INDEX idx_categorias_tipo ON public.categorias(tipo);
CREATE INDEX idx_categorias_ativo ON public.categorias(ativo);
CREATE INDEX idx_categorias_nome ON public.categorias(nome);

-- Habilitar RLS em categorias
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para categorias (permitir leitura/escrita total)
CREATE POLICY "Permitir SELECT em categorias" ON public.categorias
  FOR SELECT USING (true);

CREATE POLICY "Permitir INSERT em categorias" ON public.categorias
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir UPDATE em categorias" ON public.categorias
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Permitir DELETE em categorias" ON public.categorias
  FOR DELETE USING (true);

-- Inserir categorias padrão
INSERT INTO public.categorias (nome, tipo, cor) VALUES
-- Entradas (Receitas)
('Vendas', 'entrada', '#10b981'),
('Serviços', 'entrada', '#06b6d4'),
('Investimentos', 'entrada', '#3b82f6'),
('Devolução', 'entrada', '#8b5cf6'),
('Outras Entradas', 'entrada', '#14b8a6'),

-- Saídas (Despesas)
('Salários', 'saida', '#ef4444'),
('Fornecedores', 'saida', '#f97316'),
('Aluguel', 'saida', '#ec4899'),
('Utilidades', 'saida', '#f59e0b'),
('Impostos', 'saida', '#6366f1'),
('Marketing', 'saida', '#d946ef'),
('Operacional', 'saida', '#84cc16'),
('Outras Saídas', 'saida', '#64748b')
ON CONFLICT (nome) DO NOTHING;

-- ============================================================
-- 2. CRIAR TABELA: RESPONSÁVEIS
-- ============================================================
DROP TABLE IF EXISTS public.responsaveis CASCADE;

CREATE TABLE public.responsaveis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  nome VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(100),
  ativo BOOLEAN DEFAULT TRUE
);

-- Criar índices para responsáveis
CREATE INDEX idx_responsaveis_ativo ON public.responsaveis(ativo);
CREATE INDEX idx_responsaveis_nome ON public.responsaveis(nome);
CREATE INDEX idx_responsaveis_email ON public.responsaveis(email);

-- Habilitar RLS em responsáveis
ALTER TABLE public.responsaveis ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para responsáveis
CREATE POLICY "Permitir SELECT em responsaveis" ON public.responsaveis
  FOR SELECT USING (true);

CREATE POLICY "Permitir INSERT em responsaveis" ON public.responsaveis
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir UPDATE em responsaveis" ON public.responsaveis
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Permitir DELETE em responsaveis" ON public.responsaveis
  FOR DELETE USING (true);

-- Inserir responsáveis padrão
INSERT INTO public.responsaveis (nome, email) VALUES
('Maria', 'maria@empresa.com'),
('Carlos', 'carlos@empresa.com'),
('Diretor', 'diretor@empresa.com'),
('RH', 'rh@empresa.com'),
('Compras', 'compras@empresa.com'),
('Admin', 'admin@empresa.com'),
('Financeiro', 'financeiro@empresa.com'),
('Marketing', 'marketing@empresa.com')
ON CONFLICT (nome) DO NOTHING;

-- ============================================================
-- 3. CRIAR TABELA: TAGS
-- ============================================================
DROP TABLE IF EXISTS public.tags CASCADE;

CREATE TABLE public.tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  nome VARCHAR(100) NOT NULL UNIQUE,
  descricao TEXT,
  cor VARCHAR(7) DEFAULT '#06b6d4',
  ativo BOOLEAN DEFAULT TRUE
);

-- Criar índices para tags
CREATE INDEX idx_tags_ativo ON public.tags(ativo);
CREATE INDEX idx_tags_nome ON public.tags(nome);

-- Habilitar RLS em tags
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para tags
CREATE POLICY "Permitir SELECT em tags" ON public.tags
  FOR SELECT USING (true);

CREATE POLICY "Permitir INSERT em tags" ON public.tags
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir UPDATE em tags" ON public.tags
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Permitir DELETE em tags" ON public.tags
  FOR DELETE USING (true);

-- Inserir tags padrão
INSERT INTO public.tags (nome, descricao, cor) VALUES
('SnapHubb', 'Operação/Projeto SnapHubb', '#06b6d4'),
('Lumpic', 'Operação/Projeto Lumpic', '#10b981'),
('Administrativo', 'Despesas administrativas gerais', '#f59e0b'),
('Investimentos', 'Investimentos e novos projetos', '#8b5cf6')
ON CONFLICT (nome) DO NOTHING;

-- ============================================================
-- 4. CRIAR TABELA: METAS
-- ============================================================
DROP TABLE IF EXISTS public.metas CASCADE;

CREATE TABLE public.metas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  categoria_id UUID NOT NULL REFERENCES public.categorias(id) ON DELETE CASCADE,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada', 'saida')),
  valor_meta DECIMAL(15, 2) NOT NULL CHECK (valor_meta > 0),
  mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
  ano INTEGER NOT NULL CHECK (ano >= 2000),
  
  UNIQUE(categoria_id, mes, ano)
);

-- Criar índices para metas
CREATE INDEX idx_metas_categoria ON public.metas(categoria_id);
CREATE INDEX idx_metas_periodo ON public.metas(mes, ano);
CREATE INDEX idx_metas_tipo ON public.metas(tipo);

-- Habilitar RLS em metas
ALTER TABLE public.metas ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para metas
CREATE POLICY "Permitir SELECT em metas" ON public.metas
  FOR SELECT USING (true);

CREATE POLICY "Permitir INSERT em metas" ON public.metas
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir UPDATE em metas" ON public.metas
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Permitir DELETE em metas" ON public.metas
  FOR DELETE USING (true);

-- ============================================================
-- 5. CRIAR TABELA: LANÇAMENTOS (com suporte a tag_id)
-- ============================================================
DROP TABLE IF EXISTS public.lancamentos CASCADE;

CREATE TABLE public.lancamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  data DATE NOT NULL,
  mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
  ano INTEGER NOT NULL CHECK (ano >= 2000),
  
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada', 'saida')),
  categoria_id UUID REFERENCES public.categorias(id) ON DELETE SET NULL,
  responsavel_id UUID REFERENCES public.responsaveis(id) ON DELETE SET NULL,
  tag_id UUID REFERENCES public.tags(id) ON DELETE SET NULL,
  
  descricao TEXT NOT NULL,
  valor DECIMAL(15, 2) NOT NULL CHECK (valor > 0),
  status VARCHAR(20) DEFAULT 'concluido' CHECK (status IN ('pendente', 'concluido', 'cancelado')),
  
  notas TEXT,
  documento VARCHAR(100),
  
  CONSTRAINT descricao_not_empty CHECK (LENGTH(TRIM(descricao)) > 0)
);

-- Criar índices para lançamentos
CREATE INDEX idx_lancamentos_data ON public.lancamentos(data);
CREATE INDEX idx_lancamentos_mes_ano ON public.lancamentos(mes, ano);
CREATE INDEX idx_lancamentos_tipo ON public.lancamentos(tipo);
CREATE INDEX idx_lancamentos_categoria ON public.lancamentos(categoria_id);
CREATE INDEX idx_lancamentos_responsavel ON public.lancamentos(responsavel_id);
CREATE INDEX idx_lancamentos_tag ON public.lancamentos(tag_id);
CREATE INDEX idx_lancamentos_status ON public.lancamentos(status);

-- Habilitar RLS em lançamentos
ALTER TABLE public.lancamentos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para lançamentos
CREATE POLICY "Permitir SELECT em lancamentos" ON public.lancamentos
  FOR SELECT USING (true);

CREATE POLICY "Permitir INSERT em lancamentos" ON public.lancamentos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir UPDATE em lancamentos" ON public.lancamentos
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Permitir DELETE em lancamentos" ON public.lancamentos
  FOR DELETE USING (true);

-- ============================================================
-- 6. VERIFICAR ESTRUTURA (OPCIONAL - apenas para debug)
-- ============================================================
-- Descomente para ver o que foi criado:
-- SELECT * FROM information_schema.tables WHERE table_schema = 'public';
-- SELECT * FROM information_schema.columns WHERE table_schema = 'public';

-- ============================================================
-- FIM DO SETUP COMPLETO
-- ============================================================
