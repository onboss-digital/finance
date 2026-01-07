"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface KPIsSectionProps {
  dados: any[]
}

export default function KPIsSection({ dados }: KPIsSectionProps) {
  const kpis = useMemo(() => {
    const entradas = dados.filter((d) => d.tipo === "entrada").reduce((sum, d) => sum + Number.parseFloat(d.valor), 0)

    const saidas = dados.filter((d) => d.tipo === "saida").reduce((sum, d) => sum + Number.parseFloat(d.valor), 0)

    const saldo = entradas - saidas
    const resultado = saldo

    return { entradas, saidas, saldo, resultado }
  }, [dados])

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total de Entradas */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Total de Entradas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{formatarMoeda(kpis.entradas)}</div>
        </CardContent>
      </Card>

      {/* Total de Saídas */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Total de Saídas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{formatarMoeda(kpis.saidas)}</div>
        </CardContent>
      </Card>

      {/* Saldo Atual */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Saldo Atual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${kpis.saldo >= 0 ? "text-green-600" : "text-red-600"}`}>
            {formatarMoeda(kpis.saldo)}
          </div>
        </CardContent>
      </Card>

      {/* Resultado do Mês */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Resultado do Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${kpis.resultado >= 0 ? "text-green-600" : "text-red-600"}`}>
            {kpis.resultado >= 0 ? "Lucro" : "Prejuízo"} {formatarMoeda(Math.abs(kpis.resultado))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
