"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Tag, Target, Layers } from "lucide-react"
import GerenciarResponsaveis from "@/components/gerenciamento/gerenciar-responsaveis"
import GerenciarCategorias from "@/components/gerenciamento/gerenciar-categorias"
import GerenciarMetas from "@/components/gerenciamento/gerenciar-metas"
import GerenciarTags from "@/components/gerenciamento/gerenciar-tags"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 pb-24 md:pb-8">
      {/* Background glow effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Painel Administrativo</h1>
          <p className="text-slate-400 text-sm sm:text-base">Gerencie responsáveis, categorias e configurações do sistema</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="responsaveis" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6 sm:mb-8 bg-gradient-to-br from-slate-800/50 to-slate-900/30 border border-slate-700/50 backdrop-blur-xl p-1 rounded-lg">
            <TabsTrigger value="responsaveis" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm rounded-md">
              <Users className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Responsáveis</span>
            </TabsTrigger>
            <TabsTrigger value="categorias" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm rounded-md">
              <Tag className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Categorias</span>
            </TabsTrigger>
            <TabsTrigger value="metas" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm rounded-md">
              <Target className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Metas</span>
            </TabsTrigger>
            <TabsTrigger value="tags" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm rounded-md">
              <Layers className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Tags</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="responsaveis" className="space-y-4 sm:space-y-6">
            <GerenciarResponsaveis />
          </TabsContent>

          <TabsContent value="categorias" className="space-y-4 sm:space-y-6">
            <GerenciarCategorias />
          </TabsContent>

          <TabsContent value="metas" className="space-y-4 sm:space-y-6">
            <GerenciarMetas />
          </TabsContent>

          <TabsContent value="tags" className="space-y-4 sm:space-y-6">
            <GerenciarTags />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
