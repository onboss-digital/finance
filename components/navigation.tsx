"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, BarChart3, Settings, FileText, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { href: "/", label: "Dashboard", icon: BarChart3 },
    { href: "/admin", label: "Admin", icon: Settings },
    { href: "/relatorios", label: "Relatórios", icon: FileText },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-950 to-slate-900 border-b border-slate-800/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white hidden sm:inline">ONBOSS FINANCE</span>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-slate-800">
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Menu Mobile */}
          <button className="md:hidden text-gray-300 hover:text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menu Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-slate-800"
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
