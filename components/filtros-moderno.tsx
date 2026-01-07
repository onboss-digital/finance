"use client"

import { useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from "lucide-react"

interface Lancamento {
  data: string
  responsavel: string
  categoria: string
  tag_id?: string
}

interface Filtros {
  mes: number
  ano: number
  responsavel: string
  categoria: string
  tag_id: string
}

export default function FiltrosModerno({
  filtros,
  setFiltros,
  dados = [],
  tags = [],
  categorias = [],
  responsaveis = [],
}: {
  filtros: Filtros
  setFiltros: (filtros: Filtros) => void
  dados?: Lancamento[]
  tags?: any[]
  categorias?: any[]
  responsaveis?: any[]
}) {
  const meses = [
    { value: "0", label: "Todos os Meses" },
    { value: "1", label: "Janeiro" },
    { value: "2", label: "Fevereiro" },
    { value: "3", label: "Março" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Maio" },
    { value: "6", label: "Junho" },
    { value: "7", label: "Julho" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ]

  const anos = useMemo(() => {
    if (!dados || dados.length === 0) return []
    const anosUnicos = new Set(dados.map((d) => new Date(d.data).getFullYear()))
    return Array.from(anosUnicos)
      .sort((a, b) => b - a)
      .map((ano) => ({ value: ano.toString(), label: ano.toString() }))
  }, [dados])

  const responsaveisList = useMemo(() => {
    if (!responsaveis || responsaveis.length === 0) return [{ value: "Todos", label: "Todos os Responsáveis" }]
    return [
      { value: "Todos", label: "Todos os Responsáveis" },
      ...responsaveis.map((r) => ({ value: r.nome, label: r.nome })),
    ]
  }, [responsaveis])

  const categoriasList = useMemo(() => {
    if (!categorias || categorias.length === 0) return [{ value: "Todos", label: "Todas as Categorias" }]
    return [
      { value: "Todos", label: "Todas as Categorias" },
      ...categorias.map((c) => ({ value: c.nome, label: c.nome })),
    ]
  }, [categorias])

  return (
    <div className="flex flex-col gap-3 p-3 sm:p-4 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/30 backdrop-blur-xl">
      <div className="flex items-center gap-2 text-slate-400">
        <Filter className="w-4 h-4 flex-shrink-0" />
        <span className="text-xs sm:text-sm font-medium">Filtrar por:</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        <Select
          value={filtros.mes.toString()}
          onValueChange={(value) => setFiltros({ ...filtros, mes: Number.parseInt(value) })}
        >
          <SelectTrigger className="w-full text-xs sm:text-sm bg-slate-700/50 border-slate-600/50 text-white rounded-lg">
            <SelectValue placeholder="Mês" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {meses.map((m) => (
              <SelectItem key={m.value} value={m.value} className="text-white text-sm">
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filtros.ano.toString()}
          onValueChange={(value) => setFiltros({ ...filtros, ano: Number.parseInt(value) })}
        >
          <SelectTrigger className="w-full text-xs sm:text-sm bg-slate-700/50 border-slate-600/50 text-white rounded-lg">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {anos.map((a) => (
              <SelectItem key={a.value} value={a.value} className="text-white text-sm">
                {a.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filtros.responsavel} onValueChange={(value) => setFiltros({ ...filtros, responsavel: value })}>
          <SelectTrigger className="w-full text-xs sm:text-sm bg-slate-700/50 border-slate-600/50 text-white rounded-lg col-span-2 sm:col-span-1">
            <SelectValue placeholder="Responsável" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {responsaveisList.map((r) => (
              <SelectItem key={r.value} value={r.value} className="text-white text-sm">
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filtros.categoria} onValueChange={(value) => setFiltros({ ...filtros, categoria: value })}>
          <SelectTrigger className="w-full text-xs sm:text-sm bg-slate-700/50 border-slate-600/50 text-white rounded-lg col-span-2 sm:col-span-1">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {categoriasList.map((c) => (
              <SelectItem key={c.value} value={c.value} className="text-white text-sm">
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filtros.tag_id || "todos"} onValueChange={(value) => setFiltros({ ...filtros, tag_id: value })}>
          <SelectTrigger className="w-full text-xs sm:text-sm bg-slate-700/50 border-slate-600/50 text-white rounded-lg col-span-2 sm:col-span-1">
            <SelectValue placeholder="Produto" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="todos" className="text-white text-sm">
              Todos os Produtos
            </SelectItem>
            {tags.map((tag) => (
              <SelectItem key={tag.id} value={tag.id} className="text-white text-sm">
                {tag.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
