import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Shield, Database, Eye, Lock, UserCheck } from "lucide-react"

export default function PoliticaDePrivacidadePage() {
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
            <h1 className="text-3xl font-bold text-foreground">Política de Privacidade</h1>
            <p className="text-muted-foreground">Sistema de Controle de Frotas - VisionXMA</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Proteção de Dados e Privacidade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-sm leading-relaxed">
            <div>
              <p className="text-muted-foreground mb-4">
                <strong>Última atualização:</strong> {new Date().toLocaleDateString("pt-BR")}
              </p>
              <p>
                A VisionX Inova Simples, responsável pelo CONTROLE.APP, está comprometida com a proteção da sua privacidade e dos seus dados pessoais.
                Esta política explica como coletamos, usamos, armazenamos e protegemos suas informações.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  1. Informações que Coletamos
                </h3>
                <p>Coletamos as seguintes informações quando você usa nosso sistema:</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>
                    <strong>Dados de Conta:</strong> Email, senha (criptografada), nome da empresa
                  </li>
                  <li>
                    <strong>Dados Empresariais:</strong> Produtos, estoque, vendas, relatórios
                  </li>
                  <li>
                    <strong>Dados de Uso:</strong> Logs de acesso, horários de utilização, funcionalidades utilizadas
                  </li>
                  <li>
                    <strong>Dados Técnicos:</strong> Endereço IP, tipo de navegador, sistema operacional
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  2. Como Usamos suas Informações
                </h3>
                <p>Utilizamos suas informações para:</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Fornecer e manter o funcionamento do sistema</li>
                  <li>Processar e armazenar seus dados empresariais</li>
                  <li>Gerar relatórios e analytics personalizados</li>
                  <li>Oferecer suporte técnico e atendimento ao cliente</li>
                  <li>Melhorar nossos serviços e funcionalidades</li>
                  <li>Garantir a segurança e prevenir fraudes</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  3. Proteção e Segurança dos Dados
                </h3>
                <p>Implementamos medidas rigorosas de segurança:</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>
                    <strong>Criptografia:</strong> Todos os dados são criptografados em trânsito e em repouso
                  </li>
                  <li>
                    <strong>Firebase Security:</strong> Utilizamos a infraestrutura segura do Google Firebase
                  </li>
                  <li>
                    <strong>Autenticação:</strong> Sistema de login seguro com verificação de email
                  </li>
                  <li>
                    <strong>Isolamento:</strong> Cada empresa acessa apenas seus próprios dados
                  </li>
                  <li>
                    <strong>Backup Automático:</strong> Backup contínuo e redundante dos dados
                  </li>
                  <li>
                    <strong>Monitoramento:</strong> Monitoramento 24/7 para detectar atividades suspeitas
                  </li>
                  <p>
                    <strong>Aviso Importante:</strong> Apesar de todos os esforços, o sistema pode estar sujeito 
                    a falhas ocasionais do Firebase ou a vulnerabilidades decorrentes de ataques hackers. 
                    Embora adotemos boas práticas, <strong>não é possível garantir 100% de proteção contra tais riscos.</strong>

                  </p>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">4. Armazenamento de Dados</h3>
                <p>
                  Seus dados são armazenados nos servidores seguros do Google Firebase, localizados em data centers
                  certificados. Os dados são mantidos pelo tempo necessário para fornecer nossos serviços ou conforme
                  exigido por lei.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">5. Compartilhamento de Informações</h3>
                <p>
                  <strong>Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros</strong> para fins
                  comerciais. Seus dados podem ser compartilhados apenas nas seguintes situações:
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Com seu consentimento explícito</li>
                  <li>Para cumprir obrigações legais ou ordens judiciais</li>
                  <li>Para proteger nossos direitos, propriedade ou segurança</li>
                  <li>
                    Com prestadores de serviços que nos ajudam a operar o sistema (sob acordos de confidencialidade)
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  6. Seus Direitos (LGPD)
                </h3>
                <p>De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>
                    <strong>Acesso:</strong> Saber quais dados pessoais possuímos sobre você
                  </li>
                  <li>
                    <strong>Correção:</strong> Solicitar a correção de dados incompletos ou incorretos
                  </li>
                  <li>
                    <strong>Exclusão:</strong> Solicitar a exclusão de seus dados pessoais
                  </li>
                  <li>
                    <strong>Portabilidade:</strong> Solicitar a transferência de seus dados
                  </li>
                  <li>
                    <strong>Oposição:</strong> Opor-se ao tratamento de seus dados
                  </li>
                  <li>
                    <strong>Revogação:</strong> Revogar o consentimento a qualquer momento
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">7. Cookies e Tecnologias Similares</h3>
                <p>
                  Utilizamos cookies e tecnologias similares para melhorar sua experiência, manter sua sessão ativa e
                  analisar o uso do sistema. Você pode gerenciar suas preferências de cookies nas configurações do seu
                  navegador.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">8. Menores de Idade</h3>
                <p>
                  Nosso sistema é destinado a empresas e usuários maiores de 18 anos. Não coletamos intencionalmente
                  informações de menores de idade.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">9. Alterações nesta Política</h3>
                <p>
                  Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas através do
                  sistema ou por email. O uso continuado após as alterações constitui aceitação da nova política.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">10. Contato e Exercício de Direitos</h3>
                <p>Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato:</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>
                    <strong>Email:</strong> visionxma@gmail.com
                  </li>
                  <li>
                    <strong>WhatsApp:</strong> +55 (99) 98468-0391
                  </li>
                  <li>
                    <strong>Endereço:</strong> Pedreiras, Maranhão - Brasil
                  </li>
                  <li>
                    <strong>Horário:</strong> Segunda a Sexta, 8h às 18h | Sábado, 8h às 12h
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t pt-4 mt-6">
              <p className="text-center text-muted-foreground">
                <strong>VisionXMA - Soluções Tecnológicas</strong>
                <br />
                Comprometidos com a proteção da sua privacidade
                <br />
                Para dúvidas sobre privacidade: visionxma@gmail.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
