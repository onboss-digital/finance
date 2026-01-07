-- Seed realistic cash flow data for last 3 months
INSERT INTO public.lancamentos (data, mes, ano, tipo, categoria, descricao, responsavel, valor, status) VALUES
-- January 2025 - Entradas
('2025-01-05', 1, 2025, 'entrada', 'Vendas', 'Venda Produto A - Cliente João', 'Maria', 5000.00, 'concluido'),
('2025-01-08', 1, 2025, 'entrada', 'Vendas', 'Venda Produto B - Cliente Pedro', 'Maria', 3500.00, 'concluido'),
('2025-01-12', 1, 2025, 'entrada', 'Serviços', 'Consultoria - Empresa XYZ', 'Carlos', 2000.00, 'concluido'),
('2025-01-15', 1, 2025, 'entrada', 'Investimentos', 'Aporte de Capital', 'Diretor', 10000.00, 'concluido'),
('2025-01-20', 1, 2025, 'entrada', 'Vendas', 'Venda Produto C - Cliente Ana', 'Maria', 4500.00, 'concluido'),

-- January 2025 - Saídas
('2025-01-03', 1, 2025, 'saida', 'Salários', 'Folha de Pagamento Janeiro', 'RH', 12000.00, 'concluido'),
('2025-01-05', 1, 2025, 'saida', 'Fornecedores', 'Compra Matéria Prima - Fornecedor A', 'Compras', 3000.00, 'concluido'),
('2025-01-10', 1, 2025, 'saida', 'Aluguel', 'Aluguel Sala Comercial', 'Admin', 2500.00, 'concluido'),
('2025-01-12', 1, 2025, 'saida', 'Utilidades', 'Conta Energia', 'Admin', 800.00, 'concluido'),
('2025-01-15', 1, 2025, 'saida', 'Impostos', 'INSS Mensal', 'Financeiro', 1500.00, 'pendente'),
('2025-01-18', 1, 2025, 'saida', 'Marketing', 'Publicidade Google Ads', 'Marketing', 1200.00, 'concluido'),

-- December 2024 - Entradas
('2024-12-02', 12, 2024, 'entrada', 'Vendas', 'Venda Produto A - Holiday', 'Maria', 6500.00, 'concluido'),
('2024-12-08', 12, 2024, 'entrada', 'Vendas', 'Venda Especial Produto D', 'Maria', 4200.00, 'concluido'),
('2024-12-15', 12, 2024, 'entrada', 'Serviços', 'Consultoria - Cliente Beta', 'Carlos', 3000.00, 'concluido'),

-- December 2024 - Saídas
('2024-12-01', 12, 2024, 'saida', 'Salários', 'Folha de Pagamento + 13º', 'RH', 15000.00, 'concluido'),
('2024-12-05', 12, 2024, 'saida', 'Fornecedores', 'Compra Matéria Prima', 'Compras', 4000.00, 'concluido'),
('2024-12-10', 12, 2024, 'saida', 'Aluguel', 'Aluguel Sala Comercial', 'Admin', 2500.00, 'concluido'),

-- November 2024 - Entradas
('2024-11-05', 11, 2024, 'entrada', 'Vendas', 'Venda Black Friday', 'Maria', 8000.00, 'concluido'),
('2024-11-10', 11, 2024, 'entrada', 'Serviços', 'Projeto Desenvolvimento', 'Carlos', 5000.00, 'concluido'),

-- November 2024 - Saídas
('2024-11-01', 11, 2024, 'saida', 'Salários', 'Folha de Pagamento', 'RH', 12000.00, 'concluido'),
('2024-11-05', 11, 2024, 'saida', 'Fornecedores', 'Estoque', 'Compras', 3500.00, 'concluido');
