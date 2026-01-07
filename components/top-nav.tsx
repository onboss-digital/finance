"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { LogOut, Menu, X, BarChart3, LineChart, Target, Plus, Settings, FileText, User } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"
import Link from "next/link"

export default function TopNav() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [userName, setUserName] = useState("Usuário")
  const [userEmail, setUserEmail] = useState("")

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || "")
        if (user.user_metadata?.name) {
          setUserName(user.user_metadata.name)
        } else if (user.email) {
          if (user.email === "onbossdigital@gmail.com") {
            setUserName("Sr: Luiz")
          } else {
            const nameFromEmail = user.email.split("@")[0]
            setUserName(nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1))
          }
        }
      }
    }
    getUser()
  }, [supabase])

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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
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
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center flex-shrink-0 border border-cyan-400/50 overflow-hidden">
                  <img 
                    src="/avatar/profile.jpg" 
                    alt={userName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                      e.currentTarget.parentElement!.textContent = userName.charAt(0).toUpperCase()
                    }}
                  />
                </div>
                <div className="hidden lg:flex flex-col items-start">
                  <span className="text-sm font-medium text-white">{userName}</span>
                  <span className="text-xs text-slate-400">{userEmail}</span>
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                  {/* User Info Section */}
                  <div className="px-4 py-4 bg-gradient-to-r from-slate-800 to-slate-700/50 border-b border-slate-600">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center flex-shrink-0 border border-cyan-400/50 overflow-hidden">
                        <img 
                          src="/avatar/profile.jpg" 
                          alt={userName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none"
                            e.currentTarget.parentElement!.textContent = userName.charAt(0).toUpperCase()
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{userName}</p>
                        <p className="text-xs text-slate-400 truncate">{userEmail}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="px-2 py-3 space-y-2">
                    <Link
                      href="/configuracoes"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Meu Perfil
                    </Link>
                  </div>

                  {/* Logout Section */}
                  <div className="border-t border-slate-700 px-2 py-3">
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsDropdownOpen(false)
                      }}
                      className="w-full px-3 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2 border border-red-500/20 hover:border-red-500/50"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair da Conta
                    </button>
                  </div>
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
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
            {/* Mobile User Info */}
            <div className="px-4 py-4 bg-gradient-to-r from-slate-800 to-slate-700/50 border-b border-slate-600 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center flex-shrink-0 border border-cyan-400/50 overflow-hidden">
                <img 
                  src="/avatar/profile.jpg" 
                  alt={userName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                    e.currentTarget.parentElement!.textContent = userName.charAt(0).toUpperCase()
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{userName}</p>
                <p className="text-xs text-slate-400 truncate">{userEmail}</p>
              </div>
            </div>

            {/* Mobile Menu Links */}
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
            <Link
              href="/configuracoes"
              className="block px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              onClick={() => setIsMobileOpen(false)}
            >
              Meu Perfil
            </Link>

            {/* Mobile Logout */}
            <div className="border-t border-slate-700 pt-3">
              <button
                onClick={() => {
                  handleLogout()
                  setIsMobileOpen(false)
                }}
                className="w-full text-left px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair da Conta
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
