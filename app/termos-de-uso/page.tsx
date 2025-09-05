import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, FileText, Shield, Users, AlertTriangle } from "lucide-react"

export default function TermosDeUsoPage() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Termos de Uso</h1>
            <p className="text-muted-foreground">CONTROLE.APP - VisionXMA</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Condições de Uso do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-sm leading-relaxed">
            <div>
              <p className="text-muted-foreground mb-4">
                <strong>Última atualização:</strong> {new Date().toLocaleDateString("pt-BR")}
              </p>
              <p>
                Bem-vindo ao CONTROLE.APP, o Sistema de Supermercado desenvolvido pela VisionX Inova Simples. 
                Ao utilizar nosso sistema, você concorda com os seguintes termos e condições de uso.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  1. Aceitação dos Termos
                </h3>
                <p>
                  Ao acessar e usar este sistema, você aceita estar vinculado a estes Termos de Uso. Se você não
                  concordar com qualquer parte destes termos, não deve utilizar o sistema.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">2. Descrição do Serviço</h3>
                <p>
                  O CONTROLE.APP é uma plataforma web desenvolvida pela VisionXMA para gerenciamento de
                  produtos, estoque, vendas e relatórios empresariais. O sistema oferece funcionalidades de:
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Cadastro e gerenciamento de produtos</li>
                  <li>Controle de estoque e movimentações</li>
                  <li>Registro e acompanhamento de vendas</li>
                  <li>Geração de relatórios e analytics</li>
                  <li>Backup automático de dados</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">3. Responsabilidades do Usuário</h3>
                <p>Você é responsável por:</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Manter a confidencialidade de suas credenciais de acesso</li>
                  <li>Usar o sistema apenas para fins legítimos e empresariais</li>
                  <li>Não compartilhar sua conta com terceiros não autorizados</li>
                  <li>Manter seus dados atualizados e precisos</li>
                  <li>Notificar imediatamente sobre qualquer uso não autorizado</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  4. Segurança e Privacidade
                </h3>
                <p>
                  Seus dados são protegidos por medidas de segurança avançadas, incluindo criptografia e backup
                  automático. Todos os dados são armazenados de forma segura no Firebase e são acessíveis apenas por
                  você.
                </p>
                <p>
                Entretanto, informamos que o sistema está sujeito a falhas ocasionais do Firebase e a possíveis vulnerabilidades 
                decorrentes de ataques hackers. Apesar de adotarmos boas práticas de segurança, <strong>não podemos garantir 100% de proteção contra tais eventos.</strong>
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">5. Propriedade Intelectual</h3>
                <p>
                  O sistema, incluindo seu código, design, funcionalidades e documentação, é propriedade da VisionX Inova Simples.
                  Você recebe apenas uma licença de uso, não de propriedade.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">6. Limitações de Responsabilidade</h3>
                <p>
                  A VisionX Inova Simples não se responsabiliza por perdas de dados decorrentes de uso inadequado do sistema, falhas
                  de conectividade ou eventos fora de nosso controle. Recomendamos backups regulares de dados críticos.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  7. Modificações dos Termos
                </h3>
                <p>
                  Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor
                  imediatamente após a publicação. O uso continuado do sistema constitui aceitação dos novos termos.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">8. Suporte Técnico</h3>
                <p>Oferecemos suporte técnico através dos seguintes canais:</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Email: visionxma@gmail.com</li>
                  <li>WhatsApp: +55 (99) 98468-0391</li>
                  <li>Website: visionxma.com</li>
                  <li>Horário: Segunda a Sexta, 8h às 18h | Sábado, 8h às 12h</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">9. Rescisão</h3>
                <p>
                  Você pode encerrar sua conta a qualquer momento. Reservamo-nos o direito de suspender ou encerrar
                  contas que violem estes termos ou sejam usadas para atividades ilegais.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">10. Lei Aplicável</h3>
                <p>
                  Estes termos são regidos pelas leis brasileiras. Qualquer disputa será resolvida nos tribunais
                  competentes do Brasil.
                </p>
              </div>
            </div>

            <div className="border-t pt-4 mt-6">
              <p className="text-center text-muted-foreground">
                <strong>VisionXMA - Soluções Tecnológicas</strong>
                <br />
                Pedreiras, Maranhão - Brasil
                <br />
                Para dúvidas sobre estes termos, entre em contato: visionxma@gmail.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
