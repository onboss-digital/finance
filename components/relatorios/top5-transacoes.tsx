"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownLeft, Zap } from "lucide-react"

interface Lancamento {
  id: string
  data: string
  descricao: string
  categoria: string
  responsavel: string
  tipo: string
  valor: number
}

export default function Top5Transacoes({ dados = [] }: { dados?: Lancamento[] }) {
  const top5 = useMemo(() => {
    return (dados || [])
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 5)
      .map((item, idx) => ({
        ...item,
        posicao: idx + 1,
      }))
  }, [dados])

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor)
  }

  const totalTop5 = top5.reduce((sum, item) => sum + item.valor, 0)
  const percentualTotal = dados.length > 0 ? (totalTop5 / dados.reduce((sum, d) => sum + d.valor, 0)) * 100 : 0

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/30 border-slate-700/50 shadow-xl">
      <CardHeader className="pb-4 sm:pb-6">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-white text-base sm:text-lg">Top 5 Maiores Transações</CardTitle>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              {formatarMoeda(totalTop5)} - {percentualTotal.toFixed(1)}% do total
            </p>
          </div>
          <Zap className="w-5 h-5 text-amber-400 opacity-50" />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
        <div className="space-y-3 sm:space-y-4">
          {top5.length > 0 ? (
            top5.map((item) => (
              <div
                key={item.id}
                className={`rounded-xl border p-3 sm:p-4 bg-gradient-to-br ${
                  item.tipo === "entrada"
                    ? "border-emerald-500/30 from-emerald-900/20 to-emerald-900/5"
                    : "border-red-500/30 from-red-900/20 to-red-900/5"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Posição */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        item.tipo === "entrada" ? "bg-emerald-500/30 text-emerald-300" : "bg-red-500/30 text-red-300"
                      }`}
                    >
                      {item.posicao}
                    </div>
                  </div>

                  {/* Informações */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="text-white font-semibold text-sm sm:text-base truncate">{item.descricao}</p>
                        <p className="text-slate-400 text-xs mt-1">{item.categoria}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                          item.tipo === "entrada"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {item.tipo === "entrada" ? "Entrada" : "Saída"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-slate-500">Data</p>
                        <p className="text-slate-300 font-semibold">
                          {new Date(item.data).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500">Responsável</p>
                        <p className="text-slate-300 font-semibold truncate">{item.responsavel}</p>
                      </div>
                    </div>
                  </div>

                  {/* Valor */}
                  <div className="flex-shrink-0 text-right">
                    <p
                      className={`text-base sm:text-lg font-bold ${
                        item.tipo === "entrada" ? "text-emerald-300" : "text-red-300"
                      }`}
                    >
                      {formatarMoeda(item.valor)}
                    </p>
                    <div className="flex items-center justify-end mt-2 gap-1">
                      {item.tipo === "entrada" ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-400">Nenhuma transação registrada</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
