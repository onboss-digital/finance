"use client"

import type React from "react"

import { useState } from "react"
import { LogOut, Menu, X, BarChart3, LineChart, Target, Plus, Settings, FileText, User } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"
import Link from "next/link"

export default function TopNav() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      setIsDropdownOpen(!isDropdownOpen)
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false)
    }
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">FC</span>
            </div>
            <span className="font-semibold text-white hidden sm:inline">ONBOSS FINANCE</span>
          </Link>

          <div className="flex items-center gap-6">
            {/* Navigation Links */}
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-sm"
            >
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              href="/relatorios"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-sm"
            >
              <FileText className="w-4 h-4" />
              Relatórios
            </Link>
            <Link
              href="/admin"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-sm"
            >
              <Settings className="w-4 h-4" />
              Configurações
            </Link>
            <Link
              href="/lancamentos"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-sm bg-cyan-500/20 border border-cyan-500/50"
            >
              <Plus className="w-4 h-4" />
              Novo
            </Link>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onKeyDown={handleKeyDown}
                aria-haspopup="menu"
                aria-expanded={isDropdownOpen}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                <User className="w-4 h-4" />
                <span className="text-sm">Perfil</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">FC</span>
            </div>
          </Link>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isMobileOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>

        {isMobileOpen && (
          <div className="border-t border-slate-700 bg-slate-800">
            <Link
              href="/"
              className="block px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              onClick={() => setIsMobileOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/relatorios"
              className="block px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              onClick={() => setIsMobileOpen(false)}
            >
              Relatórios
            </Link>
            <Link
              href="/admin"
              className="block px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              onClick={() => setIsMobileOpen(false)}
            >
              Configurações
            </Link>
            <Link
              href="/lancamentos"
              className="block px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              onClick={() => setIsMobileOpen(false)}
            >
              Novo Lançamento
            </Link>
            <div className="border-t border-slate-700 pt-3">
              <button
                onClick={() => {
                  handleLogout()
                  setIsMobileOpen(false)
                }}
                className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-slate-700 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
