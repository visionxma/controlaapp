"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign, ShoppingBag, Calendar } from "lucide-react"

interface SalesStatsProps {
  stats: {
    monthlyRevenue: number
    monthlyProfit: number
    dailyRevenue: number
    dailyProfit: number
    totalSales: number
    monthlySalesCount: number
    dailySalesCount: number
  }
  loading?: boolean
}

export function SalesStats({ stats, loading }: SalesStatsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Faturamento Mensal</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ {stats.monthlyRevenue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">{stats.monthlySalesCount} vendas este mês</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Lucro Mensal</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">R$ {stats.monthlyProfit.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.monthlyRevenue > 0 ? ((stats.monthlyProfit / stats.monthlyRevenue) * 100).toFixed(1) : 0}% de margem
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Vendas Hoje</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.dailySalesCount}</div>
          <p className="text-xs text-muted-foreground mt-1">R$ {stats.dailyRevenue.toFixed(2)} faturado</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total de Vendas</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalSales}</div>
          <p className="text-xs text-muted-foreground mt-1">Vendas registradas</p>
        </CardContent>
      </Card>
    </div>
  )
}
