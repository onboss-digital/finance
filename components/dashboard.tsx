"use client"

import { useMemo } from "react"
import Filtros from "./filtros"
import KPIsSection from "./kpis-section"
import GraficosSection from "./graficos-section"

interface DashboardProps {
  dados: any[]
  filtros: { mes: number; ano: number; responsavel: string }
  setFiltros: (filtros: any) => void
}

export default function Dashboard({ dados, filtros, setFiltros }: DashboardProps) {
  const dadosFiltrados = useMemo(() => {
    return dados.filter((item) => {
      const filtroMes = item.mes === filtros.mes
      const filtroAno = item.ano === filtros.ano
      const filtroResponsavel = filtros.responsavel === "Todos" || item.responsavel === filtros.responsavel
      return filtroMes && filtroAno && filtroResponsavel
    })
  }, [dados, filtros])

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Filtros filtros={filtros} setFiltros={setFiltros} dados={dados} />

      {/* KPIs */}
      <KPIsSection dados={dadosFiltrados} />

      {/* Gráficos */}
      <GraficosSection dados={dadosFiltrados} />
    </div>
  )
}
