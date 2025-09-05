"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type AccentColor = "purple" | "blue" | "green" | "yellow" | "red" | "pink" | "orange"

interface CustomizationContextType {
  accentColor: AccentColor
  setAccentColor: (color: AccentColor) => void
}

const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined)

const accentColors: Record<AccentColor, string> = {
  purple: "oklch(0.646 0.222 302.71)", // #8b5cf6 - padrão
  blue: "oklch(0.6 0.118 184.704)", // #3b82f6
  green: "oklch(0.769 0.188 70.08)", // #10b981
  yellow: "oklch(0.828 0.189 84.429)", // #f59e0b
  red: "oklch(0.577 0.245 27.325)", // #dc2626
  pink: "oklch(0.7 0.2 350)", // #ec4899
  orange: "oklch(0.7 0.2 50)", // #f97316
}

export function CustomizationProvider({ children }: { children: React.ReactNode }) {
  const [accentColor, setAccentColorState] = useState<AccentColor>("purple")

  useEffect(() => {
    // Carregar cor salva do localStorage
    const savedColor = localStorage.getItem("accent-color") as AccentColor
    if (savedColor && accentColors[savedColor]) {
      setAccentColorState(savedColor)
    }
  }, [])

  useEffect(() => {
    // Aplicar cor no CSS
    const root = document.documentElement
    root.style.setProperty("--accent", accentColors[accentColor])
    root.style.setProperty("--sidebar-accent", accentColors[accentColor])
    root.style.setProperty("--ring", accentColors[accentColor])
    root.style.setProperty("--sidebar-ring", accentColors[accentColor])
  }, [accentColor])

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color)
    localStorage.setItem("accent-color", color)
  }

  return (
    <CustomizationContext.Provider value={{ accentColor, setAccentColor }}>{children}</CustomizationContext.Provider>
  )
}

export function useCustomization() {
  const context = useContext(CustomizationContext)
  if (context === undefined) {
    throw new Error("useCustomization must be used within a CustomizationProvider")
  }
  return context
}
