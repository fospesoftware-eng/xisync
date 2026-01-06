import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../../components/ui/Logo';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LanguageSwitcher } from '../../components/ui/LanguageSwitcher';
import { useAuth } from '../../lib/auth-context';
import { useI18n } from '../../lib/i18n';
import { Mail, Lock, AlertCircle, Shield, Building2, Users } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const { t, language } = useI18n();
  const navigate = useNavigate();

  const demoAccounts = [
    {
      title: t.auth.demoItems[0].title,
      description: t.auth.demoItems[0].description,
      email: 'admin@xisync.com',
      password: 'Demo@123456',
      redirect: '/admin',
      icon: Shield,
      color: 'bg-xisync-blue-100 text-xisync-blue-600',
    },
    {
      title: t.auth.demoItems[1].title,
      description: t.auth.demoItems[1].description,
      email: 'demo@exportco.com',
      password: 'Demo@123456',
      redirect: '/dashboard',
      icon: Building2,
      color: 'bg-xisync-cyan-100 text-xisync-cyan-600',
    },
    {
      title: t.auth.demoItems[2].title,
      description: t.auth.demoItems[2].description,
      email: 'buyer@abccorp.com',
      password: 'Demo@123456',
      redirect: '/portal',
      icon: Users,
      color: 'bg-xisync-green-100 text-xisync-green-600',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      const account = demoAccounts.find(a => a.email === email);
      navigate(account?.redirect || '/dashboard');
    }
  };

  const handleQuickAccess = (redirect: string) => {
    navigate(redirect);
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <div className="flex items-center justify-between mb-8">
            <Link to="/">
              <Logo size="lg" />
            </Link>
            <LanguageSwitcher variant="compact" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{t.auth.loginTitle}</h2>
          <p className="mt-2 text-sm text-gray-600">
            {t.auth.loginSubtitle}
          </p>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <Input
              label={t.common.email}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={<Mail className="w-4 h-4" />}
              placeholder="you@company.com"
            />

            <div>
              <Input
                label={t.common.password}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                icon={<Lock className="w-4 h-4" />}
                placeholder="•••••••"
              />
              <div className="mt-2 text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-xisync-cyan-600 hover:text-xisync-cyan-700"
                >
                  {t.auth.forgotPassword}
                </Link>
              </div>
            </div>

            <Button type="submit" className="w-full" loading={loading}>
              {t.auth.signIn}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            {t.auth.noAccount}{' '}
            <Link
              to="/register"
              className="font-semibold text-xisync-cyan-600 hover:text-xisync-cyan-700"
            >
              {t.nav.startFreeTrial}
            </Link>
          </p>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              {t.auth.demoAccounts} ({t.auth.demoInfo})
            </p>
            <div className="space-y-3">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => handleQuickAccess(account.redirect)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-xisync-cyan-300 hover:bg-gray-50 transition-all text-left group"
                >
                  <div className={`p-2 rounded-lg ${account.color}`}>
                    <account.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm group-hover:text-xisync-cyan-700">
                      {account.title}
                    </div>
                    <div className="text-xs text-gray-500">{account.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400 font-mono">{account.email}</div>
                    <div className="text-xs text-gray-400 font-mono">{account.password}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block relative flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-xisync-blue-900 via-xisync-cyan-800 to-xisync-green-700">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-lg text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {t.auth.loginSide.title}
            </h2>
            <p className="text-xisync-blue-100">
              {t.auth.loginSide.description}
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-sm text-xisync-blue-200">
                  {t.auth.loginSide.stats.exporters}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-sm text-xisync-blue-200">
                  {t.auth.loginSide.stats.countries}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-sm text-xisync-blue-200">
                  {t.auth.loginSide.stats.uptime}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
