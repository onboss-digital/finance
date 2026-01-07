# 🎯 Referência Rápida - Dados Dinâmicos

## Para Desenvolvedores

### Usar dados em novo componente

```tsx
import { useSupabaseData } from "@/hooks/use-supabase-data"

export default function MeuComponente() {
  const { categorias, responsaveis, tags, loading, error } = useSupabaseData()

  if (loading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error}</div>

  return (
    <div>
      {categorias.map(cat => (
        <div key={cat.id}>{cat.nome}</div>
      ))}
    </div>
  )
}
```

---

## Para Administradores

### Acessar dados via Supabase Console

```
https://supabase.com
→ Seu Projeto
→ Tables
→ Selecione tabela (categorias, responsaveis, etc)
→ Clique em "Insert new row"
```

### Inserir dados via SQL

```sql
-- Categorias
INSERT INTO categorias (nome, tipo, cor) 
VALUES ('Nova Categoria', 'entrada', '#10b981');

-- Responsáveis
INSERT INTO responsaveis (nome, email, ativo) 
VALUES ('Novo Responsável', 'email@empresa.com', true);

-- Tags
INSERT INTO tags (nome, ativo) 
VALUES ('Novo Projeto', true);

-- Metas
INSERT INTO metas (categoria_id, tipo, valor_meta, mes, ano)
VALUES ('uuid-da-categoria', 'entrada', 15000, 1, 2026);
```

---

## Estrutura de Dados

### Categoria
```json
{
  "id": "uuid",
  "nome": "Vendas",
  "tipo": "entrada",
  "cor": "#10b981",
  "descricao": "Receita de vendas"
}
```

### Responsável
```json
{
  "id": "uuid",
  "nome": "Maria",
  "email": "maria@empresa.com",
  "ativo": true
}
```

### Tag
```json
{
  "id": "uuid",
  "nome": "Projeto A",
  "ativo": true,
  "cor": "#06b6d4"
}
```

### Meta
```json
{
  "id": "uuid",
  "categoria_id": "uuid",
  "tipo": "entrada",
  "valor_meta": 15000,
  "mes": 1,
  "ano": 2026
}
```

---

## Debug

### Verificar dados carregados
```tsx
// No console do navegador
const data = await supabase.from("categorias").select("*")
console.log(data)
```

### RLS Issues
```sql
-- Se não conseguir ver dados, verificar RLS
SELECT tablename FROM pg_tables WHERE tablename LIKE '%';
-- Habilitar RLS se necessário
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
```

---

## Checklist Antes de Deploy

- [ ] Tabela `metas` criada via SQL
- [ ] Pelo menos 1 categoria em `categorias`
- [ ] Pelo menos 1 responsável em `responsaveis`
- [ ] RLS habilitado em todas as tabelas
- [ ] Variáveis de ambiente configuradas
- [ ] Servidor compilando sem erros
- [ ] Testar formulário de lançamentos
- [ ] Testar seção de metas

---

## Contato

Qualquer dúvida, verificar:
- `DATA_CONFIG.md` - Documentação técnica
- `REFACTORING_REPORT.md` - Relatório detalhado
- `SETUP_INICIAL.md` - Guia de setup
