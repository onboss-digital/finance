// Script para executar os scripts SQL
import fs from "fs"
import path from "path"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("[v0] Erro: Variáveis de ambiente não configuradas")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function executarScripts() {
  try {
    // Ler e executar script de criação
    const scriptPath1 = path.join(process.cwd(), "scripts", "01_create_lancamentos_table.sql")
    const scriptPath2 = path.join(process.cwd(), "scripts", "02_seed_lancamentos.sql")

    if (!fs.existsSync(scriptPath1) || !fs.existsSync(scriptPath2)) {
      console.log("[v0] Scripts SQL não encontrados no diretório de scripts")
      console.log("[v0] Execute manualmente via Supabase Dashboard")
      return
    }

    const sql1 = fs.readFileSync(scriptPath1, "utf-8")
    const sql2 = fs.readFileSync(scriptPath2, "utf-8")

    console.log("[v0] Executando script de criação de tabela...")
    const { error: error1 } = await supabase.rpc("exec", { sql: sql1 })
    if (error1) throw error1
    console.log("[v0] Tabela criada com sucesso")

    console.log("[v0] Executando script de população de dados...")
    const { error: error2 } = await supabase.rpc("exec", { sql: sql2 })
    if (error2) throw error2
    console.log("[v0] Dados populados com sucesso")
  } catch (error) {
    console.error("[v0] Erro ao executar scripts:", error)
    process.exit(1)
  }
}

executarScripts()
