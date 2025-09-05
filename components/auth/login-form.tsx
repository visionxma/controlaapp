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
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"

interface LoginFormProps {
  onToggleMode: () => void
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [isResetMode, setIsResetMode] = useState(false)
  const { signIn } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signIn(email, password)
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao sistema de gestão.",
      })
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast({
        title: "Email necessário",
        description: "Digite seu email para recuperar a senha.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      })
      setIsResetMode(false)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar o email de recuperação.",
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
        <CardDescription>{isResetMode ? "Recuperar senha" : "Sistema de Gestão Empresarial"}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={isResetMode ? handlePasswordReset : handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Empresarial</Label>
            <Input
              id="email"
              type="email"
              placeholder="empresa@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {!isResetMode && (
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
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (isResetMode ? "Enviando..." : "Entrando...") : isResetMode ? "Enviar Email" : "Entrar"}
          </Button>
          <div className="text-center space-y-2">
            {!isResetMode ? (
              <>
                <Button type="button" variant="link" onClick={() => setIsResetMode(true)} className="text-sm">
                  Esqueceu sua senha?
                </Button>
                <br />
                <Button type="button" variant="link" onClick={onToggleMode} className="text-sm">
                  Não tem conta? Cadastre sua empresa
                </Button>
              </>
            ) : (
              <Button type="button" variant="link" onClick={() => setIsResetMode(false)} className="text-sm">
                Voltar ao login
              </Button>
            )}
            <div className="text-xs text-muted-foreground space-x-2 mt-4">
              <Link href="/termos-de-uso" className="hover:underline">
                Termos de Uso
              </Link>
              <span>•</span>
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
