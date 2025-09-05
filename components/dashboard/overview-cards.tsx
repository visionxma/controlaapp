"use client"

import type React from "react"
import { useProducts } from "@/hooks/use-products"
import { useSales } from "@/hooks/use-sales"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, TrendingUp, Warehouse } from "lucide-react"

type PeriodFilter = "today" | "7days" | "30days" | "90days" | "year" | "all"

interface OverviewCardProps {
  title: string
  value: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  trend?: {
    value: string
    isPositive: boolean
  }
}

function OverviewCard({ title, value, description, icon: Icon, trend }: OverviewCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        {trend && (
          <div className={`text-xs mt-1 ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
            {trend.isPositive ? "+" : ""}
            {trend.value}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface OverviewCardsProps {
  period?: PeriodFilter
}

export function OverviewCards({ period = "30days" }: OverviewCardsProps) {
  const { products } = useProducts()
  const { salesStats } = useSales()

  const getStartDate = (period: PeriodFilter): Date => {
    const now = new Date()
    switch (period) {
      case "today":
        return new Date(now.getFullYear(), now.getMonth(), now.getDate())
      case "7days":
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      case "30days":
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      case "90days":
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      case "year":
        return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
      case "all":
      default:
        return new Date(0)
    }
  }

  const startDate = getStartDate(period)
  const filteredStats = {
    revenue: period === "all" ? salesStats.monthlyRevenue : salesStats.monthlyRevenue,
    profit: period === "all" ? salesStats.monthlyProfit : salesStats.monthlyProfit,
    salesCount: period === "all" ? salesStats.monthlySalesCount : salesStats.monthlySalesCount,
  }

  const totalProducts = products.length
  const totalStock = products.reduce((sum, product) => sum + product.currentStock, 0)
  const lowStockProducts = products.filter((p) => p.currentStock <= 5 && p.currentStock > 0).length
  const outOfStockProducts = products.filter((p) => p.currentStock === 0).length

  const getPeriodDescription = (period: PeriodFilter): string => {
    switch (period) {
      case "today":
        return "hoje"
      case "7days":
        return "últimos 7 dias"
      case "30days":
        return "últimos 30 dias"
      case "90days":
        return "últimos 90 dias"
      case "year":
        return "último ano"
      case "all":
        return "total"
      default:
        return "período selecionado"
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <OverviewCard
        title="Total de Produtos"
        value={totalProducts.toString()}
        description="Produtos cadastrados"
        icon={Package}
      />
      <OverviewCard
        title={`Vendas ${getPeriodDescription(period)}`}
        value={`R$ ${filteredStats.revenue.toFixed(2)}`}
        description={`${filteredStats.salesCount} vendas realizadas`}
        icon={ShoppingCart}
      />
      <OverviewCard
        title={`Lucro ${getPeriodDescription(period)}`}
        value={`R$ ${filteredStats.profit.toFixed(2)}`}
        description={`${filteredStats.revenue > 0 ? ((filteredStats.profit / filteredStats.revenue) * 100).toFixed(1) : 0}% de margem`}
        icon={TrendingUp}
      />
      <OverviewCard
        title="Itens em Estoque"
        value={totalStock.toString()}
        description={`${outOfStockProducts} sem estoque, ${lowStockProducts} baixo`}
        icon={Warehouse}
      />
    </div>
  )
}
