import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      app: {
        name: 'PNGify',
        converter: 'Converter',
        plans: 'Pricing',
        analytics: 'Analytics',
        account: 'My Account',
        signOut: 'Sign out',
        signIn: 'Sign in',
      },
      index: {
        hero_badge: 'Instant and free conversion',
        hero_title_1: 'Convert to',
        hero_title_2: 'in seconds',
        hero_desc: 'Transform your images into high-quality PNG with automatic background removal using AI. Simple, fast and free.',
        ia: 'AI + Instant conversion',
        bg: 'Automatic background removal',
        dl: 'Instant download',
        new_feature: 'New: AI Background Removal!',
        quota_title: 'Conversions left today: {{remaining}}/{{max}}',
        quota_desc: 'Free plan - resets at 00:00 UTC',
        upgrade: 'Upgrade PRO',
        choose_images: 'Drag your images here',
        upload_help: 'Convert to PNG + remove backgrounds automatically with AI (max {{max}} files)',
        formats: 'JPG, PNG, WebP, BMP - up to 10MB per file',
        why_title: 'Why choose PNGify?',
        why_desc: 'The fastest and most reliable tool for image conversion with AI',
        feat1: 'Conversion + AI',
        feat1_desc: 'Convert to PNG and remove the background automatically with AI',
        feat2: '100% Private',
        feat2_desc: 'Your images never leave your device. Local processing with AI.',
        feat3: 'Batch download',
        feat3_desc: 'Download multiple processed images at once in ZIP',
      },
      pricing: {
        title: 'Choose Your Plan',
        desc: 'Convert images to PNG with professional speed and quality',
        free: 'Free',
        pro: 'PRO',
        start_free: 'Start Free',
        subscribe_pro: 'Subscribe PRO',
        most_popular: 'Most Popular',
      },
      auth: {
        email: 'Email',
        password: 'Password',
        enter: 'Sign in',
        create: 'Create account',
        no_account: "Don't have an account? Sign up",
        have_account: 'Have an account? Sign in',
        or_continue: 'or continue with',
      },
      toasts: {
        limit_reached_title: 'Daily limit reached',
        limit_reached_desc: 'You have already converted {{max}} images today. Come back tomorrow or consider PRO.',
        limited_files_title: 'Some files were limited',
        limited_files_desc: 'Only {{remaining}} conversions left today.',
        error_conversion_title: 'Conversion error',
        error_conversion_desc: 'Failed to convert {{name}}',
        conversion_done_title: 'Conversion completed!',
        conversion_done_desc: '{{count}} image(s) converted to PNG with background removal.',
        download_started_title: 'Download started',
        download_started_desc: 'Your PNG files are being downloaded.',
      },
      footer: {
        tagline: 'Convert images to PNG and remove backgrounds automatically with AI. Simple, fast and free.',
        product: 'Product',
        convert: 'Convert Images',
        pricing: 'Pricing',
        support: 'Support',
        help_center: 'Help Center',
        contact: 'Contact',
        status: 'System Status',
        legal: 'Legal',
        terms: 'Terms of Use',
        privacy: 'Privacy Policy',
        cookies: 'Cookies',
        copyright: '© {{year}} PNGify. All rights reserved.',
      }
    }
  },
  pt: {
    translation: {
      app: {
        name: 'PNGify',
        converter: 'Converter',
        plans: 'Planos',
        analytics: 'Analytics',
        account: 'Minha Conta',
        signOut: 'Sair',
        signIn: 'Entrar',
      },
      index: {
        hero_badge: 'Conversão instantânea e gratuita',
        hero_title_1: 'Converta para',
        hero_title_2: 'em segundos',
        hero_desc: 'Transforme suas imagens em PNG de alta qualidade com remoção automática de fundo usando IA. Simples, rápido e completamente gratuito.',
        ia: 'IA + Conversão instantânea',
        bg: 'Remoção de fundo automática',
        dl: 'Download imediato',
        new_feature: 'Nova funcionalidade: Remoção de fundo com IA!',
        quota_title: 'Conversões restantes hoje: {{remaining}}/{{max}}',
        quota_desc: 'Plano gratuito - resets às 00:00 UTC',
        upgrade: 'Upgrade PRO',
        choose_images: 'Arraste suas imagens aqui',
        upload_help: 'Converta para PNG + remova fundos automaticamente com IA (máximo {{max}} arquivos)',
        formats: 'JPG, PNG, WebP, BMP - até 10MB por arquivo',
        why_title: 'Por que escolher o PNGify?',
        why_desc: 'A ferramenta mais rápida e confiável para conversão de imagens com IA',
        feat1: 'Conversão + IA',
        feat1_desc: 'Converta para PNG e remova o fundo automaticamente com IA',
        feat2: '100% Privado',
        feat2_desc: 'Suas imagens nunca saem do seu dispositivo. Processamento local com IA.',
        feat3: 'Download em Lote',
        feat3_desc: 'Baixe múltiplas imagens processadas de uma só vez em ZIP',
      },
      pricing: {
        title: 'Escolha Seu Plano',
        desc: 'Converta imagens para PNG com velocidade e qualidade profissional',
        free: 'Gratuito',
        pro: 'PRO',
        start_free: 'Começar Grátis',
        subscribe_pro: 'Assinar PRO',
        most_popular: 'Mais Popular',
      },
      auth: {
        email: 'Email',
        password: 'Senha',
        enter: 'Entrar',
        create: 'Criar conta',
        no_account: 'Não tem conta? Cadastre-se',
        have_account: 'Já tem conta? Entrar',
        or_continue: 'ou continue com',
      },
      toasts: {
        limit_reached_title: 'Limite diário atingido',
        limit_reached_desc: 'Você já converteu {{max}} imagens hoje. Volte amanhã ou considere o plano PRO.',
        limited_files_title: 'Alguns arquivos foram limitados',
        limited_files_desc: 'Apenas {{remaining}} conversões restantes hoje.',
        error_conversion_title: 'Erro na conversão',
        error_conversion_desc: 'Falha ao converter {{name}}',
        conversion_done_title: 'Conversão concluída!',
        conversion_done_desc: '{{count}} imagem(ns) convertida(s) para PNG com remoção de fundo.',
        download_started_title: 'Download iniciado',
        download_started_desc: 'Seus arquivos PNG estão sendo baixados.',
      },
      footer: {
        tagline: 'Converta imagens para PNG e remova fundos automaticamente com IA. Simples, rápido e grátis.',
        product: 'Produto',
        convert: 'Converter Imagens',
        pricing: 'Planos e Preços',
        support: 'Suporte',
        help_center: 'Central de Ajuda',
        contact: 'Contato',
        status: 'Status do Sistema',
        legal: 'Legal',
        terms: 'Termos de Uso',
        privacy: 'Política de Privacidade',
        cookies: 'Cookies',
        copyright: '© {{year}} PNGify. Todos os direitos reservados.',
      }
    }
  }
};

const stored = localStorage.getItem('lang') as 'en' | 'pt' | null;
const browser = (navigator.language || 'pt').toLowerCase().startsWith('en') ? 'en' : 'pt';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: stored || browser || 'pt',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;


