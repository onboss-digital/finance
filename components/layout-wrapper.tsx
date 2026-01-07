"use client"

import { usePathname } from "next/navigation"
import TopNav from "./top-nav"
import BottomNav from "./bottom-nav"

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"

  return (
    <>
      {!isLoginPage && <TopNav />}
      {children}
      {!isLoginPage && <BottomNav />}
    </>
  )
}
