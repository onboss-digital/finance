"use client"

import { useState, useEffect } from "react"
import { getBrowserClient } from "@/lib/supabase-client"

export function useCachedData<T>(table: string, cacheKey: string) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)

        // Tentar carregar do cache
        const cached = localStorage.getItem(cacheKey)
        if (cached) {
          setData(JSON.parse(cached))
        }

        // Carregar dados frescos
        const supabase = getBrowserClient()
        
        // If Supabase is not available, just use cached data
        if (!supabase) {
          setLoading(false)
          return
        }

        const { data: freshData, error: err } = await supabase.from(table).select("*")

        if (err) throw err

        setData(freshData || [])
        localStorage.setItem(cacheKey, JSON.stringify(freshData || []))
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Erro desconhecido"))
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [table, cacheKey])

  return { data, loading, error }
}
