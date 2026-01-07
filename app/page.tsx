"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import DashboardModerno from "@/components/dashboard-moderno"
import WelcomeLoader from "@/components/welcome-loader"
import { TrendingUp } from "lucide-react"

export default function Home() {
  const [dados, setDados] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [categorias, setCategorias] = useState<any[]>([])
  const [responsaveis, setResponsaveis] = useState<any[]>([])
  const [metas, setMetas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showLoader, setShowLoader] = useState(false)
  const [userName, setUserName] = useState("Usuário")
  const [filtros, setFiltros] = useState<any>({
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
    responsavel: "Todos",
    categoria: "Todos",
    tag_id: "todos",
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    // Verificar se é a primeira vez que entra (não é refresh)
    const isFirstVisit = sessionStorage.getItem("hasVisited") === null
    if (isFirstVisit) {
      setShowLoader(true)
      sessionStorage.setItem("hasVisited", "true")
      
      // Obter nome do usuário
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user?.user_metadata?.name) {
          setUserName(user.user_metadata.name)
        } else if (user?.email) {
          // Se for o email específico, usar "Sr: Luiz"
          if (user.email === "onbossdigital@gmail.com") {
            setUserName("Sr: Luiz")
          } else {
            const nameFromEmail = user.email.split("@")[0]
            setUserName(nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1))
          }
        }
      })
    }
    
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("lancamentos")
        .select("*, categorias(nome), responsaveis(nome)")
        .order("data", { ascending: false })

      if (error) throw error
      
      // Mapear dados para formato esperado
      const dadosMapeados = (data || []).map((item: any) => ({
        ...item,
        categoria: item.categorias?.nome || "",
        responsavel: item.responsaveis?.nome || "",
      }))
      setDados(dadosMapeados)

      // Carregar tags
      const { data: tagsData } = await supabase.from("tags").select("*").eq("ativo", true)
      setTags(tagsData || [])

      // Carregar categorias
      const { data: categoriasData } = await supabase
        .from("categorias")
        .select("*")
        .eq("ativo", true)
        .order("nome")
      setCategorias(categoriasData || [])

      // Carregar responsáveis
      const { data: responsaveisData } = await supabase
        .from("responsaveis")
        .select("*")
        .eq("ativo", true)
        .order("nome")
      setResponsaveis(responsaveisData || [])

      // Carregar metas
      const { data: metasData } = await supabase
        .from("metas")
        .select("*")
        .order("mes", { ascending: false })
      setMetas(metasData || [])
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleNovoLancamento = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    setLoading(true)
    await carregarDados()
  }

  const updateFiltros = (novosFiltros: any) => {
    setFiltros(novosFiltros)
  }

  return (
    <>
      {showLoader && <WelcomeLoader userName={userName} onComplete={() => setShowLoader(false)} />}
      
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 pb-24 md:pb-8">
        {/* Background glow effect */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
          {/* Header premium */}
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-linear-to-br from-cyan-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">ONBOSS FINANCE</h1>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm ml-13">Gestão financeira inteligente e em tempo real</p>
          </div>

          {/* Dashboard Principal */}
          {!loading && <DashboardModerno dados={dados} filtros={filtros} setFiltros={updateFiltros} tags={tags} categorias={categorias} responsaveis={responsaveis} metas={metas} />}
          {loading && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Carregando dados...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
