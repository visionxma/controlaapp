"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X } from "lucide-react"
import type { Product } from "@/lib/types"

interface ProductFormProps {
  onSubmit: (productData: Omit<Product, "id" | "createdAt" | "updatedAt">, imageFile?: File) => Promise<void>
  initialData?: Partial<Product>
  isEditing?: boolean
}

export function ProductForm({ onSubmit, initialData, isEditing = false }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    costPrice: initialData?.costPrice || undefined,
    salePrice: initialData?.salePrice || undefined,
    initialStock: initialData?.initialStock || undefined,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(initialData?.imageUrl || "")
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        costPrice: initialData.costPrice || undefined,
        salePrice: initialData.salePrice || undefined,
        initialStock: initialData.initialStock || undefined,
      })
      setImagePreview(initialData.imageUrl || "")
      setImageFile(null) // Reset image file when editing
    } else {
      // Reset form when not editing
      setFormData({
        name: "",
        costPrice: undefined,
        salePrice: undefined,
        initialStock: undefined,
      })
      setImagePreview("")
      setImageFile(null)
    }
  }, [initialData])

  const profit = (formData.salePrice || 0) - (formData.costPrice || 0)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("[v0] Iniciando cadastro de produto:", formData)
      console.log("[v0] Arquivo de imagem:", imageFile)

      await onSubmit(
        {
          ...formData,
          profit,
          currentStock: isEditing ? initialData?.currentStock || formData.initialStock : formData.initialStock,
          userId: "", // Will be set in the hook
        },
        imageFile || undefined,
      )

      console.log("[v0] Produto cadastrado com sucesso!")

      if (!isEditing) {
        // Reset form for new products
        setFormData({
          name: "",
          costPrice: undefined,
          salePrice: undefined,
          initialStock: undefined,
        })
        removeImage()
      }
    } catch (error) {
      console.error("[v0] Erro detalhado ao cadastrar produto:", error)
      console.error("[v0] Tipo do erro:", typeof error)
      console.error("[v0] Stack trace:", error instanceof Error ? error.stack : "N/A")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Produto" : "Cadastrar Novo Produto"}</CardTitle>
        <CardDescription>
          {isEditing ? "Atualize as informações do produto" : "Preencha os dados do produto"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Foto do Produto</Label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={removeImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="w-20 h-20 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  Escolher Imagem
                </Button>
              </div>
            </div>
          </div>

          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Produto</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Coco Verde"
              required
            />
          </div>

          {/* Prices */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="costPrice">Valor de Custo (R$)</Label>
              <Input
                id="costPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.costPrice || ""}
                onChange={(e) =>
                  setFormData({ ...formData, costPrice: Number.parseFloat(e.target.value) || undefined })
                }
                placeholder="0,00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salePrice">Valor de Venda (R$)</Label>
              <Input
                id="salePrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.salePrice || ""}
                onChange={(e) =>
                  setFormData({ ...formData, salePrice: Number.parseFloat(e.target.value) || undefined })
                }
                placeholder="0,00"
                required
              />
            </div>
          </div>

          {/* Profit Display */}
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Lucro por unidade:</span>
              <span className={`font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                R$ {profit.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Initial Stock */}
          <div className="space-y-2">
            <Label htmlFor="initialStock">Estoque Inicial</Label>
            <Input
              id="initialStock"
              type="number"
              min="0"
              value={formData.initialStock || ""}
              onChange={(e) => setFormData({ ...formData, initialStock: Number.parseInt(e.target.value) || undefined })}
              placeholder="0"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Salvando..." : isEditing ? "Atualizar Produto" : "Cadastrar Produto"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
