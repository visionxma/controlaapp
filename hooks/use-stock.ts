"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { addStockEntry, getStockEntries } from "@/lib/stock"
import type { StockEntry } from "@/lib/types"

export function useStock() {
  const [stockEntries, setStockEntries] = useState<StockEntry[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchStockEntries = async () => {
    if (!user) return

    try {
      setLoading(true)
      const entries = await getStockEntries(user.uid)
      setStockEntries(entries)
    } catch (error) {
      console.error("Error fetching stock entries:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStockEntries()
  }, [user])

  const addEntry = async (entryData: Omit<StockEntry, "id" | "date">) => {
    if (!user) throw new Error("User not authenticated")

    await addStockEntry({ ...entryData, userId: user.uid })
    await fetchStockEntries()
  }

  return {
    stockEntries,
    loading,
    addEntry,
    refetch: fetchStockEntries,
  }
}
