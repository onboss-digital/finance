import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

async function setupDatabase() {
  try {
    console.log("[v0] Starting database setup...")

    // Create lancamentos table
    console.log("[v0] Creating lancamentos table...")
    await sql`
      CREATE TABLE IF NOT EXISTS public.lancamentos (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        
        data DATE NOT NULL,
        mes INTEGER NOT NULL,
        ano INTEGER NOT NULL,
        
        tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada', 'saida')),
        categoria VARCHAR(100) NOT NULL,
        subcategoria VARCHAR(100),
        descricao TEXT NOT NULL,
        responsavel VARCHAR(100) NOT NULL,
        
        valor DECIMAL(15, 2) NOT NULL CHECK (valor > 0),
        status VARCHAR(20) DEFAULT 'concluido' CHECK (status IN ('pendente', 'concluido', 'cancelado')),
        
        notas TEXT,
        documento VARCHAR(100),
        
        user_id UUID
      )
    `

    // Create indexes
    console.log("[v0] Creating indexes...")
    await sql`CREATE INDEX IF NOT EXISTS idx_lancamentos_data ON public.lancamentos(data)`
    await sql`CREATE INDEX IF NOT EXISTS idx_lancamentos_mes_ano ON public.lancamentos(mes, ano)`
    await sql`CREATE INDEX IF NOT EXISTS idx_lancamentos_tipo ON public.lancamentos(tipo)`
    await sql`CREATE INDEX IF NOT EXISTS idx_lancamentos_categoria ON public.lancamentos(categoria)`
    await sql`CREATE INDEX IF NOT EXISTS idx_lancamentos_responsavel ON public.lancamentos(responsavel)`
    await sql`CREATE INDEX IF NOT EXISTS idx_lancamentos_status ON public.lancamentos(status)`

    // Seed data
    console.log("[v0] Seeding data...")
    const seedData = [
      {
        data: "2025-01-05",
        mes: 1,
        ano: 2025,
        tipo: "entrada",
        categoria: "Vendas",
        descricao: "Venda Produto A - Cliente João",
        responsavel: "Maria",
        valor: 5000,
      },
      {
        data: "2025-01-08",
        mes: 1,
        ano: 2025,
        tipo: "entrada",
        categoria: "Vendas",
        descricao: "Venda Produto B - Cliente Pedro",
        responsavel: "Maria",
        valor: 3500,
      },
      {
        data: "2025-01-12",
        mes: 1,
        ano: 2025,
        tipo: "entrada",
        categoria: "Serviços",
        descricao: "Consultoria - Empresa XYZ",
        responsavel: "Carlos",
        valor: 2000,
      },
      {
        data: "2025-01-15",
        mes: 1,
        ano: 2025,
        tipo: "entrada",
        categoria: "Investimentos",
        descricao: "Aporte de Capital",
        responsavel: "Diretor",
        valor: 10000,
      },
      {
        data: "2025-01-20",
        mes: 1,
        ano: 2025,
        tipo: "entrada",
        categoria: "Vendas",
        descricao: "Venda Produto C - Cliente Ana",
        responsavel: "Maria",
        valor: 4500,
      },
      {
        data: "2025-01-03",
        mes: 1,
        ano: 2025,
        tipo: "saida",
        categoria: "Salários",
        descricao: "Folha de Pagamento Janeiro",
        responsavel: "RH",
        valor: 12000,
        status: "concluido",
      },
      {
        data: "2025-01-05",
        mes: 1,
        ano: 2025,
        tipo: "saida",
        categoria: "Fornecedores",
        descricao: "Compra Matéria Prima - Fornecedor A",
        responsavel: "Compras",
        valor: 3000,
      },
      {
        data: "2025-01-10",
        mes: 1,
        ano: 2025,
        tipo: "saida",
        categoria: "Aluguel",
        descricao: "Aluguel Sala Comercial",
        responsavel: "Admin",
        valor: 2500,
      },
      {
        data: "2025-01-12",
        mes: 1,
        ano: 2025,
        tipo: "saida",
        categoria: "Utilidades",
        descricao: "Conta Energia",
        responsavel: "Admin",
        valor: 800,
      },
      {
        data: "2025-01-15",
        mes: 1,
        ano: 2025,
        tipo: "saida",
        categoria: "Impostos",
        descricao: "INSS Mensal",
        responsavel: "Financeiro",
        valor: 1500,
        status: "pendente",
      },
    ]

    for (const item of seedData) {
      await sql`
        INSERT INTO public.lancamentos (data, mes, ano, tipo, categoria, descricao, responsavel, valor, status)
        VALUES (${item.data}, ${item.mes}, ${item.ano}, ${item.tipo}, ${item.categoria}, ${item.descricao}, ${item.responsavel}, ${item.valor}, ${item.status || "concluido"})
        ON CONFLICT DO NOTHING
      `
    }

    console.log("[v0] Database setup completed successfully!")
  } catch (error) {
    console.error("[v0] Error setting up database:", error)
    process.exit(1)
  }
}

setupDatabase()
