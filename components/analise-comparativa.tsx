"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft } from "lucide-react"

interface Lancamento {
  tipo: string
  valor: number
  data: string
}

interface AnaliseComparativaProps {
  dados?: Lancamento[]
  mes?: number
  ano?: number
}

export default function AnaliseComparativa({ dados = [], mes, ano }: AnaliseComparativaProps) {
  const comparacao = useMemo(() => {
    // Se não tiver mes/ano, usar data atual
    const agora = new Date()
    const mesAtual = mes || agora.getMonth() + 1
    const anoAtual = ano || agora.getFullYear()
    const mesAnterior = mesAtual === 1 ? 12 : mesAtual - 1
    const anoAnterior = mesAtual === 1 ? anoAtual - 1 : anoAtual

    // Dados do mês atual
    const dadosMesAtual = (dados || []).filter((d) => {
      const data = new Date(d.data)
      return data.getMonth() + 1 === mesAtual && data.getFullYear() === anoAtual
    })

    // Dados do mês anterior
    const dadosMesAnterior = (dados || []).filter((d) => {
      const data = new Date(d.data)
      return data.getMonth() + 1 === mesAnterior && data.getFullYear() === anoAnterior
    })

    // Cálculos mês atual
    const entradasAtual = dadosMesAtual.filter((d) => d.tipo === "entrada").reduce((sum, d) => sum + d.valor, 0)
    const saidasAtual = dadosMesAtual.filter((d) => d.tipo === "saida").reduce((sum, d) => sum + d.valor, 0)
    const saldoAtual = entradasAtual - saidasAtual

    // Cálculos mês anterior
    const entradasAnterior = dadosMesAnterior.filter((d) => d.tipo === "entrada").reduce((sum, d) => sum + d.valor, 0)
    const saidasAnterior = dadosMesAnterior.filter((d) => d.tipo === "saida").reduce((sum, d) => sum + d.valor, 0)
    const saldoAnterior = entradasAnterior - saidasAnterior

    // Variações
    const variacaoEntradas = entradasAnterior > 0 ? ((entradasAtual - entradasAnterior) / entradasAnterior) * 100 : 0
    const variacaoSaidas = saidasAnterior > 0 ? ((saidasAtual - saidasAnterior) / saidasAnterior) * 100 : 0
    const variacaoSaldo = saldoAnterior !== 0 ? ((saldoAtual - saldoAnterior) / Math.abs(saldoAnterior)) * 100 : 0

    return {
      mesAtualNome: new Date(anoAtual, mesAtual - 1).toLocaleString("pt-BR", { month: "long", year: "numeric" }),
      mesAnteriorNome: new Date(anoAnterior, mesAnterior - 1).toLocaleString("pt-BR", { month: "long", year: "numeric" }),
      entradasAtual,
      entradasAnterior,
      variacaoEntradas,
      saidasAtual,
      saidasAnterior,
      variacaoSaidas,
      saldoAtual,
      saldoAnterior,
      variacaoSaldo,
    }
  }, [dados])

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor)
  }

  const formatarVariacao = (variacao: number) => {
    return `${variacao > 0 ? "+" : ""}${variacao.toFixed(1)}%`
  }

  const corVariacao = (variacao: number) => {
    return variacao > 0 ? "text-emerald-400" : "text-red-400"
  }

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/30 border-slate-700/50 shadow-xl">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-white text-base sm:text-lg">Comparativo: Mês Atual vs Anterior</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Entradas */}
          <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/20 to-emerald-900/5 p-4 sm:p-5">
            <div className="mb-4">
              <p className="text-emerald-400/80 text-xs sm:text-sm font-medium mb-1">Entradas</p>
              <div className="flex items-baseline gap-2">
                <p className="text-lg sm:text-2xl font-bold text-emerald-300">{formatarMoeda(comparacao.entradasAtual)}</p>
                <span className={`text-xs sm:text-sm font-semibold ${corVariacao(comparacao.variacaoEntradas)}`}>
                  {comparacao.variacaoEntradas > 0 ? <ArrowUpRight className="w-3 h-3 inline mr-1" /> : <ArrowDownLeft className="w-3 h-3 inline mr-1" />}
                  {formatarVariacao(comparacao.variacaoEntradas)}
                </span>
              </div>
              <p className="text-emerald-400/50 text-xs mt-2">{comparacao.mesAtualNome}</p>
            </div>
            <div className="pt-3 border-t border-emerald-500/20">
              <p className="text-emerald-400/60 text-xs">{comparacao.mesAnteriorNome}</p>
              <p className="text-emerald-300/80 font-semibold text-sm mt-1">{formatarMoeda(comparacao.entradasAnterior)}</p>
            </div>
          </div>

          {/* Saídas */}
          <div className="rounded-xl border border-red-500/30 bg-gradient-to-br from-red-900/20 to-red-900/5 p-4 sm:p-5">
            <div className="mb-4">
              <p className="text-red-400/80 text-xs sm:text-sm font-medium mb-1">Saídas</p>
              <div className="flex items-baseline gap-2">
                <p className="text-lg sm:text-2xl font-bold text-red-300">{formatarMoeda(comparacao.saidasAtual)}</p>
                <span className={`text-xs sm:text-sm font-semibold ${corVariacao(comparacao.variacaoSaidas)}`}>
                  {comparacao.variacaoSaidas > 0 ? <ArrowUpRight className="w-3 h-3 inline mr-1" /> : <ArrowDownLeft className="w-3 h-3 inline mr-1" />}
                  {formatarVariacao(comparacao.variacaoSaidas)}
                </span>
              </div>
              <p className="text-red-400/50 text-xs mt-2">{comparacao.mesAtualNome}</p>
            </div>
            <div className="pt-3 border-t border-red-500/20">
              <p className="text-red-400/60 text-xs">{comparacao.mesAnteriorNome}</p>
              <p className="text-red-300/80 font-semibold text-sm mt-1">{formatarMoeda(comparacao.saidasAnterior)}</p>
            </div>
          </div>

          {/* Saldo */}
          <div
            className={`rounded-xl border p-4 sm:p-5 bg-gradient-to-br ${
              comparacao.saldoAtual >= 0
                ? "border-cyan-500/30 from-cyan-900/20 to-cyan-900/5"
                : "border-orange-500/30 from-orange-900/20 to-orange-900/5"
            }`}
          >
            <div className="mb-4">
              <p className={`${comparacao.saldoAtual >= 0 ? "text-cyan-400/80" : "text-orange-400/80"} text-xs sm:text-sm font-medium mb-1`}>Saldo</p>
              <div className="flex items-baseline gap-2">
                <p className={`text-lg sm:text-2xl font-bold ${comparacao.saldoAtual >= 0 ? "text-cyan-300" : "text-orange-300"}`}>
                  {formatarMoeda(comparacao.saldoAtual)}
                </p>
                <span className={`text-xs sm:text-sm font-semibold ${corVariacao(comparacao.variacaoSaldo)}`}>
                  {comparacao.variacaoSaldo > 0 ? <ArrowUpRight className="w-3 h-3 inline mr-1" /> : <ArrowDownLeft className="w-3 h-3 inline mr-1" />}
                  {formatarVariacao(comparacao.variacaoSaldo)}
                </span>
              </div>
              <p className={`${comparacao.saldoAtual >= 0 ? "text-cyan-400/50" : "text-orange-400/50"} text-xs mt-2`}>{comparacao.mesAtualNome}</p>
            </div>
            <div className={`pt-3 border-t ${comparacao.saldoAtual >= 0 ? "border-cyan-500/20" : "border-orange-500/20"}`}>
              <p className={`${comparacao.saldoAtual >= 0 ? "text-cyan-400/60" : "text-orange-400/60"} text-xs`}>
                {comparacao.mesAnteriorNome}
              </p>
              <p className={`${comparacao.saldoAtual >= 0 ? "text-cyan-300/80" : "text-orange-300/80"} font-semibold text-sm mt-1`}>
                {formatarMoeda(comparacao.saldoAnterior)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
