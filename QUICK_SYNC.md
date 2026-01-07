# ⚡ QUICK REFERENCE - SINCRONIZAÇÃO SUPABASE

## 🚨 PASSO 1: EXECUTE ESTE SQL

Arquivo: **`scripts/00_SETUP_COMPLETO.sql`**

Local: https://app.supabase.com → SQL Editor → Copie e Cole → Run

```
Takes: ~10 segundos
Result: 5 tabelas criadas com dados padrão
```

---

## ✅ PASSO 2: VERIFIQUE SE FUNCIONOU

### Opção A: Teste Automático
```bash
node scripts/test-supabase.js
```

Esperado:
```
✅ categorias: 13 registros
✅ responsaveis: 8 registros
✅ tags: 4 registros
✅ metas: 0 registros
✅ lancamentos: 0 registros
```

### Opção B: Verificação Manual
https://app.supabase.com → Database → Tables

Você deve ver:
- [ ] categorias (13 linhas)
- [ ] responsaveis (8 linhas)
- [ ] tags (4 linhas)
- [ ] metas (0 linhas)
- [ ] lancamentos (0 linhas)

---

## 🎯 PASSO 3: TESTE NA APLICAÇÃO

```bash
npm run dev
```

Acesse: **http://localhost:3000/admin**

### Admin → Categorias
```
✅ Clique "Nova Categoria"
✅ Nome: "Teste Categoria"
✅ Tipo: "entrada"
✅ Cor: Escolha uma
✅ Clique "Adicionar Categoria"
→ Aparece na lista?
→ Aparece no Supabase?
```

### Admin → Responsáveis
```
✅ Clique "Novo Responsável"
✅ Nome: "Teste Responsável"
✅ Email: "teste@email.com"
✅ Clique "Adicionar Responsável"
→ Aparece na lista?
→ Aparece no Supabase?
```

### Admin → Metas
```
✅ Clique "Nova Meta"
✅ Categoria: Escolha uma
✅ Valor: 5000
✅ Mês/Ano: Padrão está OK
✅ Clique "Adicionar Meta"
→ Aparece na lista?
→ Aparece no Supabase?
```

### Admin → Tags
```
✅ Clique "Nova Tag"
✅ Nome: "Teste Tag"
✅ Cor: Escolha uma
✅ Clique "Adicionar Tag"
→ Aparece na lista?
→ Aparece no Supabase?
```

---

## 🔧 TABELAS ESPERADAS

| Tabela | Campos | Relacionamento |
|--------|--------|-----------------|
| **categorias** | nome, tipo, cor, descricao | Base para tudo |
| **responsaveis** | nome, email | Quem fez |
| **tags** | nome, cor, descricao | Projeto/Operação |
| **metas** | categoria_id, valor_meta, mes, ano | Alvo por categoria |
| **lancamentos** | data, valor, categoria_id, responsavel_id, tag_id | Registro financeiro |

---

## 🗄️ DADOS INSERIDOS AUTOMATICAMENTE

### Categorias Padrão (13)
```
Entrada:
- Vendas (verde)
- Serviços (azul)
- Investimentos (azul escuro)
- Devolução (roxo)
- Outras Entradas (teal)

Saída:
- Salários (vermelho)
- Fornecedores (laranja)
- Aluguel (rosa)
- Utilidades (amarelo)
- Impostos (índigo)
- Marketing (roxo magenta)
- Operacional (amarelo-verde)
- Outras Saídas (cinza)
```

### Responsáveis Padrão (8)
```
Maria, Carlos, Diretor, RH, Compras, Admin, Financeiro, Marketing
(Todos com emails fictícios)
```

### Tags Padrão (4)
```
SnapHubb, Lumpic, Administrativo, Investimentos
```

---

## 🔐 SEGURANÇA RLS

Cada tabela permite:
- [x] SELECT (ler)
- [x] INSERT (adicionar)
- [x] UPDATE (editar)
- [x] DELETE (deletar)

Para qualquer usuário, sem autenticação obrigatória.

---

## 🐛 ERRORS & FIXES

| Erro | Solução |
|------|---------|
| "relation already exists" | Delete tabelas manualmente, execute script novamente |
| "permission denied" | Verifique se é OWNER do projeto Supabase |
| Dados não atualizam | Refreshe a página (F5), verifique console (F12) |
| FK constraint error | Delete o objeto relacionado primeiro |

---

## 📊 SQL CRIADO

Todas essas operações agora funcionam:

### INSERT (Adicionar)
```typescript
supabase.from('categorias').insert([{ nome, tipo, cor }])
```

### SELECT (Ler)
```typescript
supabase.from('categorias').select('*').order('nome')
```

### UPDATE (Editar)
```typescript
supabase.from('categorias').update({ nome }).eq('id', id)
```

### DELETE (Deletar)
```typescript
supabase.from('categorias').delete().eq('id', id)
```

### JOIN (Com relacionamento)
```typescript
supabase.from('metas').select(`
  *,
  categorias(nome, tipo)
`).order('mes')
```

---

## 📱 COMPONENTES ATUALIZADOS

| Componente | Status | CRUD |
|-----------|--------|------|
| gerenciar-categorias.tsx | ✅ | C R U D |
| gerenciar-responsaveis.tsx | ✅ | C R U D |
| gerenciar-metas.tsx | ✅ | C R U D |
| gerenciar-tags.tsx | ✅ | C R U D |
| lancamentos-form.tsx | ✅ | C - - - |

---

## 🎯 CONFIRMAÇÃO DE SINCRONIZAÇÃO

Após executar o SQL, você deve ter:

```
Supabase Database
├── categorias
│   └── 13 registros ✅
├── responsaveis
│   └── 8 registros ✅
├── tags
│   └── 4 registros ✅
├── metas
│   └── 0 registros (você cria)
└── lancamentos
    └── 0 registros (você cria)
```

---

## 🚀 PRONTO!

Agora quando você:
- **Criar** algo → Aparece no Supabase ✅
- **Editar** algo → Atualiza no Supabase ✅
- **Deletar** algo → Remove do Supabase ✅

**Arquivo SQL:** `scripts/00_SETUP_COMPLETO.sql`
**Teste:** `node scripts/test-supabase.js`
**Documentação:** `RESUMO_SINCRONIZACAO.md`

---

## 📞 NÃO FUNCIONA?

1. Verifique `.env.local` tem as variáveis Supabase
2. Execute o script SQL novamente
3. Execute `node scripts/test-supabase.js`
4. Abra DevTools (F12) e procure por erros
5. Verifique Database → RLS está ON

---

## ✨ DICAS

- Sempre execute script SQL **inteiro** (não parcial)
- Use `node scripts/test-supabase.js` para verificar
- Dados padrão ajudam a testar rapidinho
- Foreign Keys garantem integridade
- RLS garante segurança
- Índices garantem velocidade

**Tudo sincronizado agora!** 🎉
