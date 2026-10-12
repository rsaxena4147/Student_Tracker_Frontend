import { Link } from 'react-router-dom';
import { leetUrl, ccUrl } from '../lib/api';
import { Breadcrumbs, StatCard, fmtDate } from '../components/ui';

export function Head({ student, totals, sync }) {
  const cc = student.codechef || {};
  return (<>
    <Breadcrumbs trail={[{ label: 'Home', to: '/' }, { label: (student.classId && student.classId.name) || 'Class', to: student.classId ? '/class/' + student.classId._id : '/' }, { label: student.name }]} />
    <div className="card p-5 mb-4">
      <h1 className="text-xl font-bold">{student.name}</h1>
      <div className="text-sm text-slate-500 mt-1">Roll {student.rollNo}</div>
      <div className="flex flex-wrap gap-2 mt-3 text-sm">
        {student.leetcodeId
          ? <a href={leetUrl(student.leetcodeId)} target="_blank" rel="noreferrer" className="btn">LeetCode: @{student.leetcodeId}</a>
          : <span className="btn opacity-60">LeetCode: no id</span>}
        {student.codechefId
          ? <a href={ccUrl(student.codechefId)} target="_blank" rel="noreferrer" className="btn">CodeChef: @{student.codechefId}</a>
          : <span className="btn opacity-60">CodeChef: no id</span>}
      </div>
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
