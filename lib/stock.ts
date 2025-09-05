import { collection, addDoc, getDocs, query, where, doc, updateDoc, increment } from "firebase/firestore"
import { db } from "./firebase"
import type { StockEntry } from "./types"

export async function addStockEntry(stockEntryData: Omit<StockEntry, "id" | "date">): Promise<string> {
  try {
    // Add stock entry record
    const docRef = await addDoc(collection(db, "stockEntries"), {
      ...stockEntryData,
      date: new Date(),
    })

    // Update product current stock
    const productRef = doc(db, "products", stockEntryData.productId)
    await updateDoc(productRef, {
      currentStock: increment(stockEntryData.quantity),
      updatedAt: new Date(),
    })

    return docRef.id
  } catch (error) {
    console.error("Error adding stock entry:", error)
    throw error
  }
}

export async function getStockEntries(userId: string): Promise<StockEntry[]> {
  try {
    const q = query(collection(db, "stockEntries"), where("userId", "==", userId))

    const querySnapshot = await getDocs(q)
    const entries = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date(),
    })) as StockEntry[]

    return entries.sort((a, b) => b.date.getTime() - a.date.getTime())
  } catch (error) {
    console.error("Error getting stock entries:", error)
    throw error
  }
}

export async function getStockEntriesByProduct(productId: string, userId: string): Promise<StockEntry[]> {
  try {
    const q = query(collection(db, "stockEntries"), where("productId", "==", productId), where("userId", "==", userId))

    const querySnapshot = await getDocs(q)
    const entries = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date(),
    })) as StockEntry[]

    return entries.sort((a, b) => b.date.getTime() - a.date.getTime())
  } catch (error) {
    console.error("Error getting stock entries by product:", error)
    throw error
  }
}
