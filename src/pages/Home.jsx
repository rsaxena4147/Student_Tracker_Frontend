import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchClasses, importExcel } from '../lib/api';
import { Empty, Loading, ErrorBox } from '../components/ui';

export default function Home() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [showUp, setShowUp] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [upMsg, setUpMsg] = useState('');
  const [upErr, setUpErr] = useState('');

  const load = () => {
    setErr('');
    fetchClasses().then(setData).catch((e) => setErr(e.response?.data?.message || e.message));
  };
  useEffect(load, []);

  const uploadExcel = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const file = fd.get('file');
    if (!file || !file.name) { setUpErr('Choose an Excel file (.xlsx / .xls) first'); return; }
    setUploading(true); setUpErr(''); setUpMsg('');
    try {
      const r = await importExcel(file, String(fd.get('className') || '').trim());
      setUpMsg(`Imported "${r.file}" → ${r.classesTouched.join(', ')} · ${r.created} added, ${r.updated} updated${r.skippedDuplicates ? `, ${r.skippedDuplicates} duplicates skipped` : ''}`);
      e.target.reset();
      load();
    } catch (e2) { setUpErr(e2.response?.data?.message || e2.message); }
    setUploading(false);
  };

  if (err) return <ErrorBox message={err} onRetry={load} />;
  if (!data) return <Loading label="Loading classes…" />;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-1">
        <h1 className="text-xl font-bold">Select your class</h1>
        <div className="flex-1" />
        <button className="btn btn-primary" onClick={() => { setUpMsg(''); setUpErr(''); setShowUp(!showUp); }}>
          {showUp ? 'Close' : '+ Add class from Excel'}
        </button>
      </div>
      <p className="text-sm text-slate-500 mb-4">Pick a class to see every student's LeetCode & CodeChef progress.</p>
      {showUp && (
        <form onSubmit={uploadExcel} className="card p-4 mb-4 grid sm:grid-cols-4 gap-2">
          <input name="file" type="file" accept=".xlsx,.xls" className="input sm:col-span-2" required />
          <input name="className" className="input" placeholder="Class name (optional — else from file)" />
          <div><button className="btn btn-primary w-full justify-center" disabled={uploading}>{uploading ? 'Uploading…' : 'Upload & create class'}</button></div>
          {upMsg && <div className="sm:col-span-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">{upMsg}</div>}
          {upErr && <div className="sm:col-span-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{upErr}</div>}
          <div className="sm:col-span-4 text-xs text-slate-400">
            Columns: name, roll no, LeetCode username, CodeChef username (sheet names become class names if class name is left blank). Re-uploading the same file updates existing students.
          </div>
        </form>
      )}
      {data.length === 0
        ? <Empty title="No classes yet" hint="Upload an Excel file with student data to create your first class." />
        : (
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
        )}
      </div>
  );
}

