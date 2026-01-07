"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react"
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import AnaliseComparativa from "../analise-comparativa"
import Top5Transacoes from "./top5-transacoes"
import AnaliseTemporalRelatorio from "./analise-temporal"

interface RelatorioCompletoProps {
  dados: any[]
  mes: number
  ano: number
}

export default function RelatorioCompleto({ dados, mes, ano }: RelatorioCompletoProps) {
  const mesNome = new Date(ano, mes - 1).toLocaleString("pt-BR", { month: "long", year: "numeric" })

  // Normalizar tipos (case-insensitive)
  const dadosNormalizados = (dados || []).map((d) => ({
    ...d,
    tipo: d.tipo.toLowerCase() === "entrada" ? "entrada" : "saida",
  }))

  // Cálculos principais
  const totalEntradas = useMemo(
    () => dadosNormalizados.filter((d) => d.tipo === "entrada").reduce((acc, d) => acc + (d.valor || 0), 0),
    [dadosNormalizados],
  )

  const totalSaidas = useMemo(
    () => dadosNormalizados.filter((d) => d.tipo === "saida").reduce((acc, d) => acc + (d.valor || 0), 0),
    [dadosNormalizados],
  )

  const saldo = totalEntradas - totalSaidas

  // Resumo por categoria
  const porCategoria = useMemo(() => {
    return dadosNormalizados.reduce(
      (acc, d) => {
        const categoria = d.categoria || "Sem categoria"
        if (!acc[categoria]) {
          acc[categoria] = { entrada: 0, saida: 0, quantidade: 0 }
        }
        if (d.tipo === "entrada") {
          acc[categoria].entrada += d.valor || 0
        } else {
          acc[categoria].saida += d.valor || 0
        }
        acc[categoria].quantidade += 1
        return acc
      },
      {} as Record<string, { entrada: number; saida: number; quantidade: number }>,
    )
  }, [dadosNormalizados])

  // Resumo por responsável
  const porResponsavel = useMemo(() => {
    return dadosNormalizados.reduce(
      (acc, d) => {
        const responsavel = d.responsavel || "Sem responsável"
        if (!acc[responsavel]) {
          acc[responsavel] = { entrada: 0, saida: 0, quantidade: 0 }
        }
        if (d.tipo === "entrada") {
          acc[responsavel].entrada += d.valor || 0
        } else {
          acc[responsavel].saida += d.valor || 0
        }
        acc[responsavel].quantidade += 1
        return acc
      },
      {} as Record<string, { entrada: number; saida: number; quantidade: number }>,
    )
  }, [dadosNormalizados])

  // Dados para gráfico de categorias
  const chartCategories = Object.entries(porCategoria).map(([nome, valores]) => ({
    name: nome.slice(0, 15),
    entrada: valores.entrada,
    saida: valores.saida,
  }))

  // Cores premium
  const cores = [
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#14b8a6",
    "#f87171",
  ]

  // Tooltip customizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-cyan-500/50 rounded-lg p-3 shadow-xl">
          <p className="text-cyan-300 font-semibold text-sm">{payload[0].payload.name}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className={`text-xs mt-1 ${entry.dataKey === "entrada" ? "text-emerald-400" : "text-red-400"}`}>
              {entry.dataKey === "entrada" ? "Entrada: " : "Saída: "}
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const totalTransacoes = dadosNormalizados.length
  const ticketMedio = totalTransacoes > 0 ? (totalEntradas + totalSaidas) / totalTransacoes : 0
  const percentualSaidas = totalEntradas > 0 ? (totalSaidas / totalEntradas) * 100 : 0

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header do Relatório */}
      <Card className="bg-linear-to-br from-slate-800/50 to-slate-900/30 border-slate-700/50 shadow-xl">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-cyan-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-white text-lg sm:text-xl capitalize">
                Relatório de {mesNome}
              </CardTitle>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">Análise completa de entradas e saídas</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-4 border-t border-slate-700/50">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-xs sm:text-sm text-slate-400">{totalTransacoes} transações registradas</span>
          </div>
        </CardHeader>
      </Card>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-gradient-to-br from-emerald-900/20 to-emerald-900/5 border-emerald-500/30">
          <CardHeader className="pb-3 p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-emerald-400/80 text-xs sm:text-sm font-medium">Total Entradas</CardTitle>
              <TrendingUp className="w-4 h-4 text-emerald-400 opacity-50" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-xl sm:text-2xl font-bold text-emerald-300">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalEntradas)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-900/20 to-red-900/5 border-red-500/30">
          <CardHeader className="pb-3 p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-red-400/80 text-xs sm:text-sm font-medium">Total Saídas</CardTitle>
              <TrendingDown className="w-4 h-4 text-red-400 opacity-50" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-xl sm:text-2xl font-bold text-red-300">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalSaidas)}
            </p>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${
          saldo >= 0
            ? "from-cyan-900/20 to-cyan-900/5 border-cyan-500/30"
            : "from-orange-900/20 to-orange-900/5 border-orange-500/30"
        }`}>
          <CardHeader className="pb-3 p-4">
            <div className="flex items-center justify-between">
              <CardTitle className={`${saldo >= 0 ? "text-cyan-400/80" : "text-orange-400/80"} text-xs sm:text-sm font-medium`}>
                Saldo
              </CardTitle>
              <DollarSign className={`w-4 h-4 ${saldo >= 0 ? "text-cyan-400" : "text-orange-400"} opacity-50`} />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className={`text-xl sm:text-2xl font-bold ${saldo >= 0 ? "text-cyan-300" : "text-orange-300"}`}>
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(saldo)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/20 to-purple-900/5 border-purple-500/30">
          <CardHeader className="pb-3 p-4">
            <CardTitle className="text-purple-400/80 text-xs sm:text-sm font-medium">% de Saídas</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-xl sm:text-2xl font-bold text-purple-300">
              {percentualSaidas.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Análise Comparativa */}
      <AnaliseComparativa dados={dados} mes={mes} ano={ano} />

      {/* Top 5 Maiores Transações */}
      <Top5Transacoes dados={dadosNormalizados} />

      {/* Análise Temporal */}
      <AnaliseTemporalRelatorio dados={dadosNormalizados} />
      {chartCategories.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/30 border-slate-700/50 shadow-xl">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-white text-base sm:text-lg">Entradas vs Saídas por Categoria</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartCategories} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                  <defs>
                    <linearGradient id="gradEntrada" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#059669" stopOpacity={0.4} />
                    </linearGradient>
                    <linearGradient id="gradSaida" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#dc2626" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 6" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" angle={-45} textAnchor="end" height={80} style={{ fontSize: "11px" }} />
                  <YAxis stroke="#94a3b8" style={{ fontSize: "11px" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="entrada" fill="url(#gradEntrada)" name="Entradas" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="saida" fill="url(#gradSaida)" name="Saídas" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/30 border-slate-700/50 shadow-xl">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-white text-base sm:text-lg">Distribuição por Categoria</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartCategories.map((c) => ({ name: c.name, value: c.entrada + c.saida }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {chartCategories.map((_, index) => (
                      <Cell key={index} fill={cores[index % cores.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px" }}
                    formatter={(value) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabela de Movimentações */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/30 border-slate-700/50 shadow-xl">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-white text-base sm:text-lg">Todas as Movimentações</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 overflow-x-auto">
          {dadosNormalizados.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700/50">
                  <TableHead className="text-slate-400 text-xs sm:text-sm">Data</TableHead>
                  <TableHead className="text-slate-400 text-xs sm:text-sm">Descrição</TableHead>
                  <TableHead className="text-slate-400 text-xs sm:text-sm hidden sm:table-cell">Categoria</TableHead>
                  <TableHead className="text-slate-400 text-xs sm:text-sm hidden lg:table-cell">Responsável</TableHead>
                  <TableHead className="text-slate-400 text-xs sm:text-sm">Tipo</TableHead>
                  <TableHead className="text-right text-slate-400 text-xs sm:text-sm">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dadosNormalizados.map((item) => (
                  <TableRow key={item.id} className="border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                    <TableCell className="text-slate-300 text-xs sm:text-sm whitespace-nowrap">
                      {new Date(item.data).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-slate-300 text-xs sm:text-sm max-w-xs truncate">
                      {item.descricao}
                    </TableCell>
                    <TableCell className="text-slate-300 text-xs sm:text-sm hidden sm:table-cell">
                      {item.categoria || "Sem categoria"}
                    </TableCell>
                    <TableCell className="text-slate-300 text-xs sm:text-sm hidden lg:table-cell">
                      {item.responsavel || "Sem responsável"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                          item.tipo === "entrada" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {item.tipo === "entrada" ? "Entrada" : "Saída"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-slate-300 text-xs sm:text-sm font-medium whitespace-nowrap">
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.valor)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400">Nenhuma movimentação registrada neste período</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumo por Categoria */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/30 border-slate-700/50 shadow-xl">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-white text-base sm:text-lg">Resumo por Categoria</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          {Object.entries(porCategoria).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {Object.entries(porCategoria).map(([categoria, valores]) => (
                <div key={categoria} className="p-3 sm:p-4 bg-gradient-to-br from-slate-700/30 to-slate-700/10 rounded-xl border border-slate-700/50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-slate-200 font-medium text-sm sm:text-base truncate">{categoria}</p>
                      <p className="text-slate-500 text-xs mt-1">{valores.quantidade} transações</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-500/10 rounded-lg p-2">
                      <p className="text-emerald-400 text-xs font-medium">Entradas</p>
                      <p className="text-emerald-300 font-bold text-sm mt-1">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(
                          valores.entrada,
                        )}
                      </p>
                    </div>
                    <div className="bg-red-500/10 rounded-lg p-2">
                      <p className="text-red-400 text-xs font-medium">Saídas</p>
                      <p className="text-red-300 font-bold text-sm mt-1">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(
                          valores.saida,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-400">Nenhuma categoria registrada</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumo por Responsável */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/30 border-slate-700/50 shadow-xl">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-white text-base sm:text-lg">Resumo por Responsável</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          {Object.entries(porResponsavel).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {Object.entries(porResponsavel).map(([responsavel, valores]) => (
                <div key={responsavel} className="p-3 sm:p-4 bg-gradient-to-br from-slate-700/30 to-slate-700/10 rounded-xl border border-slate-700/50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-slate-200 font-medium text-sm sm:text-base truncate">{responsavel}</p>
                      <p className="text-slate-500 text-xs mt-1">{valores.quantidade} transações</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-500/10 rounded-lg p-2">
                      <p className="text-emerald-400 text-xs font-medium">Entradas</p>
                      <p className="text-emerald-300 font-bold text-sm mt-1">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(
                          valores.entrada,
                        )}
                      </p>
                    </div>
                    <div className="bg-red-500/10 rounded-lg p-2">
                      <p className="text-red-400 text-xs font-medium">Saídas</p>
                      <p className="text-red-300 font-bold text-sm mt-1">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(
                          valores.saida,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-400">Nenhum responsável registrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
