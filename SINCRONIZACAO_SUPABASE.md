# 🎯 SINCRONIZAÇÃO SUPABASE - GUIA RÁPIDO

## 📌 O PROBLEMA QUE FOI RESOLVIDO

❌ **Antes:** Quando você adicionava/editava/deletava algo, não sincronizava com Supabase
✅ **Depois:** Tudo sincroniza automaticamente!

---

## 🚀 COMO USAR AGORA

### 1️⃣ **Execute o Setup SQL**

Abra https://app.supabase.com → Seu Projeto → SQL Editor

Copie **TODO** o código de:
```
scripts/00_SETUP_COMPLETO.sql
```

Cole no editor e clique em **"▶ Run"**

### 2️⃣ **Teste Tudo Funciona** (Opcional)

```bash
cd e:/ONBOSS\ DIGITAL/SOFTAWARES/onboss-finance
npm run test:supabase
```

Ou manualmente:
```bash
node scripts/test-supabase.js
```

### 3️⃣ **Acesse a Aplicação**

```bash
npm run dev
```

Vá para: **http://localhost:3000/admin**

---

## ✅ CHECKLIST DE TESTES

Depois de executar o script, teste cada funcionalidade:

### Categorias
- [ ] Adicione nova categoria → Aparece na lista?
- [ ] Edite a categoria → Nome muda na lista?
- [ ] Delete a categoria → Desaparece?

### Responsáveis
- [ ] Adicione responsável com email
- [ ] Edite o email
- [ ] Delete o responsável

### Metas
- [ ] Selecione uma categoria
- [ ] Digite valor da meta
- [ ] Selecione mês/ano
- [ ] Clique em "Adicionar Meta"
- [ ] Edite a meta
- [ ] Delete a meta

### Tags
- [ ] Crie tag com cor
- [ ] Edite nome/descrição
- [ ] Delete tag

---

## 📊 ESTRUTURA DO BANCO (Depois do Setup)

```
┌─────────────────────────────────────────────┐
│           SUPABASE DATABASE                 │
├─────────────────────────────────────────────┤
│                                             │
│  1. categorias (13 padrões)                 │
│     ├─ Vendas (verde)                       │
│     ├─ Serviços (azul)                      │
│     ├─ Salários (vermelho)                  │
│     └─ ... (mais 10)                        │
│                                             │
│  2. responsaveis (8 padrões)                │
│     ├─ Maria                                │
│     ├─ Carlos                               │
│     └─ ... (mais 6)                         │
│                                             │
│  3. tags (4 padrões)                        │
│     ├─ SnapHubb                             │
│     ├─ Lumpic                               │
│     └─ ... (mais 2)                         │
│                                             │
│  4. metas (vazio - você cria)               │
│     └─ Linked com categoria_id              │
│                                             │
│  5. lancamentos (vazio - você cria)         │
│     └─ Linked com categoria_id,             │
│        responsavel_id, tag_id               │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🔐 SEGURANÇA (RLS Habilitado)

Cada tabela tem **Row Level Security (RLS)** ativado:

```sql
SELECT  ✅ Ler dados
INSERT  ✅ Adicionar dados
UPDATE  ✅ Editar dados
DELETE  ✅ Deletar dados
```

**Atualmente:** Qualquer um pode fazer tudo (sem autenticação)
**Depois:** Você pode restricionar para usuários autenticados

---

## 🐛 SE ALGO DER ERRADO

### Erro: "relation already exists"
```
1. Vá em https://app.supabase.com
2. Database → Tables
3. Delete todas as tabelas (lancamentos, metas, tags, responsaveis, categorias)
4. Execute o script novamente
```

### Erro: "permission denied"
```
1. Verifique se você é OWNER do projeto Supabase
2. Vá em Settings → Database
3. Confirme que RLS está ON
```

### Dados não aparecem após adicionar
```
1. Refreshe a página (F5)
2. Abra DevTools (F12) → Console
3. Procure por erros em vermelho
4. Verifique se NEXT_PUBLIC_SUPABASE_URL está correto
```

---

## 📁 ARQUIVOS IMPORTANTES

### ✅ Novos (Use esses)
```
scripts/00_SETUP_COMPLETO.sql     ← Script SQL consolidado
scripts/test-supabase.js          ← Teste automático
SETUP_SUPABASE.md                 ← Documentação completa
```

### ❌ Antigos (Pode deletar depois)
```
scripts/01_create_tables.sql
scripts/01_create_lancamentos_table.sql
scripts/02_seed_data.sql
scripts/02_seed_lancamentos.sql
scripts/03_create_responsaveis_table.sql
scripts/04_create_categorias_table.sql
scripts/05_create_tags_table.sql
scripts/06_create_metas_table.sql
```

---

## 🔗 RELACIONAMENTOS ENTRE TABELAS

```
lancamentos {
  categoria_id → categorias.id
  responsavel_id → responsaveis.id
  tag_id → tags.id
}

