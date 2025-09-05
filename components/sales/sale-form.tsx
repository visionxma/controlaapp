"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"
import type { Product, Sale } from "@/lib/types"

interface SaleFormProps {
  products: Product[]
  onSubmit: (saleData: Omit<Sale, "id" | "date">) => Promise<void>
}

const paymentMethods = [
  { value: "pix", label: "PIX" },
  { value: "dinheiro", label: "Dinheiro" },
  { value: "cartao", label: "Cartão" },
  { value: "fiado", label: "Fiado" },
] as const

export function SaleForm({ products, onSubmit }: SaleFormProps) {
  const [formData, setFormData] = useState({
    productId: "",
    quantity: undefined as number | undefined,
    paymentMethod: "" as Sale["paymentMethod"],
  })
  const [loading, setLoading] = useState(false)

  const selectedProduct = products.find((p) => p.id === formData.productId)
  const totalValue = selectedProduct && formData.quantity ? selectedProduct.salePrice * formData.quantity : 0
  const totalProfit = selectedProduct && formData.quantity ? selectedProduct.profit * formData.quantity : 0
  const hasStock = selectedProduct && formData.quantity ? selectedProduct.currentStock >= formData.quantity : false

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedProduct || !hasStock) return

    setLoading(true)

    try {
      await onSubmit({
        ...formData,
        totalValue,
        profit: totalProfit,
        userId: "", // Will be set in the hook
      })

      // Reset form
      setFormData({
        productId: "",
        quantity: undefined,
        paymentMethod: "" as Sale["paymentMethod"],
      })
    } catch (error) {
      console.error("Error submitting sale:", error)
    } finally {
      setLoading(false)
    }
  }

  const availableProducts = products.filter((p) => p.currentStock > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Venda</CardTitle>
        <CardDescription>Registre uma nova venda no sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Selection */}
          <div className="space-y-2">
            <Label>Produto</Label>
            <Select
              value={formData.productId}
              onValueChange={(value) => setFormData({ ...formData, productId: value, quantity: undefined })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent>
                {availableProducts.length === 0 ? (
                  <SelectItem value="" disabled>
                    Nenhum produto com estoque disponível
                  </SelectItem>
                ) : (
                  availableProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} - R$ {product.salePrice.toFixed(2)} (Estoque: {product.currentStock})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Product Info */}
          {selectedProduct && (
            <div className="p-3 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Produto selecionado:</span>
                <span className="font-bold">{selectedProduct.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Preço unitário:</span>
                <span className="font-bold">R$ {selectedProduct.salePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Estoque disponível:</span>
                <Badge variant={selectedProduct.currentStock <= 5 ? "secondary" : "default"}>
                  {selectedProduct.currentStock} unidades
                </Badge>
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={selectedProduct?.currentStock || 1}
              value={formData.quantity || ""}
              onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) || undefined })}
              placeholder="Digite a quantidade"
              required
            />
            {selectedProduct && formData.quantity && formData.quantity > selectedProduct.currentStock && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertTriangle className="h-4 w-4" />
                Quantidade maior que o estoque disponível
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label>Forma de Pagamento</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) => setFormData({ ...formData, paymentMethod: value as Sale["paymentMethod"] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a forma de pagamento" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sale Summary */}
          {selectedProduct && formData.quantity && formData.quantity > 0 && hasStock && (
            <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg space-y-2">
              <h4 className="font-semibold text-accent">Resumo da Venda</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total da venda:</span>
                  <p className="font-bold text-lg">R$ {totalValue.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Lucro:</span>
                  <p className={`font-bold text-lg ${totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                    R$ {totalProfit.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Estoque após venda: {selectedProduct.currentStock - formData.quantity} unidades
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !formData.productId || !formData.paymentMethod || !hasStock || !formData.quantity}
          >
            {loading ? "Registrando..." : "Registrar Venda"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
