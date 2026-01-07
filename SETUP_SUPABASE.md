# 🔧 SETUP COMPLETO DO SUPABASE - PASSO A PASSO

## ⚠️ IMPORTANTE: LER ANTES DE EXECUTAR

Seu projeto tinha **scripts SQL duplicados e inconsistentes**. Isso causava conflitos ao adicionar/excluir dados.

---

## 📋 CHECKLIST: ESTRUTURA ESPERADA

Sua aplicação deve ter **5 tabelas principais**:

| Tabela | Campos | Relacionamento |
|--------|--------|-----------------|
| **categorias** | id, nome, tipo, cor, descricao, ativo | Base para metas e lançamentos |
| **responsaveis** | id, nome, email, ativo | Quem fez o lançamento |
| **tags** | id, nome, cor, descricao, ativo | Projeto/operação do lançamento |
| **metas** | id, categoria_id, tipo, valor_meta, mes, ano | Alvo por categoria/período |
| **lancamentos** | id, data, tipo, categoria_id, responsavel_id, tag_id, valor, status | Registro de entradas/saídas |

---

## 🚀 COMO EXECUTAR O SETUP

### OPÇÃO 1: Via Supabase Dashboard (Recomendado)

1. **Acesse o Supabase**
   - Abra: https://app.supabase.com
   - Entre na sua conta
   - Selecione seu projeto

2. **Abra o SQL Editor**
   - Menu esquerdo → "SQL Editor"
   - Clique em "+" → "New Query"

3. **Copie e Cole TODO o Código**
   ```
   Arquivo: scripts/00_SETUP_COMPLETO.sql
   ```
   - Selecione TUDO do arquivo
   - Copie (Ctrl+C)
   - Cole no editor do Supabase (Ctrl+V)

4. **Execute**
   - Botão "▶ Run" (canto superior direito)
   - Aguarde a conclusão (deve aparecer "Success")

5. **Verifique as Tabelas**
   - Menu esquerdo → "Tables"
   - Você deve ver:
     - [ ] categorias
     - [ ] responsaveis
     - [ ] tags
     - [ ] metas
     - [ ] lancamentos

---

### OPÇÃO 2: Via JavaScript (Se preferir automatizar)

Se quiser criar um script Node.js:

```javascript
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const sql = fs.readFileSync('scripts/00_SETUP_COMPLETO.sql', 'utf-8')

const { error } = await supabase.rpc('execute_sql', { sql })
if (error) console.error(error)
else console.log('✅ Setup concluído!')
```

---

## ✅ DEPOIS DE EXECUTAR O SETUP

### 1. Teste Adicionar Categoria
```bash
Na aplicação: Admin → Categorias → "Nova Categoria"
- Nome: "Teste Adicionar"
- Tipo: "entrada"
- Cor: Escolha uma
- Clique em "Adicionar Categoria"
```

**Esperado:** Aparece na lista imediatamente

### 2. Teste Editar Categoria
```bash
- Clique em ✏️ (ícone de editar)
- Mude o nome para "Categoria Editada"
- Clique em "Salvar Alterações"
```

**Esperado:** Nome muda imediatamente na lista

### 3. Teste Deletar Categoria
```bash
- Clique em 🗑️ (ícone de lixeira)
- Confirme a deleção
```

**Esperado:** Desaparece da lista

### 4. Teste as Outras Tabelas
Repita os passos 1-3 para:
- [ ] Responsáveis
- [ ] Metas
- [ ] Tags

---

## 🐛 SE HOUVER ERROS

### Erro: "relation already exists"
```
Solução: O script tenta DROP primeira, mas se tiver FK constraints,
pode não funcionar. Se isso acontecer:

1. Vá em Database → Tables (no Supabase)
2. Delete manualmente:
   - lancamentos (primeiro, pois referencia as outras)
   - metas
   - tags
   - responsaveis
   - categorias
3. Execute o script novamente
```

### Erro: "duplicate key value violates"
```
Solução: Os INSERTs têm "ON CONFLICT DO NOTHING", então não deveriam
falhar. Mas se falhar, é sinal que algo está errado:
1. Vá em Database → Tables
2. Clique em cada tabela
3. Delete todos os dados (DELETE * FROM ...)
4. Execute o script novamente
```

### Erro: "permission denied"
```
Solução: Você não tem permissão de editar a estrutura do banco.
No Supabase, vá em:
- Settings → Database → Realtime
- Confirme que RLS está HABILITADO
- Verifique se você é owner do projeto
```

---

