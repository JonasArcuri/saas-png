import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AuthDialog from "@/components/AuthDialog";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { user, loading, signOut } = useAuth();
  const { t, i18n } = useTranslation();
  const current = i18n.language.startsWith('en') ? 'en' : 'pt';
  const toggleLang = () => {
    const next = current === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(next);
    localStorage.setItem('lang', next);
  };
  return (
    <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">P</span>
          </div>
          <span className="text-xl font-bold text-foreground">{t('app.name')}</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            {t('app.converter')}
          </Link>
          <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
            {t('app.plans')}
          </Link>
        </nav>

        {loading ? null : user ? (
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={toggleLang}>
              {current === 'pt' ? 'EN' : 'PT'}
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/analytics">{t('app.analytics')}</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/account">{t('app.account')}</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={() => signOut()}>{t('app.signOut')}</Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={toggleLang}>
              {current === 'pt' ? 'EN' : 'PT'}
            </Button>
            <AuthDialog />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;