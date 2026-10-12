// PART A — header + state + submit (appended by part B)
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchStudents, addStudent, syncClass, exportClassExcel, saveBlob, blobErrMsg } from '../lib/api';
import { leetUrl, ccUrl, scoreTone, scoreBg } from '../lib/api';
import { Breadcrumbs, Empty, Loading, ErrorBox, fmtDate } from '../components/ui';

const SORTS = [
  ['name', 'Name'], ['rollNo', 'Roll no'], ['leetcode', 'LeetCode'],
  ['codechef', 'CodeChef'], ['combined', 'Combined'], ['contests', 'Contests'],
];

export default function ClassPage() {
  const { id } = useParams();
  const [res, setRes] = useState(null);
  const [err, setErr] = useState('');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('combined');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');
  const [downloading, setDownloading] = useState(false);

  const doDownload = async () => {
    setDownloading(true); setSyncMsg('');
    try {
      const blob = await exportClassExcel(id);
      saveBlob(blob, ((res && res.class && res.class.name) || 'class') + '.xlsx');
      setSyncMsg('Excel downloaded — check your downloads.');
    } catch (e) { setSyncMsg('Download failed: ' + await blobErrMsg(e)); }
    setDownloading(false);
  };

  const doSync = async () => {
    setSyncing(true); setSyncMsg('');
    try {
      const r = await syncClass(id);
      setSyncMsg(`Synced ${r.ok}/${r.total} profiles`);
      load();
    } catch (e) { setSyncMsg('Sync failed: ' + (e.response?.data?.message || e.message)); }
    setSyncing(false);
  };

  const load = () => {
    setErr('');
    fetchStudents(id, { q, sort, order, page, limit: 20 })
      .then(setRes).catch((e) => setErr(e.response?.data?.message || e.message));
  };
  // search: debounce, clear par turant reset; sort/order/page change par reload
  useEffect(() => { setPage(1); }, [id]);
  useEffect(() => { load(); }, [id, sort, order, page]);
  useEffect(() => {
    if (q.trim() === '') { setPage(1); load(); return; }
    const t = setTimeout(() => { setPage(1); load(); }, 350);
    return () => clearTimeout(t);
  }, [q]);

  const submitAdd = async (e) => {
    e.preventDefault();
    setSaving(true); setFormErr('');
    const fd = new FormData(e.target);
    try {
      await addStudent(id, { name: fd.get('name'), rollNo: fd.get('rollNo'), leetcodeId: fd.get('leetcodeId'), codechefId: fd.get('codechefId') });
      e.target.reset(); setShowAdd(false); load();
    } catch (e2) { setFormErr(e2.response?.data?.message || e2.message); }
    setSaving(false);
  };

  if (err) return <ErrorBox message={err} onRetry={load} />;
  if (!res) return <Loading label="Loading students…" />;
  return <Body res={res} q={q} setQ={setQ} sort={sort} setSort={setSort} order={order} setOrder={setOrder} page={page} setPage={setPage} showAdd={showAdd} setShowAdd={setShowAdd} submitAdd={submitAdd} saving={saving} formErr={formErr} syncing={syncing} syncMsg={syncMsg} doSync={doSync} downloading={downloading} doDownload={doDownload} />;
}

