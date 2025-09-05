import jsPDF from "jspdf"

export interface PDFColumn {
  header: string
  dataKey: string
  width?: number
}

export interface PDFOptions {
  title: string
  subtitle?: string
  columns: PDFColumn[]
  data: any[]
  filename?: string
}

export function generateSimplePDF(options: PDFOptions) {
  const { title, subtitle, columns, data, filename = "relatorio.pdf" } = options

  // Create new PDF document
  const doc = new jsPDF()

  // Set simple font
  doc.setFont("helvetica", "normal")
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0) // Black text only

  let yPosition = 20

  doc.setFontSize(14)
  doc.text(title, 20, yPosition)
  yPosition += 10

  if (subtitle) {
    doc.setFontSize(10)
    doc.text(subtitle, 20, yPosition)
    yPosition += 8
  }

  doc.setFontSize(9)
  doc.text(
    `Gerado em: ${new Date().toLocaleDateString("pt-BR")} as ${new Date().toLocaleTimeString("pt-BR")}`,
    20,
    yPosition,
  )
  yPosition += 15

  doc.setFontSize(10)

  data.forEach((row, index) => {
    // Add item number
    doc.text(`${index + 1}.`, 20, yPosition)
    yPosition += 5

    // Display each field as simple text lines
    columns.forEach((col) => {
      let value = row[col.dataKey]

      if (
        col.dataKey.includes("total") ||
        col.dataKey.includes("price") ||
        col.dataKey.includes("Price") ||
        col.dataKey.includes("revenue") ||
        col.dataKey.includes("Revenue") ||
        col.dataKey.includes("profit") ||
        col.dataKey.includes("Value")
      ) {
        const numValue = typeof value === "number" ? value : Number.parseFloat(value)
        if (!isNaN(numValue) && isFinite(numValue)) {
          value = `R$ ${numValue.toFixed(2)}`
        } else {
          value = "R$ 0,00"
        }
      }

      const text = String(value || "-")
      doc.text(`  ${col.header}: ${text}`, 25, yPosition)
      yPosition += 4
    })

    yPosition += 3 // Space between items

    if (yPosition > 270) {
      doc.addPage()
      yPosition = 20
    }
  })

  // Save the PDF
  doc.save(filename)
}

export function generateFinancialReportPDF(paymentMethodData: any[], periodData: any[]) {
  // Payment Methods Report
  generateSimplePDF({
    title: "Relatório Financeiro - Formas de Pagamento",
    subtitle: "Distribuição do faturamento por método de pagamento",
    columns: [
      { header: "Forma de Pagamento", dataKey: "method" },
      { header: "Quantidade de Vendas", dataKey: "count" },
      { header: "Total Faturado", dataKey: "total" },
      { header: "Percentual", dataKey: "percentage" },
    ],
    data: paymentMethodData.map((item) => ({
      ...item,
      percentage:
        typeof item.percentage === "number" && !isNaN(item.percentage) ? `${item.percentage.toFixed(1)}%` : "0%",
    })),
    filename: "relatorio-financeiro-pagamentos.pdf",
  })
}

export function generateProductListPDF(products: any[]) {
  generateSimplePDF({
    title: "Lista de Produtos",
    subtitle: "Todos os produtos cadastrados no sistema",
    columns: [
      { header: "Nome", dataKey: "name" },
      { header: "Categoria", dataKey: "category" },
      { header: "Preço de Venda", dataKey: "sellPrice" },
      { header: "Preço de Custo", dataKey: "costPrice" },
      { header: "Estoque", dataKey: "stock" },
    ],
    data: products,
    filename: "lista-produtos.pdf",
  })
}

export function generateSalesHistoryPDF(sales: any[], products: any[]) {
  const salesWithProductNames = sales.map((sale) => {
    const product = products.find((p) => p.id === sale.productId)
    return {
      ...sale,
      productName: product?.name || "Produto não encontrado",
      date: new Date(sale.createdAt).toLocaleDateString("pt-BR"),
    }
  })

  generateSimplePDF({
    title: "Histórico de Vendas",
    subtitle: "Todas as vendas realizadas no sistema",
    columns: [
      { header: "Data", dataKey: "date" },
      { header: "Produto", dataKey: "productName" },
      { header: "Quantidade", dataKey: "quantity" },
      { header: "Valor Unitário", dataKey: "unitPrice" },
      { header: "Valor Total", dataKey: "total" },
      { header: "Forma de Pagamento", dataKey: "paymentMethod" },
    ],
    data: salesWithProductNames,
    filename: "historico-vendas.pdf",
  })
}

export function generateStockReportPDF(stockData: any[]) {
  generateSimplePDF({
    title: "Relatório de Estoque",
    subtitle: "Situação atual do estoque",
    columns: [
      { header: "Produto", dataKey: "name" },
      { header: "Estoque Atual", dataKey: "stock" },
      { header: "Estoque Mínimo", dataKey: "minStock" },
      { header: "Status", dataKey: "status" },
      { header: "Valor em Estoque", dataKey: "stockValue" },
    ],
    data: stockData,
    filename: "relatorio-estoque.pdf",
  })
}

