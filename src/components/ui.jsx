import { Link } from 'react-router-dom';

export function Breadcrumbs({ trail }) {
  return (
    <nav className="text-sm text-slate-500 mb-4 flex items-center gap-1.5 flex-wrap">
      {trail.map((t, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-slate-300">/</span>}
          {t.to ? <Link to={t.to} className="hover:text-accent hover:underline">{t.label}</Link>
            : <span className="text-ink font-medium">{t.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function StatCard({ label, value, sub, tone = 'slate' }) {
  const tones = {
    slate: 'text-ink', blue: 'text-accent', amber: 'text-leet', violet: 'text-cc', green: 'text-emerald-700',
  };
  return (
    <div className="card p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`text-2xl font-bold mt-1 ${tones[tone]}`}>{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}

export function Empty({ title, hint }) {
  return (
    <div className="card p-10 text-center">
      <div className="text-lg font-semibold">{title}</div>
      {hint && <div className="text-sm text-slate-500 mt-1">{hint}</div>}
    </div>
  );
}

export function Loading({ label = 'Loading…' }) {
  return (
    <div className="card p-10 text-center text-slate-500">
      <div className="animate-pulse text-sm">{label}</div>
    </div>
  );
}

export function ErrorBox({ message, onRetry }) {
  return (
    <div className="card p-6 border-red-200 bg-red-50">
      <div className="font-semibold text-red-800">Something went wrong</div>
      <div className="text-sm text-red-700 mt-1">{message}</div>
      {onRetry && <button className="btn mt-3" onClick={onRetry}>Retry</button>}
    </div>
  );
}

export function monthLabel(ym) {
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleString('en', { month: 'short', year: 'numeric' });
}

export function fmtDate(d) {
  if (!d) return '—';
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return '—';
  return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
