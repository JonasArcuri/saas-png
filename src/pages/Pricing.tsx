import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthDialog from "@/components/AuthDialog";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const Pricing = () => {
  const plans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "/mês",
      description: "Para uso pessoal e testes",
      icon: <Zap className="w-6 h-6" />,
      features: [
        "5 conversões por dia",
        "Arquivos até 10MB",
        "Remoção de fundo com IA (GRÁTIS!)",
        "Download individual",
      ],
      buttonText: "Começar Grátis",
      buttonVariant: "outline" as const,
      popular: false,
    },
    {
      name: "PRO",
      price: "R$ 19",
      period: "/mês",
      description: "Para profissionais e equipes",
      icon: <Crown className="w-6 h-6" />,
      features: [
        "Conversões ilimitadas",
        "Arquivos até 100MB",
        "Todos os formatos suportados",
        "Download em lote (ZIP)",
        "Remoção de fundo com IA",
        "Processamento em lote avançado",
        "API de conversão",
        "Suporte prioritário",
      ],
      buttonText: "Assinar PRO",
      buttonVariant: "hero" as const,
      popular: true,
    },
  ];

  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-bg">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">{t('pricing.title')}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t('pricing.desc')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative p-8 ${
                plan.popular
                  ? "border-primary shadow-glow scale-105"
                  : "border-border/50"
              } transition-all duration-300 hover:shadow-lg`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-primary">{t('pricing.most_popular')}</Badge>
              )}

              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl">{plan.name === 'Gratuito' ? t('pricing.free') : t('pricing.pro')}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {plan.description}
                </CardDescription>
                <div className="text-4xl font-bold text-foreground">
                  {plan.price}
                  <span className="text-lg text-muted-foreground font-normal">
                    {plan.period}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-success" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.name === 'PRO' ? (
                  user ? (
                    <Button variant={plan.buttonVariant} size="lg" className="w-full" onClick={() => navigate('/account')}>
                      Entrar em contato para PRO
                    </Button>
                  ) : (
                    <AuthDialog
                      trigger={
                        <Button variant={plan.buttonVariant} size="lg" className="w-full">
                          {plan.buttonText}
                        </Button>
                      }
                      onSignedIn={() => navigate('/account')}
                    />
                  )
                ) : (
                  <Button variant={plan.buttonVariant} size="lg" className="w-full" onClick={() => navigate('/')}>Começar Grátis</Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16 space-y-4">
          <h3 className="text-xl font-semibold text-foreground">
            🎉 Remoção de Fundo com IA Agora Disponível!
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Nossa funcionalidade de remoção de fundo com inteligência artificial 
            está agora ativa e funcionando para todos os usuários! 
            Converta para PNG e remova fundos automaticamente.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;