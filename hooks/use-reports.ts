"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  getPaymentMethodReport,
  getProductPerformanceReport,
  getPeriodReport,
  getStockReport,
  type PaymentMethodReport,
  type ProductPerformance,
  type PeriodReport,
} from "@/lib/reports"

export function useReports() {
  const [paymentMethodReport, setPaymentMethodReport] = useState<PaymentMethodReport[]>([])
  const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([])
  const [periodReport, setPeriodReport] = useState<PeriodReport[]>([])
  const [stockReport, setStockReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchReports = async () => {
    if (!user) return

    try {
      setLoading(true)
      const [paymentData, productData, periodData, stockData] = await Promise.all([
        getPaymentMethodReport(user.uid),
        getProductPerformanceReport(user.uid),
        getPeriodReport(user.uid, 30),
        getStockReport(user.uid),
      ])

      setPaymentMethodReport(paymentData)
      setProductPerformance(productData)
      setPeriodReport(periodData)
      setStockReport(stockData)
    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [user])

  return {
    paymentMethodReport,
    productPerformance,
    periodReport,
    stockReport,
    loading,
    refetch: fetchReports,
  }
}
