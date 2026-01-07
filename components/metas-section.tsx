"use client"

import { useMemo, useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Target, Check, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface Lancamento {
  tipo: string
  categoria: string
  valor: number
}

interface Meta {
  id: string
  categoria_id: string
  categoria_nome: string
  tipo: "entrada" | "saida"
  valor_meta: number
  mes?: number
  ano?: number
}

export default function MetasSection({ dados = [] }: { dados?: Lancamento[] }) {
  const [metas, setMetas] = useState<Meta[]>([])

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    const carregarMetas = async () => {
      try {
        const currentMonth = new Date().getMonth() + 1
        const currentYear = new Date().getFullYear()

        // Buscar metas do mês atual
        const { data: metasData } = await supabase
          .from("metas")
          .select("*, categorias(nome)")
          .eq("mes", currentMonth)
          .eq("ano", currentYear)

        if (metasData) {
          setMetas(
            metasData.map((m: any) => ({
              id: m.id,
              categoria_id: m.categoria_id,
              categoria_nome: m.categorias?.nome || "Sem categoria",
              tipo: m.tipo,
              valor_meta: m.valor_meta,
              mes: m.mes,
              ano: m.ano,
            }))
          )
        } else {
          setMetas([])
        }
      } catch (error) {
        console.error("Erro ao carregar metas:", error)
        setMetas([])
      }
    }

    carregarMetas()
  }, [])

  const realizacaoMetas = useMemo(() => {
    return metas.map((m) => {
      const realizado = (dados || [])
        .filter((d) => d.tipo === m.tipo && d.categoria === m.categoria_nome)
        .reduce((sum, d) => sum + d.valor, 0)

      const percentual = (realizado / m.valor_meta) * 100
      const status = percentual >= 100 ? "atingida" : percentual >= 75 ? "progresso" : "atrasada"

      return {
        ...m,
        realizado,
        percentual: Math.min(percentual, 100),
        status,
        label: m.categoria_nome,
      }
    })
  }, [dados, metas])

  const statusIcons = {
    atingida: <Check className="w-5 h-5 text-emerald-400" />,
    progresso: <AlertCircle className="w-5 h-5 text-amber-400" />,
    atrasada: <AlertCircle className="w-5 h-5 text-red-400" />,
  }

  const statusCores = {
    atingida: "bg-emerald-600",
    progresso: "bg-amber-600",
    atrasada: "bg-red-600",
  }

  return (
    <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/30 backdrop-blur-xl p-4 sm:p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-cyan-400 flex-shrink-0" />
        <h3 className="text-white font-bold text-base sm:text-lg">Metas do Mês</h3>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {realizacaoMetas.length > 0 ? (
          realizacaoMetas.map((meta, i) => (
            <div key={i} className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {statusIcons[meta.status as keyof typeof statusIcons]}
                  <div className="min-w-0 flex-1">
                    <p className="text-white font-medium text-sm truncate">{meta.label}</p>
                    <p className="text-slate-400 text-xs mt-0.5">
                      {meta.realizado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} de{" "}
                      {meta.valor_meta.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </p>
                  </div>
                </div>
                <span className={`text-sm font-bold whitespace-nowrap ml-2 ${meta.percentual >= 100 ? "text-emerald-400" : "text-slate-300"}`}>
                  {Math.round(meta.percentual)}%
                </span>
              </div>
              <Progress
                value={meta.percentual}
                className={`h-2 rounded-full ${statusCores[meta.status as keyof typeof statusCores]}`}
              />
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-slate-600 mx-auto mb-3 opacity-50" />
            <p className="text-slate-400 text-sm">Nenhuma meta definida para este período</p>
          </div>
        )}
      </div>
    </div>
  )
}
