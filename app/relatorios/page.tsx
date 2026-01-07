"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { FileText } from "lucide-react"
import RelatorioCompleto from "@/components/relatorios/relatorio-completo"
import ExportadorCSV from "@/components/relatorios/exportador-csv"

export default function RelatoriosPage() {
  const [dados, setDados] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtroMes, setFiltroMes] = useState(new Date().getMonth() + 1)
  const [filtroAno, setFiltroAno] = useState(new Date().getFullYear())

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    carregarDados()
  }, [filtroMes, filtroAno])

  const carregarDados = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("lancamentos")
        .select("*, categorias(nome), responsaveis(nome)")
        .order("data", { ascending: false })

      if (error) throw error

      // Mapear dados para formato esperado
      const dadosMapeados = (data || []).map((item: any) => ({
        ...item,
        categoria: item.categorias?.nome || "Sem categoria",
        responsavel: item.responsaveis?.nome || "Sem responsável",
      }))

      const dadosFiltrados = dadosMapeados.filter((item) => {
        const dataItem = new Date(item.data)
        const mesItem = dataItem.getMonth() + 1
        const anoItem = dataItem.getFullYear()
        return mesItem === filtroMes && anoItem === filtroAno
      })

      setDados(dadosFiltrados)
    } catch (error) {
      console.error("[v0] Erro ao carregar relatórios:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 pb-24 md:pb-8">
      {/* Background glow effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Relatórios e Análises</h1>
          </div>
          <p className="text-slate-400 text-sm sm:text-base ml-13">Visualize e exporte dados financeiros detalhados</p>
        </div>

        {/* Filtros */}
        <div className="mb-6 sm:mb-8 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
          <select
            value={filtroMes}
            onChange={(e) => setFiltroMes(Number(e.target.value))}
            className="px-3 sm:px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-cyan-500 focus:ring-cyan-500/20 focus:outline-none"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((mes) => (
              <option key={mes} value={mes}>
                {new Date(2024, mes - 1).toLocaleString("pt-BR", { month: "long" })}
              </option>
            ))}
          </select>

          <select
            value={filtroAno}
            onChange={(e) => setFiltroAno(Number(e.target.value))}
            className="px-3 sm:px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white text-sm focus:border-cyan-500 focus:ring-cyan-500/20 focus:outline-none"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((ano) => (
              <option key={ano} value={ano}>
                {ano}
              </option>
            ))}
          </select>

          <div className="col-span-2 sm:col-span-1">
            <ExportadorCSV dados={dados} nomeArquivo={`relatorio-${filtroMes}-${filtroAno}`} />
          </div>
        </div>

        {/* Relatório */}
        {!loading && <RelatorioCompleto dados={dados} mes={filtroMes} ano={filtroAno} />}
      </div>
    </div>
  )
}
