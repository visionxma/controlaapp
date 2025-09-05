"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { OverviewCards } from "@/components/dashboard/overview-cards"
import { RecentSales } from "@/components/dashboard/recent-sales"
import { StockAlerts } from "@/components/dashboard/stock-alerts"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { useSales } from "@/hooks/use-sales"
import { useProducts } from "@/hooks/use-products"

type PeriodFilter = "today" | "7days" | "30days" | "90days" | "year" | "all"

const periodOptions = [
  { value: "today" as PeriodFilter, label: "Hoje" },
  { value: "7days" as PeriodFilter, label: "7 dias" },
  { value: "30days" as PeriodFilter, label: "30 dias" },
  { value: "90days" as PeriodFilter, label: "90 dias" },
  { value: "year" as PeriodFilter, label: "1 ano" },
  { value: "all" as PeriodFilter, label: "Todos" },
]

export default function DashboardPage() {
  const { user, userData, loading } = useAuth()
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilter>("30days")
  const { sales, salesStats } = useSales()
  const { products } = useProducts()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Olá, {userData?.companyName || "Empresa"}! 👋</h1>
          <p className="text-muted-foreground">
            {userData?.responsibleName && <span className="text-sm">Responsável: {userData.responsibleName} • </span>}
            Visão geral do seu caixa
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-1">
              {periodOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={selectedPeriod === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod(option.value)}
                  className="text-xs"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <OverviewCards period={selectedPeriod} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RecentSales period={selectedPeriod} />
        <StockAlerts />
      </div>
    </div>
  )
}
