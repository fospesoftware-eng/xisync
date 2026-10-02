import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../../components/ui/Logo';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../lib/auth-context';
import { useI18n } from '../../lib/i18n';
import { Mail, Lock, User, Building2, AlertCircle, Check } from 'lucide-react';

export function RegisterPage() {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError(t.pages.register.validation.passwordMismatch);
      return;
    }

    if (formData.password.length < 8) {
      setError(t.pages.register.validation.passwordTooShort);
      return;
    }

    setLoading(true);

    const { error } = await signUp(formData.email, formData.password, formData.fullName);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/">
            <Logo size="lg" />
          </Link>
          <h2 className="mt-8 text-2xl font-bold text-gray-900">{t.pages.register.title}</h2>
          <p className="mt-2 text-sm text-gray-600">
            {t.pages.register.subtitle}
          </p>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <Input
              label={t.pages.register.formLabels.fullName}
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
              icon={<User className="w-4 h-4" />}
              placeholder={t.pages.register.formLabels.fullName}
            />

            <Input
              label={t.pages.register.formLabels.workEmail}
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              icon={<Mail className="w-4 h-4" />}
              placeholder="you@company.com"
            />

            <Input
              label={t.pages.register.formLabels.company}
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
              icon={<Building2 className="w-4 h-4" />}
              placeholder={t.pages.register.formLabels.company}
            />

            <Input
              label={t.pages.register.formLabels.password}
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              icon={<Lock className="w-4 h-4" />}
              placeholder="Min. 8 characters"
              helperText="At least 8 characters"
            />

            <Input
              label={t.pages.register.formLabels.confirmPassword}
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              icon={<Lock className="w-4 h-4" />}
              placeholder={t.pages.register.formLabels.confirmPassword}
            />

            <Button type="submit" className="w-full" loading={loading}>
              {t.pages.register.formLabels.createAccount}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            {t.auth.hasAccount}{' '}
            <Link
              to="/login"
              className="font-semibold text-xisync-cyan-600 hover:text-xisync-cyan-700"
            >
              {t.pages.register.formLabels.signIn}
            </Link>
          </p>

          <p className="mt-4 text-xs text-gray-500 text-center">
            {t.pages.register.terms}{' '}
            <Link to="/terms" className="text-xisync-cyan-600 hover:underline">
              {t.pages.register.termsLink}
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-xisync-cyan-600 hover:underline">
              {t.pages.register.privacyLink}
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:block relative flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-xisync-blue-900 via-xisync-cyan-800 to-xisync-green-700">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-lg">
            <h2 className="text-3xl font-bold text-white mb-6">
              Everything you need to grow globally
            </h2>
            <ul className="space-y-4">
              {t.pages.register.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-xisync-green-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-xisync-green-400" />
                  </div>
                  <span className="text-white">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 p-6 bg-white/10 backdrop-blur-sm rounded-xl">
              <p className="text-white italic">
                "{t.pages.home.testimonials[0].quote}"
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-xisync-cyan-500 flex items-center justify-center text-white font-bold">
                  ZW
                </div>
                <div>
                  <div className="text-white font-medium">{t.pages.home.testimonials[0].author}</div>
                  <div className="text-sm text-xisync-blue-200">{t.pages.home.testimonials[0].role}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
