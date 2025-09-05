"use client"

import type React from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Footer } from "@/components/layout/footer"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Sidebar />
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1 p-6 lg:p-8">{children}</main>
        <Footer />
      </div>
    </div>
  )
}
