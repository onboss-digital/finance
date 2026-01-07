"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Users, Trophy, TrendingUp, TrendingDown } from "lucide-react"

interface Lancamento {
  responsavel: string
  tipo: string
  valor: number
  data: string
}

export default function PerformanceResponsavel({ dados = [] }: { dados?: Lancamento[] }) {
  const performance = useMemo(() => {
    if (!dados || dados.length === 0) return { ranking: [], chartData: [] }

    const responsavelMap = new Map<
      string,
      {
        movimentacoes: number
        entradas: number
        saidas: number
        saldo: number
        ticketMedio: number
      }
    >()

    // Agregar dados
    dados.forEach((item) => {
      const resp = item.responsavel || "Sem responsável"
      const existe = responsavelMap.get(resp) || {
        movimentacoes: 0,
        entradas: 0,
        saidas: 0,
        saldo: 0,
        ticketMedio: 0,
      }

      existe.movimentacoes++
      if (item.tipo === "entrada") {
        existe.entradas += item.valor
      } else {
        existe.saidas += item.valor
      }
      existe.saldo = existe.entradas - existe.saidas

      responsavelMap.set(resp, existe)
    })

    // Calcular ticket médio
    const ranking = Array.from(responsavelMap.entries())
      .map(([nome, dados]) => ({
        nome,
        movimentacoes: dados.movimentacoes,
        entradas: dados.entradas,
        saidas: dados.saidas,
        saldo: dados.saldo,
        ticketMedio: (dados.entradas + dados.saidas) / dados.movimentacoes,
        percentualSaidas: dados.entradas > 0 ? (dados.saidas / dados.entradas) * 100 : 0,
      }))
      .sort((a, b) => b.movimentacoes - a.movimentacoes)

    // Dados para gráfico
    const chartData = ranking.map((r) => ({
      nome: r.nome.split(" ")[0], // Primeiro nome
      entradas: Math.round(r.entradas * 100) / 100,
      saidas: Math.round(r.saidas * 100) / 100,
    }))

    return { ranking, chartData }
  }, [dados])

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor)
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-cyan-500/50 rounded-lg p-3 shadow-xl">
          <p className="text-cyan-300 font-semibold text-sm">{payload[0].payload.nome}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className={`text-xs mt-1 ${entry.dataKey === "entradas" ? "text-emerald-400" : "text-red-400"}`}>
              {entry.dataKey === "entradas" ? "Entradas: " : "Saídas: "}
              {formatarMoeda(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Ranking em Cards */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/30 border-slate-700/50 shadow-xl">
        <CardHeader className="pb-4 sm:pb-6">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-white text-base sm:text-lg">Ranking de Performance</CardTitle>
              <p className="text-slate-400 text-xs sm:text-sm mt-2">Análise por responsável</p>
            </div>
            <Trophy className="w-5 h-5 text-amber-400 opacity-50" />
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          <div className="space-y-3 sm:space-y-4">
            {performance.ranking.map((responsavel, idx) => (
              <div
                key={responsavel.nome}
                className={`rounded-xl border p-4 sm:p-5 bg-gradient-to-br ${
                  idx === 0
                    ? "border-amber-500/30 from-amber-900/20 to-amber-900/5"
                    : idx === 1
                      ? "border-slate-500/30 from-slate-800/20 to-slate-800/5"
                      : idx === 2
                        ? "border-orange-500/30 from-orange-900/20 to-orange-900/5"
                        : "border-slate-600/30 from-slate-700/20 to-slate-700/5"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        idx === 0
                          ? "bg-amber-500/30 text-amber-300"
                          : idx === 1
                            ? "bg-slate-500/30 text-slate-300"
                            : idx === 2
                              ? "bg-orange-500/30 text-orange-300"
                              : "bg-slate-600/30 text-slate-300"
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm sm:text-base">{responsavel.nome}</p>
                      <p className="text-slate-400 text-xs">{responsavel.movimentacoes} movimentações</p>
                    </div>
                  </div>
                </div>

                {/* Métricas */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  <div className="bg-slate-800/30 rounded-lg p-2 sm:p-3">
                    <p className="text-emerald-400/80 text-xs font-medium">Entradas</p>
                    <p className="text-emerald-300 font-bold text-xs sm:text-sm mt-1">{formatarMoeda(responsavel.entradas)}</p>
                  </div>
                  <div className="bg-slate-800/30 rounded-lg p-2 sm:p-3">
                    <p className="text-red-400/80 text-xs font-medium">Saídas</p>
                    <p className="text-red-300 font-bold text-xs sm:text-sm mt-1">{formatarMoeda(responsavel.saidas)}</p>
                  </div>
                  <div className="bg-slate-800/30 rounded-lg p-2 sm:p-3">
                    <p className="text-cyan-400/80 text-xs font-medium">Saldo</p>
                    <p className={`font-bold text-xs sm:text-sm mt-1 ${responsavel.saldo >= 0 ? "text-cyan-300" : "text-orange-300"}`}>
                      {formatarMoeda(responsavel.saldo)}
                    </p>
                  </div>
                  <div className="bg-slate-800/30 rounded-lg p-2 sm:p-3">
                    <p className="text-purple-400/80 text-xs font-medium">Ticket Médio</p>
                    <p className="text-purple-300 font-bold text-xs sm:text-sm mt-1">{formatarMoeda(responsavel.ticketMedio)}</p>
                  </div>
                </div>

                {/* Barra de Proporção */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-slate-400 text-xs">Proporção Saída/Entrada</p>
                    <span className="text-slate-300 text-xs font-semibold">{responsavel.percentualSaidas.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-red-500 rounded-full"
                      style={{ width: `${Math.min(responsavel.percentualSaidas, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gráfico Comparativo */}
      {performance.chartData.length > 0 && (
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/30 border-slate-700/50 shadow-xl">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="text-white text-base sm:text-lg">Entradas vs Saídas por Responsável</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performance.chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                <defs>
                  <linearGradient id="gradEntradaResp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.4} />
                  </linearGradient>
                  <linearGradient id="gradSaidaResp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 6" stroke="#334155" vertical={false} />
                <XAxis dataKey="nome" stroke="#94a3b8" angle={-45} textAnchor="end" height={80} style={{ fontSize: "11px" }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: "11px" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="entradas" fill="url(#gradEntradaResp)" name="Entradas" radius={[8, 8, 0, 0]} />
                <Bar dataKey="saidas" fill="url(#gradSaidaResp)" name="Saídas" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
