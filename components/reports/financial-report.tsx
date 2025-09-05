"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import type { PaymentMethodReport, PeriodReport } from "@/lib/reports"

interface FinancialReportProps {
  paymentMethodData: PaymentMethodReport[]
  periodData: PeriodReport[]
  loading?: boolean
}

const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"]

export function FinancialReport({ paymentMethodData, periodData, loading }: FinancialReportProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-64 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const totalRevenue = paymentMethodData.reduce((sum, item) => sum + item.total, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Relatório Financeiro</h2>
          <p className="text-sm text-muted-foreground">Análise detalhada das vendas e faturamento</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Payment Methods Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Vendas por Forma de Pagamento</CardTitle>
            <CardDescription>Distribuição do faturamento por método de pagamento</CardDescription>
          </CardHeader>
          <CardContent>
            {paymentMethodData.length > 0 ? (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ method, percentage }) => `${method} (${percentage.toFixed(1)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="total"
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`R$ ${value.toFixed(2)}`, "Total"]} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-2">
                  {paymentMethodData.map((item, index) => (
                    <div key={item.method} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span>{item.method}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">R$ {item.total.toFixed(2)}</div>
                        <div className="text-muted-foreground">{item.count} vendas</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                Nenhuma venda registrada
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Faturamento dos Últimos 30 Dias</CardTitle>
            <CardDescription>Evolução diária do faturamento e lucro</CardDescription>
          </CardHeader>
          <CardContent>
            {periodData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={periodData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `R$ ${value.toFixed(2)}`,
                      name === "revenue" ? "Faturamento" : "Lucro",
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8b5cf6" name="Faturamento" />
                  <Bar dataKey="profit" fill="#10b981" name="Lucro" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                Nenhuma venda nos últimos 30 dias
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Faturado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentMethodData.reduce((sum, item) => sum + item.count, 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ticket Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R${" "}
              {paymentMethodData.length > 0
                ? (totalRevenue / paymentMethodData.reduce((sum, item) => sum + item.count, 0)).toFixed(2)
                : "0.00"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
