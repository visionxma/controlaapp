"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Package, ShoppingCart, AlertTriangle } from "lucide-react"
import type { Product, Sale } from "@/lib/types"
import { getOptimizedImageUrl } from "@/lib/cloudinary"

interface QuickSaleListProps {
  products: Product[]
  onSubmit: (saleData: Omit<Sale, "id" | "date">) => Promise<void>
  loading?: boolean
}

const paymentMethods = [
  { value: "pix", label: "PIX" },
  { value: "dinheiro", label: "Dinheiro" },
  { value: "cartao", label: "Cartão" },
  { value: "fiado", label: "Fiado" },
] as const

export function QuickSaleList({ products, onSubmit, loading }: QuickSaleListProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    quantity: undefined as number | undefined,
    paymentMethod: "" as Sale["paymentMethod"],
  })
  const [submitting, setSubmitting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const availableProducts = products.filter((p) => p.currentStock > 0)

  const totalValue = selectedProduct && formData.quantity ? selectedProduct.salePrice * formData.quantity : 0
  const totalProfit = selectedProduct && formData.quantity ? selectedProduct.profit * formData.quantity : 0
  const hasStock = selectedProduct && formData.quantity ? selectedProduct.currentStock >= formData.quantity : false

  const handleQuickSale = (product: Product) => {
    setSelectedProduct(product)
    setFormData({ quantity: undefined, paymentMethod: "" })
    setDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedProduct || !hasStock || !formData.quantity) return

    setSubmitting(true)

    try {
      await onSubmit({
        productId: selectedProduct.id,
        quantity: formData.quantity,
        paymentMethod: formData.paymentMethod,
        totalValue,
        profit: totalProfit,
        userId: "", // Will be set in the hook
      })

      // Reset form and close dialog
      setFormData({ quantity: undefined, paymentMethod: "" })
      setSelectedProduct(null)
      setDialogOpen(false)
    } catch (error) {
      console.error("Error submitting quick sale:", error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-32 bg-muted rounded mb-4"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (availableProducts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum produto disponível</h3>
          <p className="text-muted-foreground text-center">Não há produtos com estoque disponível para venda rápida.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {availableProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-square relative bg-muted">
              {product.imageUrl ? (
                <img
                  src={getOptimizedImageUrl(product.imageUrl, 300, 300, 80) || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{product.name}</h3>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Preço:</span>
                    <p className="font-medium">R$ {product.salePrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Lucro:</span>
                    <p className={`font-medium ${product.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                      R$ {product.profit.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Badge variant={product.currentStock > 5 ? "default" : "secondary"}>
                    Estoque: {product.currentStock}
                  </Badge>
                </div>

                <Dialog open={dialogOpen && selectedProduct?.id === product.id} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full gap-2" onClick={() => handleQuickSale(product)}>
                      <ShoppingCart className="h-4 w-4" />
                      Vender Agora
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Sale Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Venda Rápida - {selectedProduct?.name}</DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Info */}
              <div className="p-3 bg-muted rounded-lg space-y-2">
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

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quick-quantity">Quantidade</Label>
                <Input
                  id="quick-quantity"
                  type="number"
                  min="1"
                  max={selectedProduct.currentStock}
                  value={formData.quantity || ""}
                  onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) || undefined })}
                  placeholder="Digite a quantidade"
                  required
                />
                {formData.quantity && formData.quantity > selectedProduct.currentStock && (
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
              {formData.quantity && formData.quantity > 0 && hasStock && (
                <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg space-y-2">
                  <h4 className="font-semibold text-accent">Resumo da Venda</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total:</span>
                      <p className="font-bold text-lg">R$ {totalValue.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Lucro:</span>
                      <p className={`font-bold text-lg ${totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                        R$ {totalProfit.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={submitting || !formData.paymentMethod || !hasStock || !formData.quantity}
                >
                  {submitting ? "Vendendo..." : "Confirmar Venda"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
