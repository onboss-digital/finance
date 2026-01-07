"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Calendar } from "lucide-react"

interface Lancamento {
  tipo: string
  valor: number
  data: string
}

export default function AnaliseTemporalRelatorio({ dados = [] }: { dados?: Lancamento[] }) {
  const analiseTemporalDias = useMemo(() => {
    const diasSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
    const mapaTemp = new Map<number, { entrada: number; saida: number; movimentacoes: number }>()

    // Inicializar mapa para os 7 dias da semana
    for (let i = 0; i < 7; i++) {
      mapaTemp.set(i, { entrada: 0, saida: 0, movimentacoes: 0 })
    }

    // Agregar dados por dia da semana
    dados.forEach((item) => {
      const data = new Date(item.data)
      const diaSemana = data.getDay()
      const registro = mapaTemp.get(diaSemana)!

      if (item.tipo === "entrada") {
        registro.entrada += item.valor
      } else {
        registro.saida += item.valor
      }
      registro.movimentacoes++
    })

    // Converter para array
    return Array.from(mapaTemp.entries()).map(([dia, dados]) => ({
      dia: diasSemana[dia],
      entrada: Math.round(dados.entrada * 100) / 100,
      saida: Math.round(dados.saida * 100) / 100,
      movimentacoes: dados.movimentacoes,
      saldo: dados.entrada - dados.saida,
    }))
  }, [dados])

  const analiseTemporalMes = useMemo(() => {
    const mapa = new Map<number, { entrada: number; saida: number; movimentacoes: number }>()

    dados.forEach((item) => {
      const data = new Date(item.data)
      const dia = data.getDate()
      if (!mapa.has(dia)) {
        mapa.set(dia, { entrada: 0, saida: 0, movimentacoes: 0 })
      }
      const registro = mapa.get(dia)!

      if (item.tipo === "entrada") {
        registro.entrada += item.valor
      } else {
        registro.saida += item.valor
      }
      registro.movimentacoes++
    })

    return Array.from(mapa.entries())
      .map(([dia, dados]) => ({
        dia,
        entrada: Math.round(dados.entrada * 100) / 100,
        saida: Math.round(dados.saida * 100) / 100,
        saldo: dados.entrada - dados.saida,
      }))
      .sort((a, b) => a.dia - b.dia)
  }, [dados])

  // Encontrar dia da semana com mais movimentações
  const diaComMaisMovimentacoes = analiseTemporalDias.length > 0 ? analiseTemporalDias.reduce((prev, current) =>
    current.movimentacoes > prev.movimentacoes ? current : prev,
  ) : null

  // Encontrar dia do mês com maior saldo
  const diaComMaiorSaldo = analiseTemporalMes.length > 0 ? analiseTemporalMes.reduce((prev, current) =>
    current.saldo > prev.saldo ? current : prev,
  ) : null

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor)
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-cyan-500/50 rounded-lg p-3 shadow-xl">
          <p className="text-cyan-300 font-semibold text-sm">{payload[0].payload.dia}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className={`text-xs mt-1 ${entry.dataKey === "entrada" ? "text-emerald-400" : "text-red-400"}`}>
              {entry.dataKey === "entrada" ? "Entrada: " : "Saída: "}
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
      {/* Insights Rápidos */}
      {diaComMaisMovimentacoes && diaComMaiorSaldo ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Card className="bg-gradient-to-br from-amber-900/20 to-amber-900/5 border-amber-500/30 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-amber-400 text-sm sm:text-base">Dia da Semana Mais Ativo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white font-bold text-lg sm:text-xl">{diaComMaisMovimentacoes.dia}</p>
              <p className="text-amber-400/80 text-xs sm:text-sm mt-2">
                {diaComMaisMovimentacoes.movimentacoes} movimentações
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-900/20 to-cyan-900/5 border-cyan-500/30 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-cyan-400 text-sm sm:text-base">Melhor Dia do Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white font-bold text-lg sm:text-xl">{diaComMaiorSaldo.dia} de {new Date().toLocaleString("pt-BR", { month: "long" })}</p>
              <p className={`${diaComMaiorSaldo.saldo >= 0 ? "text-cyan-400/80" : "text-orange-400/80"} text-xs sm:text-sm mt-2`}>
                Saldo: {formatarMoeda(diaComMaiorSaldo.saldo)}
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-slate-400">Nenhuma movimentação registrada neste período</p>
        </div>
      )}

      {/* Gráfico por Dia da Semana */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/30 border-slate-700/50 shadow-xl">
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="text-white text-base sm:text-lg">Fluxo por Dia da Semana</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analiseTemporalDias} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="gradEntradaTempo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.4} />
                </linearGradient>
                <linearGradient id="gradSaidaTempo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 6" stroke="#334155" vertical={false} />
              <XAxis dataKey="dia" stroke="#94a3b8" style={{ fontSize: "11px" }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: "11px" }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="entrada" fill="url(#gradEntradaTempo)" name="Entradas" radius={[8, 8, 0, 0]} />
              <Bar dataKey="saida" fill="url(#gradSaidaTempo)" name="Saídas" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico por Dia do Mês */}
      {analiseTemporalMes.length > 0 && (
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/30 border-slate-700/50 shadow-xl">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="text-white text-base sm:text-lg">Saldo Diário do Mês</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analiseTemporalMes} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="gradSaldoPositivo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#0891b2" stopOpacity={0.4} />
                  </linearGradient>
                  <linearGradient id="gradSaldoNegativo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#d97706" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 6" stroke="#334155" vertical={false} />
                <XAxis
                  dataKey="dia"
                  stroke="#94a3b8"
                  style={{ fontSize: "11px" }}
                  interval={Math.max(0, Math.floor(analiseTemporalMes.length / 8))}
                />
                <YAxis stroke="#94a3b8" style={{ fontSize: "11px" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="saldo"
                  fill="#06b6d4"
                  radius={[8, 8, 0, 0]}
                  name="Saldo Diário"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
