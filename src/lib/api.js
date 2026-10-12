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
