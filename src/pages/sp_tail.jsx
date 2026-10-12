import { Link } from 'react-router-dom';
import { fmtDate, monthLabel } from '../components/ui';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from '../lib/charts';
import { LineChart, Line, CartesianGrid, Legend } from '../lib/charts';
import { MONTHS } from './sp_months';

export function Charts({ data }) {
  if (!data.monthlyBreakdownAvailable) {
    return <div className="card p-4 mt-4 border-amber-200 bg-amber-50 text-sm text-amber-900">{data.monthlyBreakdownNote}</div>;
  }
  const chartData = data.months.map((m) => ({ name: MONTHS[m.month], LeetCode: m.leetcode, CodeChef: m.codechef, Contests: m.contests }));
  return (
    <div className="card p-4 mt-4">
      <div className="font-semibold mb-2">Questions solved & contests over time (dated records only)</div>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="h-64"><ResponsiveContainer><BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis allowDecimals={false} /><Tooltip /><Legend />
          <Bar dataKey="LeetCode" fill="#b45309" /><Bar dataKey="CodeChef" fill="#7c3aed" />
        </BarChart></ResponsiveContainer></div>
        <div className="h-64"><ResponsiveContainer><LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis allowDecimals={false} /><Tooltip /><Legend />
          <Line type="monotone" dataKey="Contests" stroke="#059669" strokeWidth={2} dot={false} />
        </LineChart></ResponsiveContainer></div>
      </div>
    </div>
  );
}

export function MonthBlock({ data, sel, setSel, month }) {
  return (
    <div className="card p-4 mt-4">
      <div className="font-semibold mb-2">Month-wise progress</div>
      {data.months.length === 0 && <div className="text-sm text-slate-500">No dated contest records yet.</div>}
      <MonthTimeline months={data.months} sel={sel} setSel={setSel} />
      <MonthDetail sel={sel} month={month} />
    </div>
  );
}

function MonthTimeline({ months, sel, setSel }) {
  if (!months.length) return null;
  const g = {};
  months.forEach((m) => { (g[m.year] = g[m.year] || []).push(m); });
  return (<>
    {Object.entries(g).sort((a, b) => b[0] - a[0]).map(([year, ms]) => (
      <div key={year} className="mb-3">
        <div className="text-xs font-bold text-slate-500 uppercase mb-1.5">{year}</div>
        <div className="flex flex-wrap gap-2">
          {ms.map((m) => (
            <button key={m.key} onClick={() => setSel(m.key)} className={'rounded-lg border px-3 py-2 text-left text-xs ' + (sel === m.key ? 'border-accent bg-blue-50' : 'border-slate-200 bg-white hover:bg-slate-50')}>
              <div className="font-semibold">{MONTHS[m.month]}</div>
              <div className="text-slate-500">{m.leetcode + m.codechef} solved · {m.contests} contests</div>
            </button>
          ))}
        </div>
      </div>
    ))}
  </>);
}

function MonthDetail({ sel, month }) {
  if (!sel || !month) return null;
  const rankCls = (r) => (!r ? 'text-slate-400' : r <= 1000 ? 'text-emerald-700' : r <= 5000 ? 'text-amber-700' : 'text-red-600');
  return (
    <div className="mt-4 border-t pt-4">
      <div className="font-semibold mb-2">{monthLabel(sel)} — {month.counts.leetcode + month.counts.codechef} solved · {month.counts.contests} contests</div>
      <div className="text-xs font-bold text-emerald-700 uppercase mb-1">Contests ({month.counts.contests})</div>
      {month.contests.length === 0 ? <div className="text-xs text-slate-400">No contests this month.</div> : (
        <div className="overflow-x-auto"><table className="w-full min-w-[560px] text-sm">
          <thead><tr className="bg-slate-50"><th className="th">Contest</th><th className="th">Platform</th><th className="th">Date</th><th className="th">Rank</th><th className="th">Rating</th></tr></thead>
          <tbody>{month.contests.map((c) => <tr key={c._id}><td className="td">{c.contestName}</td><td className="td">{c.platform === 'codechef' ? <span className="badge bg-violet-100 text-cc">CodeChef</span> : <span className="badge bg-amber-100 text-leet">LeetCode</span>}</td><td className="td">{fmtDate(c.date)}</td><td className={'td font-semibold ' + rankCls(c.rank)}>{c.rank ?? '—'}</td><td className="td">{c.rating ?? '—'}</td></tr>)}</tbody>
        </table></div>
      )}
    </div>
  );
}

export function Back({ student }) {
  return <div className="mt-4"><Link to={student.classId ? '/class/' + student.classId._id : '/'} className="text-sm text-accent hover:underline">Back to class</Link></div>;
}
