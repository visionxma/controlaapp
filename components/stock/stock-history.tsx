"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Calendar, User, Truck } from "lucide-react"
import type { StockEntry, Product } from "@/lib/types"

interface StockHistoryProps {
  stockEntries: StockEntry[]
  products: Product[]
  loading?: boolean
}

export function StockHistory({ stockEntries, products, loading }: StockHistoryProps) {
  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    return product?.name || "Produto não encontrado"
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Entradas</CardTitle>
          <CardDescription>Carregando histórico...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (stockEntries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Entradas</CardTitle>
          <CardDescription>Registro de todas as entradas de estoque</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma entrada registrada</h3>
            <p className="text-muted-foreground text-center">
              As entradas de estoque aparecerão aqui quando forem registradas.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Entradas</CardTitle>
        <CardDescription>Registro de todas as entradas de estoque</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stockEntries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{getProductName(entry.productId)}</span>
                  <Badge variant="secondary">+{entry.quantity} unidades</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {entry.date.toLocaleDateString("pt-BR")} às{" "}
                    {entry.date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Recebido por: {entry.receivedBy}
                  </div>
                  <div className="flex items-center gap-1">
                    <Truck className="h-3 w-3" />
                    De: {entry.receivedFrom}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
