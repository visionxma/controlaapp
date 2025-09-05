"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSales } from "@/hooks/use-sales"
import { useProducts } from "@/hooks/use-products"
import { Badge } from "@/components/ui/badge"

type PeriodFilter = "today" | "7days" | "30days" | "90days" | "year" | "all"

const paymentMethodLabels = {
  pix: "PIX",
  dinheiro: "Dinheiro",
  cartao: "Cartão",
  fiado: "Fiado",
}

interface RecentSalesProps {
  period?: PeriodFilter
}

export function RecentSales({ period = "30days" }: RecentSalesProps) {
  const { sales } = useSales()
  const { products } = useProducts()

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
  const filteredSales = sales.filter((sale) => sale.date >= startDate)
  const recentSales = filteredSales.slice(0, 5) // Show last 5 sales from filtered period

  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    return product?.name || "Produto não encontrado"
  }

  const getPeriodDescription = (period: PeriodFilter): string => {
    switch (period) {
      case "today":
        return "de hoje"
      case "7days":
        return "dos últimos 7 dias"
      case "30days":
        return "dos últimos 30 dias"
      case "90days":
        return "dos últimos 90 dias"
      case "year":
        return "do último ano"
      case "all":
        return "do sistema"
      default:
        return "do período selecionado"
    }
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Vendas Recentes</CardTitle>
        <CardDescription>Últimas vendas {getPeriodDescription(period)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentSales.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm font-medium leading-none">
                {period === "all" ? "Nenhuma venda registrada" : `Nenhuma venda ${getPeriodDescription(period)}`}
              </p>
              <p className="text-sm text-muted-foreground">As vendas aparecerão aqui quando forem realizadas</p>
            </div>
          ) : (
            recentSales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{getProductName(sale.productId)}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      {sale.quantity} unidades • {paymentMethodLabels[sale.paymentMethod]}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {sale.date.toLocaleDateString("pt-BR")}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">R$ {sale.totalValue.toFixed(2)}</p>
                  <p className={`text-xs ${sale.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                    Lucro: R$ {sale.profit.toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
