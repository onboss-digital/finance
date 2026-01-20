"use client"

import { useEffect, useState } from "react"
import { getBrowserClient } from "@/lib/supabase-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trash2, Plus, Edit2, Target } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function GerenciarMetas() {
  const [metas, setMetas] = useState<any[]>([])
  const [categorias, setCategorias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    categoria_id: "",
    tipo: "entrada",
    valor_meta: "",
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
  })

  const supabase = getBrowserClient()

  if (!supabase) {
    return <div>Erro: Configuração não disponível</div>
  }

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      const { data: metasData, error: metasError } = await supabase
        .from("metas")
        .select("*, categorias(nome, tipo)")
        .order("mes", { ascending: false })
      if (metasError) throw metasError
      setMetas(metasData || [])

      const { data: categoriasData, error: categoriasError } = await supabase
        .from("categorias")
        .select("*")
        .order("nome")
      if (categoriasError) throw categoriasError
      setCategorias(categoriasData || [])
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      categoria_id: "",
      tipo: "entrada",
      valor_meta: "",
      mes: new Date().getMonth() + 1,
      ano: new Date().getFullYear(),
    })
    setEditingId(null)
  }

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

  const handleValorMetaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBRL(e.target.value)
    setFormData({ ...formData, valor_meta: formatted })
  }

  const adicionarMeta = async () => {
    if (!formData.categoria_id || !formData.valor_meta) return

    try {
      const { error } = await supabase.from("metas").insert([
        {
          ...formData,
          valor_meta: parseFloat(formData.valor_meta.replace(/\./g, "").replace(",", ".")),
        },
      ])
      if (error) throw error
      resetForm()
      setOpenAdd(false)
      await carregarDados()
    } catch (error) {
      console.error("Erro ao adicionar meta:", error)
    }
  }

  const abrirEdicao = (meta: any) => {
    setFormData({
      categoria_id: meta.categoria_id,
      tipo: meta.tipo,
      valor_meta: meta.valor_meta,
      mes: meta.mes || new Date().getMonth() + 1,
      ano: meta.ano || new Date().getFullYear(),
    })
    setEditingId(meta.id)
    setOpenEdit(true)
  }

  const atualizarMeta = async () => {
    if (!editingId || !formData.categoria_id || !formData.valor_meta) return

    try {
      const { error } = await supabase.from("metas").update({
        ...formData,
        valor_meta: parseFloat(formData.valor_meta.replace(/\./g, "").replace(",", ".")),
      }).eq("id", editingId)
      if (error) throw error
      resetForm()
      setOpenEdit(false)
      await carregarDados()
    } catch (error) {
      console.error("Erro ao atualizar meta:", error)
    }
  }

  const deletarMeta = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja deletar esta meta?")) return

    try {
      const { error } = await supabase.from("metas").delete().eq("id", id)
      if (error) throw error
      await carregarDados()
    } catch (error) {
      console.error("Erro ao deletar meta:", error)
    }
  }

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

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-amber-400" />
            <CardTitle className="text-white">Metas</CardTitle>
          </div>
          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700">
                <Plus className="w-4 h-4 mr-2" />
                Nova Meta
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">Adicionar Meta</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300 block mb-2">Categoria *</label>
                  <Select value={formData.categoria_id} onValueChange={(v) => setFormData({ ...formData, categoria_id: v })}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Selecione categoria" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {categorias.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id} className="text-white">
                          {cat.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-300 block mb-2">Valor Meta (R$) *</label>
                  <Input
                    type="text"
                    placeholder="0,00"
                    value={formData.valor_meta}
                    onChange={handleValorMetaChange}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300 block mb-2">Mês</label>
                  <Select value={formData.mes.toString()} onValueChange={(v) => setFormData({ ...formData, mes: parseInt(v) })}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {meses.map((m) => (
                        <SelectItem key={m.valor} value={m.valor.toString()} className="text-white">
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-300 block mb-2">Ano</label>
                  <Input
                    type="number"
                    placeholder="2026"
                    value={formData.ano}
                    onChange={(e) => setFormData({ ...formData, ano: parseInt(e.target.value) })}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <Button onClick={adicionarMeta} className="w-full bg-amber-600 hover:bg-amber-700">
                  Adicionar Meta
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-gray-400">Carregando...</p>
        ) : (
          <div className="space-y-2">
            {metas.length === 0 ? (
              <p className="text-gray-400">Nenhuma meta cadastrada</p>
            ) : (
              metas.map((meta) => (
                <div key={meta.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <div className="flex-1">
                    <p className="text-white font-medium">{meta.categorias?.nome}</p>
                    <p className="text-xs text-gray-400">
                      {meta.valor_meta?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} • {meta.mes}/{meta.ano}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Dialog open={openEdit && editingId === meta.id} onOpenChange={(open) => !open && resetForm()}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => abrirEdicao(meta)}
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-white">Editar Meta</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-300 block mb-2">Categoria *</label>
                            <Select value={formData.categoria_id} onValueChange={(v) => setFormData({ ...formData, categoria_id: v })}>
                              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 border-slate-700">
                                {categorias.map((cat) => (
                                  <SelectItem key={cat.id} value={cat.id} className="text-white">
                                    {cat.nome}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="text-sm text-gray-300 block mb-2">Valor Meta (R$) *</label>
                            <Input
                              type="text"
                              value={formData.valor_meta}
                              onChange={handleValorMetaChange}
                              className="bg-slate-800 border-slate-700 text-white"
                            />
                          </div>

                          <div>
                            <label className="text-sm text-gray-300 block mb-2">Mês</label>
                            <Select value={formData.mes.toString()} onValueChange={(v) => setFormData({ ...formData, mes: parseInt(v) })}>
                              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 border-slate-700">
                                {meses.map((m) => (
                                  <SelectItem key={m.valor} value={m.valor.toString()} className="text-white">
                                    {m.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="text-sm text-gray-300 block mb-2">Ano</label>
                            <Input
                              type="number"
                              value={formData.ano}
                              onChange={(e) => setFormData({ ...formData, ano: parseInt(e.target.value) })}
                              className="bg-slate-800 border-slate-700 text-white"
                            />
                          </div>

                          <Button onClick={atualizarMeta} className="w-full bg-blue-600 hover:bg-blue-700">
                            Salvar Alterações
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deletarMeta(meta.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
