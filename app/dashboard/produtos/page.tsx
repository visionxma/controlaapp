"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useProducts } from "@/hooks/use-products"
import { ProductForm } from "@/components/products/product-form"
import { ProductList } from "@/components/products/product-list"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"

export default function ProdutosPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { products, loading, addProduct, editProduct, removeProduct } = useProducts()
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/")
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  if (!user) return null

  const handleSubmit = async (productData: Omit<Product, "id" | "createdAt" | "updatedAt">, imageFile?: File) => {
    try {
      if (editingProduct) {
        await editProduct(editingProduct.id, productData, imageFile)
        toast({
          title: "Produto atualizado!",
          description: "As informações do produto foram atualizadas com sucesso.",
        })
        setEditingProduct(null)
      } else {
        await addProduct(productData, imageFile)
        toast({
          title: "Produto cadastrado!",
          description: "O produto foi adicionado ao seu catálogo.",
        })
      }
      setShowForm(false)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o produto. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDelete = async (productId: string, imageUrl?: string) => {
    try {
      await removeProduct(productId, imageUrl)
      toast({
        title: "Produto excluído!",
        description: "O produto foi removido do seu catálogo.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o produto. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleCancelEdit = () => {
    setEditingProduct(null)
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground">Gerencie seu catálogo de produtos</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          {showForm ? (
            <>
              <X className="h-4 w-4" />
              Cancelar
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Novo Produto
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <div className="space-y-4">
          <ProductForm onSubmit={handleSubmit} initialData={editingProduct || undefined} isEditing={!!editingProduct} />
          {editingProduct && (
            <Button variant="outline" onClick={handleCancelEdit} className="w-full bg-transparent">
              Cancelar Edição
            </Button>
          )}
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Produtos Cadastrados</h2>
        <ProductList products={products} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />
      </div>
    </div>
  )
}
