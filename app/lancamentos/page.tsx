"use client"

import { useRouter } from "next/navigation"
import LancamentosForm from "@/components/lancamentos-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LancamentosPage() {
  const router = useRouter()

  const handleSucesso = () => {
    // Redireciona para home após sucesso
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 pb-24 md:pb-8">
      {/* Background glow effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {/* Header com botão voltar */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Novo Lançamento</h1>
          <p className="text-gray-400">Registre uma nova movimentação financeira</p>
        </div>

        {/* Formulário */}
        <LancamentosForm onSucesso={handleSucesso} />
      </div>
    </div>
  )
}
