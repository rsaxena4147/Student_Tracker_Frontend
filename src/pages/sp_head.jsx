import { useState } from 'react';
import { updateStudent, exportStudentExcel, saveBlob, blobErrMsg, leetUrl, ccUrl } from '../lib/api';
import { Breadcrumbs, StatCard, fmtDate } from '../components/ui';

export function Head({ student, totals, sync, onSaved }) {
  const cc = student.codechef || {};
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [dlErr, setDlErr] = useState('');

  const doDownload = async () => {
    setDownloading(true); setDlErr('');
    try {
      const blob = await exportStudentExcel(student._id);
      const cls = (student.classId && student.classId.name) || '';
      saveBlob(blob, `${cls ? cls + ' - ' : ''}${student.name}.xlsx`);
    } catch (e) { setDlErr(await blobErrMsg(e)); }
    setDownloading(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    setSaving(true); setFormErr('');
    try {
      await updateStudent(student._id, {
        name: fd.get('name'),
        leetcodeId: fd.get('leetcodeId'),
        codechefId: fd.get('codechefId'),
      });
      setEditing(false);
      if (onSaved) onSaved();
    } catch (e2) { setFormErr(e2.response?.data?.message || e2.message); }
    setSaving(false);
  };

  return (<>
    <Breadcrumbs trail={[{ label: 'Home', to: '/' }, { label: (student.classId && student.classId.name) || 'Class', to: student.classId ? '/class/' + student.classId._id : '/' }, { label: student.name }]} />
    <div className="card p-5 mb-4">
      {!editing ? (<>
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h1 className="text-xl font-bold">{student.name}</h1>
            <div className="text-sm text-slate-500 mt-1">Roll {student.rollNo}</div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn" disabled={downloading} onClick={doDownload}>{downloading ? 'Preparing…' : '⬇ Download Excel'}</button>
            <button className="btn" onClick={() => { setFormErr(''); setDlErr(''); setEditing(true); }}>Edit</button>
          </div>
        </div>
        {dlErr && <div className="text-xs text-red-600 mt-2">Download failed: {dlErr}</div>}
        <div className="flex flex-wrap gap-2 mt-3 text-sm">
          {student.leetcodeId
            ? <a href={leetUrl(student.leetcodeId)} target="_blank" rel="noreferrer" className="btn">LeetCode: @{student.leetcodeId}</a>
            : <span className="btn opacity-60">LeetCode: no id</span>}
          {student.codechefId
            ? <a href={ccUrl(student.codechefId)} target="_blank" rel="noreferrer" className="btn">CodeChef: @{student.codechefId}</a>
            : <span className="btn opacity-60">CodeChef: no id</span>}
        </div>
      </>) : (
        <form onSubmit={submit}>
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-xl font-bold">Edit student</h1>
            <div className="flex-1" />
            <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            <button type="button" className="btn" disabled={saving} onClick={() => { setEditing(false); setFormErr(''); }}>Cancel</button>
          </div>
          <div className="grid sm:grid-cols-3 gap-2">
            <input name="name" className="input" placeholder="Full name *" required defaultValue={student.name} />
            <input name="leetcodeId" className="input" placeholder="LeetCode username" defaultValue={student.leetcodeId || ''} />
            <input name="codechefId" className="input" placeholder="CodeChef username" defaultValue={student.codechefId || ''} />
          </div>
          <div className="text-xs text-slate-400 mt-2">Username badalne par purane sync stats reset ho jaate hain — Save ke baad dobara Sync karein.</div>
          {formErr && <div className="mt-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{formErr}</div>}
        </form>
      )}
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard label="LeetCode solved" value={totals.leetcodeSolved} tone="amber" sub={sync.syncedAt ? 'synced ' + fmtDate(sync.syncedAt) : 'not synced'} />
      <StatCard label="CodeChef solved" value={totals.codechefSolved} tone="violet" sub={cc.syncedAt ? 'synced ' + fmtDate(cc.syncedAt) : 'not synced'} />
      <StatCard label="Combined" value={totals.combinedSolved} sub="deduped where verified" />
      <StatCard label="Contests" value={totals.contests} tone="green" sub={totals.leetcodeSyncContests + ' LC · ' + (totals.codechefSyncContests || 0) + ' CC'} />
    </div>
    <div className="card p-4 mt-4 text-sm">
      <b>LeetCode:</b>{' '}
      <span className="font-semibold text-emerald-700">Easy {sync.easy || 0}</span>{' · '}
      <span className="font-semibold text-amber-700">Medium {sync.medium || 0}</span>{' · '}
      <span className="font-semibold text-red-600">Hard {sync.hard || 0}</span>
      <span className="text-slate-400 mx-2">|</span> Rank #{sync.ranking ?? '—'}
      <span className="text-slate-400 mx-2">|</span> Rating {sync.contestRating ?? '—'}
      {sync.syncError ? <span className="text-red-600"> · {sync.syncError}</span> : null}
      <br />
      <b>CodeChef:</b> Rating {totals.codechefRating ?? cc.rating ?? '—'}
      <span className="text-slate-400 mx-2">|</span> Contests {(totals.codechefSyncContests || 0)}
      {totals.codechefSyncError ? <span className="text-red-600"> · {totals.codechefSyncError}</span> : null}
    </div>
  </>);
}
