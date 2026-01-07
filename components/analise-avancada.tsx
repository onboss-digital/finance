"use client"

import { useMemo } from "react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, TrendingDown, Calendar } from "lucide-react"

interface Lancamento {
  data: string
  tipo: string
  valor: number
}

export default function AnaliseAvancada({ dados = [] }: { dados?: Lancamento[] }) {
  const fluxoCumulativo = useMemo(() => {
    const dadosOrdenados = [...(dados || [])].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    let saldoAcumulado = 0

    return dadosOrdenados.map((item) => {
      const saldoItem = item.tipo === "entrada" ? item.valor : -item.valor
      saldoAcumulado += saldoItem
      return {
        data: new Date(item.data).toLocaleDateString("pt-BR", { month: "short", day: "numeric" }),
        saldo: Math.round(saldoAcumulado * 100) / 100,
      }
    })
  }, [dados])

  const fluxoPorDia = useMemo(() => {
    const mapa = new Map<string, { entrada: number; saida: number }>()

    dados.forEach((item) => {
      const dia = new Date(item.data).toLocaleDateString("pt-BR", { month: "short", day: "numeric" })
      if (!mapa.has(dia)) {
        mapa.set(dia, { entrada: 0, saida: 0 })
      }
      const registro = mapa.get(dia)!
      if (item.tipo === "entrada") {
        registro.entrada += item.valor
      } else {
        registro.saida += item.valor
      }
    })

    return Array.from(mapa.entries()).map(([dia, { entrada, saida }]) => ({
      dia,
      entrada,
      saida,
      saldo: entrada - saida,
    }))
  }, [dados])

  const metricasAvancadas = useMemo(() => {
    const entradas = dados.filter((d) => d.tipo === "entrada")
    const saidas = dados.filter((d) => d.tipo === "saida")

    const mediaEntrada = entradas.length > 0 ? entradas.reduce((sum, d) => sum + d.valor, 0) / entradas.length : 0
    const mediaSaida = saidas.length > 0 ? saidas.reduce((sum, d) => sum + d.valor, 0) / saidas.length : 0

    const maiorEntrada = entradas.length > 0 ? Math.max(...entradas.map((d) => d.valor)) : 0
    const maiorSaida = saidas.length > 0 ? Math.max(...saidas.map((d) => d.valor)) : 0

    return [
      { label: "Ticket Médio (Entradas)", valor: mediaEntrada, icon: TrendingUp, cor: "text-emerald-400" },
      { label: "Ticket Médio (Saídas)", valor: mediaSaida, icon: TrendingDown, cor: "text-red-400" },
      { label: "Maior Entrada", valor: maiorEntrada, icon: TrendingUp, cor: "text-cyan-400" },
      { label: "Maior Saída", valor: maiorSaida, icon: TrendingDown, cor: "text-orange-400" },
    ]
  }, [dados])

  return (
    <div className="space-y-6">
      {/* Métricas Avançadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricasAvancadas.map((metrica, i) => {
          const Icon = metrica.icon
          return (
            <div key={i} className="rounded-xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-xs mb-1">{metrica.label}</p>
                  <p className="text-lg font-bold text-white">
                    {metrica.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </p>
                </div>
                <Icon className={`w-5 h-5 ${metrica.cor}`} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Fluxo Acumulado */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-cyan-400" />
          <h3 className="text-white font-semibold">Fluxo Acumulado</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={fluxoCumulativo}>
            <defs>
              <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
            <XAxis stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
            <Area type="monotone" dataKey="saldo" stroke="#06b6d4" fillOpacity={1} fill="url(#colorSaldo)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Fluxo Diário */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-sm p-6">
        <h3 className="text-white font-semibold mb-4">Fluxo Diário (Entradas vs Saídas)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={fluxoPorDia}>
            <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
            <XAxis stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }} />
            <Legend />
            <Line type="monotone" dataKey="entrada" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="saida" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="saldo" stroke="#06b6d4" strokeWidth={2} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