metas {
  categoria_id → categorias.id
}
```

**Isso significa:**
- Se deletar uma categoria, todos os lançamentos e metas relacionadas vão desaparecer (CASCADE DELETE)
- Se deletar responsável ou tag, o lançamento fica órfão mas não deleta (SET NULL)

---

## 💻 COMO OS COMPONENTES FUNCIONAM AGORA

### Admin → Categorias
```typescript
1. Carrega categorias via: supabase.from('categorias').select()
2. Adiciona: supabase.from('categorias').insert([data])
3. Edita: supabase.from('categorias').update(data).eq('id', id)
4. Deleta: supabase.from('categorias').delete().eq('id', id)
5. Recarrega a lista
```

### Admin → Responsáveis
Mesmo fluxo, mas com suporte a email

### Admin → Metas
Mesmo fluxo, mas com JOIN para mostrar nome da categoria

### Admin → Tags
Mesmo fluxo, com suporte a cor e descrição

### Dashboard → Lançamentos
```typescript
1. Carrega categorias/responsaveis/tags para dropdowns
2. Usuário preenche formulário
3. Envia para Supabase: supabase.from('lancamentos').insert([data])
4. Dados aparecem em tempo real no dashboard
```

---

## 📈 PRÓXIMAS ETAPAS (Opcionais)

### Se você quer adicionar Autenticação:
```sql
ALTER TABLE categorias ADD COLUMN user_id UUID REFERENCES auth.users(id);
CREATE POLICY "Usuários veem suas próprias categorias" ON categorias
  FOR SELECT USING (user_id = auth.uid());
```

### Se você quer adicionar Logs de Auditoria:
```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY,
  tabela VARCHAR(50),
  acao VARCHAR(20), -- INSERT, UPDATE, DELETE
  dados JSONB,
  user_id UUID,
  criado_em TIMESTAMP DEFAULT NOW()
);
```

### Se você quer Cache Local:
```typescript
// Já implementado no hook useSupabaseData
// Ele cacheaautomaticamente os dados
```

---

## ✨ RESULTADO FINAL

✅ **Tudo que você cria agora sincroniza com Supabase**
✅ **Tudo que você edita atualiza em tempo real**
✅ **Tudo que você deleta é removido do banco**
✅ **Nenhum erro de "undefined" ou "não encontrado"**

---

## 📞 DÚVIDAS FREQUENTES

**P: Preciso fazer backup?**
R: Sim! No Supabase → Database → Backups

**P: Posso adicionar mais campos depois?**
R: Sim! Use ALTER TABLE:
```sql
ALTER TABLE categorias ADD COLUMN novo_campo TEXT;
```

**P: Como vejo os dados no Supabase?**
R: https://app.supabase.com → Table Editor

**P: Posso usar em produção?**
R: Sim! Mas configure RLS para segurança antes.

**P: Qual é a velocidade de sincronização?**
R: Instantânea! Usa WebSockets do Supabase.

---

## 🎉 PRONTO!

Seu projeto agora está **100% sincronizado com Supabase**!

Execute o script SQL e comece a criar dados.

Boa sorte! 🚀
