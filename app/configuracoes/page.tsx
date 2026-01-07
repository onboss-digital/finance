"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertCircle, Plus, Trash2, Users, Tag, SettingsIcon, Shield } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import TopNav from "@/components/top-nav"
import BottomNav from "@/components/bottom-nav"

export default function ConfiguracoesPage() {
  const [responsaveis, setResponsaveis] = useState<any[]>([])
  const [categorias, setCategorias] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [novoResponsavel, setNovoResponsavel] = useState("")
  const [novaCategoria, setNovaCategoria] = useState({ nome: "", tipo: "entrada" })
  const [novaTag, setNovaTag] = useState({ nome: "" })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      setLoading(true)
      setError("")
      const [respRes, catRes, tagRes] = await Promise.all([
        supabase.from("responsaveis").select("*").order("nome"),
        supabase.from("categorias").select("*").order("nome"),
        supabase.from("tags").select("*").order("nome"),
      ])

      if (respRes.error) throw respRes.error
      if (catRes.error) throw catRes.error
      if (tagRes.error) throw tagRes.error

      setResponsaveis(respRes.data || [])
      setCategorias(catRes.data || [])
      setTags(tagRes.data || [])
    } catch (err) {
      setError("Erro ao carregar dados do banco")
      console.error("[v0] Erro ao carregar:", err)
    } finally {
      setLoading(false)
    }
  }

  const adicionarResponsavel = async () => {
    if (!novoResponsavel.trim()) {
      setError("Digite um nome para o responsável")
      return
    }

    try {
      setError("")
      setSuccess("")
      const { error } = await supabase.from("responsaveis").insert([{ nome: novoResponsavel.trim() }])

      if (error) throw error

      setSuccess("Responsável adicionado com sucesso!")
      setNovoResponsavel("")
      await carregarDados()
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message || "Erro ao adicionar responsável")
    }
  }

  const removerResponsavel = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este responsável?")) return

    try {
      setError("")
      const { error } = await supabase.from("responsaveis").delete().eq("id", id)

      if (error) throw error

      setSuccess("Responsável removido com sucesso!")
      await carregarDados()
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message || "Erro ao remover responsável")
    }
  }

  const adicionarCategoria = async () => {
    if (!novaCategoria.nome.trim()) {
      setError("Digite um nome para a categoria")
      return
    }

    try {
      setError("")
      setSuccess("")
      const { error } = await supabase.from("categorias").insert([
        {
          nome: novaCategoria.nome.trim(),
          tipo: novaCategoria.tipo,
          descricao: "",
          ativo: true,
        },
      ])

      if (error) throw error

      setSuccess("Categoria adicionada com sucesso!")
      setNovaCategoria({ nome: "", tipo: "entrada" })
      await carregarDados()
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message || "Erro ao adicionar categoria")
    }
  }

  const removerCategoria = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover esta categoria?")) return

    try {
      setError("")
      const { error } = await supabase.from("categorias").delete().eq("id", id)

      if (error) throw error

      setSuccess("Categoria removida com sucesso!")
      await carregarDados()
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message || "Erro ao remover categoria")
    }
  }

  const adicionarTag = async () => {
    if (!novaTag.nome.trim()) {
      setError("Digite um nome para a tag")
      return
    }

    try {
      setError("")
      setSuccess("")
      const { error } = await supabase.from("tags").insert([{ nome: novaTag.nome.trim() }])

      if (error) throw error

      setSuccess("Tag adicionada com sucesso!")
      setNovaTag({ nome: "" })
      await carregarDados()
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message || "Erro ao adicionar tag")
    }
  }

  const removerTag = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover esta tag?")) return

    try {
      setError("")
      const { error } = await supabase.from("tags").delete().eq("id", id)

      if (error) throw error

      setSuccess("Tag removida com sucesso!")
      await carregarDados()
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message || "Erro ao remover tag")
    }
  }

  return (
    <>
      <TopNav />
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 pb-24 md:pb-8">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Header com ícone */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-linear-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
                <SettingsIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Configurações</h1>
                <p className="text-slate-400 text-sm mt-1">
                  Gerencie todos os aspectos do seu projeto de fluxo de caixa
                </p>
              </div>
            </div>
          </div>

          {/* Alertas de Sucesso/Erro */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 border-emerald-500/50 bg-emerald-500/10">
              <AlertCircle className="h-4 w-4 text-emerald-400" />
              <AlertDescription className="text-emerald-400">{success}</AlertDescription>
            </Alert>
          )}

          {/* Tabs principais */}
          <Tabs defaultValue="responsaveis" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-slate-800/50 border border-slate-700/50">
              <TabsTrigger value="responsaveis" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Responsáveis</span>
              </TabsTrigger>
              <TabsTrigger value="categorias" className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span className="hidden sm:inline">Categorias</span>
              </TabsTrigger>
              <TabsTrigger value="tags" className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-purple-400" />
                <span className="hidden sm:inline">Tags</span>
              </TabsTrigger>
              <TabsTrigger value="geral" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Geral</span>
              </TabsTrigger>
            </TabsList>

            {/* Aba: Responsáveis */}
            <TabsContent value="responsaveis" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    Gerenciar Responsáveis
                  </CardTitle>
                  <CardDescription>
                    Adicione pessoas responsáveis pelos lançamentos financeiros. Todos os dados são salvos no banco de
                    dados.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Formulário para adicionar */}
                  <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 space-y-4">
                    <h3 className="font-semibold text-white">Adicionar Novo Responsável</h3>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        placeholder="Ex: João Silva, Maria Santos, etc."
                        value={novoResponsavel}
                        onChange={(e) => setNovoResponsavel(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && adicionarResponsavel()}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                      />
                      <Button
                        onClick={adicionarResponsavel}
                        className="gap-2 whitespace-nowrap bg-cyan-600 hover:bg-cyan-700"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar
                      </Button>
                    </div>
                  </div>

                  {/* Lista de responsáveis */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-white text-sm uppercase tracking-wider">
                      Responsáveis Cadastrados ({responsaveis.length})
                    </h3>
                    {responsaveis.length === 0 ? (
                      <div className="p-6 text-center bg-slate-700/20 rounded-lg border border-dashed border-slate-600/50">
                        <Users className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
                        <p className="text-slate-400 text-sm">Nenhum responsável cadastrado ainda.</p>
                        <p className="text-slate-500 text-xs mt-1">Use o formulário acima para adicionar o primeiro.</p>
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        {responsaveis.map((resp) => (
                          <div
                            key={resp.id}
                            className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:border-slate-500/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                <Users className="w-4 h-4 text-cyan-400" />
                              </div>
                              <span className="text-slate-200 font-medium">{resp.nome}</span>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removerResponsavel(resp.id)}
                              className="gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Remover</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba: Categorias */}
            <TabsContent value="categorias" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-emerald-400" />
                    Gerenciar Categorias
                  </CardTitle>
                  <CardDescription>
                    Crie categorias para classificar suas entradas e saídas. Todos os dados são salvos no banco de
                    dados.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Formulário para adicionar */}
                  <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 space-y-4">
                    <h3 className="font-semibold text-white">Adicionar Nova Categoria</h3>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                          placeholder="Ex: Vendas, Salários, Aluguel, etc."
                          value={novaCategoria.nome}
                          onChange={(e) => setNovaCategoria({ ...novaCategoria, nome: e.target.value })}
                          onKeyPress={(e) => e.key === "Enter" && adicionarCategoria()}
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                        />
                        <select
                          value={novaCategoria.tipo}
                          onChange={(e) => setNovaCategoria({ ...novaCategoria, tipo: e.target.value })}
                          className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-md text-slate-200 hover:border-slate-500"
                        >
                          <option value="entrada">📥 Entrada</option>
                          <option value="saida">📤 Saída</option>
                        </select>
                        <Button
                          onClick={adicionarCategoria}
                          className="gap-2 whitespace-nowrap bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Plus className="w-4 h-4" />
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Categorias por tipo */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Entradas */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-emerald-400 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        Categorias de Entrada ({categorias.filter((c) => c.tipo === "entrada").length})
                      </h3>
                      <div className="space-y-2">
                        {categorias.filter((c) => c.tipo === "entrada").length === 0 ? (
                          <div className="p-4 text-center bg-slate-700/20 rounded-lg border border-dashed border-slate-600/50">
                            <p className="text-slate-400 text-sm">Nenhuma categoria cadastrada</p>
                          </div>
                        ) : (
                          categorias
                            .filter((cat) => cat.tipo === "entrada")
                            .map((cat) => (
                              <div
                                key={cat.id}
                                className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:border-slate-500/50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: cat.cor || "#10b981" }}
                                  ></div>
                                  <span className="text-slate-200">{cat.nome}</span>
                                </div>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removerCategoria(cat.id)}
                                  className="gap-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))
                        )}
                      </div>
                    </div>

                    {/* Saídas */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-red-400 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        Categorias de Saída ({categorias.filter((c) => c.tipo === "saida").length})
                      </h3>
                      <div className="space-y-2">
                        {categorias.filter((c) => c.tipo === "saida").length === 0 ? (
                          <div className="p-4 text-center bg-slate-700/20 rounded-lg border border-dashed border-slate-600/50">
                            <p className="text-slate-400 text-sm">Nenhuma categoria cadastrada</p>
                          </div>
                        ) : (
                          categorias
                            .filter((cat) => cat.tipo === "saida")
                            .map((cat) => (
                              <div
                                key={cat.id}
                                className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:border-slate-500/50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: cat.cor || "#ef4444" }}
                                  ></div>
                                  <span className="text-slate-200">{cat.nome}</span>
                                </div>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removerCategoria(cat.id)}
                                  className="gap-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba: Tags */}
            <TabsContent value="tags" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-purple-400" />
                    Gerenciar Produtos/Projetos
                  </CardTitle>
                  <CardDescription>
                    Crie tags para separar e analisar seus produtos/projetos. Cada lançamento pode ser associado a um
                    produto específico.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Formulário para adicionar */}
                  <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 space-y-4">
                    <h3 className="font-semibold text-white">Adicionar Novo Produto/Projeto</h3>
                    <div className="flex flex-col gap-2">
                      <Input
                        placeholder="Ex: SnapHubb, Lumpic, etc."
                        value={novaTag.nome}
                        onChange={(e) => setNovaTag({ ...novaTag, nome: e.target.value })}
                        onKeyPress={(e) => e.key === "Enter" && adicionarTag()}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                      />
                      <Button onClick={adicionarTag} className="gap-2 bg-purple-600 hover:bg-purple-700">
                        <Plus className="w-4 h-4" />
                        Adicionar
                      </Button>
                    </div>
                  </div>

                  {/* Lista de tags */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-white text-sm uppercase tracking-wider">
                      Produtos/Projetos Cadastrados ({tags.length})
                    </h3>
                    {tags.length === 0 ? (
                      <div className="p-6 text-center bg-slate-700/20 rounded-lg border border-dashed border-slate-600/50">
                        <Tag className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
                        <p className="text-slate-400 text-sm">Nenhuma tag cadastrada ainda.</p>
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        {tags.map((tag) => (
                          <div
                            key={tag.id}
                            className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:border-slate-500/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: tag.cor || "#06b6d4" }}
                              ></div>
                              <span className="text-slate-200 font-medium">{tag.nome}</span>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removerTag(tag.id)}
                              className="gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba: Configurações Gerais */}
            <TabsContent value="geral" className="space-y-6">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    Configurações Gerais
                  </CardTitle>
                  <CardDescription>Ajustes gerais do projeto</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                    <h3 className="font-semibold text-white mb-2">Status do Projeto</h3>
                    <div className="space-y-2 text-sm text-slate-300">
                      <div className="flex justify-between">
                        <span>Responsáveis cadastrados:</span>
                        <span className="font-semibold text-cyan-400">{responsaveis.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Categorias cadastradas:</span>
                        <span className="font-semibold text-emerald-400">{categorias.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tags cadastradas:</span>
                        <span className="font-semibold text-purple-400">{tags.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Banco de Dados:</span>
                        <span className="font-semibold text-emerald-400">Conectado (Supabase)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <BottomNav />
    </>
  )
}
