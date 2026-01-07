"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { AlertCircle, TrendingUp } from "lucide-react"

interface Lancamento {
  tipo: string
  valor: number
  data: string
}

export default function ProjecaoCaixa({ dados = [] }: { dados?: Lancamento[] }) {
  const projecao = useMemo(() => {
    if (!dados || dados.length === 0) return { dados: [], avisos: [] }

    // Calcular saldo inicial (até hoje)
    const hoje = new Date()
    const saldoHistorico = (dados || [])
      .filter((d) => new Date(d.data) <= hoje)
      .reduce((acc, d) => acc + (d.tipo === "entrada" ? d.valor : -d.valor), 0)

    // Calcular média diária de entradas e saídas dos últimos 30 dias
    const hace30Dias = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000)
    const dados30Dias = (dados || []).filter((d) => {
      const data = new Date(d.data)
      return data >= hace30Dias && data <= hoje
    })

    const diasUnicos = new Set(dados30Dias.map((d) => new Date(d.data).toDateString())).size || 1
    const entradasMedia = dados30Dias.filter((d) => d.tipo === "entrada").reduce((sum, d) => sum + d.valor, 0) / diasUnicos
    const saidasMedia = dados30Dias.filter((d) => d.tipo === "saida").reduce((sum, d) => sum + d.valor, 0) / diasUnicos

    const fluxoDiario = entradasMedia - saidasMedia

    // Gerar projeção para os próximos 30 dias
    const dadosProjecao = []
    let saldoProjetado = saldoHistorico
    const avisos = []

    for (let i = 0; i <= 30; i++) {
      const data = new Date(hoje.getTime() + i * 24 * 60 * 60 * 1000)
      const dataFormatada = data.toLocaleDateString("pt-BR", { month: "short", day: "numeric" })

      dadosProjecao.push({
        dia: dataFormatada,
        saldo: Math.max(0, Math.round(saldoProjetado * 100) / 100),
        saldoReal: saldoProjetado,
      })

      // Verificar avisos
      if (saldoProjetado < 0 && avisos.filter((a) => a.tipo === "negativo").length === 0) {
        avisos.push({
          tipo: "negativo",
          dia: i,
          mensagem: `Caixa ficará negativo em ${i} dias`,
          cor: "text-red-400",
        })
      }

      if (saldoProjetado < 500 && saldoProjetado > 0 && avisos.filter((a) => a.tipo === "critico").length === 0) {
        avisos.push({
          tipo: "critico",
          dia: i,
          mensagem: `Caixa abaixo de R$ 500 em ${i} dias`,
          cor: "text-orange-400",
        })
      }

      saldoProjetado += fluxoDiario
    }

    // Verificar se consegue 30 dias com saldo positivo
    const diasPositivos = dadosProjecao.filter((d) => d.saldoReal >= 0).length
    if (diasPositivos < 30) {
      avisos.push({
        tipo: "runway",
        dia: diasPositivos,
        mensagem: `Cash runway de apenas ${diasPositivos} dias`,
        cor: "text-amber-400",
      })
    }

    return { dados: dadosProjecao, avisos, saldoAtual: saldoHistorico, fluxoDiario }
  }, [dados])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-cyan-500/50 rounded-lg p-3 shadow-xl">
          <p className="text-cyan-300 font-semibold text-sm">{payload[0].payload.dia}</p>
          <p className="text-emerald-400 text-xs mt-1">
            Saldo: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor)
  }

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/30 border-slate-700/50 shadow-xl">
      <CardHeader className="pb-4 sm:pb-6">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-white text-base sm:text-lg">Projeção de Caixa - Próximos 30 Dias</CardTitle>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">Baseado na média dos últimos 30 dias</p>
          </div>
          <TrendingUp className="w-5 h-5 text-cyan-400 opacity-50" />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-6">
        {/* KPIs da Projeção */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gradient-to-br from-cyan-900/20 to-cyan-900/5 border border-cyan-500/30 rounded-lg p-3 sm:p-4">
            <p className="text-cyan-400/80 text-xs sm:text-sm font-medium">Saldo Atual</p>
            <p className="text-cyan-300 font-bold text-lg sm:text-xl mt-1">{formatarMoeda(projecao.saldoAtual)}</p>
          </div>

          <div
            className={`bg-gradient-to-br border rounded-lg p-3 sm:p-4 ${
              projecao.fluxoDiario > 0
                ? "from-emerald-900/20 to-emerald-900/5 border-emerald-500/30"
                : "from-red-900/20 to-red-900/5 border-red-500/30"
            }`}
          >
            <p className={`${projecao.fluxoDiario > 0 ? "text-emerald-400/80" : "text-red-400/80"} text-xs sm:text-sm font-medium`}>
              Fluxo Diário
            </p>
            <p className={`${projecao.fluxoDiario > 0 ? "text-emerald-300" : "text-red-300"} font-bold text-lg sm:text-xl mt-1`}>
              {formatarMoeda(projecao.fluxoDiario)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/20 to-purple-900/5 border border-purple-500/30 rounded-lg p-3 sm:p-4">
            <p className="text-purple-400/80 text-xs sm:text-sm font-medium">Saldo em 30 Dias</p>
            <p className="text-purple-300 font-bold text-lg sm:text-xl mt-1">
              {formatarMoeda(projecao.dados[30]?.saldoReal || 0)}
            </p>
          </div>
        </div>

        {/* Avisos */}
        {projecao.avisos.length > 0 && (
          <div className="space-y-2">
            {projecao.avisos.map((aviso, idx) => (
              <div key={idx} className="flex items-start gap-2 p-3 rounded-lg bg-slate-700/30 border border-slate-600/50">
                <AlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${aviso.cor}`} />
                <span className={`text-xs sm:text-sm ${aviso.cor}`}>{aviso.mensagem}</span>
              </div>
            ))}
          </div>
        )}

        {/* Gráfico de Projeção */}
        {projecao.dados.length > 0 && (
          <div className="rounded-lg bg-slate-900/30 p-3 sm:p-4">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={projecao.dados} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="gradProjecao" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 6" stroke="#334155" vertical={false} />
                <XAxis
                  dataKey="dia"
                  stroke="#94a3b8"
                  style={{ fontSize: "11px" }}
                  tick={{ dy: 5 }}
                  interval={Math.floor(projecao.dados.length / 6)}
                />
                <YAxis stroke="#94a3b8" style={{ fontSize: "11px" }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="saldo"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
