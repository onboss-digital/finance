"use client"

import { useMemo } from "react"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"

interface Lancamento {
  tipo: string
  categoria: string
  responsavel: string
  valor: number
  tag_id?: string
}

// Tooltip customizado com premium styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-cyan-500/50 rounded-lg p-3 shadow-2xl backdrop-blur-md">
        <p className="text-cyan-300 font-semibold text-sm">{payload[0].payload.name || label}</p>
        <p className="text-emerald-400 text-xs mt-1">
          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(payload[0].value)}
        </p>
      </div>
    )
  }
  return null
}

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const percent = ((data.value / (payload[0].payload.value || 1)) * 100).toFixed(1)
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-cyan-500/50 rounded-lg p-3 shadow-2xl backdrop-blur-md">
        <p className="text-cyan-300 font-semibold text-sm">{data.name}</p>
        <p className="text-emerald-400 text-xs mt-1">
          {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(data.value)}
        </p>
        <p className="text-amber-300 text-xs mt-0.5">{percent}% do total</p>
      </div>
    )
  }
  return null
}

export default function GraficosModerno({ dados = [], tagFiltro }: { dados?: Lancamento[]; tagFiltro?: string }) {
  const dadosFiltrados = useMemo(() => {
    if (!tagFiltro || tagFiltro === "todos") return dados || []
    return dados.filter((d) => d.tag_id === tagFiltro)
  }, [dados, tagFiltro])

  const entradaSaida = useMemo(() => {
    const entrada = dadosFiltrados.filter((d) => d.tipo === "entrada").reduce((sum, d) => sum + d.valor, 0)
    const saida = dadosFiltrados.filter((d) => d.tipo === "saida").reduce((sum, d) => sum + d.valor, 0)
    return [
      { name: "Entradas", value: entrada, fill: "#10b981" },
      { name: "Saídas", value: saida, fill: "#ef4444" },
    ]
  }, [dadosFiltrados])

  const categoriaData = useMemo(() => {
    const mapa = new Map<string, number>()
    dadosFiltrados.forEach((d) => {
      mapa.set(d.categoria, (mapa.get(d.categoria) || 0) + d.valor)
    })
    return Array.from(mapa.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [dadosFiltrados])

  const responsavelData = useMemo(() => {
    const mapa = new Map<string, number>()
    dadosFiltrados.forEach((d) => {
      mapa.set(d.responsavel, (mapa.get(d.responsavel) || 0) + d.valor)
    })
    return Array.from(mapa.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [dadosFiltrados])

  // Cores premium gradiente
  const coresPremium = [
    { primary: "#06b6d4", secondary: "#0891b2", light: "#cffafe" }, // Cyan
    { primary: "#3b82f6", secondary: "#1d4ed8", light: "#dbeafe" }, // Blue
    { primary: "#8b5cf6", secondary: "#6d28d9", light: "#ede9fe" }, // Purple
    { primary: "#ec4899", secondary: "#be185d", light: "#fce7f3" }, // Pink
    { primary: "#f59e0b", secondary: "#d97706", light: "#fef3c7" }, // Amber
    { primary: "#10b981", secondary: "#059669", light: "#d1fae5" }, // Emerald
    { primary: "#14b8a6", secondary: "#0d9488", light: "#ccfbf1" }, // Teal
    { primary: "#f87171", secondary: "#dc2626", light: "#fee2e2" }, // Red
  ]

  const totalEntrada = entradaSaida[0].value
  const totalSaida = entradaSaida[1].value
  const diferenca = totalEntrada - totalSaida

  return (
    <div className="space-y-6">
      {/* Resumo Visual - Entradas vs Saídas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/20 to-emerald-900/5 backdrop-blur-xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-emerald-400/80 text-xs sm:text-sm font-medium">Total de Entradas</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-300 mt-2 break-words">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalEntrada)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400 opacity-40 ml-2 flex-shrink-0" />
          </div>
        </div>

        <div className="rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-900/20 to-red-900/5 backdrop-blur-xl p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-red-400/80 text-xs sm:text-sm font-medium">Total de Saídas</p>
              <p className="text-xl sm:text-2xl font-bold text-red-300 mt-2 break-words">
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalSaida)}
              </p>
            </div>
            <TrendingDown className="w-8 h-8 sm:w-10 sm:h-10 text-red-400 opacity-40 ml-2 flex-shrink-0" />
          </div>
        </div>

        <div className={`rounded-2xl border backdrop-blur-xl p-4 sm:p-6 ${
          diferenca >= 0
            ? "border-cyan-500/30 bg-gradient-to-br from-cyan-900/20 to-cyan-900/5"
            : "border-orange-500/30 bg-gradient-to-br from-orange-900/20 to-orange-900/5"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className={`text-xs sm:text-sm font-medium ${diferenca >= 0 ? "text-cyan-400/80" : "text-orange-400/80"}`}>Saldo</p>
              <p className={`text-xl sm:text-2xl font-bold mt-2 break-words ${diferenca >= 0 ? "text-cyan-300" : "text-orange-300"}`}>
                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(diferenca)}
              </p>
            </div>
            <div className={`text-3xl sm:text-4xl ml-2 flex-shrink-0 ${diferenca >= 0 ? "text-cyan-400/40" : "text-orange-400/40"}`}>
              {diferenca >= 0 ? "📈" : "📉"}
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Entradas vs Saídas - Gráfico de Barras */}
        <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/30 backdrop-blur-xl p-4 sm:p-6 shadow-xl">
          <div className="mb-4">
            <h3 className="text-white font-bold text-base sm:text-lg">Fluxo de Caixa</h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">Comparativo de entradas e saídas</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={entradaSaida} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="gradientEntrada" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.4} />
                </linearGradient>
                <linearGradient id="gradientSaida" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 6" stroke="#334155" vertical={false} />
              <XAxis stroke="#94a3b8" style={{ fontSize: "11px" }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: "11px" }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(6, 182, 212, 0.1)" }} />
              <Bar dataKey="value" radius={[12, 12, 0, 0]} animationDuration={800}>
                {entradaSaida.map((entry, index) => (
                  <Cell key={index} fill={index === 0 ? "url(#gradientEntrada)" : "url(#gradientSaida)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribuição por Categoria - Pizza */}
        <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/30 backdrop-blur-xl p-4 sm:p-6 shadow-xl">
          <div className="mb-4">
            <h3 className="text-white font-bold text-base sm:text-lg">Distribuição por Categoria</h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">{categoriaData.length} categorias encontradas</p>
          </div>
          {categoriaData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <defs>
                  {coresPremium.map((cor, i) => (
                    <linearGradient key={i} id={`pieGradient${i}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={cor.primary} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={cor.secondary} stopOpacity={0.7} />
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  dataKey="value"
                  data={categoriaData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  animationDuration={800}
                  label={({ name, percent }) => `${name.slice(0, 8)}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {categoriaData.map((entry, index) => (
                    <Cell key={index} fill={`url(#pieGradient${index % coresPremium.length})`} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">Nenhum dado disponível</div>
          )}
        </div>
      </div>

      {/* Movimentação por Responsável */}
      <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/30 backdrop-blur-xl p-4 sm:p-6 shadow-xl overflow-x-auto">
        <div className="mb-4">
          <h3 className="text-white font-bold text-base sm:text-lg">Movimentação por Responsável</h3>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">{responsavelData.length} responsáveis registrados</p>
        </div>
        {responsavelData.length > 0 ? (
          <ResponsiveContainer width="100%" height={Math.max(250, responsavelData.length * 40)}>
            <BarChart
              data={responsavelData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
              animationDuration={800}
            >
              <defs>
                {coresPremium.map((cor, i) => (
                  <linearGradient key={i} id={`barGradient${i}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={cor.primary} stopOpacity={0.8} />
                    <stop offset="100%" stopColor={cor.secondary} stopOpacity={0.5} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="4 6" stroke="#334155" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" style={{ fontSize: "11px" }} />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" style={{ fontSize: "11px" }} width={90} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(6, 182, 212, 0.1)" }} />
              <Bar dataKey="value" radius={[0, 12, 12, 0]} animationDuration={800}>
                {responsavelData.map((entry, index) => (
                  <Cell key={index} fill={`url(#barGradient${index % coresPremium.length})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-slate-400 text-sm">Nenhum dado disponível</div>
        )}
      </div>
    </div>
  )
}
