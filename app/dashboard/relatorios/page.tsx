"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useReports } from "@/hooks/use-reports"
import { FinancialReport } from "@/components/reports/financial-report"
import { ProductPerformanceReport } from "@/components/reports/product-performance"
import { StockReport } from "@/components/reports/stock-report"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Package, DollarSign } from "lucide-react"

export default function RelatoriosPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { paymentMethodReport, productPerformance, periodReport, stockReport, loading } = useReports()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/")
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatórios e Analytics</h1>
        <p className="text-muted-foreground">Análises detalhadas do seu negócio</p>
      </div>

      <Tabs defaultValue="financial" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Financeiro
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Produtos
          </TabsTrigger>
          <TabsTrigger value="stock" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Estoque
          </TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="space-y-4">
          <FinancialReport paymentMethodData={paymentMethodReport} periodData={periodReport} loading={loading} />
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <ProductPerformanceReport data={productPerformance} loading={loading} />
        </TabsContent>

        <TabsContent value="stock" className="space-y-4">
          <StockReport data={stockReport} loading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
