#!/usr/bin/env node

/**
 * Script para testar se o Supabase está sincronizado corretamente
 * Execute com: node scripts/test-supabase.js
 */

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Erro: Variáveis de ambiente SUPABASE_URL e SUPABASE_ANON_KEY não configuradas')
  console.error('Verifique o arquivo .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Cores para output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

async function testTable(tableName) {
  try {
    const { data, count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact' })
      .limit(1)

    if (error) throw error

    log('green', `✅ ${tableName}: ${count} registros`)
    return true
  } catch (error) {
    log('red', `❌ ${tableName}: ${error.message}`)
    return false
  }
}

async function testInsert(tableName, data) {
  try {
    const { error } = await supabase.from(tableName).insert([data])

    if (error) throw error

    log('green', `✅ INSERT ${tableName}: Funcionando`)
    return true
  } catch (error) {
    log('yellow', `⚠️  INSERT ${tableName}: ${error.message}`)
    return false
  }
}

async function testUpdate(tableName, id, data) {
  try {
    const { error } = await supabase.from(tableName).update(data).eq('id', id)

    if (error) throw error

    log('green', `✅ UPDATE ${tableName}: Funcionando`)
    return true
  } catch (error) {
    log('yellow', `⚠️  UPDATE ${tableName}: ${error.message}`)
    return false
  }
}

async function testDelete(tableName, id) {
  try {
    const { error } = await supabase.from(tableName).delete().eq('id', id)

    if (error) throw error

    log('green', `✅ DELETE ${tableName}: Funcionando`)
    return true
  } catch (error) {
    log('yellow', `⚠️  DELETE ${tableName}: ${error.message}`)
    return false
  }
}

async function main() {
  log('cyan', '\n═══════════════════════════════════════════════════════════')
  log('cyan', '  🧪 TESTE DE SINCRONIZAÇÃO SUPABASE')
  log('cyan', '═══════════════════════════════════════════════════════════\n')

  // 1. Testar conexão
  log('blue', '1️⃣  Testando conexão com Supabase...')
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    log('green', '✅ Conexão OK\n')
  } catch (error) {
    log('red', `❌ Erro de conexão: ${error.message}\n`)
    process.exit(1)
  }

  // 2. Verificar tabelas
  log('blue', '2️⃣  Verificando tabelas...\n')
  const tablesOk = {
    categorias: await testTable('categorias'),
    responsaveis: await testTable('responsaveis'),
    tags: await testTable('tags'),
    metas: await testTable('metas'),
    lancamentos: await testTable('lancamentos'),
  }
  console.log('')

  // 3. Testar CRUD em categorias (teste mais simples)
  log('blue', '3️⃣  Testando operações CRUD em Categorias...\n')

  // INSERT
  const testCategoria = {
    nome: `Teste ${Date.now()}`,
    tipo: 'entrada',
    cor: '#06b6d4',
    descricao: 'Categoria de teste',
  }

  const { data: insertedData, error: insertError } = await supabase
    .from('categorias')
    .insert([testCategoria])
    .select()

  if (insertError) {
    log('red', `❌ INSERT falhou: ${insertError.message}`)
  } else {
    log('green', `✅ INSERT: Categoria "${testCategoria.nome}" criada`)

    const categoriaId = insertedData[0].id

    // UPDATE
    const updateData = {
      descricao: 'Descrição atualizada',
    }

    const { error: updateError } = await supabase
      .from('categorias')
      .update(updateData)
      .eq('id', categoriaId)

    if (updateError) {
      log('red', `❌ UPDATE falhou: ${updateError.message}`)
    } else {
      log('green', `✅ UPDATE: Categoria atualizada`)
    }

    // DELETE
    const { error: deleteError } = await supabase
      .from('categorias')
      .delete()
      .eq('id', categoriaId)

    if (deleteError) {
      log('red', `❌ DELETE falhou: ${deleteError.message}`)
    } else {
      log('green', `✅ DELETE: Categoria deletada`)
    }
  }

  console.log('')
  log('cyan', '═══════════════════════════════════════════════════════════')
  log('cyan', '  📊 RESUMO DO TESTE')
  log('cyan', '═══════════════════════════════════════════════════════════\n')

  const allOk = Object.values(tablesOk).every((ok) => ok)

  if (allOk) {
    log('green', '✅ TODAS AS TABELAS ESTÃO SINCRONIZADAS!')
    log('green', '\n✨ Você pode usar a aplicação sem problemas!\n')
  } else {
    log('red', '❌ ALGUMAS TABELAS ESTÃO COM PROBLEMAS!')
    log('yellow', '\n⚠️  Acesse: https://app.supabase.com')
    log('yellow', '   E execute o script: scripts/00_SETUP_COMPLETO.sql\n')
  }

  log('cyan', '═══════════════════════════════════════════════════════════\n')
}

main().catch((error) => {
  log('red', `\n❌ Erro geral: ${error.message}\n`)
  process.exit(1)
})
