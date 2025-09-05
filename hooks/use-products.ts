"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/products"
import type { Product } from "@/lib/types"

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchProducts = useCallback(async () => {
    if (!user) {
      console.log("[v0] No user authenticated, skipping product fetch")
      setProducts([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      console.log("[v0] Fetching products for user:", user.uid)

      const fetchedProducts = await getProducts(user.uid)
      console.log("[v0] Fetched products count:", fetchedProducts.length)

      setProducts(fetchedProducts)

      if (fetchedProducts.length === 0) {
        console.log("[v0] No products found - checking if user ID matches saved data")
      }
    } catch (error) {
      console.error("[v0] Error fetching products:", error)
      console.error("[v0] Error details:", error.message)
    } finally {
      setLoading(false)
    }
  }, [user]) // Use user instead of user?.uid to prevent unnecessary re-renders

  useEffect(() => {
    console.log("[v0] useProducts effect triggered, user:", user?.uid)
    fetchProducts()
  }, [fetchProducts]) // Use fetchProducts in dependency array since it's now memoized

  const addProduct = async (productData: Omit<Product, "id" | "createdAt" | "updatedAt">, imageFile?: File) => {
    if (!user) throw new Error("User not authenticated")

    console.log("[v0] Adding product with userId:", user.uid)
    console.log("[v0] Product data being saved:", { ...productData, userId: user.uid })

    await createProduct({ ...productData, userId: user.uid }, imageFile)
    console.log("[v0] Product added successfully, refetching products")
    await fetchProducts()
  }

  const editProduct = async (productId: string, productData: Partial<Product>, imageFile?: File) => {
    await updateProduct(productId, productData, imageFile)
    await fetchProducts()
  }

  const removeProduct = async (productId: string, imageUrl?: string) => {
    await deleteProduct(productId, imageUrl)
    await fetchProducts()
  }

  return {
    products,
    loading,
    addProduct,
    editProduct,
    removeProduct,
    refetch: fetchProducts,
  }
}
