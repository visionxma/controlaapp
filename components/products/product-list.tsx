"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Package } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { Product } from "@/lib/types"
import { getOptimizedImageUrl } from "@/lib/cloudinary"

interface ProductListProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (productId: string, imageUrl?: string) => Promise<void>
  loading?: boolean
}

export function ProductList({ products, onEdit, onDelete, loading }: ProductListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (productId: string, imageUrl?: string) => {
    setDeletingId(productId)
    try {
      await onDelete(productId, imageUrl)
    } finally {
      setDeletingId(null)
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

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum produto cadastrado</h3>
          <p className="text-muted-foreground text-center">
            Comece cadastrando seu primeiro produto usando o formulário acima.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Lista de Produtos</h2>
          <p className="text-sm text-muted-foreground">{products.length} produtos cadastrados</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-square relative bg-muted">
              {product.imageUrl ? (
                <img
                  src={getOptimizedImageUrl(product.imageUrl, 400, 400, 80) || "/placeholder.svg"}
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
                    <span className="text-muted-foreground">Custo:</span>
                    <p className="font-medium">R$ {product.costPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Venda:</span>
                    <p className="font-medium">R$ {product.salePrice.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-muted-foreground text-sm">Lucro:</span>
                    <p className={`font-bold ${product.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                      R$ {product.profit.toFixed(2)}
                    </p>
                  </div>
                  <Badge variant={product.currentStock > 0 ? "default" : "destructive"}>
                    Estoque: {product.currentStock}
                  </Badge>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(product)} className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" disabled={deletingId === product.id}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir produto</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir "{product.name}"? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(product.id, product.imageUrl)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