function Body(p) {
  const { res } = p;
  return (
    <div>
      <Breadcrumbs trail={[{ label: 'Home', to: '/' }, { label: res.class.name }]} />
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <h1 className="text-xl font-bold">{res.class.name}</h1>
        <span className="badge bg-slate-100 text-slate-600">{res.total} students</span>
        <div className="flex-1" />
        <button className="btn" disabled={p.downloading} onClick={p.doDownload}>{p.downloading ? 'Preparing…' : '⬇ Download Excel'}</button>
        <button className="btn" disabled={p.syncing} onClick={p.doSync}>{p.syncing ? 'Syncing…' : 'Sync LeetCode + CodeChef'}</button>
        <button className="btn btn-primary" onClick={() => p.setShowAdd(!p.showAdd)}>+ Add student</button>
      </div>
      {p.syncMsg && <div className="text-xs text-slate-500 mb-3">{p.syncMsg}</div>}
      {p.showAdd && (
        <form onSubmit={p.submitAdd} className="card p-4 mb-4 grid sm:grid-cols-5 gap-2">
          <input name="name" className="input" placeholder="Full name *" required />
          <input name="rollNo" className="input" placeholder="Roll no *" required />
          <input name="leetcodeId" className="input" placeholder="LeetCode username" />
          <input name="codechefId" className="input" placeholder="CodeChef username" />
          <div><button className="btn btn-primary w-full justify-center" disabled={p.saving}>{p.saving ? 'Adding…' : 'Add'}</button></div>
          {p.formErr && <div className="sm:col-span-5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{p.formErr}</div>}
        </form>
      )}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <input className="input max-w-xs" placeholder="Search name or roll no…" value={p.q} onChange={(e) => p.setQ(e.target.value)} />
        <select className="input max-w-[160px]" value={p.sort} onChange={(e) => p.setSort(e.target.value)}>
          {SORTS.map(([v, l]) => <option key={v} value={v}>Sort: {l}</option>)}
        </select>
        <button className="btn" onClick={() => p.setOrder(p.order === 'asc' ? 'desc' : 'asc')}>{p.order === 'asc' ? 'Asc' : 'Desc'}</button>
      </div>
      {res.students.length === 0 ? <Empty title="No students match" hint="Try a different search." /> : <Table res={res} />}
      <p className="text-xs text-slate-400 mt-2">Scores: green 100+, amber 30-99, red 1-29, grey 0. Username par click karne se profile khulti hai.</p>
      <div className="flex items-center gap-2 mt-3 text-sm">
        <button className="btn" disabled={p.page <= 1} onClick={() => p.setPage(p.page - 1)}>Prev</button>
        <span className="text-slate-500">Page {res.page} of {Math.max(1, res.pages)} · {res.total} students</span>
        <button className="btn" disabled={p.page >= res.pages} onClick={() => p.setPage(p.page + 1)}>Next</button>
      </div>
    </div>
  );
}

function Table({ res }) {
  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[860px]">
        <thead><tr className="bg-slate-50">
          <th className="th">Student</th><th className="th">LeetCode</th><th className="th">CodeChef</th>
          <th className="th">Combined</th><th className="th">Contests</th><th className="th">Latest activity</th>
        </tr></thead>
        <tbody>
          {res.students.map((s) => (
            <tr key={s._id} className="hover:bg-slate-50">
              <td className="td">
                <Link to={'/student/' + s._id} className="font-medium text-accent hover:underline">{s.name}</Link>
                <div className="text-xs text-slate-500">{s.rollNo}</div>
              </td>
              <td className="td">
                <span className={'inline-block rounded-md border px-2 py-0.5 font-semibold ' + scoreBg(s.leetcodeSolved)}>{s.leetcodeSolved}</span>
                <div className="text-xs mt-1">{s.leetcodeId
                  ? <a href={leetUrl(s.leetcodeId)} target="_blank" rel="noreferrer" className="text-accent hover:underline">@{s.leetcodeId}</a>
                  : <span className="text-slate-400">no id</span>}</div>
              </td>
              <td className="td">
                <span className={'inline-block rounded-md border px-2 py-0.5 font-semibold ' + scoreBg(s.codechefSolved)}>{s.codechefSolved}</span>
                <div className="text-xs mt-1">{s.codechefId
                  ? <a href={ccUrl(s.codechefId)} target="_blank" rel="noreferrer" className="text-accent hover:underline">@{s.codechefId}</a>
                  : <span className="text-slate-400">no id</span>}</div>
              </td>
              <td className={'td font-bold ' + scoreTone(s.combinedSolved)}>{s.combinedSolved}</td>
              <td className="td">{s.contests}</td>
              <td className="td text-slate-500 text-xs">{fmtDate(s.lastActivityAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
