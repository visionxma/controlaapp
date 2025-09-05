"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Product, StockEntry } from "@/lib/types"

interface StockEntryFormProps {
  products: Product[]
  onSubmit: (entryData: Omit<StockEntry, "id" | "date">) => Promise<void>
}

export function StockEntryForm({ products, onSubmit }: StockEntryFormProps) {
  const [formData, setFormData] = useState({
    productId: "",
    quantity: undefined as number | undefined,
    receivedBy: "",
    receivedFrom: "",
  })
  const [loading, setLoading] = useState(false)

  const selectedProduct = products.find((p) => p.id === formData.productId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit({
        ...formData,
        userId: "", // Will be set in the hook
      })

      // Reset form
      setFormData({
        productId: "",
        quantity: undefined,
        receivedBy: "",
        receivedFrom: "",
      })
    } catch (error) {
      console.error("Error submitting stock entry:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Entrada de Estoque</CardTitle>
        <CardDescription>Registre a entrada de produtos no estoque</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Selection */}
          <div className="space-y-2">
            <Label>Produto</Label>
            <Select
              value={formData.productId}
              onValueChange={(value) => setFormData({ ...formData, productId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} (Estoque atual: {product.currentStock})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Current Stock Display */}
          {selectedProduct && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Estoque atual:</span>
                <span className="font-bold">{selectedProduct.currentStock} unidades</span>
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade Recebida</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity || ""}
              onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) || undefined })}
              placeholder="Digite a quantidade"
              required
            />
          </div>

          {/* Received By */}
          <div className="space-y-2">
            <Label htmlFor="receivedBy">Quem Recebeu (Responsável)</Label>
            <Input
              id="receivedBy"
              value={formData.receivedBy}
              onChange={(e) => setFormData({ ...formData, receivedBy: e.target.value })}
              placeholder="Ex: Funcionário Maria"
              required
            />
          </div>

          {/* Received From */}
          <div className="space-y-2">
            <Label htmlFor="receivedFrom">De Quem Foi Recebido (Fornecedor)</Label>
            <Input
              id="receivedFrom"
              value={formData.receivedFrom}
              onChange={(e) => setFormData({ ...formData, receivedFrom: e.target.value })}
              placeholder="Ex: Fornecedor João do Coco"
              required
            />
          </div>

          {/* New Stock Preview */}
          {selectedProduct && formData.quantity && formData.quantity > 0 && (
            <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Novo estoque será:</span>
                <span className="font-bold text-accent">
                  {selectedProduct.currentStock + formData.quantity} unidades
                </span>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading || !formData.productId || !formData.quantity}>
            {loading ? "Registrando..." : "Registrar Entrada"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
