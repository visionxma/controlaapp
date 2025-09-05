"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { addSale, getSales, getSalesStats } from "@/lib/sales"
import type { Sale } from "@/lib/types"

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([])
  const [salesStats, setSalesStats] = useState({
    monthlyRevenue: 0,
    monthlyProfit: 0,
    dailyRevenue: 0,
    dailyProfit: 0,
    totalSales: 0,
    monthlySalesCount: 0,
    dailySalesCount: 0,
  })
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchSales = async () => {
    if (!user) return

    try {
      setLoading(true)
      const [salesData, statsData] = await Promise.all([getSales(user.uid), getSalesStats(user.uid)])
      setSales(salesData)
      setSalesStats(statsData)
    } catch (error) {
      console.error("Error fetching sales:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSales()
  }, [user])

  const addNewSale = async (saleData: Omit<Sale, "id" | "date">) => {
    if (!user) throw new Error("User not authenticated")

    await addSale({ ...saleData, userId: user.uid })
    await fetchSales()
  }

  return {
    sales,
    salesStats,
    loading,
    addSale: addNewSale,
    refetch: fetchSales,
  }
}
