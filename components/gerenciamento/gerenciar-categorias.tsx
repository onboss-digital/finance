"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trash2, Plus, Edit2, Tag } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function GerenciarCategorias() {
  const [categorias, setCategorias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    nome: "",
    tipo: "entrada",
    cor: "#10b981",
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    carregarCategorias()
  }, [])

  const carregarCategorias = async () => {
    try {
      const { data, error } = await supabase.from("categorias").select("*").order("nome")
      if (error) throw error
      setCategorias(data || [])
    } catch (error) {
      console.error("Erro ao carregar categorias:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ nome: "", tipo: "entrada", cor: "#10b981" })
    setEditingId(null)
  }

  const adicionarCategoria = async () => {
    if (!formData.nome.trim()) return

    try {
      const { error } = await supabase.from("categorias").insert([formData])
      if (error) throw error
      resetForm()
      setOpenAdd(false)
      await carregarCategorias()
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error)
    }
  }

  const abrirEdicao = (categoria: any) => {
    setFormData(categoria)
    setEditingId(categoria.id)
    setOpenEdit(true)
  }

  const atualizarCategoria = async () => {
    if (!editingId || !formData.nome.trim()) return

    try {
      const { error } = await supabase.from("categorias").update(formData).eq("id", editingId)
      if (error) throw error
      resetForm()
      setOpenEdit(false)
      await carregarCategorias()
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error)
    }
  }

  const deletarCategoria = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja deletar esta categoria?")) return

    try {
      const { error } = await supabase.from("categorias").delete().eq("id", id)
      if (error) throw error
      await carregarCategorias()
    } catch (error) {
      console.error("Erro ao deletar categoria:", error)
    }
  }

  const cores = [
    "#10b981", // emerald
    "#06b6d4", // cyan
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#f97316", // orange
    "#6366f1", // indigo
  ]


  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Tag className="w-5 h-5 text-emerald-400" />
            <CardTitle className="text-white">Categorias</CardTitle>
          </div>
          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
              <Button className="bg-cyan-600 hover:bg-cyan-700">
                <Plus className="w-4 h-4 mr-2" />
                Nova Categoria
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">Adicionar Categoria</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300 block mb-2">Nome *</label>
                  <Input
                    placeholder="Ex: Vendas"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300 block mb-2">Tipo *</label>
                  <Select value={formData.tipo} onValueChange={(v) => setFormData({ ...formData, tipo: v })}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="entrada" className="text-white">
                        Entrada (Receita)
                      </SelectItem>
                      <SelectItem value="saida" className="text-white">
                        Saída (Despesa)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-300 block mb-2">Cor</label>
                  <Input
                    type="color"
                    value={formData.cor}
                    onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                    className="h-10 bg-slate-800 border-slate-700"
                  />
                </div>

                <Button onClick={adicionarCategoria} className="w-full bg-cyan-600 hover:bg-cyan-700">
                  Adicionar Categoria
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
            {categorias.length === 0 ? (
              <p className="text-gray-400">Nenhuma categoria cadastrada</p>
            ) : (
              categorias.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: cat.cor }}></div>
                    <div>
                      <p className="text-white font-medium">{cat.nome}</p>
                      <p className="text-xs text-gray-400">{cat.tipo === "entrada" ? "Receita" : "Despesa"}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog open={openEdit && editingId === cat.id} onOpenChange={(open) => !open && resetForm()}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => abrirEdicao(cat)}
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-white">Editar Categoria</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-300 block mb-2">Nome *</label>
                            <Input
                              value={formData.nome}
                              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                              className="bg-slate-800 border-slate-700 text-white"
                            />
                          </div>

                          <div>
                            <label className="text-sm text-gray-300 block mb-2">Tipo *</label>
                            <Select value={formData.tipo} onValueChange={(v) => setFormData({ ...formData, tipo: v })}>
                              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 border-slate-700">
                                <SelectItem value="entrada" className="text-white">
                                  Entrada (Receita)
                                </SelectItem>
                                <SelectItem value="saida" className="text-white">
                                  Saída (Despesa)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="text-sm text-gray-300 block mb-2">Cor</label>
                            <Input
                              type="color"
                              value={formData.cor}
                              onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                              className="h-10 bg-slate-800 border-slate-700"
                            />
                          </div>

                          <Button onClick={atualizarCategoria} className="w-full bg-blue-600 hover:bg-blue-700">
                            Salvar Alterações
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deletarCategoria(cat.id)}
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
