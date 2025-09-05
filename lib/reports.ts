import { getSales } from "./sales"
import { getStockEntries } from "./stock"
import { getProducts } from "./products"

export interface PaymentMethodReport {
  method: string
  total: number
  count: number
  percentage: number
}

export interface ProductPerformance {
  productId: string
  productName: string
  totalSold: number
  totalRevenue: number
  totalProfit: number
  salesCount: number
}

export interface PeriodReport {
  period: string
  revenue: number
  profit: number
  salesCount: number
}

export async function getPaymentMethodReport(userId: string): Promise<PaymentMethodReport[]> {
  try {
    const sales = await getSales(userId)

    const paymentMethods = sales.reduce(
      (acc, sale) => {
        const method = sale.paymentMethod
        if (!acc[method]) {
          acc[method] = { total: 0, count: 0 }
        }
        acc[method].total += sale.totalValue
        acc[method].count += 1
        return acc
      },
      {} as Record<string, { total: number; count: number }>,
    )

    const totalRevenue = Object.values(paymentMethods).reduce((sum, method) => sum + method.total, 0)

    const methodLabels = {
      pix: "PIX",
      dinheiro: "Dinheiro",
      cartao: "Cartão",
      fiado: "Fiado",
    }

    return Object.entries(paymentMethods).map(([method, data]) => ({
      method: methodLabels[method as keyof typeof methodLabels] || method,
      total: data.total,
      count: data.count,
      percentage: totalRevenue > 0 ? (data.total / totalRevenue) * 100 : 0,
    }))
  } catch (error) {
    console.error("Error getting payment method report:", error)
    throw error
  }
}

export async function getProductPerformanceReport(userId: string): Promise<ProductPerformance[]> {
  try {
    const [sales, products] = await Promise.all([getSales(userId), getProducts(userId)])

    const productMap = products.reduce(
      (acc, product) => {
        acc[product.id] = product.name
        return acc
      },
      {} as Record<string, string>,
    )

    const performance = sales.reduce(
      (acc, sale) => {
        const productId = sale.productId
        if (!acc[productId]) {
          acc[productId] = {
            totalSold: 0,
            totalRevenue: 0,
            totalProfit: 0,
            salesCount: 0,
          }
        }
        acc[productId].totalSold += sale.quantity
        acc[productId].totalRevenue += sale.totalValue
        acc[productId].totalProfit += sale.profit
        acc[productId].salesCount += 1
        return acc
      },
      {} as Record<string, Omit<ProductPerformance, "productId" | "productName">>,
    )

    return Object.entries(performance)
      .map(([productId, data]) => ({
        productId,
        productName: productMap[productId] || "Produto não encontrado",
        ...data,
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
  } catch (error) {
    console.error("Error getting product performance report:", error)
    throw error
  }
}

export async function getPeriodReport(userId: string, days = 30): Promise<PeriodReport[]> {
  try {
    const sales = await getSales(userId)
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - days)

    const filteredSales = sales.filter((sale) => sale.date >= startDate)

    // Group by day
    const dailyData = filteredSales.reduce(
      (acc, sale) => {
        const dateKey = sale.date.toISOString().split("T")[0]
        if (!acc[dateKey]) {
          acc[dateKey] = { revenue: 0, profit: 0, salesCount: 0 }
        }
        acc[dateKey].revenue += sale.totalValue
        acc[dateKey].profit += sale.profit
        acc[dateKey].salesCount += 1
        return acc
      },
      {} as Record<string, { revenue: number; profit: number; salesCount: number }>,
    )

    return Object.entries(dailyData)
      .map(([date, data]) => ({
        period: new Date(date).toLocaleDateString("pt-BR"),
        ...data,
      }))
      .sort(
        (a, b) =>
          new Date(a.period.split("/").reverse().join("-")).getTime() -
          new Date(b.period.split("/").reverse().join("-")).getTime(),
      )
  } catch (error) {
    console.error("Error getting period report:", error)
    throw error
  }
}

export async function getStockReport(userId: string) {
  try {
    const [products, stockEntries] = await Promise.all([getProducts(userId), getStockEntries(userId)])

    const lowStockProducts = products.filter((p) => p.currentStock <= 5 && p.currentStock > 0)
    const outOfStockProducts = products.filter((p) => p.currentStock === 0)
    const totalStockValue = products.reduce((sum, product) => sum + product.currentStock * product.costPrice, 0)

    return {
      totalProducts: products.length,
      totalStockItems: products.reduce((sum, p) => sum + p.currentStock, 0),
      totalStockValue,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      lowStockProducts,
      outOfStockProducts,
      recentEntries: stockEntries.slice(0, 10),
    }
  } catch (error) {
    console.error("Error getting stock report:", error)
    throw error
  }
}
