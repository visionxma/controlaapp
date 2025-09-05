"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

interface RegisterFormProps {
  onToggleMode: () => void
}

export function RegisterForm({ onToggleMode }: RegisterFormProps) {
  const [companyName, setCompanyName] = useState("")
  const [responsibleName, setResponsibleName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!companyName.trim()) {
      toast({
        title: "Erro",
        description: "Nome da empresa é obrigatório.",
        variant: "destructive",
      })
      return
    }

    if (!responsibleName.trim()) {
      toast({
        title: "Erro",
        description: "Nome do responsável é obrigatório.",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      await signUp(email, password, companyName, responsibleName)
      toast({
        title: "Empresa cadastrada com sucesso!",
        description: `Bem-vindo ao sistema, ${responsibleName}!`,
      })
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: "Não foi possível criar a conta. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center">
  <Image
    src="https://i.imgur.com/P9zZvdt.png"
    alt="Logo"
    width={120}
    height={40}
    className="object-contain w-[150px] h-auto"
  />
</CardTitle>

        <CardTitle className="text-2xl font-bold">Cadastro Empresarial</CardTitle>
        <CardDescription>Registre sua empresa no sistema VisionXMA</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Nome da Empresa</Label>
            <Input
              id="companyName"
              type="text"
              placeholder="Sua Empresa Ltda"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="responsibleName">Nome do Responsável</Label>
            <Input
              id="responsibleName"
              type="text"
              placeholder="João Silva"
              value={responsibleName}
              onChange={(e) => setResponsibleName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Empresarial</Label>
            <Input
              id="email"
              type="email"
              placeholder="contato@suaempresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Cadastrando empresa..." : "Cadastrar Empresa"}
          </Button>
          <div className="text-center space-y-2">
            <Button type="button" variant="link" onClick={onToggleMode} className="text-sm">
              Já tem conta? Faça login
            </Button>
            <div className="text-xs text-muted-foreground space-x-2">
              <span>Ao cadastrar-se, você concorda com nossos</span>
              <Link href="/termos-de-uso" className="hover:underline">
                Termos de Uso
              </Link>
              <span>e</span>
              <Link href="/politica-de-privacidade" className="hover:underline">
                Política de Privacidade
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
