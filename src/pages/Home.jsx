import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchClasses } from '../lib/api';
import { Empty, Loading, ErrorBox } from '../components/ui';

export default function Home() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  const load = () => {
    setErr('');
    fetchClasses().then(setData).catch((e) => setErr(e.response?.data?.message || e.message));
  };
  useEffect(load, []);

  if (err) return <ErrorBox message={err} onRetry={load} />;
  if (!data) return <Loading label="Loading classes…" />;
  if (!data.length) return <Empty title="No classes yet" hint="Ask admin to seed classes." />;

  return (
    <div>
      <h1 className="text-xl font-bold mb-1">Select your class</h1>
      <p className="text-sm text-slate-500 mb-4">Pick a class to see every student's LeetCode & CodeChef progress.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((c) => (
          <Link key={c._id} to={`/class/${c._id}`} className="card p-5 hover:shadow-md hover:border-accent/40 transition-all block">
            <div className="font-bold text-lg">{c.name}</div>
            <div className="text-xs text-slate-500 mt-0.5">{c.studentCount} students · click to open →</div>
            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="rounded-lg bg-amber-50 border border-amber-200 py-2">
                <div className="font-bold text-leet">{c.leetcodeSolved}</div>
                <div className="text-[11px] text-slate-500">LeetCode</div>
              </div>
              <div className="rounded-lg bg-violet-50 border border-violet-200 py-2">
                <div className="font-bold text-cc">{c.codechefSolved}</div>
                <div className="text-[11px] text-slate-500">CodeChef</div>
              </div>
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 py-2">
                <div className="font-bold text-emerald-700">{c.contestCount}</div>
                <div className="text-[11px] text-slate-500">Contests</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

