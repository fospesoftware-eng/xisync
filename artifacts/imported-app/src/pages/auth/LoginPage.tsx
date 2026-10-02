import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';

export function LoginPage() {
  const { user, loading, error, signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) navigate('/dashboard', { replace: true });
  }, [user, loading, navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <Link to="/" className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">XiSync</Link>
        <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">Sign in to XiSync</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Continue with your secure account. Your first sign-in creates a private XiSync workspace.
        </p>
        {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button
          type="button"
          onClick={signIn}
          disabled={loading}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-xisync-blue-600 to-xisync-cyan-500 px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
        >
          {loading ? 'Loading…' : 'Continue securely'}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          New to XiSync? <Link to="/register" className="font-semibold text-cyan-700 hover:underline dark:text-cyan-300">Create an account</Link>
        </p>
        <p className="mt-8 text-center text-xs leading-5 text-slate-400">
          You’ll be redirected to the secure identity provider to sign in.
        </p>
      </section>
    </main>
  );
}