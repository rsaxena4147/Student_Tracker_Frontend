import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ClassPage from './pages/ClassPage';
import StudentPage from './pages/StudentPage';

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="bg-ink text-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/" className="font-bold text-lg tracking-tight">Coding Progress Tracker</Link>
          <span className="text-xs text-slate-300 hidden sm:inline">LeetCode · CodeChef · Contests</span>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/class/:id" element={<ClassPage />} />
          <Route path="/student/:id" element={<StudentPage />} />
        </Routes>
      </main>
      <footer className="max-w-6xl mx-auto px-4 pb-8 text-xs text-slate-400">
        Data: MongoDB · LeetCode live sync. Monthly question charts use date-stamped records only.
      </footer>
    </div>
  );
}

