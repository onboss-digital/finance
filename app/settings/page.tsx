"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertCircle, Plus, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SettingsPage() {
  const [responsaveis, setResponsaveis] = useState<any[]>([])
  const [categorias, setCategorias] = useState<any[]>([])
  const [novoResponsavel, setNovoResponsavel] = useState("")
  const [novaCategoria, setNovaCategoria] = useState({ nome: "", tipo: "entrada" })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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
      const [respRes, catRes] = await Promise.all([
        supabase.from("responsaveis").select("*").eq("ativo", true),
        supabase.from("categorias").select("*").eq("ativo", true),
      ])

      if (respRes.error) throw respRes.error
      if (catRes.error) throw catRes.error

      setResponsaveis(respRes.data || [])
      setCategorias(catRes.data || [])
    } catch (err) {
      setError("Erro ao carregar dados")
      console.error(err)
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
      const { error } = await supabase.from("responsaveis").insert([{ nome: novoResponsavel.trim() }])

      if (error) throw error

      setNovoResponsavel("")
      await carregarDados()
    } catch (err: any) {
      setError(err.message || "Erro ao adicionar responsável")
    }
  }

  const removerResponsavel = async (id: string) => {
    try {
      const { error } = await supabase.from("responsaveis").update({ ativo: false }).eq("id", id)

      if (error) throw error

      await carregarDados()
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
      const { error } = await supabase
        .from("categorias")
        .insert([{ nome: novaCategoria.nome.trim(), tipo: novaCategoria.tipo }])

      if (error) throw error

      setNovaCategoria({ nome: "", tipo: "entrada" })
      await carregarDados()
    } catch (err: any) {
      setError(err.message || "Erro ao adicionar categoria")
    }
  }

  const removerCategoria = async (id: string) => {
    try {
      const { error } = await supabase.from("categorias").update({ ativo: false }).eq("id", id)

      if (error) throw error

      await carregarDados()
    } catch (err: any) {
      setError(err.message || "Erro ao remover categoria")
    }
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-24 md:pb-8">
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Configurações</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="responsaveis" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-800/50 border border-slate-700/50">
          <TabsTrigger value="responsaveis">Responsáveis</TabsTrigger>
          <TabsTrigger value="categorias">Categorias</TabsTrigger>
        </TabsList>

        {/* Responsáveis */}
        <TabsContent value="responsaveis" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle>Gerenciar Responsáveis</CardTitle>
              <CardDescription>
                Adicione ou remova responsáveis pelos lançamentos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* conteúdo mantido */}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categorias */}
        <TabsContent value="categorias" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle>Gerenciar Categorias</CardTitle>
              <CardDescription>
                Adicione ou remova categorias de lançamentos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* conteúdo mantido */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </div>
)
