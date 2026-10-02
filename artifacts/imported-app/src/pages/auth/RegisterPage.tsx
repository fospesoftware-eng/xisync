import { Link } from 'react-router-dom';
import { ArrowRight, UserPlus } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';

export function RegisterPage() {
  const { signIn, loading } = useAuth();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <Link to="/" className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">XiSync</Link>
        <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
          <UserPlus className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">Create your XiSync account</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Create or use your secure account. XiSync will set up a private workspace the first time you sign in.
        </p>
        <button
          type="button"
          onClick={signIn}
          disabled={loading}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-xisync-blue-600 to-xisync-cyan-500 px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
        >
          Continue securely
          <ArrowRight className="h-4 w-4" />
        </button>
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already registered? <Link to="/login" className="font-semibold text-cyan-700 hover:underline dark:text-cyan-300">Sign in</Link>
        </p>
      </section>
    </main>
  );
}