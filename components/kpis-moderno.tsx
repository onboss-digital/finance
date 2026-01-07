"use client"

import { ArrowUpRight, ArrowDownLeft, TrendingUp, Zap } from "lucide-react"

interface Lancamento {
  id: string
  tipo: string
  valor: number
}

export default function KPIsModerno({ dados = [] }: { dados?: Lancamento[] }) {
  const entradas = (dados || []).filter((d) => d.tipo === "entrada").reduce((sum, d) => sum + d.valor, 0)
  const saidas = dados.filter((d) => d.tipo === "saida").reduce((sum, d) => sum + d.valor, 0)
  const saldo = entradas - saidas
  const resultado = ((entradas - saidas) / entradas) * 100 || 0

  const kpis = [
    {
      label: "Total Entradas",
      valor: entradas,
      icon: ArrowUpRight,
      cor: "from-emerald-600 to-emerald-400",
      textCor: "text-emerald-400",
    },
    {
      label: "Total Saídas",
      valor: saidas,
      icon: ArrowDownLeft,
      cor: "from-red-600 to-red-400",
      textCor: "text-red-400",
    },
    {
      label: "Saldo",
      valor: saldo,
      icon: TrendingUp,
      cor: saldo >= 0 ? "from-cyan-600 to-cyan-400" : "from-orange-600 to-orange-400",
      textCor: saldo >= 0 ? "text-cyan-400" : "text-orange-400",
    },
    {
      label: "Margem",
      valor: resultado,
      icon: Zap,
      cor: "from-purple-600 to-purple-400",
      textCor: "text-purple-400",
      suffix: "%",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {kpis.map((kpi, i) => {
        const Icon = kpi.icon
        return (
          <div
            key={i}
            className="relative overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/30 backdrop-blur-xl p-4 sm:p-6 hover:border-slate-600/50 transition-all group"
          >
            {/* Background gradient */}
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-linear-to-br ${kpi.cor}`}
            ></div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-linear-to-br ${kpi.cor} bg-opacity-10`}>
                  <Icon className={`w-5 h-5 ${kpi.textCor}`} />
                </div>
              </div>

              <p className="text-slate-400 text-xs sm:text-sm mb-2 font-medium">{kpi.label}</p>
              <p className="text-lg sm:text-2xl font-bold text-white break-words">
                {kpi.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                {kpi.suffix && <span className="text-sm sm:text-lg ml-1">{kpi.suffix}</span>}
              </p>
            </div>

            {/* Border glow on hover */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-cyan-500/20"></div>
          </div>
        )
      })}
    </div>
  )
}
