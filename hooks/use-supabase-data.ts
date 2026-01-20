import { useEffect, useState } from "react"
import { getBrowserClient } from "@/lib/supabase-client"

interface Categoria {
  id: string
  nome: string
  tipo: "entrada" | "saida"
  cor: string
  descricao?: string
}

interface Responsavel {
  id: string
  nome: string
}

interface Tag {
  id: string
  nome: string
  ativo: boolean
}

export function useSupabaseData() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = getBrowserClient()

  useEffect(() => {
    const carregarDados = async () => {
      try {
        if (!supabase) {
          setError("Configuração de banco de dados não disponível")
          setLoading(false)
          return
        }
        setLoading(true)
        setError(null)

        // Carregar categorias
        const { data: categoriasData, error: categoriasError } = await supabase
          .from("categorias")
          .select("*")
          .order("nome")

        if (categoriasError) throw categoriasError
        setCategorias(categoriasData || [])

        // Carregar responsáveis
        const { data: responsaveisData, error: responsaveisError } = await supabase
          .from("responsaveis")
          .select("*")
          .order("nome")

        if (responsaveisError) throw responsaveisError
        setResponsaveis(responsaveisData || [])

        // Carregar tags
        const { data: tagsData, error: tagsError } = await supabase
          .from("tags")
          .select("*")
          .eq("ativo", true)
          .order("nome")

        if (tagsError) throw tagsError
        setTags(tagsData || [])
      } catch (err) {
        console.error("Erro ao carregar dados do Supabase:", err)
        setError(err instanceof Error ? err.message : "Erro desconhecido")
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  }, [])

  return {
    categorias,
    responsaveis,
    tags,
    loading,
    error,
    categoriasEntrada: categorias.filter((c) => c.tipo === "entrada"),
    categoriasSaida: categorias.filter((c) => c.tipo === "saida"),
  }
}
