"use client"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FiltrosProps {
  filtros: { mes: number; ano: number; responsavel: string }
  setFiltros: (filtros: any) => void
  dados: any[]
}

export default function Filtros({ filtros, setFiltros, dados }: FiltrosProps) {
  const meses = [
    { valor: 1, label: "Janeiro" },
    { valor: 2, label: "Fevereiro" },
    { valor: 3, label: "Março" },
    { valor: 4, label: "Abril" },
    { valor: 5, label: "Maio" },
    { valor: 6, label: "Junho" },
    { valor: 7, label: "Julho" },
    { valor: 8, label: "Agosto" },
    { valor: 9, label: "Setembro" },
    { valor: 10, label: "Outubro" },
    { valor: 11, label: "Novembro" },
    { valor: 12, label: "Dezembro" },
  ]

  const anos = Array.from(new Set(dados.map((d) => d.ano))).sort((a, b) => b - a)

  const responsaveis = ["Todos", ...Array.from(new Set(dados.map((d) => d.responsavel))).sort()]

  return (
    <Card className="p-4 border-gray-200">
      <div className="flex flex-wrap gap-4 items-end">
        {/* Mês */}
        <div className="flex-1 min-w-48">
          <label className="text-sm font-medium text-gray-700 block mb-2">Mês</label>
          <Select
            value={filtros.mes.toString()}
            onValueChange={(v) => setFiltros({ ...filtros, mes: Number.parseInt(v) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {meses.map((m) => (
                <SelectItem key={m.valor} value={m.valor.toString()}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ano */}
        <div className="flex-1 min-w-48">
          <label className="text-sm font-medium text-gray-700 block mb-2">Ano</label>
          <Select
            value={filtros.ano.toString()}
            onValueChange={(v) => setFiltros({ ...filtros, ano: Number.parseInt(v) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {anos.map((a) => (
                <SelectItem key={a} value={a.toString()}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Responsável */}
        <div className="flex-1 min-w-48">
          <label className="text-sm font-medium text-gray-700 block mb-2">Responsável</label>
          <Select value={filtros.responsavel} onValueChange={(v) => setFiltros({ ...filtros, responsavel: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {responsaveis.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  )
}
