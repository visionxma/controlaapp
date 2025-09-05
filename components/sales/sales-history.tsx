"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Calendar, CreditCard, TrendingUp } from "lucide-react"
import type { Sale, Product } from "@/lib/types"

interface SalesHistoryProps {
  sales: Sale[]
  products: Product[]
  loading?: boolean
}

const paymentMethodLabels = {
  pix: "PIX",
  dinheiro: "Dinheiro",
  cartao: "Cartão",
  fiado: "Fiado",
}

export function SalesHistory({ sales, products, loading }: SalesHistoryProps) {
  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    return product?.name || "Produto não encontrado"
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Vendas</CardTitle>
          <CardDescription>Carregando histórico...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (sales.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Vendas</CardTitle>
          <CardDescription>Registro de todas as vendas realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma venda registrada</h3>
            <p className="text-muted-foreground text-center">As vendas aparecerão aqui quando forem registradas.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Histórico de Vendas</CardTitle>
            <CardDescription>Registro de todas as vendas realizadas</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sales.map((sale) => (
            <div
              key={sale.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{getProductName(sale.productId)}</span>
                  <Badge variant="secondary">{sale.quantity} unidades</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {sale.date.toLocaleDateString("pt-BR")} às{" "}
                    {sale.date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  <div className="flex items-center gap-1">
                    <CreditCard className="h-3 w-3" />
                    {paymentMethodLabels[sale.paymentMethod]}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Total: R$ {sale.totalValue.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span className={`font-medium ${sale.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                      Lucro: R$ {sale.profit.toFixed(2)}
                    </span>
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
