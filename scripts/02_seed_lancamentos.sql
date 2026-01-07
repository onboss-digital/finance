-- Seed data for lancamentos table
INSERT INTO lancamentos (data, mes, ano, tipo, categoria, descricao, responsavel, valor, status) VALUES
-- Janeiro 2025
('2025-01-05', 1, 2025, 'ENTRADA', 'Vendas', 'Venda de produto A', 'Gerente Vendas', 5000.00, 'Pago'),
('2025-01-08', 1, 2025, 'ENTRADA', 'Serviços', 'Consultoria projeto B', 'Diretor', 3500.00, 'Pago'),
('2025-01-10', 1, 2025, 'SAÍDA', 'Ferramentas', 'Software de contabilidade', 'Gerente TI', 800.00, 'Pago'),
('2025-01-12', 1, 2025, 'SAÍDA', 'Marketing', 'Publicidade digital', 'Gerente Marketing', 1500.00, 'Pendente'),
('2025-01-15', 1, 2025, 'SAÍDA', 'Impostos', 'Imposto municipal', 'Contador', 2000.00, 'Pago'),
('2025-01-18', 1, 2025, 'ENTRADA', 'Vendas', 'Venda de serviço C', 'Vendedor Junior', 2200.00, 'Pago'),
('2025-01-22', 1, 2025, 'SAÍDA', 'Outros', 'Material de escritório', 'Assistente', 350.00, 'Pago'),
('2025-01-25', 1, 2025, 'ENTRADA', 'Serviços', 'Projeto consultoria D', 'Diretor', 4000.00, 'Pendente'),

-- Fevereiro 2025
('2025-02-03', 2, 2025, 'ENTRADA', 'Vendas', 'Venda de produto E', 'Gerente Vendas', 6000.00, 'Pago'),
('2025-02-07', 2, 2025, 'SAÍDA', 'Marketing', 'Campanha redes sociais', 'Gerente Marketing', 2000.00, 'Pago'),
('2025-02-10', 2, 2025, 'ENTRADA', 'Serviços', 'Suporte técnico', 'Gerente Técnico', 1500.00, 'Pago'),
('2025-02-14', 2, 2025, 'SAÍDA', 'Ferramentas', 'Licenças de software', 'Gerente TI', 1200.00, 'Pendente'),
('2025-02-17', 2, 2025, 'SAÍDA', 'Impostos', 'Contribuição fiscal', 'Contador', 2500.00, 'Pago'),
('2025-02-20', 2, 2025, 'ENTRADA', 'Vendas', 'Venda grande cliente', 'Gerente Vendas', 8000.00, 'Pendente'),
('2025-02-24', 2, 2025, 'SAÍDA', 'Outros', 'Manutenção escritório', 'Gerente Operações', 600.00, 'Pago'),

-- Março 2025
('2025-03-02', 3, 2025, 'ENTRADA', 'Vendas', 'Venda de produto F', 'Gerente Vendas', 4500.00, 'Pago'),
('2025-03-05', 3, 2025, 'ENTRADA', 'Serviços', 'Consultoria estratégica', 'Diretor', 5000.00, 'Pago'),
('2025-03-08', 3, 2025, 'SAÍDA', 'Marketing', 'Evento de marketing', 'Gerente Marketing', 3000.00, 'Pago'),
('2025-03-12', 3, 2025, 'SAÍDA', 'Ferramentas', 'Hardware para equipe', 'Gerente TI', 2500.00, 'Pendente'),
('2025-03-15', 3, 2025, 'ENTRADA', 'Serviços', 'Projeto implementação', 'Gerente Técnico', 3500.00, 'Pago'),
('2025-03-18', 3, 2025, 'SAÍDA', 'Impostos', 'Imposto estadual', 'Contador', 3000.00, 'Pago'),
('2025-03-22', 3, 2025, 'ENTRADA', 'Vendas', 'Venda promoção', 'Vendedor Junior', 2800.00, 'Pago'),
('2025-03-28', 3, 2025, 'SAÍDA', 'Outros', 'Limpeza e manutenção', 'Gerente Operações', 400.00, 'Pago');
