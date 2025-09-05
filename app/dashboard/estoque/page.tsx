"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useProducts } from "@/hooks/use-products"
import { useStock } from "@/hooks/use-stock"
import { StockEntryForm } from "@/components/stock/stock-entry-form"
import { StockHistory } from "@/components/stock/stock-history"
import { CurrentStock } from "@/components/stock/current-stock"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EstoquePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { products, loading: productsLoading, refetch: refetchProducts } = useProducts()
  const { stockEntries, loading: stockLoading, addEntry } = useStock()
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState("current")
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

  const handleSubmit = async (entryData: any) => {
    try {
      await addEntry(entryData)
      await refetchProducts() // Refresh products to show updated stock
      toast({
        title: "Entrada registrada!",
        description: "A entrada de estoque foi registrada com sucesso.",
      })
      setShowForm(false)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível registrar a entrada. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Controle de Estoque</h1>
          <p className="text-muted-foreground">Gerencie entradas e monitore o estoque</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            {showForm ? (
              <>
                <X className="h-4 w-4" />
                Cancelar
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Nova Entrada
              </>
            )}
          </Button>
        </div>
      </div>

      {showForm && <StockEntryForm products={products} onSubmit={handleSubmit} />}

      <Tabs defaultValue="current" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="current">Estoque Atual</TabsTrigger>
          <TabsTrigger value="history">Histórico de Entradas</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          <CurrentStock products={products} loading={productsLoading} />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <StockHistory stockEntries={stockEntries} products={products} loading={stockLoading} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
