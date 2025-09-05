import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from "firebase/firestore"
import { db } from "./firebase"
import type { Product } from "./types"
import { uploadToCloudinary } from "./cloudinary"

export async function createProduct(
  productData: Omit<Product, "id" | "createdAt" | "updatedAt">,
  imageFile?: File,
): Promise<string> {
  try {
    console.log("[v0] Creating product with data:", productData)
    let imageUrl = ""

    if (imageFile) {
      console.log("[v0] Uploading image to Cloudinary:", imageFile.name)
      imageUrl = await uploadToCloudinary(imageFile)
      console.log("[v0] Image uploaded to Cloudinary, URL:", imageUrl)
    }

    const docRef = await addDoc(collection(db, "products"), {
      ...productData,
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log("[v0] Product created with ID:", docRef.id)
    return docRef.id
  } catch (error) {
    console.error("[v0] Error creating product:", error)
    throw error
  }
}

export async function updateProduct(productId: string, productData: Partial<Product>, imageFile?: File): Promise<void> {
  try {
    const updateData: any = {
      ...productData,
      updatedAt: new Date(),
    }

    if (imageFile) {
      updateData.imageUrl = await uploadToCloudinary(imageFile)
    }

    const productRef = doc(db, "products", productId)
    await updateDoc(productRef, updateData)
  } catch (error) {
    console.error("Error updating product:", error)
    throw error
  }
}

export async function deleteProduct(productId: string, imageUrl?: string): Promise<void> {
  try {
    // Note: Cloudinary images can be deleted via API if needed, but for now we'll keep them

    // Delete product document
    await deleteDoc(doc(db, "products", productId))
  } catch (error) {
    console.error("Error deleting product:", error)
    throw error
  }
}

export async function getProducts(userId: string): Promise<Product[]> {
  try {
    console.log("[v0] Getting products for userId:", userId)
    console.log("[v0] Querying collection 'products' with userId filter")

    const q = query(collection(db, "products"), where("userId", "==", userId))

    console.log("[v0] Executing Firestore query...")
    const querySnapshot = await getDocs(q)
    console.log("[v0] Query completed. Snapshot size:", querySnapshot.size)
    console.log("[v0] Query snapshot empty?", querySnapshot.empty)

    if (querySnapshot.empty) {
      console.log("[v0] No documents found for userId:", userId)
      return []
    }

    const products = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      console.log("[v0] Processing doc:", doc.id)
      console.log("[v0] Doc data userId:", data.userId)
      console.log("[v0] Doc data:", data)

      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      }
    }) as Product[]

    products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    console.log("[v0] Final products array:", products)
    return products
  } catch (error) {
    console.error("[v0] Error getting products:", error)
    console.error("[v0] Error code:", error.code)
    console.error("[v0] Error message:", error.message)
    throw error
  }
}
