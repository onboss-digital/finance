"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trash2, Plus, Edit2, Layers } from "lucide-react"

export default function GerenciarTags() {
  const [tags, setTags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    nome: "",
    cor: "#06b6d4",
    ativo: true,
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    carregarTags()
  }, [])

  const carregarTags = async () => {
    try {
      const { data, error } = await supabase.from("tags").select("*").order("nome")
      if (error) throw error
      setTags(data || [])
    } catch (error) {
      console.error("Erro ao carregar tags:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ nome: "", cor: "#06b6d4", ativo: true })
    setEditingId(null)
  }

  const adicionarTag = async () => {
    if (!formData.nome.trim()) return

    try {
      const { error } = await supabase.from("tags").insert([formData])
      if (error) throw error
      resetForm()
      setOpenAdd(false)
      await carregarTags()
    } catch (error) {
      console.error("Erro ao adicionar tag:", error)
    }
  }

  const abrirEdicao = (tag: any) => {
    setFormData(tag)
    setEditingId(tag.id)
    setOpenEdit(true)
  }

  const atualizarTag = async () => {
    if (!editingId || !formData.nome.trim()) return

    try {
      const { error } = await supabase.from("tags").update(formData).eq("id", editingId)
      if (error) throw error
      resetForm()
      setOpenEdit(false)
      await carregarTags()
    } catch (error) {
      console.error("Erro ao atualizar tag:", error)
    }
  }

  const deletarTag = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja deletar esta tag?")) return

    try {
      const { error } = await supabase.from("tags").delete().eq("id", id)
      if (error) throw error
      await carregarTags()
    } catch (error) {
      console.error("Erro ao deletar tag:", error)
    }
  }

  const cores = [
    "#06b6d4", // cyan
    "#10b981", // emerald
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
            <Layers className="w-5 h-5 text-pink-400" />
            <CardTitle className="text-white">Tags/Projetos</CardTitle>
          </div>
          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
              <Button className="bg-pink-600 hover:bg-pink-700">
                <Plus className="w-4 h-4 mr-2" />
                Nova Tag
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">Adicionar Tag</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300 block mb-2">Nome *</label>
                  <Input
                    placeholder="Ex: Projeto A"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
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

                <Button onClick={adicionarTag} className="w-full bg-pink-600 hover:bg-pink-700">
                  Adicionar Tag
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
            {tags.length === 0 ? (
              <p className="text-gray-400">Nenhuma tag cadastrada</p>
            ) : (
              tags.map((tag) => (
                <div key={tag.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: tag.cor }}></div>
                    <div>
                      <p className="text-white font-medium">{tag.nome}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog open={openEdit && editingId === tag.id} onOpenChange={(open) => !open && resetForm()}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => abrirEdicao(tag)}
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-white">Editar Tag</DialogTitle>
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
                            <label className="text-sm text-gray-300 block mb-2">Cor</label>
                            <Input
                              type="color"
                              value={formData.cor}
                              onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                              className="h-10 bg-slate-800 border-slate-700"
                            />
                          </div>

                          <Button onClick={atualizarTag} className="w-full bg-blue-600 hover:bg-blue-700">
                            Salvar Alterações
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deletarTag(tag.id)}
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
