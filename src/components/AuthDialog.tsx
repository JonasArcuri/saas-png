import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { Github, Mail, Chrome } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type AuthDialogProps = {
  trigger?: React.ReactNode;
  onSignedIn?: () => void;
};

const AuthDialog = ({ trigger, onSignedIn }: AuthDialogProps) => {
  const { signInWithEmail, signUpWithEmail, signInWithOAuth } = useAuth();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const action = mode === 'signin' ? signInWithEmail : signUpWithEmail;
    const { error } = await action(email, password);
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    setOpen(false);
    onSignedIn?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="hero" size="sm">Entrar</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'signin' ? t('auth.enter') : t('auth.create')}</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <div className="flex items-center justify-between">
            <Button type="submit" disabled={loading}>
              {loading ? '...' : (mode === 'signin' ? t('auth.enter') : t('auth.create'))}
            </Button>
            <Button type="button" variant="link" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
              {mode === 'signin' ? t('auth.no_account') : t('auth.have_account')}
            </Button>
          </div>
        </form>

        <div className="mt-4 space-y-2">
          <div className="text-center text-sm text-muted-foreground">{t('auth.or_continue')}</div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="w-full" onClick={() => signInWithOAuth('google')}>
              <Chrome className="w-4 h-4" /> Google
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={() => signInWithOAuth('github')}>
              <Github className="w-4 h-4" /> GitHub
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;


