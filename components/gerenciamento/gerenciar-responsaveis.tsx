"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trash2, Plus, Edit2, Users } from "lucide-react"

export default function GerenciarResponsaveis() {
  const [responsaveis, setResponsaveis] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    carregarResponsaveis()
  }, [])

  const carregarResponsaveis = async () => {
    try {
      const { data, error } = await supabase.from("responsaveis").select("*").order("nome")
      if (error) throw error
      setResponsaveis(data || [])
    } catch (error) {
      console.error("Erro ao carregar responsáveis:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ nome: "", email: "" })
    setEditingId(null)
  }

  const adicionarResponsavel = async () => {
    if (!formData.nome.trim()) return

    try {
      const { error } = await supabase.from("responsaveis").insert([formData])
      if (error) throw error
      resetForm()
      setOpenAdd(false)
      await carregarResponsaveis()
    } catch (error) {
      console.error("Erro ao adicionar responsável:", error)
    }
  }

  const abrirEdicao = (responsavel: any) => {
    setFormData(responsavel)
    setEditingId(responsavel.id)
    setOpenEdit(true)
  }

  const atualizarResponsavel = async () => {
    if (!editingId || !formData.nome.trim()) return

    try {
      const { error } = await supabase.from("responsaveis").update(formData).eq("id", editingId)
      if (error) throw error
      resetForm()
      setOpenEdit(false)
      await carregarResponsaveis()
    } catch (error) {
      console.error("Erro ao atualizar responsável:", error)
    }
  }

  const deletarResponsavel = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja deletar este responsável?")) return

    try {
      const { error } = await supabase.from("responsaveis").delete().eq("id", id)
      if (error) throw error
      await carregarResponsaveis()
    } catch (error) {
      console.error("Erro ao deletar responsável:", error)
    }
  }


  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-cyan-400" />
            <CardTitle className="text-white">Responsáveis</CardTitle>
          </div>
          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Responsável
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">Adicionar Responsável</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300 block mb-2">Nome *</label>
                  <Input
                    placeholder="Ex: Maria Silva"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 block mb-2">Email (Opcional)</label>
                  <Input
                    type="email"
                    placeholder="maria@empresa.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <Button onClick={adicionarResponsavel} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Adicionar Responsável
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
            {responsaveis.length === 0 ? (
              <p className="text-gray-400">Nenhum responsável cadastrado</p>
            ) : (
              responsaveis.map((resp) => (
                <div key={resp.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <div className="flex-1">
                    <p className="text-white font-medium">{resp.nome}</p>
                    {resp.email && <p className="text-xs text-gray-400">{resp.email}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Dialog open={openEdit && editingId === resp.id} onOpenChange={(open) => !open && resetForm()}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => abrirEdicao(resp)}
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-white">Editar Responsável</DialogTitle>
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
                            <label className="text-sm text-gray-300 block mb-2">Email (Opcional)</label>
                            <Input
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="bg-slate-800 border-slate-700 text-white"
                            />
                          </div>
                          <Button onClick={atualizarResponsavel} className="w-full bg-blue-600 hover:bg-blue-700">
                            Salvar Alterações
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deletarResponsavel(resp.id)}
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
