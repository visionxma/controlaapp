"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, Package, DollarSign } from "lucide-react"
import type { ProductPerformance } from "@/lib/reports"

interface ProductPerformanceProps {
  data: ProductPerformance[]
  loading?: boolean
}

export function ProductPerformanceReport({ data, loading }: ProductPerformanceProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-64 bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const topProducts = data.slice(0, 10) // Top 10 products

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Performance dos Produtos</h2>
          <p className="text-sm text-muted-foreground">Análise detalhada de vendas e faturamento por produto</p>
        </div>
      </div>

      {/* Top Products Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance dos Produtos</CardTitle>
          <CardDescription>Faturamento por produto (Top 10)</CardDescription>
        </CardHeader>
        <CardContent>
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="productName" type="category" width={100} />
                <Tooltip formatter={(value: number) => [`R$ ${value.toFixed(2)}`, "Faturamento"]} />
                <Bar dataKey="totalRevenue" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">Nenhuma venda registrada</div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Product List */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento por Produto</CardTitle>
          <CardDescription>Performance detalhada de todos os produtos</CardDescription>
        </CardHeader>
        <CardContent>
          {data.length > 0 ? (
            <div className="space-y-4">
              {data.map((product, index) => (
                <div key={product.productId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-full text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{product.productName}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          {product.totalSold} vendidos
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {product.salesCount} vendas
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="font-bold">R$ {product.totalRevenue.toFixed(2)}</div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Lucro: R$ {product.totalProfit.toFixed(2)}
                      </Badge>
                      <Badge variant={product.totalProfit >= 0 ? "default" : "destructive"} className="text-xs">
                        {product.totalRevenue > 0 ? ((product.totalProfit / product.totalRevenue) * 100).toFixed(1) : 0}
                        %
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma venda registrada</h3>
              <p className="text-muted-foreground text-center">
                Os dados de performance aparecerão aqui quando houver vendas.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
