-- Criar tabela de metas
CREATE TABLE IF NOT EXISTS metas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  categoria_id UUID NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada', 'saida')),
  valor_meta DECIMAL(15,2) NOT NULL,
  mes INTEGER CHECK (mes >= 1 AND mes <= 12),
  ano INTEGER CHECK (ano >= 2000),
  usuario_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adicionar índices
CREATE INDEX idx_metas_categoria ON metas(categoria_id);
CREATE INDEX idx_metas_usuario ON metas(usuario_id);
CREATE INDEX idx_metas_periodo ON metas(mes, ano);

-- Inserir metas padrões iniciais (sem mês/ano específico = aplicável a todos)
INSERT INTO metas (categoria_id, tipo, valor_meta)
SELECT id, tipo, 
  CASE 
    WHEN tipo = 'entrada' THEN 15000
    ELSE 10000
  END as valor_meta
FROM categorias
ON CONFLICT DO NOTHING;

-- Habilitar RLS
ALTER TABLE metas ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
CREATE POLICY "Usuários podem ver metas" ON metas
  FOR SELECT USING (
    usuario_id IS NULL OR usuario_id = auth.uid()
  );

CREATE POLICY "Usuários podem criar metas" ON metas
  FOR INSERT WITH CHECK (usuario_id = auth.uid());

CREATE POLICY "Usuários podem atualizar suas metas" ON metas
  FOR UPDATE USING (usuario_id = auth.uid());

CREATE POLICY "Usuários podem deletar suas metas" ON metas
  FOR DELETE USING (usuario_id = auth.uid());
