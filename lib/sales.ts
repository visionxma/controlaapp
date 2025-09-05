import { collection, addDoc, getDocs, query, where, doc, updateDoc, increment } from "firebase/firestore"
import { db } from "./firebase"
import type { Sale } from "./types"

export async function addSale(saleData: Omit<Sale, "id" | "date">): Promise<string> {
  try {
    // Add sale record
    const docRef = await addDoc(collection(db, "sales"), {
      ...saleData,
      date: new Date(),
    })

    // Update product current stock (decrease)
    const productRef = doc(db, "products", saleData.productId)
    await updateDoc(productRef, {
      currentStock: increment(-saleData.quantity),
      updatedAt: new Date(),
    })

    return docRef.id
  } catch (error) {
    console.error("Error adding sale:", error)
    throw error
  }
}

export async function getSales(userId: string): Promise<Sale[]> {
  try {
    const q = query(collection(db, "sales"), where("userId", "==", userId))

    const querySnapshot = await getDocs(q)
    const sales = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date(),
    })) as Sale[]

    return sales.sort((a, b) => b.date.getTime() - a.date.getTime())
  } catch (error) {
    console.error("Error getting sales:", error)
    throw error
  }
}

export async function getSalesByProduct(productId: string, userId: string): Promise<Sale[]> {
  try {
    const q = query(collection(db, "sales"), where("productId", "==", productId), where("userId", "==", userId))

    const querySnapshot = await getDocs(q)
    const sales = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate() || new Date(),
    })) as Sale[]

    return sales.sort((a, b) => b.date.getTime() - a.date.getTime())
  } catch (error) {
    console.error("Error getting sales by product:", error)
    throw error
  }
}

export async function getSalesStats(userId: string) {
  try {
    const sales = await getSales(userId)

    const today = new Date()
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())

    const monthlySales = sales.filter((sale) => sale.date >= startOfMonth)
    const dailySales = sales.filter((sale) => sale.date >= startOfDay)

    const monthlyRevenue = monthlySales.reduce((sum, sale) => sum + sale.totalValue, 0)
    const monthlyProfit = monthlySales.reduce((sum, sale) => sum + sale.profit, 0)
    const dailyRevenue = dailySales.reduce((sum, sale) => sum + sale.totalValue, 0)
    const dailyProfit = dailySales.reduce((sum, sale) => sum + sale.profit, 0)

    return {
      monthlyRevenue,
      monthlyProfit,
      dailyRevenue,
      dailyProfit,
      totalSales: sales.length,
      monthlySalesCount: monthlySales.length,
      dailySalesCount: dailySales.length,
    }
  } catch (error) {
    console.error("Error getting sales stats:", error)
    throw error
  }
}
