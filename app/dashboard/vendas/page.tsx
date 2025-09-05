"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useProducts } from "@/hooks/use-products"
import { useSales } from "@/hooks/use-sales"
import { SaleForm } from "@/components/sales/sale-form"
import { SalesHistory } from "@/components/sales/sales-history"
import { SalesStats } from "@/components/sales/sales-stats"
import { QuickSaleList } from "@/components/sales/quick-sale-list"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function VendasPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { products, loading: productsLoading, refetch: refetchProducts } = useProducts()
  const { sales, salesStats, loading: salesLoading, addSale } = useSales()
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState("quick-sale")
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

  const handleSubmit = async (saleData: any) => {
    try {
      await addSale(saleData)
      await refetchProducts() // Refresh products to show updated stock
      toast({
        title: "Venda registrada!",
        description: "A venda foi registrada com sucesso.",
      })
      setShowForm(false)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível registrar a venda. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const hasProductsWithStock = products.some((p) => p.currentStock > 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendas</h1>
          <p className="text-muted-foreground">Registre e gerencie suas vendas</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowForm(!showForm)} className="gap-2" disabled={!hasProductsWithStock}>
            {showForm ? (
              <>
                <X className="h-4 w-4" />
                Cancelar
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Nova Venda
              </>
            )}
          </Button>
        </div>
      </div>

      {!hasProductsWithStock && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            Não há produtos com estoque disponível para venda. Cadastre produtos ou adicione estoque para começar a
            vender.
          </p>
        </div>
      )}

      {showForm && hasProductsWithStock && (
        <SaleForm products={products.filter((p) => p.currentStock > 0)} onSubmit={handleSubmit} />
      )}

      <SalesStats stats={salesStats} loading={salesLoading} />

      <Tabs defaultValue="quick-sale" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="quick-sale">Venda Rápida</TabsTrigger>
          <TabsTrigger value="history">Histórico de Vendas</TabsTrigger>
        </TabsList>

        <TabsContent value="quick-sale" className="space-y-4">
          <QuickSaleList products={products} onSubmit={handleSubmit} loading={productsLoading} />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <SalesHistory sales={sales} products={products} loading={salesLoading} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