export function generateProductPerformancePDF(performanceData: any[]) {
  generateSimplePDF({
    title: "Relatório de Performance dos Produtos",
    subtitle: "Análise detalhada da performance de vendas por produto",
    columns: [
      { header: "Produto", dataKey: "productName" },
      { header: "Qtd Vendida", dataKey: "totalSold" },
      { header: "Nº de Vendas", dataKey: "salesCount" },
      { header: "Faturamento", dataKey: "totalRevenue" },
      { header: "Lucro Total", dataKey: "totalProfit" },
      { header: "Margem (%)", dataKey: "profitMargin" },
    ],
    data: performanceData.map((item) => ({
      ...item,
      profitMargin:
        typeof item.totalRevenue === "number" && item.totalRevenue > 0 && typeof item.totalProfit === "number"
          ? `${((item.totalProfit / item.totalRevenue) * 100).toFixed(1)}%`
          : "0%",
    })),
    filename: "relatorio-performance-produtos.pdf",
  })
}

export function generateDashboardPDF(dashboardData: any) {
  const doc = new jsPDF()

  doc.setFont("helvetica", "normal")
  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0)

  let yPosition = 20

  // Header
  doc.text(`Dashboard - ${dashboardData.companyName}`, 20, yPosition)
  yPosition += 10

  if (dashboardData.responsibleName) {
    doc.setFontSize(10)
    doc.text(`Responsável: ${dashboardData.responsibleName}`, 20, yPosition)
    yPosition += 8
  }

  doc.setFontSize(9)
  doc.text(`Período: ${dashboardData.period}`, 20, yPosition)
  yPosition += 5
  doc.text(
    `Gerado em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`,
    20,
    yPosition,
  )
  yPosition += 15

  doc.setFontSize(10)

  // Stats
  if (dashboardData.stats) {
    doc.text("ESTATÍSTICAS:", 20, yPosition)
    yPosition += 8

    doc.text(`  Total de Vendas: ${dashboardData.stats.totalSales || 0}`, 25, yPosition)
    yPosition += 5
    doc.text(`  Faturamento Total: R$ ${(dashboardData.stats.totalRevenue || 0).toFixed(2)}`, 25, yPosition)
    yPosition += 5
    doc.text(`  Produtos Vendidos: ${dashboardData.stats.totalProductsSold || 0}`, 25, yPosition)
    yPosition += 10
  }

  // Recent Sales
  if (dashboardData.recentSales && dashboardData.recentSales.length > 0) {
    doc.text("VENDAS RECENTES:", 20, yPosition)
    yPosition += 8

    dashboardData.recentSales.slice(0, 10).forEach((sale: any, index: number) => {
      doc.text(`${index + 1}.`, 20, yPosition)
      yPosition += 5
      doc.text(`  Data: ${new Date(sale.createdAt).toLocaleDateString("pt-BR")}`, 25, yPosition)
      yPosition += 4
      doc.text(`  Produto: ${sale.productName || "N/A"}`, 25, yPosition)
      yPosition += 4
      doc.text(`  Quantidade: ${sale.quantity || 0}`, 25, yPosition)
      yPosition += 4
      doc.text(`  Total: R$ ${(sale.total || 0).toFixed(2)}`, 25, yPosition)
      yPosition += 6

      if (yPosition > 270) {
        doc.addPage()
        yPosition = 20
      }
    })
  }

  doc.save("dashboard-relatorio.pdf")
}

export function generateStockPDF(products: any[]) {
  generateSimplePDF({
    title: "Relatório de Estoque Atual",
    subtitle: "Situação atual do estoque de todos os produtos",
    columns: [
      { header: "Nome do Produto", dataKey: "name" },
      { header: "Categoria", dataKey: "category" },
      { header: "Estoque Atual", dataKey: "currentStock" },
      { header: "Estoque Mínimo", dataKey: "minStock" },
      { header: "Preço de Custo", dataKey: "costPrice" },
      { header: "Preço de Venda", dataKey: "sellPrice" },
    ],
    data: products,
    filename: "estoque-atual.pdf",
  })
}

export function generateStockHistoryPDF(stockEntries: any[], products: any[]) {
  const entriesWithProductNames = stockEntries.map((entry) => {
    const product = products.find((p) => p.id === entry.productId)
    return {
      ...entry,
      productName: product?.name || "Produto não encontrado",
      date: new Date(entry.createdAt).toLocaleDateString("pt-BR"),
    }
  })

  generateSimplePDF({
    title: "Histórico de Entradas de Estoque",
    subtitle: "Todas as movimentações de entrada no estoque",
    columns: [
      { header: "Data", dataKey: "date" },
      { header: "Produto", dataKey: "productName" },
      { header: "Quantidade", dataKey: "quantity" },
      { header: "Preço de Custo", dataKey: "costPrice" },
      { header: "Observações", dataKey: "notes" },
    ],
    data: entriesWithProductNames,
    filename: "historico-estoque.pdf",
  })
}
