"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useSupabaseData } from "@/hooks/use-supabase-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowUpRight, ArrowDownLeft, CheckCircle2 } from "lucide-react"

interface LancamentosFormProps {
  onSucesso: () => void
}

export default function LancamentosForm({ onSucesso }: LancamentosFormProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { categorias, responsaveis, tags, categoriasEntrada, categoriasSaida } = useSupabaseData()
  
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split("T")[0],
    tipo: "entrada",
    categoria_id: "",
    descricao: "",
    responsavel_id: "",
    valor: "",
    status: "pago",
    tag_id: "",
  })

  // Formatar valor em BRL
  const formatBRL = (value: string) => {
    const numValue = value.replace(/\D/g, "")
    if (!numValue) return ""
    const asNumber = parseInt(numValue, 10) / 100
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(asNumber)
  }

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBRL(e.target.value)
    setFormData({ ...formData, valor: formatted })
  }

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  // Definir categoria padrão quando categorias são carregadas
  useEffect(() => {
    if (categoriasEntrada.length > 0 && !formData.categoria) {
      setFormData((prev) => ({
        ...prev,
        categoria: categoriasEntrada[0].nome,
      }))
    }
  }, [categoriasEntrada])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.descricao || !formData.valor || !formData.responsavel_id || !formData.categoria_id) {
      alert("Preencha todos os campos obrigatórios")
      return
    }

    try {
      setLoading(true)
      const data = new Date(formData.data)
      const mes = data.getMonth() + 1
      const ano = data.getFullYear()

      // Converter valor BRL para número
      const valorNumero = parseFloat(formData.valor.replace(/\./g, "").replace(",", "."))

      const { error } = await supabase.from("lancamentos").insert([
        {
          data: formData.data,
          mes,
          ano,
          tipo: formData.tipo,
          categoria_id: formData.categoria_id,
          responsavel_id: formData.responsavel_id,
          descricao: formData.descricao,
          valor: valorNumero,
          status: formData.status,
          tag_id: formData.tag_id || null,
        },
      ])

      if (error) throw error

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)

      setFormData({
        data: new Date().toISOString().split("T")[0],
        tipo: "entrada",
        categoria_id: "",
        descricao: "",
        responsavel_id: "",
        valor: "",
        status: "pago",
        tag_id: "",
      })
      onSucesso()
    } catch (error) {
      alert("Erro ao registrar lançamento")
    } finally {
      setLoading(false)
    }
  }

  const categoriasAtual = formData.tipo === "entrada" ? categoriasEntrada : categoriasSaida

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-8">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-3 sm:px-4">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-cyan-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                {formData.tipo === "entrada" ? (
                  <ArrowUpRight className="w-5 h-5 text-white" />
                ) : (
                  <ArrowDownLeft className="w-5 h-5 text-white" />
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Novo Lançamento</h2>
            </div>
            <p className="text-slate-400 text-sm ml-13">Registre uma nova movimentação financeira</p>
          </div>

          {/* Success message */}
          {success && (
            <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm sm:text-base">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>Lançamento registrado com sucesso!</span>
            </div>
          )}

          {/* Form Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Data */}
            <div className="space-y-2">
              <Label htmlFor="data" className="text-slate-300 font-medium text-sm">
                Data *
              </Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/20 h-10 text-sm rounded-lg"
              />
            </div>

            {/* Tipo */}
            <div className="space-y-2">
              <Label htmlFor="tipo" className="text-slate-300 font-medium text-sm">
                Tipo *
              </Label>
              <Select
                value={formData.tipo}
                onValueChange={(v) =>
                  setFormData({
                    ...formData,
                    tipo: v,
                    categoria_id: "",
                  })
                }
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-white text-sm rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="entrada" className="text-white">
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                      Entrada
                    </div>
                  </SelectItem>
                  <SelectItem value="saida" className="text-white">
                    <div className="flex items-center gap-2">
                      <ArrowDownLeft className="w-4 h-4 text-red-400" />
                      Saída
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <Label htmlFor="categoria" className="text-slate-300 font-medium text-sm">
                Categoria *
              </Label>
              <Select value={formData.categoria_id} onValueChange={(v) => setFormData({ ...formData, categoria_id: v })}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-white text-sm rounded-lg">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {categoriasAtual.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id} className="text-white text-sm">
                      {cat.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Responsável */}
            <div className="space-y-2">
              <Label htmlFor="responsavel" className="text-slate-300 font-medium text-sm">
                Responsável *
              </Label>
              <Select value={formData.responsavel_id} onValueChange={(v) => setFormData({ ...formData, responsavel_id: v })}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-white text-sm rounded-lg">
                  <SelectValue placeholder="Responsável" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {responsaveis.map((resp) => (
                    <SelectItem key={resp.id} value={resp.id} className="text-white text-sm">
                      {resp.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Valor */}
            <div className="space-y-2">
              <Label htmlFor="valor" className="text-slate-300 font-medium text-sm">
                Valor (R$) *
              </Label>
              <Input
                id="valor"
                type="text"
                placeholder="0,00"
                value={formData.valor}
                onChange={handleValorChange}
                className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/20 h-10 text-sm rounded-lg"
              />
            </div>

            {/* Status de Pagamento */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-slate-300 font-medium text-sm">
                Status de Pagamento
              </Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-white text-sm rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="pago" className="text-white text-sm">
                    Pago
                  </SelectItem>
                  <SelectItem value="pendente" className="text-white text-sm">
                    Pendente
                  </SelectItem>
                  <SelectItem value="cancelado" className="text-white text-sm">
                    Cancelado
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tag/Produto */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="tag" className="text-slate-300 font-medium text-sm">
                Produto/Projeto
              </Label>
              <Select value={formData.tag_id} onValueChange={(v) => setFormData({ ...formData, tag_id: v })}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700/50 text-white text-sm rounded-lg">
                  <SelectValue placeholder="Produto/Projeto" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {tags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id} className="text-white text-sm">
                      {tag.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="descricao" className="text-slate-300 font-medium text-sm">
              Descrição *
            </Label>
            <Input
              id="descricao"
              type="text"
              placeholder="Descrição detalhada do lançamento"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:ring-cyan-500/20 h-10 text-sm rounded-lg"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-base"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Registrando...
              </>
            ) : (
              "Registrar Lançamento"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
