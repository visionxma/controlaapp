"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { useProducts } from "@/hooks/use-products"

export function StockAlerts() {
  const { products } = useProducts()

  const lowStockProducts = products.filter((p) => p.currentStock <= 50 && p.currentStock > 0)
  const outOfStockProducts = products.filter((p) => p.currentStock === 0)

  const hasAlerts = lowStockProducts.length > 0 || outOfStockProducts.length > 0

  return (
    <Card className="col-span-3">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          Alertas de Estoque
        </CardTitle>
        <CardDescription className="text-sm">Produtos com estoque baixo</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {!hasAlerts ? (
          <div className="text-sm text-muted-foreground text-center py-6 border rounded-lg bg-muted/20">
            Nenhum alerta de estoque
          </div>
        ) : (
          <div className="space-y-3">
            {outOfStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <span className="text-sm font-medium text-red-800">{product.name}</span>
                <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded">Sem estoque</span>
              </div>
            ))}
            {lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <span className="text-sm font-medium text-yellow-800">{product.name}</span>
                <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                  {product.currentStock} restantes
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
