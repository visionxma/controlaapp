"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Package, ShoppingCart, BarChart3, Warehouse, Menu, X, LogOut, User, Settings, CreditCard } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"

const navigation = [
  { name: "Caixa", href: "/dashboard", icon: CreditCard },
  { name: "Produtos", href: "/dashboard/produtos", icon: Package },
  { name: "Estoque", href: "/dashboard/estoque", icon: Warehouse },
  { name: "Vendas", href: "/dashboard/vendas", icon: ShoppingCart },
  { name: "Relatórios", href: "/dashboard/relatorios", icon: BarChart3 },
  { name: "Configurações", href: "/dashboard/configuracoes", icon: Settings },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, userData, logout } = useAuth()

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex p-6 border-b border-sidebar-border items-center">
            <Image
              src="https://i.imgur.com/P9zZvdt.png"
              alt="Logo"
              width={100}
              height={100}
              className="object-contain w-[300px] h-[30px]"
            />
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-sidebar-accent rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-sidebar-accent-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {userData?.companyName || user?.email}
                </p>
                {userData?.responsibleName && (
                  <p className="text-xs text-muted-foreground truncate">{userData.responsibleName}</p>
                )}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={logout} className="w-full justify-start gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
