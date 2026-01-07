"use client"

import { usePathname } from "next/navigation"
import { BarChart3, LineChart, Target, Plus, Settings } from "lucide-react"
import Link from "next/link"

export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", icon: BarChart3, label: "Dashboard" },
    { href: "/#analise", icon: LineChart, label: "Análise" },
    { href: "/#metas", icon: Target, label: "Metas" },
    { href: "/#lancamentos", icon: Plus, label: "Novo" },
    { href: "/configuracoes", icon: Settings, label: "Config" },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50 z-40">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href.includes("#") && pathname === "/")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-3 text-xs transition-all duration-200 group ${
                isActive
                  ? "text-cyan-500 border-t-2 border-cyan-500"
                  : "text-slate-400 hover:text-cyan-400 border-t-2 border-transparent"
              }`}
            >
              <Icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
