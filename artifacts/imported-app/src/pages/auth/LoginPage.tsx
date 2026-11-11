import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import { useI18n } from '../../lib/i18n';
import { LanguageSwitcher } from '../../components/ui/LanguageSwitcher';

const copy = {
  en: {
    subtitle: 'Sign in with your work email and password.',
    email: 'Email',
    password: 'Password',
    submit: 'Sign in with email',
    submitting: 'Signing in…',
    invalid: 'Incorrect email or password.',
    failed: 'Unable to sign in right now. Please try again.',
    newHere: 'New to XiSync?',
    create: 'Create an account',
  },
  zh: {
    subtitle: '使用工作邮箱和密码登录。',
    email: '邮箱',
    password: '密码',
    submit: '使用邮箱登录',
    submitting: '正在登录…',
    invalid: '邮箱或密码不正确。',
    failed: '暂时无法登录，请稍后再试。',
    newHere: '还没有 XiSync 账号？',
    create: '创建账号',
  },
} as const;

export function LoginPage() {
  const { user, loading, error } = useAuth();
  const { language } = useI18n();
  const text = copy[language];
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (user && !loading) navigate('/dashboard', { replace: true });
  }, [user, loading, navigate]);

  async function handleCredentialsSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setFormError(null);
    setSubmitting(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (response.ok) {
        window.location.assign('/dashboard');
        return;
      }
      setFormError(response.status === 401 ? text.invalid : text.failed);
    } catch {
      setFormError(text.failed);
    }
    setSubmitting(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">XiSync</Link>
          <LanguageSwitcher variant="compact" />
        </div>
        <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">Sign in to XiSync</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{text.subtitle}</p>

        {(error || formError) && (
          <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">
            {formError ?? error}
          </p>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleCredentialsSignIn}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{text.email}</span>
            <span className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2.5 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-950">
              <Mail className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                type="email"
                name="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
              />
            </span>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{text.password}</span>
            <span className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2.5 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-950">
              <LockKeyhole className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
              />
            </span>
          </label>
          <button
            type="submit"
            disabled={submitting || loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {submitting ? text.submitting : text.submit}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          {text.newHere} <Link to="/register" className="font-semibold text-cyan-700 hover:underline dark:text-cyan-300">{text.create}</Link>
        </p>
      </section>
    </main>
  );
}
