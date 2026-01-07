-- Create lancamentos table
CREATE TABLE IF NOT EXISTS lancamentos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  data DATE NOT NULL,
  mes INT NOT NULL,
  ano INT NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('ENTRADA', 'SAÍDA')),
  categoria VARCHAR(50) NOT NULL,
  descricao VARCHAR(255) NOT NULL,
  responsavel VARCHAR(100) NOT NULL,
  valor DECIMAL(12, 2) NOT NULL CHECK (valor > 0),
  status VARCHAR(20) NOT NULL CHECK (status IN ('Pago', 'Pendente')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_lancamentos_data ON lancamentos(data);
CREATE INDEX IF NOT EXISTS idx_lancamentos_mes_ano ON lancamentos(mes, ano);
CREATE INDEX IF NOT EXISTS idx_lancamentos_tipo ON lancamentos(tipo);
CREATE INDEX IF NOT EXISTS idx_lancamentos_categoria ON lancamentos(categoria);
CREATE INDEX IF NOT EXISTS idx_lancamentos_responsavel ON lancamentos(responsavel);
