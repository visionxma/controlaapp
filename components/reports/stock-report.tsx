"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, AlertTriangle, TrendingDown, Warehouse } from "lucide-react"

interface StockReportProps {
  data: any
  loading?: boolean
}

export function StockReport({ data, loading }: StockReportProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-32 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Carregando dados do estoque...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Relatório de Estoque</h2>
          <p className="text-sm text-muted-foreground">Situação atual e alertas do estoque</p>
        </div>
      </div>

      {/* Stock Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Itens em Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalStockItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Valor do Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {data.totalStockValue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alertas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{data.lowStockCount + data.outOfStockCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Alerts */}
      {(data.outOfStockProducts.length > 0 || data.lowStockProducts.length > 0) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Alertas de Estoque
            </CardTitle>
            <CardDescription>Produtos que precisam de atenção</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.outOfStockProducts.length > 0 && (
              <div>
                <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  Produtos sem estoque ({data.outOfStockProducts.length})
                </h4>
                <div className="space-y-2">
                  {data.outOfStockProducts.map((product: any) => (
                    <div key={product.id} className="flex items-center justify-between p-2 bg-red-100 rounded">
                      <span className="font-medium text-red-800">{product.name}</span>
                      <Badge variant="destructive">0 unidades</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.lowStockProducts.length > 0 && (
              <div>
                <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Estoque baixo ({data.lowStockProducts.length})
                </h4>
                <div className="space-y-2">
                  {data.lowStockProducts.map((product: any) => (
                    <div key={product.id} className="flex items-center justify-between p-2 bg-yellow-100 rounded">
                      <span className="font-medium text-yellow-800">{product.name}</span>
                      <Badge variant="secondary" className="bg-yellow-200 text-yellow-800">
                        {product.currentStock} unidades
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Stock Entries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Warehouse className="h-5 w-5" />
            Últimas Entradas de Estoque
          </CardTitle>
          <CardDescription>Movimentações recentes no estoque</CardDescription>
        </CardHeader>
        <CardContent>
          {data.recentEntries.length > 0 ? (
            <div className="space-y-3">
              {data.recentEntries.map((entry: any) => (
                <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">+{entry.quantity} unidades</div>
                    <div className="text-sm text-muted-foreground">
                      {entry.date.toLocaleDateString("pt-BR")} • De: {entry.receivedFrom}
                    </div>
                  </div>
                  <Badge variant="secondary">Por: {entry.receivedBy}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <Package className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Nenhuma entrada registrada</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
