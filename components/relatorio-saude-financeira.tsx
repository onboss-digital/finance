"use client"

import { useMemo } from "react"
import { AlertCircle, Info, TrendingUp, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Lancamento {
  tipo: string
  valor: number
  data: string
}

interface Meta {
  tipo: string
  valor_meta: number
  mes: number
  ano: number
}

export default function RelatorioSaudeFincanceira({
  dados = [],
  metas = [],
}: {
  dados?: Lancamento[]
  metas?: Meta[]
}) {
  const analise = useMemo(() => {
    const entradas = (dados || []).filter((d) => d.tipo === "entrada").reduce((sum, d) => sum + d.valor, 0)
    const saidas = (dados || []).filter((d) => d.tipo === "saida").reduce((sum, d) => sum + d.valor, 0)
    const saldo = entradas - saidas

    // Calcular despesa diária média
    const diasUnicos = new Set((dados || []).map((d) => new Date(d.data).toDateString())).size || 1
    const despesaDiaria = saidas / Math.max(diasUnicos, 1)

    // Cash Runway - quantos meses o saldo cobre as despesas
    const despesaMensal = despesaDiaria * 30
    let cashRunway = 0
    if (despesaMensal > 0 && saldo > 0) {
      cashRunway = saldo / despesaMensal
    }

    // Cobertura - percentual do saldo em relação às despesas mensais
    let cobertura = 0
    if (despesaMensal > 0) {
      cobertura = (saldo / despesaMensal) * 100
    }

    // Status de saúde
    let status = "🟢 Caixa Saudável"
    let statusCor = "text-emerald-400"
    if (cobertura < 50) {
      status = "🔴 Caixa Crítico"
      statusCor = "text-red-400"
    } else if (cobertura < 100) {
      status = "🟡 Caixa Atenção"
      statusCor = "text-amber-400"
    }

    // Meta vs Realizado
    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()
    const metasDoMes = (metas || []).filter((m) => m.mes === currentMonth && m.ano === currentYear)

    const entradaMetaDoMes = metasDoMes.find((m) => m.tipo === "entrada")?.valor_meta || 0
    const saidaMetaDoMes = metasDoMes.find((m) => m.tipo === "saida")?.valor_meta || 0

    const progEntrada = entradaMetaDoMes > 0 ? (entradas / entradaMetaDoMes) * 100 : 0
    const progSaida = saidaMetaDoMes > 0 ? (saidas / saidaMetaDoMes) * 100 : 0

    return {
      entradas,
      saidas,
      saldo,
      despesaDiaria,
      despesaMensal,
      cashRunway,
      cobertura,
      status,
      statusCor,
      progEntrada,
      progSaida,
      entradaMetaDoMes,
      saidaMetaDoMes,
    }
  }, [dados, metas])

  return (
    <div className="space-y-6">
      {/* Indicadores Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cash Runway */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Cash Runway
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white mb-1">
              {analise.despesaMensal > 0 && analise.saldo > 0
                ? analise.cashRunway.toFixed(1)
                : analise.despesaMensal === 0
                  ? "∞"
                  : "0"}
            </p>
            <p className="text-xs text-gray-400">
              {analise.despesaMensal > 0
                ? "meses de despesa cobertos"
                : analise.saldo > 0
                  ? "(sem despesas registradas)"
                  : "(saldo negativo)"}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Despesa diária: {analise.despesaDiaria.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
          </CardContent>
        </Card>

        {/* Cobertura */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Cobertura
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white mb-1">
              {analise.despesaMensal > 0 ? analise.cobertura.toFixed(0) : "∞"}%
            </p>
            <p className="text-xs text-gray-400">do saldo cobre despesas mensais</p>
            <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
              <div
                className={`h-2 rounded-full transition-all ${
                  analise.cobertura >= 100
                    ? "bg-emerald-500"
                    : analise.cobertura >= 50
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
                style={{ width: Math.min(analise.cobertura, 100) + "%" }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-400">Status do Caixa</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${analise.statusCor}`}>{analise.status}</p>
            <p className="text-xs text-gray-400 mt-2">
              Saldo: {analise.saldo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
            {analise.saldo < 0 && <p className="text-xs text-red-400 mt-1">⚠️ Saldo negativo!</p>}
          </CardContent>
        </Card>
      </div>

      {/* Progresso vs Metas */}
      {(analise.entradaMetaDoMes > 0 || analise.saidaMetaDoMes > 0) && (
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-sm text-gray-400">Progresso vs Metas (Este Mês)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analise.entradaMetaDoMes > 0 && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-300">Entradas</span>
                  <span className="text-sm font-semibold text-emerald-400">
                    {analise.progEntrada.toFixed(0)}% de {analise.entradaMetaDoMes.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-emerald-500 transition-all"
                    style={{ width: Math.min(analise.progEntrada, 100) + "%" }}
                  ></div>
                </div>
              </div>
            )}
            {analise.saidaMetaDoMes > 0 && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-300">Saídas</span>
                  <span className="text-sm font-semibold text-red-400">
                    {analise.progSaida.toFixed(0)}% de {analise.saidaMetaDoMes.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-red-500 transition-all"
                    style={{ width: Math.min(analise.progSaida, 100) + "%" }}
                  ></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Banner Educativo */}
      <Card className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-cyan-700/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-cyan-300 flex items-center gap-2">
            <Info className="w-4 h-4" />
            O que significam estes indicadores?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs text-gray-300">
          <div>
            <p className="font-semibold text-cyan-300 mb-1">💰 Cash Runway</p>
            <p>Por quanto tempo seu saldo cobre as despesas mensais. Ex: 2 meses significa que você pode manter as despesas atuais por 2 meses com o saldo atual.</p>
          </div>
          <div>
            <p className="font-semibold text-cyan-300 mb-1">📊 Cobertura</p>
            <p>Percentual do saldo em relação às despesas mensais. 200% = saldo cobre 2 meses de despesas. Valores acima de 100% indicam boa saúde financeira.</p>
          </div>
          <div>
            <p className="font-semibold text-cyan-300 mb-1">🎯 Status do Caixa</p>
            <p className="space-y-1">
              <span className="block">🟢 Saudável: Cobertura ≥ 100% (mais de 1 mês de despesas)</span>
              <span className="block">🟡 Atenção: Cobertura 50-100% (menos de 1 mês)</span>
              <span className="block">🔴 Crítico: Cobertura &lt; 50% (menos de 15 dias)</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
