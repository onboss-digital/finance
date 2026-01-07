# 🚀 Setup Inicial - Dados do Supabase

Siga estes passos para configurar corretamente o Supabase com todos os dados necessários.

## 1️⃣ Verificar Tabelas Criadas

Abra o Supabase Console e verifique se estas tabelas existem:

- [ ] `lancamentos` - Transações financeiras
- [ ] `categorias` - Categorias de entrada/saída
- [ ] `responsaveis` - Pessoas responsáveis
- [ ] `tags` - Projetos/Produtos
- [ ] `metas` - Metas/Orçamentos

---

## 2️⃣ Criar Tabela de Metas (Se Não Existir)

1. Vá para **SQL Editor** no Supabase Console
2. Cole o conteúdo de `scripts/06_create_metas_table.sql`
3. Clique em **Run**

```bash
# Ou via CLI Supabase
supabase db push
```

---

## 3️⃣ Dados Iniciais Necessários

### Categorias (Obrigatório)
Pelo menos 2 categorias (1 entrada, 1 saída):

| Nome | Tipo | Cor |
|------|------|-----|
| Vendas | entrada | #10b981 |
| Salários | saida | #ef4444 |

**Via SQL:**
```sql
INSERT INTO categorias (nome, tipo, cor) VALUES 
('Vendas', 'entrada', '#10b981'),
('Salários', 'saida', '#ef4444');
```

### Responsáveis (Obrigatório)
Pelo menos 1 responsável:

| Nome | Email |
|------|-------|
| Maria | maria@empresa.com |

**Via SQL:**
```sql
INSERT INTO responsaveis (nome, email, ativo) VALUES 
('Maria', 'maria@empresa.com', true);
```

### Metas (Opcional)
Se quiser metas personalizadas:

```sql
INSERT INTO metas (categoria_id, tipo, valor_meta, mes, ano) 
SELECT id, tipo, 15000, 1, 2026 
FROM categorias LIMIT 1;
```

---

## 4️⃣ Testar Conexão

1. Abra `http://localhost:3000/lancamentos`
2. Verificar se aparecem:
   - ✅ Categorias carregadas
   - ✅ Responsáveis carregados
   - ✅ Campos preenchíveis

---

## 5️⃣ Dados em Produção

### Após o primeiro deploy:

1. **Supabase Console**
2. Vá para cada tabela
3. Insira dados reais da sua empresa:
   - Categorias do seu negócio
   - Responsáveis do seu time
   - Projetos/Tags relevantes
   - Metas mensuais/anuais

---

## 📋 Exemplo Completo de Setup

```sql
-- 1. Garantir categorias
INSERT INTO categorias (nome, tipo, cor, descricao) VALUES 
('Vendas', 'entrada', '#10b981', 'Receita de vendas'),
('Serviços', 'entrada', '#06b6d4', 'Receita de serviços'),
('Salários', 'saida', '#ef4444', 'Folha de pagamento'),
('Fornecedores', 'saida', '#f97316', 'Compras de materiais'),
('Aluguel', 'saida', '#8b5cf6', 'Despesa de aluguel')
ON CONFLICT DO NOTHING;

-- 2. Garantir responsáveis
INSERT INTO responsaveis (nome, email, ativo) VALUES 
('Maria Silva', 'maria@empresa.com', true),
('Carlos Santos', 'carlos@empresa.com', true),
('RH Financeira', 'rh@empresa.com', true)
ON CONFLICT DO NOTHING;

-- 3. Garantir tags
INSERT INTO tags (nome, descricao, ativo) VALUES 
('Projeto A', 'Projeto principal', true),
('Produto X', 'Linha de produto', true),
('Operacional', 'Despesas operacionais', true)
ON CONFLICT DO NOTHING;

-- 4. Criar metas do mês atual
INSERT INTO metas (categoria_id, tipo, valor_meta, mes, ano)
SELECT id, tipo, 
  CASE WHEN tipo = 'entrada' THEN 20000 ELSE 15000 END,
  EXTRACT(MONTH FROM NOW())::int,
  EXTRACT(YEAR FROM NOW())::int
FROM categorias
ON CONFLICT DO NOTHING;
```

---

## 🔍 Troubleshooting

### Problema: "Sem categorias no formulário"
**Solução:** 
1. Verificar tabela `categorias` tem dados
2. Verificar coluna `tipo` tem valores corretos
3. Clearar localStorage do navegador

### Problema: "Sem responsáveis no formulário"
**Solução:**
1. Verificar tabela `responsaveis` tem dados
2. Verificar coluna `ativo` está como `true`

### Problema: "Metas não aparecem"
**Solução:**
1. Verificar tabela `metas` tem dados
2. Se vazio, sistema usa padrões automáticos
3. Inserir metas do mês/ano atual

---

## 📊 Verificação Rápida

No Supabase Console, rode:

```sql
-- Contar dados em cada tabela
SELECT 'categorias' as tabela, COUNT(*) as total FROM categorias
UNION ALL
SELECT 'responsaveis', COUNT(*) FROM responsaveis
UNION ALL
SELECT 'tags', COUNT(*) FROM tags
UNION ALL
SELECT 'metas', COUNT(*) FROM metas;
```

Resultado esperado: ✅ Todos > 0

---

## ✅ Checklist Final

- [ ] Tabela `metas` criada
- [ ] Pelo menos 2 categorias inseridas
- [ ] Pelo menos 1 responsável inserido
- [ ] Servidor compilando sem erros
- [ ] Formulário de lançamentos carregando dados
- [ ] Seção de metas exibindo dados

---

**Tudo pronto? 🎉**

Agora o sistema está 100% dinâmico e sem dados hardcoded!

Qualquer novo dado adicionado ao Supabase aparecerá automaticamente na interface.
