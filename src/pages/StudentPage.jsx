import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchStudent, fetchMonth, leetUrl, ccUrl, scoreBg } from '../lib/api';
import { Loading, ErrorBox } from '../components/ui';
import { Head } from './sp_head';
import { Charts, MonthBlock, Back } from './sp_tail';


const MONTHS = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function StudentPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [sel, setSel] = useState('');
  const [month, setMonth] = useState(null);

  const load = () => {
    setErr('');
    fetchStudent(id).then((d) => {
      setData(d);
      if (!sel && d.months.length) setSel(d.months[d.months.length - 1].key);
    }).catch((e) => setErr(e.response?.data?.message || e.message));
  };
  useEffect(load, [id]);
  useEffect(() => {
    if (!sel) return;
    fetchMonth(id, sel).then(setMonth).catch(() => setMonth(null));
  }, [sel, id, data]);

  if (err) return <ErrorBox message={err} onRetry={load} />;
  if (!data) return <Loading label="Loading student…" />;
  const { student, totals } = data;
  const sync = student.leetcode || {};
  return (<div><Head student={student} totals={totals} sync={sync} onSaved={load} /><Charts data={data} /><MonthBlock data={data} sel={sel} setSel={setSel} month={month} /><Back student={student} /></div>);
}
