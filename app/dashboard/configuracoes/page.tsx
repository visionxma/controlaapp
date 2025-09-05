"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { useProducts } from "@/hooks/use-products"
import { useSales } from "@/hooks/use-sales"
import { useStock } from "@/hooks/use-stock"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "next-themes"
import { useCustomization } from "@/lib/customization-context"
import { updatePassword, sendPasswordResetEmail, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import {
  User,
  Database,
  Mail,
  MessageCircle,
  Globe,
  MapPin,
  Clock,
  Shield,
  Key,
  Building,
  UserCheck,
  AlertTriangle,
  Palette,
  Monitor,
  Sun,
  Moon,
} from "lucide-react"

export default function ConfiguracoesPage() {
  const { user } = useAuth()
  const { products } = useProducts()
  const { sales } = useSales()
  const { stockEntries } = useStock()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const { accentColor, setAccentColor } = useCustomization()
  const [dataSize, setDataSize] = useState("0 KB")
  const [lastBackup, setLastBackup] = useState("")

  const [companyData, setCompanyData] = useState<{
    companyName: string
    responsibleName: string
  } | null>(null)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (user?.uid) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid))
          if (userDoc.exists()) {
            setCompanyData(userDoc.data() as { companyName: string; responsibleName: string })
          }
        } catch (error) {
          console.error("Erro ao buscar dados da empresa:", error)
        }
      }
    }

    fetchCompanyData()
  }, [user])

  useEffect(() => {
    const calculatePasswordStrength = (password: string) => {
      let strength = 0
      if (password.length >= 8) strength += 25
      if (password.length >= 12) strength += 25
      if (/[A-Z]/.test(password)) strength += 15
      if (/[a-z]/.test(password)) strength += 15
      if (/[0-9]/.test(password)) strength += 10
      if (/[^A-Za-z0-9]/.test(password)) strength += 10
      return Math.min(strength, 100)
    }

    setPasswordStrength(calculatePasswordStrength(newPassword))
  }, [newPassword])

  useEffect(() => {
    const calculateDataSize = () => {
      const totalData = {
        products: products || [],
        sales: sales || [],
        stockEntries: stockEntries || [],
      }
      const dataString = JSON.stringify(totalData)
      const sizeInBytes = new Blob([dataString]).size
      const sizeInKB = (sizeInBytes / 1024).toFixed(1)
      const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(1)

      if (sizeInBytes < 1024) {
        setDataSize(`${sizeInBytes} bytes`)
      } else if (sizeInBytes < 1024 * 1024) {
        setDataSize(`${sizeInKB} KB`)
      } else {
        setDataSize(`${sizeInMB} MB`)
      }
    }

    calculateDataSize()
    setLastBackup(new Date().toLocaleString("pt-BR"))
  }, [products, sales, stockEntries])

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos de senha.",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      })
      return
    }

    if (newPassword.length < 8) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 8 caracteres.",
        variant: "destructive",
      })
      return
    }

    if (passwordStrength < 60) {
      toast({
        title: "Senha fraca",
        description: "Use uma senha mais forte com letras maiúsculas, minúsculas, números e símbolos.",
        variant: "destructive",
      })
      return
    }

    setChangingPassword(true)
    try {
      if (user && user.email) {
        // Reautenticar usuário antes de alterar senha
        const credential = EmailAuthProvider.credential(user.email, currentPassword)
        await reauthenticateWithCredential(user, credential)

        // Alterar senha
        await updatePassword(user, newPassword)

        toast({
          title: "Senha alterada!",
          description: "Sua senha foi alterada com sucesso.",
        })
        setCurrentPassword("")
        setNewPassword("")
        setConfirmNewPassword("")
      }
    } catch (error: any) {
      let errorMessage = "Não foi possível alterar a senha."

      if (error.code === "auth/wrong-password") {
        errorMessage = "Senha atual incorreta."
      } else if (error.code === "auth/weak-password") {
        errorMessage = "A nova senha é muito fraca."
      } else if (error.code === "auth/requires-recent-login") {
        errorMessage = "Faça login novamente para alterar sua senha."
      }

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setChangingPassword(false)
    }
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return "bg-red-500"
    if (passwordStrength < 60) return "bg-yellow-500"
    if (passwordStrength < 80) return "bg-blue-500"
    return "bg-green-500"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength < 30) return "Muito fraca"
    if (passwordStrength < 60) return "Fraca"
    if (passwordStrength < 80) return "Boa"
    return "Muito forte"
  }

  const handleSendPasswordReset = async () => {
    if (!user?.email) return

    try {
      await sendPasswordResetEmail(auth, user.email)
      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar o email de recuperação.",
        variant: "destructive",
      })
    }
  }

  const accentColors = [
    { name: "Roxo", value: "purple", color: "#8b5cf6" },
    { name: "Azul", value: "blue", color: "#3b82f6" },
    { name: "Verde", value: "green", color: "#10b981" },
    { name: "Amarelo", value: "yellow", color: "#f59e0b" },
    { name: "Vermelho", value: "red", color: "#dc2626" },
    { name: "Rosa", value: "pink", color: "#ec4899" },
    { name: "Laranja", value: "orange", color: "#f97316" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">Gerencie suas preferências e configurações do sistema</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Personalização
            </CardTitle>
            <CardDescription>Customize a aparência do sistema conforme sua preferência</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tema */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Tema do Sistema</Label>
                <p className="text-sm text-muted-foreground">Escolha entre modo claro, escuro ou automático</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  onClick={() => setTheme("light")}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                >
                  <Sun className="h-5 w-5" />
                  <span className="text-sm">Claro</span>
                </Button>

                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  onClick={() => setTheme("dark")}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                >
                  <Moon className="h-5 w-5" />
                  <span className="text-sm">Escuro</span>
                </Button>

                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  onClick={() => setTheme("system")}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                >
                  <Monitor className="h-5 w-5" />
                  <span className="text-sm">Automático</span>
                </Button>
              </div>
            </div>

            <Separator />

            {/* Cor de Destaque */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Cor de Destaque</Label>
                <p className="text-sm text-muted-foreground">Personalize a cor principal do sistema</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {accentColors.map((color) => (
                  <Button
                    key={color.value}
                    variant={accentColor === color.value ? "default" : "outline"}
                    onClick={() => setAccentColor(color.value as any)}
                    className="flex items-center gap-2 h-auto py-3"
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: color.color }}
                    />
                    <span className="text-sm">{color.name}</span>
                  </Button>
                ))}
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">
                  A cor de destaque será aplicada em botões, links e elementos interativos do sistema.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados da Conta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Dados da Conta
            </CardTitle>
            <CardDescription>Informações do seu perfil e configurações da conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {companyData && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Nome da Empresa
                    </Label>
                    <Input id="companyName" value={companyData.companyName} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responsibleName" className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      Responsável
                    </Label>
                    <Input id="responsibleName" value={companyData.responsibleName} disabled />
                  </div>
                </div>
                <Separator />
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" value={user?.email || ""} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status da Conta</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Ativa
                  </Badge>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="created">Conta criada em</Label>
              <Input
                id="created"
                value={
                  user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleString("pt-BR") : "N/A"
                }
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastLogin">Último acesso</Label>
              <Input
                id="lastLogin"
                value={
                  user?.metadata?.lastSignInTime
                    ? new Date(user.metadata.lastSignInTime).toLocaleString("pt-BR")
                    : "N/A"
                }
                disabled
              />
            </div>
          </CardContent>
        </Card>

        {/* Segurança da Conta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Segurança da Conta
            </CardTitle>
            <CardDescription>Gerencie sua senha e configurações de segurança</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="h-4 w-4" />
                  <p className="text-sm font-medium">Alteração de Senha Segura</p>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  Por segurança, você precisa confirmar sua senha atual antes de definir uma nova.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Digite sua senha atual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Digite a nova senha"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword">Confirmar Nova Senha</Label>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    placeholder="Confirme a nova senha"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                  />
                </div>
              </div>

              {newPassword && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Força da senha</Label>
                    <span className="text-xs text-muted-foreground">{getPasswordStrengthText()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleChangePassword} disabled={changingPassword} className="flex-1">
                  {changingPassword ? "Alterando..." : "Alterar Senha"}
                </Button>
                <Button variant="outline" onClick={handleSendPasswordReset} className="flex-1 bg-transparent">
                  Enviar Email de Recuperação
                </Button>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  <strong>Requisitos da senha:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Mínimo de 8 caracteres</li>
                  <li>Pelo menos uma letra maiúscula</li>
                  <li>Pelo menos uma letra minúscula</li>
                  <li>Pelo menos um número</li>
                  <li>Pelo menos um símbolo especial</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Informações do Sistema
            </CardTitle>
            <CardDescription>Estatísticas e informações sobre seus dados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-foreground">Último Backup</p>
                  <p className="text-muted-foreground">{lastBackup || "Nunca"}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Backup Automático</p>
                  <p className="text-muted-foreground">Imediato (Firebase)</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Tamanho dos Dados</p>
                  <p className="text-muted-foreground">{dataSize}</p>
                </div>
              </div>
              <Separator className="my-3" />
              <div className="text-xs text-muted-foreground">
                <p>• Os dados são salvos automaticamente no Firebase em tempo real</p>
                <p>• Backup automático e sincronização em nuvem</p>
                <p>• Seus dados estão seguros e protegidos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suporte */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Suporte Técnico
            </CardTitle>
            <CardDescription>Entre em contato conosco para obter ajuda e suporte técnico</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">E-mail</h3>
                </div>
                <p className="text-sm text-muted-foreground">Suporte por e-mail</p>
                <div className="space-y-2">
                  <p className="font-medium">visionxma@gmail.com</p>
                  <p className="text-sm text-muted-foreground">Resposta em até 24h</p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="mailto:visionxma@gmail.com">
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar E-mail
                    </a>
                  </Button>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold">WhatsApp</h3>
                </div>
                <p className="text-sm text-muted-foreground">Suporte direto</p>
                <div className="space-y-2">
                  <p className="font-medium">+55 (99) 98468-0391</p>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Disponível
                  </Badge>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://wa.me/5599984680391" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Abrir WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Website e Localização */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold">Website Oficial</h3>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://visionxma.com" target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4 mr-2" />
                    Visitar Site
                  </a>
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold">Localização</h3>
                </div>
                <p className="text-sm">Pedreiras, Maranhão - Brasil</p>
                <p className="text-xs text-muted-foreground">Atendimento remoto disponível para todo o Brasil</p>
              </div>
            </div>

            <Separator />

            {/* Horário de Atendimento */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold">Horário de Atendimento</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p>
                    <strong>Segunda a Sexta:</strong> 8h às 18h
                  </p>
                  <p>
                    <strong>Sábado:</strong> 8h às 12h
                  </p>
                </div>
                <div className="text-muted-foreground">
                  <p>* Suporte de emergência disponível via WhatsApp</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
