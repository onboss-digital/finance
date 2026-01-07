# Configuração de Dados - ONBOSS FINANCE

## Tabelas Supabase Necessárias

### 1. **categorias**
Armazena todas as categorias de lançamentos (entrada/saída)

Campos:
- `id` (UUID) - chave primária
- `nome` (VARCHAR) - nome da categoria
- `tipo` (VARCHAR) - 'entrada' ou 'saida'
- `cor` (VARCHAR) - cor hexadecimal para UI
- `descricao` (TEXT) - descrição opcional
- `criado_em` (TIMESTAMP) - data de criação

Script: `scripts/04_create_categorias_table.sql`

---

### 2. **responsaveis**
Lista de pessoas responsáveis por lançamentos

Campos:
- `id` (UUID) - chave primária
- `nome` (VARCHAR) - nome do responsável
- `email` (VARCHAR) - email (opcional)
- `ativo` (BOOLEAN) - se está ativo
- `criado_em` (TIMESTAMP) - data de criação

Script: `scripts/03_create_responsaveis_table.sql`

---

### 3. **tags**
Tags/Projetos para categorizar lançamentos

Campos:
- `id` (UUID) - chave primária
- `nome` (VARCHAR) - nome da tag
- `descricao` (TEXT) - descrição
- `cor` (VARCHAR) - cor hexadecimal
- `ativo` (BOOLEAN) - se está ativa
- `criado_em` (TIMESTAMP) - data de criação

Script: `scripts/05_create_tags_table.sql`

---

### 4. **lancamentos**
Transações financeiras do sistema

Campos:
- `id` (UUID) - chave primária
- `data` (DATE) - data da transação
- `mes` (INTEGER) - mês (1-12)
- `ano` (INTEGER) - ano
- `tipo` (VARCHAR) - 'entrada' ou 'saida'
- `categoria` (VARCHAR) - nome da categoria
- `subcategoria` (VARCHAR) - subcategoria (opcional)
- `descricao` (VARCHAR) - descrição
- `valor` (DECIMAL) - valor da transação
- `responsavel` (VARCHAR) - nome do responsável
- `status` (VARCHAR) - 'concluido', 'pendente', 'cancelado'
- `tag_id` (UUID) - referência para tags
- `notas` (TEXT) - notas adicionais
- `criado_em` (TIMESTAMP) - data de criação

Script: `scripts/01_create_lancamentos_table.sql`

---

### 5. **metas**
Metas/Orçamentos para monitoramento

Campos:
- `id` (UUID) - chave primária
- `categoria_id` (UUID) - referência para categorias
- `tipo` (VARCHAR) - 'entrada' ou 'saida'
- `valor_meta` (DECIMAL) - valor alvo
- `mes` (INTEGER) - mês específico (opcional)
- `ano` (INTEGER) - ano específico (opcional)
- `usuario_id` (UUID) - usuário que criou
- `criado_em` (TIMESTAMP) - data de criação
- `atualizado_em` (TIMESTAMP) - data de atualização

Script: `scripts/06_create_metas_table.sql`

---

## Componentes que Utilizam Dados do Supabase

### 1. **lancamentos-form.tsx**
- Hook: `useSupabaseData()`
- Dados usados: categorias, responsáveis, tags
- Busca: Carregado automaticamente via hook

### 2. **metas-section.tsx**
- Busca metas do mês/ano atual
- Fallback para 3 primeiras categorias se não houver metas
- Dados: categorias com Join na tabela de metas

### 3. **filtros-moderno.tsx**
- Filtra por: responsáveis, categorias, tags
- Extrai dinamicamente dos dados de lançamentos

### 4. **dashboard-moderno.tsx**
- Exibe KPIs com base em dados reais
- Sem dados hardcoded

### 5. **page.tsx (Home)**
- Busca lançamentos do Supabase
- Carrega dinamicamente

---

## Como Adicionar Novos Dados

### Adicionar Nova Categoria
1. Acesse o Supabase Console
2. Vá para tabela `categorias`
3. Insira nova linha com campos necessários
4. O sistema carregará automaticamente

### Adicionar Novo Responsável
1. Acesse o Supabase Console
2. Vá para tabela `responsaveis`
3. Insira nova linha
4. O sistema carregará automaticamente

### Adicionar Nova Tag/Projeto
1. Acesse o Supabase Console
2. Vá para tabela `tags`
3. Insira nova linha com `ativo = true`
4. O sistema carregará automaticamente

### Criar Meta Específica
1. Acesse o Supabase Console
2. Vá para tabela `metas`
3. Insira meta com categoria_id, tipo, valor_meta
4. Opcionalmente adicione mes e ano para metas mensais

---

## Variáveis de Ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave
```

---

## Hook Customizado: useSupabaseData

Localização: `hooks/use-supabase-data.ts`

Retorna:
- `categorias` - todas as categorias
- `categoriasEntrada` - categorias de entrada filtradas
- `categoriasSaida` - categorias de saída filtradas
- `responsaveis` - todos os responsáveis
- `tags` - tags ativas
- `loading` - estado de carregamento
- `error` - mensagem de erro se houver

Uso:
```tsx
const { categorias, responsaveis, tags } = useSupabaseData()
```

---

## Status de Implementação

✅ Hook customizado criado
✅ lancamentos-form.tsx atualizado
✅ metas-section.tsx atualizado
✅ Nenhum dado hardcoded em componentes
✅ Tabela de metas criada
⏳ Deploy em produção
