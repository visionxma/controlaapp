"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, AlertTriangle } from "lucide-react"
import type { Product } from "@/lib/types"

interface CurrentStockProps {
  products: Product[]
  loading?: boolean
}

export function CurrentStock({ products, loading }: CurrentStockProps) {
  const lowStockThreshold = 5 // Products with 5 or fewer items are considered low stock
  const lowStockProducts = products.filter((p) => p.currentStock <= lowStockThreshold && p.currentStock > 0)
  const outOfStockProducts = products.filter((p) => p.currentStock === 0)

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estoque Atual</CardTitle>
          <CardDescription>Carregando estoque...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estoque Atual</CardTitle>
          <CardDescription>Situação atual do estoque</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum produto cadastrado</h3>
            <p className="text-muted-foreground text-center">Cadastre produtos para visualizar o estoque.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Alertas de Estoque
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {outOfStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-2 bg-red-100 rounded">
                <span className="font-medium text-red-800">{product.name}</span>
                <Badge variant="destructive">Sem estoque</Badge>
              </div>
            ))}
            {lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-2 bg-yellow-100 rounded">
                <span className="font-medium text-yellow-800">{product.name}</span>
                <Badge variant="secondary" className="bg-yellow-200 text-yellow-800">
                  Estoque baixo: {product.currentStock}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Current Stock */}
      <Card>
        <CardHeader>
          <CardTitle>Estoque Atual</CardTitle>
          <CardDescription>Situação atual de todos os produtos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl || "/placeholder.svg"}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">Valor: R$ {product.salePrice.toFixed(2)}</p>
                  </div>
                </div>

                <Badge
                  variant={
                    product.currentStock === 0
                      ? "destructive"
                      : product.currentStock <= lowStockThreshold
                        ? "secondary"
                        : "default"
                  }
                  className={
                    product.currentStock <= lowStockThreshold && product.currentStock > 0
                      ? "bg-yellow-200 text-yellow-800 hover:bg-yellow-200"
                      : ""
                  }
                >
                  {product.currentStock} unidades
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
