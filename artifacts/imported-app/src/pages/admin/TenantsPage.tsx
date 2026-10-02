import { Building2, CalendarDays, Globe2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';

export function TenantsPage() {
  const { tenant, loading, error } = useAuth();

  if (loading) {
    return <div className="p-8 text-sm text-slate-500">Loading your workspace…</div>;
  }
  if (error || !tenant) {
    return <div role="alert" className="p-8 text-sm text-red-700">{error || 'Your workspace is unavailable.'}</div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <header>
        <div className="flex items-center gap-2 text-sm font-semibold text-cyan-700">
          <ShieldCheck className="h-4 w-4" /> Private workspace
        </div>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Your XiSync workspace</h1>
        <p className="mt-1 text-sm text-slate-600">This workspace and its records are isolated to your signed-in account.</p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
            <Building2 className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-slate-900">{tenant.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{tenant.slug}</p>
            <dl className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Plan</dt>
                <dd className="mt-1 capitalize text-sm text-slate-900">{tenant.plan}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</dt>
                <dd className="mt-1 capitalize text-sm text-slate-900">{tenant.status}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Industry</dt>
                <dd className="mt-1 text-sm text-slate-900">{tenant.industry || 'Not set'}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Region</dt>
                <dd className="mt-1 flex items-center gap-1.5 text-sm text-slate-900"><Globe2 className="h-4 w-4 text-slate-400" />{tenant.region || tenant.timezone || 'Not set'}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Created</dt>
                <dd className="mt-1 flex items-center gap-1.5 text-sm text-slate-900"><CalendarDays className="h-4 w-4 text-slate-400" />{new Date(tenant.created_at).toLocaleDateString()}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}