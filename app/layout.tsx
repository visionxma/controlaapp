import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import { CustomizationProvider } from "@/lib/customization-context"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Sistema de Gestão - Produtos e Vendas",
  description: "Sistema completo para gestão de produtos, estoque e vendas",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <CustomizationProvider>
              <AuthProvider>
                {children}
                <Toaster />
              </AuthProvider>
            </CustomizationProvider>
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
