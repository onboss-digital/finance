"use client"

import { useMemo } from "react"
import { ArrowUpRight, ArrowDownLeft, CheckCircle, Clock, XCircle } from "lucide-react"

interface Lancamento {
  id: string
  data: string
  tipo: string
  categoria: string
  descricao: string
  responsavel: string
  valor: number
  status: string
}

export default function TabelaLancamentos({ dados = [] }: { dados?: Lancamento[] }) {
  const dadosOrdenados = useMemo(() => {
    return [...(dados || [])].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()).slice(0, 15)
  }, [dados])

  const statusIcons = {
    pago: <CheckCircle className="w-4 h-4 text-emerald-400" />,
    concluido: <CheckCircle className="w-4 h-4 text-emerald-400" />,
    pendente: <Clock className="w-4 h-4 text-amber-400" />,
    cancelado: <XCircle className="w-4 h-4 text-red-400" />,
  }

  const statusLabels = {
    pago: "Pago",
    concluido: "Pago",
    pendente: "Pendente",
    cancelado: "Cancelado",
  }

  return (
    <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/30 backdrop-blur-xl overflow-hidden shadow-xl">
      <div className="p-4 sm:p-6 border-b border-slate-700/50">
        <h3 className="text-white font-bold text-base sm:text-lg">Últimos Lançamentos</h3>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/50 bg-slate-900/50">
              <th className="px-4 sm:px-6 py-4 text-left text-slate-400 font-medium text-xs sm:text-sm">Data</th>
              <th className="px-4 sm:px-6 py-4 text-left text-slate-400 font-medium text-xs sm:text-sm hidden md:table-cell">
                Tipo
              </th>
              <th className="px-4 sm:px-6 py-4 text-left text-slate-400 font-medium text-xs sm:text-sm hidden lg:table-cell">
                Categoria
              </th>
              <th className="px-4 sm:px-6 py-4 text-left text-slate-400 font-medium text-xs sm:text-sm">Descrição</th>
              <th className="px-4 sm:px-6 py-4 text-left text-slate-400 font-medium text-xs sm:text-sm hidden lg:table-cell">
                Responsável
              </th>
              <th className="px-4 sm:px-6 py-4 text-right text-slate-400 font-medium text-xs sm:text-sm">Valor</th>
              <th className="px-4 sm:px-6 py-4 text-center text-slate-400 font-medium text-xs sm:text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            {dadosOrdenados.map((item) => (
              <tr key={item.id} className="border-b border-slate-700/30 hover:bg-slate-800/50 transition-colors">
                <td className="px-4 sm:px-6 py-4 text-slate-300 text-xs sm:text-sm">
                  {new Date(item.data).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                  {item.tipo === "entrada" ? (
                    <div className="flex items-center gap-2 text-emerald-400 text-xs sm:text-sm">
                      <ArrowUpRight className="w-4 h-4 flex-shrink-0" />
                      <span>Entrada</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-400 text-xs sm:text-sm">
                      <ArrowDownLeft className="w-4 h-4 flex-shrink-0" />
                      <span>Saída</span>
                    </div>
                  )}
                </td>
                <td className="px-4 sm:px-6 py-4 text-slate-300 hidden lg:table-cell text-xs sm:text-sm">
                  {item.categoria}
                </td>
                <td className="px-4 sm:px-6 py-4 text-slate-300 max-w-xs truncate text-xs sm:text-sm">
                  {item.descricao}
                </td>
                <td className="px-4 sm:px-6 py-4 text-slate-400 hidden lg:table-cell text-xs sm:text-sm">
                  {item.responsavel}
                </td>
                <td className="px-4 sm:px-6 py-4 text-right font-semibold text-white text-xs sm:text-sm whitespace-nowrap">
                  {item.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </td>
                <td className="px-4 sm:px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1 sm:gap-2">
                    {statusIcons[item.status as keyof typeof statusIcons]}
                    <span className="text-xs text-slate-400 hidden sm:inline">
                      {statusLabels[item.status as keyof typeof statusLabels]}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-1">
        {dadosOrdenados.map((item) => (
          <div key={item.id} className="p-4 border-b border-slate-700/30 hover:bg-slate-800/40 transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">{new Date(item.data).toLocaleDateString("pt-BR")}</span>
                <div className="flex items-center gap-1.5">
                  {statusIcons[item.status as keyof typeof statusIcons]}
                  <span className="text-xs text-slate-400">
                    {statusLabels[item.status as keyof typeof statusLabels]}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item.tipo === "entrada" ? (
                  <div className="flex items-center gap-1 text-emerald-400">
                    <ArrowUpRight className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs font-medium">Entrada</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-400">
                    <ArrowDownLeft className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs font-medium">Saída</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-slate-200 font-medium line-clamp-2">{item.descricao}</p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-700/30">
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 block">{item.categoria}</span>
                  {item.responsavel && <span className="text-xs text-slate-600 block">{item.responsavel}</span>}
                </div>
                <span className="text-sm font-bold text-white whitespace-nowrap ml-2">
                  {item.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {dadosOrdenados.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-slate-400 text-sm">Nenhum lançamento registrado</p>
        </div>
      )}
    </div>
  )
}
