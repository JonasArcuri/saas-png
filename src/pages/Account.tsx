import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Account = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div className="min-h-screen bg-gradient-bg"><Header /><main className="container mx-auto px-4 py-16">Carregando...</main><Footer /></div>;
  }

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-bg">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <Card className="max-w-xl mx-auto p-6 space-y-4">
          <h1 className="text-2xl font-bold">Minha Conta</h1>
          <div className="space-y-1">
            <p><span className="text-muted-foreground">Email:</span> {user.email}</p>
            <p><span className="text-muted-foreground">Plano:</span> Gratuito</p>
          </div>
          <div className="flex gap-3">
            <Button variant="hero" onClick={() => navigate('/pricing')}>Upgrade para PRO</Button>
            
            <Button variant="outline" onClick={() => signOut().then(() => navigate('/'))}>Sair</Button>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Account;


