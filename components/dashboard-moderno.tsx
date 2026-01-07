"use client"

import { useMemo } from "react"
import KPIsModerno from "./kpis-moderno"
import GraficosModerno from "./graficos-moderno"
import FiltrosModerno from "./filtros-moderno"
import TabelaLancamentos from "./tabela-lancamentos"
import RelatorioSaudeFincanceira from "./relatorio-saude-financeira"
import MetasSection from "./metas-section"
import AnaliseComparativa from "./analise-comparativa"
import ProjecaoCaixa from "./projecao-caixa"
import PerformanceResponsavel from "./performance-responsavel"
import AnaliseAvancada from "./analise-avancada"

interface Lancamento {
  id: string
  data: string
  mes: number
  ano: number
  tipo: string
  categoria: string
  descricao: string
  responsavel: string
  valor: number
  status: string
  tag_id?: string
}

interface Filtros {
  mes: number
  ano: number
  responsavel: string
  categoria: string
  tag_id?: string
}

export default function DashboardModerno({
  dados = [],
  filtros,
  setFiltros,
  tags = [],
  categorias = [],
  responsaveis = [],
  metas = [],
}: {
  dados?: Lancamento[]
  filtros: Filtros
  setFiltros: (filtros: Filtros) => void
  tags?: any[]
  categorias?: any[]
  responsaveis?: any[]
  metas?: any[]
}) {
  const dadosFiltrados = useMemo(() => {
    if (!dados || dados.length === 0) return []
    return dados.filter((item) => {
      const dataItem = new Date(item.data)
      const mesItem = dataItem.getMonth() + 1
      const anoItem = dataItem.getFullYear()

      let match = true
      if (filtros.mes !== 0) match = match && mesItem === filtros.mes
      if (filtros.ano !== 0) match = match && anoItem === filtros.ano
      if (filtros.responsavel !== "Todos") match = match && item.responsavel === filtros.responsavel
      if (filtros.categoria !== "Todos") match = match && item.categoria === filtros.categoria
      if (filtros.tag_id && filtros.tag_id !== "todos") match = match && item.tag_id === filtros.tag_id

      return match
    })
  }, [dados, filtros])

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filtros */}
      <FiltrosModerno filtros={filtros} setFiltros={setFiltros} dados={dados} tags={tags} categorias={categorias} responsaveis={responsaveis} />

      {/* KPIs */}
      <KPIsModerno dados={dadosFiltrados} />

      {/* Análise Comparativa */}
      <AnaliseComparativa dados={dados} />

      {/* Projeção de Caixa */}
      <ProjecaoCaixa dados={dados} />

      {/* Relatório de Saúde Financeira */}
      <RelatorioSaudeFincanceira dados={dadosFiltrados} metas={metas} />

      {/* Metas */}
      <MetasSection dados={dadosFiltrados} />

      {/* Gráficos */}
      <GraficosModerno dados={dadosFiltrados} />

      {/* Performance por Responsável */}
      <PerformanceResponsavel dados={dadosFiltrados} />

      {/* Análise Avançada */}
      <AnaliseAvancada dados={dadosFiltrados} />

      {/* Tabela de Lançamentos */}
      <TabelaLancamentos dados={dadosFiltrados} />
    </div>
  )
}