## 📊 O QUE CADA COMPONENTE AGORA FAZ

### ✅ `gerenciar-categorias.tsx`
- Lê categorias do Supabase
- Adiciona nova categoria → INSERT
- Edita categoria → UPDATE
- Deleta categoria → DELETE (com cascata para metas)

### ✅ `gerenciar-responsaveis.tsx`
- Lê responsáveis do Supabase
- Adiciona novo responsável → INSERT
- Edita responsável → UPDATE
- Deleta responsável → DELETE

### ✅ `gerenciar-metas.tsx`
- Lê metas do Supabase (com JOIN categoria)
- Adiciona meta → INSERT
- Edita meta → UPDATE
- Deleta meta → DELETE

### ✅ `gerenciar-tags.tsx` (NOVO)
- Lê tags do Supabase
- Adiciona tag → INSERT
- Edita tag → UPDATE
- Deleta tag → DELETE

### ✅ `lancamentos-form.tsx`
- Lê categorias, responsáveis, tags
- Cria lançamento → INSERT
- Todos os dropdowns populam automaticamente

---

## 🔐 POLÍTICAS RLS (Row Level Security)

Cada tabela tem 4 políticas:
```sql
SELECT  → Ler dados
INSERT  → Adicionar dados
UPDATE  → Editar dados
DELETE  → Deletar dados
```

**Todas permitem para QUALQUER usuário** (não requer autenticação)

Se você quiser adicionar segurança depois:
```sql
-- Exemplo: só usuários autenticados podem editar
CREATE POLICY "Usuários autenticados podem atualizar" ON categorias
  FOR UPDATE USING (auth.uid() IS NOT NULL);
```

---

## 📝 ESTRUTURA DE DADOS FINAL

```
┌─────────────────┐
│  categorias     │
├─────────────────┤
│ id (UUID)       │ ← PK
│ nome (TEXT)     │ → UNIQUE
│ tipo (entrada/saida)
│ cor (HEX)       │
│ descricao (TEXT)│
│ ativo (BOOLEAN) │
└─────────────────┘
        ↓
        ├─→ metas (categoria_id FK)
        │
        └─→ lancamentos (categoria_id FK)
                ↓
                ├─→ responsaveis (responsavel_id FK)
                │
                └─→ tags (tag_id FK)
```

---

## 🎯 PRÓXIMAS ETAPAS

1. **Execute o script SQL** (Opção 1 ou 2)
2. **Teste cada operação CRUD** (Adicionar, Editar, Deletar)
3. **Verifique no Supabase** se os dados aparecem
4. **Teste na aplicação** se tudo sincroniza corretamente
5. **Se tudo funcionar**, você pode deletar os scripts antigos

---

## 📂 ARQUIVOS IMPORTANTES

```
scripts/
├── 00_SETUP_COMPLETO.sql    ← ✨ NOVO E CONSOLIDADO
├── 01_create_tables.sql      ← Obsoleto (deletar depois)
├── 01_create_lancamentos_table.sql ← Obsoleto (deletar depois)
├── 02_seed_data.sql          ← Obsoleto (deletar depois)
├── 02_seed_lancamentos.sql   ← Obsoleto (deletar depois)
├── 03_create_responsaveis_table.sql ← Obsoleto (deletar depois)
├── 04_create_categorias_table.sql ← Obsoleto (deletar depois)
├── 05_create_tags_table.sql  ← Obsoleto (deletar depois)
└── 06_create_metas_table.sql ← Obsoleto (deletar depois)
```

---

## ❓ PERGUNTAS FREQUENTES

**P: Preciso de autenticação?**
R: Não obrigatório, mas recomendado. As políticas RLS atuais permitem qualquer um. Para ativar segurança, modifique as políticas.

**P: Os dados vão sumir se eu executar o script?**
R: SIM! O script tem DROP TABLE, então **deleta tudo**. Por isso execute em ordem:
1. Faça backup
2. Execute o script
3. Teste tudo

**P: Posso adicionar mais campos depois?**
R: SIM! Use:
```sql
ALTER TABLE categorias ADD COLUMN novo_campo VARCHAR(100);
```

**P: Como faço backup?**
R: No Supabase:
1. Database → Backups
2. Create a backup
3. Download

---

## ✨ RESUMO FINAL

- **Antes:** Scripts duplicados, sem RLS, sem FKs corretas
- **Depois:** 1 script consolidado, RLS habilitado, FKs corretas, índices criados
- **Resultado:** Add/Edit/Delete agora sincronizam corretamente com Supabase!

Boa sorte! 🚀
