"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface GraficosSectionProps {
  dados: any[]
}

export default function GraficosSection({ dados }: GraficosSectionProps) {
  const entradasSaidas = useMemo(() => {
    return [
      {
        nome: "Entradas",
        valor: dados.filter((d) => d.tipo === "entrada").reduce((sum, d) => sum + Number.parseFloat(d.valor), 0),
      },
      {
        nome: "Saídas",
        valor: dados.filter((d) => d.tipo === "saida").reduce((sum, d) => sum + Number.parseFloat(d.valor), 0),
      },
    ]
  }, [dados])
  const despesasPorCategoria = useMemo(() => {
    const categorias = {}
    dados.forEach((item) => {
      if (!categorias[item.categoria]) {
        categorias[item.categoria] = 0
      }
      categorias[item.categoria] += Number.parseFloat(item.valor)
    })
    return Object.entries(categorias).map(([cat, valor]) => ({
      nome: cat,
      valor: valor as number,
    }))
  }, [dados])
  const fluxoPorResponsavel = useMemo(() => {
    const responsaveis = {}
    dados.forEach((item) => {
      if (!responsaveis[item.responsavel]) {
        responsaveis[item.responsavel] = { entradas: 0, saidas: 0 }
      }
      if (item.tipo === "entrada") {
        responsaveis[item.responsavel].entradas += Number.parseFloat(item.valor)
      } else {
        responsaveis[item.responsavel].saidas += Number.parseFloat(item.valor)
      }
    })
    return Object.entries(responsaveis).map(([nome, valores]) => ({
      nome,
      entradas: valores.entradas,
      saidas: valores.saidas,
    }))
  }, [dados])

  const CORES = ["#10b981", "#ef4444", "#f59e0b", "#3b82f6", "#8b5cf6", "#ec4899"]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico 1: Entradas x Saídas */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">Entradas x Saídas</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={entradasSaidas}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="nome" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }} />
              <Bar dataKey="valor" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico 2: Despesas por Categoria */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg">Despesas por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={despesasPorCategoria}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ nome, valor }) => `${nome}: ${(valor / 1000).toFixed(1)}k`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="valor"
              >
                {despesasPorCategoria.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico 3: Fluxo por Responsável */}
      <Card className="border-gray-200 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Fluxo de Caixa por Responsável</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fluxoPorResponsavel} layout="vertical" margin={{ top: 5, right: 30, left: 200, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="nome" type="category" width={190} stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }} />
              <Legend />
              <Bar dataKey="entradas" fill="#10b981" radius={[0, 8, 8, 0]} />
              <Bar dataKey="saidas" fill="#ef4444" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
