import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 60000,
});

export const fetchClasses = () => api.get('/classes').then((r) => r.data);
export const fetchStudents = (classId, params) => api.get(`/classes/${classId}/students`, { params }).then((r) => r.data);
export const fetchStudent = (id) => api.get(`/students/${id}`).then((r) => r.data);
export const fetchMonth = (id, ym) => api.get(`/students/${id}/month/${ym}`).then((r) => r.data);
export const syncStudent = (id) => api.post(`/students/${id}/sync`).then((r) => r.data);
export const syncClass = (classId) => api.post(`/import/sync-class/${classId}`).then((r) => r.data);
export const addStudent = (classId, body) => api.post(`/classes/${classId}/students`, body).then((r) => r.data);
export const updateStudent = (id, body) => api.patch(`/students/${id}`, body).then((r) => r.data);
export const importExcel = (file, className) => {
  const fd = new FormData();
  fd.append('file', file);
  if (className) fd.append('className', className);
  return api.post('/import/excel', fd).then((r) => r.data);
};

export const exportClassExcel = (classId) =>
  api.get(`/classes/${classId}/export`, { responseType: 'blob' }).then((r) => r.data);
export const exportStudentExcel = (id) =>
  api.get(`/students/${id}/export`, { responseType: 'blob' }).then((r) => r.data);

export function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// error responses come back as blobs — unwrap the JSON message
export async function blobErrMsg(e) {
  try {
    const d = e && e.response && e.response.data;
    if (d && typeof d.text === 'function') {
      const t = await d.text();
      try { return JSON.parse(t).message || t; } catch { return t; }
    }
  } catch { /* fall through */ }
  return (e && e.message) || 'Download failed';
}

export const leetUrl = (u) => (u ? `https://leetcode.com/u/${u}/` : '');
export const ccUrl = (u) => (u ? `https://www.codechef.com/users/${u}` : '');

// score color: minimal — green good, amber mid, red low, slate none
export function scoreTone(n) {
  if (n == null || n === 0) return 'text-slate-400';
  if (n >= 100) return 'text-emerald-700';
  if (n >= 30) return 'text-amber-700';
  return 'text-red-600';
}
export function scoreBg(n) {
  if (n == null || n === 0) return 'bg-slate-100 text-slate-500';
  if (n >= 100) return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  if (n >= 30) return 'bg-amber-50 text-amber-800 border-amber-200';
  return 'bg-red-50 text-red-700 border-red-200';
}

export default api;
