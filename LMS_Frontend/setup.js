import fs from 'fs';
import path from 'path';

const files = {
'package.json': JSON.stringify({
  name: 'lms-frontend',
  private: true,
  version: '1.0.0',
  type: 'module',
  scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' },
  dependencies: { 
    axios: '^1.7.2', 
    'lucide-react': '^0.395.0', 
    react: '^18.3.1', 
    'react-dom': '^18.3.1', 
    'react-router-dom': '^6.23.1' 
  },
  devDependencies: { 
    '@types/react': '^18.3.3', 
    '@types/react-dom': '^18.3.0', 
    '@vitejs/plugin-react': '^4.3.0', 
    autoprefixer: '^10.4.19', 
    postcss: '^8.4.38', 
    tailwindcss: '^3.4.4', 
    vite: '^5.2.11' 
  }
}, null, 2),

'vite.config.js': `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 }
});`,

'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
};`,

'postcss.config.js': `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`,

'.env': 'VITE_API_BASE_URL=http://localhost:5000/api',

'index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tuition LMS Frontend</title>
  </head>
  <body class="bg-slate-50 text-slate-900 font-sans antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`,

'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;`,

'src/main.jsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,

'src/api/axiosInstance.js': `import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use((config) => {
  const role = localStorage.getItem('role');
  const token = role === 'STUDENT' 
    ? localStorage.getItem('studentAccessToken') 
    : localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

export default API;`,

'src/api/endpoints.js': `import API from './axiosInstance';

export const registerAdmin = (data) => API.post('/auth/register', data);
export const loginAdmin = (data) => API.post('/auth/login', data);
export const loginStudent = (data) => API.post('/auth/student/login', data);
export const registerStudent = (data) => API.post('/students', data);
export const getAllStudents = () => API.get('/students');
export const markAttendance = (data) => API.post('/attendance', data);
export const getStudentAttendance = (id) => API.get(\`/attendance/student/\${id}\`);
export const createExam = (data) => API.post('/exams', data);
export const getAllExams = () => API.get('/exams');
export const getMarksEntryForm = (examId) => API.get(\`/marks/\${examId}/form\`);
export const submitBulkMarks = (examId, data) => API.post(\`/marks/\${examId}/bulk\`, data);
export const getMyResults = () => API.get('/marks/my-results');`,

'src/context/AuthContext.jsx': `import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('accessToken') || localStorage.getItem('studentAccessToken') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [user, setUser] = useState(() => {
    const s = localStorage.getItem('userData');
    return s ? JSON.parse(s) : null;
  });

  const loginAsAdmin = (data) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('role', 'ADMIN');
    localStorage.setItem('userData', JSON.stringify(data.admin || { email: data.email }));
    setToken(data.accessToken);
    setRole('ADMIN');
    setUser(data.admin || { email: data.email });
  };

  const loginAsStudent = (data) => {
    localStorage.setItem('studentAccessToken', data.accessToken);
    localStorage.setItem('studentId', data.student?.id || '');
    localStorage.setItem('role', 'STUDENT');
    localStorage.setItem('userData', JSON.stringify(data.student || {}));
    setToken(data.accessToken);
    setRole('STUDENT');
    setUser(data.student || {});
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, user, loginAsAdmin, loginAsStudent, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);`,

'src/components/Navbar.jsx': `import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut, CheckSquare, FileText, Award, Users } from 'lucide-react';

export default function Navbar() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to={role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'} className="font-bold text-xl tracking-tight flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-blue-400" /> Tuition<span className="text-blue-400">LMS</span>
        </Link>
        <div className="flex items-center space-x-4">
          {role === 'ADMIN' && (
            <div className="hidden md:flex space-x-2">
              <Link to="/admin/students" className="px-3 py-1.5 rounded-md text-sm text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-1"><Users className="w-4 h-4" /> Students</Link>
              <Link to="/admin/attendance" className="px-3 py-1.5 rounded-md text-sm text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-1"><CheckSquare className="w-4 h-4" /> Attendance</Link>
              <Link to="/admin/exams" className="px-3 py-1.5 rounded-md text-sm text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-1"><FileText className="w-4 h-4" /> Exams</Link>
            </div>
          )}
          {role === 'STUDENT' && (
            <Link to="/student/results" className="px-3 py-1.5 rounded-md text-sm text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-1"><Award className="w-4 h-4" /> My Results</Link>
          )}
          <div className="flex items-center space-x-3 border-l border-slate-700 pl-4">
            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold">{role}</span>
            <button onClick={() => { logout(); navigate('/'); }} className="p-1.5 text-slate-400 hover:text-red-400"><LogOut className="h-5 w-5" /></button>
          </div>
        </div>
      </div>
    </nav>
  );
}`,

'src/components/ProtectedRoute.jsx': `import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" replace />;
  return <Outlet />;
}`,

'src/pages/LandingPage.jsx': `import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, BookOpen } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between p-6">
      <header className="flex justify-between max-w-6xl mx-auto w-full py-4 border-b border-slate-800">
        <div className="flex items-center gap-2 font-bold text-xl"><BookOpen className="text-blue-400" /> TuitionLMS</div>
        <div className="flex gap-3">
          <Link to="/login/admin" className="text-sm px-4 py-2 rounded bg-slate-800 hover:bg-slate-700">Admin</Link>
          <Link to="/login/student" className="text-sm px-4 py-2 rounded bg-blue-600 hover:bg-blue-500">Student</Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto text-center py-12">
        <h1 className="text-4xl font-extrabold mb-4">Class, Attendance & Exam Management</h1>
        <p className="text-slate-400 mb-8">Complete React + Tailwind frontend connected to your LMS Backend API.</p>
        <div className="grid sm:grid-cols-2 gap-4 text-left max-w-xl mx-auto">
          <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
            <ShieldCheck className="w-8 h-8 text-blue-400 mb-2" />
            <h3 className="font-bold text-lg mb-1">Admin Portal</h3>
            <p className="text-xs text-slate-400 mb-4">Manage students, take attendance, enter bulk marks.</p>
            <Link to="/login/admin" className="text-xs bg-blue-600 px-3 py-2 rounded font-bold block text-center">Login as Admin</Link>
          </div>
          <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
            <GraduationCap className="w-8 h-8 text-indigo-400 mb-2" />
            <h3 className="font-bold text-lg mb-1">Student Portal</h3>
            <p className="text-xs text-slate-400 mb-4">View exam scores and overall performance.</p>
            <Link to="/login/student" className="text-xs bg-indigo-600 px-3 py-2 rounded font-bold block text-center">Login as Student</Link>
          </div>
        </div>
      </main>
      <footer className="text-center text-xs text-slate-600">&copy; Tuition LMS Platform</footer>
    </div>
  );
}`,

'src/pages/auth/AdminLogin.jsx': `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../../api/endpoints';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: 'admin@example.com', password: 'password123' });
  const [error, setError] = useState('');
  const { loginAsAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginAdmin(form);
      loginAsAdmin(res.data);
      navigate('/admin/dashboard');
    } catch (err) { 
      setError('Invalid Admin Credentials'); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="max-w-md w-full bg-white p-8 rounded-2xl shadow border">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
        {error && <div className="p-2 bg-red-100 text-red-700 text-xs rounded mb-4">{error}</div>}
        <input className="w-full mb-3 p-2.5 border rounded text-sm" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        <input type="password" className="w-full mb-4 p-2.5 border rounded text-sm" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
        <button className="w-full py-2.5 bg-blue-600 text-white rounded font-bold text-sm hover:bg-blue-700">Sign In</button>
      </form>
    </div>
  );
}`,

'src/pages/auth/StudentLogin.jsx': `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginStudent } from '../../api/endpoints';
import { useAuth } from '../../context/AuthContext';

export default function StudentLogin() {
  const [form, setForm] = useState({ username: 'john.student', password: 'password123' });
  const [error, setError] = useState('');
  const { loginAsStudent } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginStudent(form);
      loginAsStudent(res.data);
      navigate('/student/dashboard');
    } catch (err) { 
      setError('Invalid Student Credentials'); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="max-w-md w-full bg-white p-8 rounded-2xl shadow border">
        <h2 className="text-2xl font-bold mb-4 text-center">Student Login</h2>
        {error && <div className="p-2 bg-red-100 text-red-700 text-xs rounded mb-4">{error}</div>}
        <input className="w-full mb-3 p-2.5 border rounded text-sm" placeholder="Username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
        <input type="password" className="w-full mb-4 p-2.5 border rounded text-sm" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
        <button className="w-full py-2.5 bg-indigo-600 text-white rounded font-bold text-sm hover:bg-indigo-700">Sign In</button>
      </form>
    </div>
  );
}`,

'src/pages/admin/AdminDashboard.jsx': `import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { Users, FileText, CheckSquare } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Admin Control Center</h1>
        <div className="grid sm:grid-cols-3 gap-6">
          <Link to="/admin/students" className="bg-white p-6 rounded-xl border shadow-sm hover:shadow">
            <Users className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-bold">Students</h3>
            <p className="text-xs text-slate-500">View & enroll students</p>
          </Link>
          <Link to="/admin/attendance" className="bg-white p-6 rounded-xl border shadow-sm hover:shadow">
            <CheckSquare className="w-8 h-8 text-emerald-600 mb-2" />
            <h3 className="font-bold">Attendance</h3>
            <p className="text-xs text-slate-500">Mark daily attendance</p>
          </Link>
          <Link to="/admin/exams" className="bg-white p-6 rounded-xl border shadow-sm hover:shadow">
            <FileText className="w-8 h-8 text-indigo-600 mb-2" />
            <h3 className="font-bold">Exams & Marks</h3>
            <p className="text-xs text-slate-500">Create tests & bulk marks</p>
          </Link>
        </div>
      </div>
    </div>
  );
}`,

'src/pages/admin/StudentList.jsx': `import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { getAllStudents, registerStudent } from '../../api/endpoints';

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentNumber: 'S001', fullName: '', username: '', password: 'password123', school: '', phone: '', parentPhone: '' });

  const fetchStudents = () => getAllStudents().then(res => setStudents(Array.isArray(res.data) ? res.data : (res.data?.students || []))).catch(console.error);

  useEffect(() => { fetchStudents(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await registerStudent(form);
    setForm({ studentNumber: '', fullName: '', username: '', password: 'password123', school: '', phone: '', parentPhone: '' });
    fetchStudents();
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="max-w-6xl mx-auto p-8 grid lg:grid-cols-3 gap-8">
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-xl border shadow-sm space-y-3 h-fit">
          <h2 className="font-bold text-lg">Add New Student</h2>
          <input className="w-full p-2 border rounded text-xs" placeholder="Reg No (S001)" value={form.studentNumber} onChange={e=>setForm({...form, studentNumber: e.target.value})} required />
          <input className="w-full p-2 border rounded text-xs" placeholder="Full Name" value={form.fullName} onChange={e=>setForm({...form, fullName: e.target.value})} required />
          <input className="w-full p-2 border rounded text-xs" placeholder="Username" value={form.username} onChange={e=>setForm({...form, username: e.target.value})} required />
          <input className="w-full p-2 border rounded text-xs" placeholder="School" value={form.school} onChange={e=>setForm({...form, school: e.target.value})} />
          <input className="w-full p-2 border rounded text-xs" placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} />
          <button className="w-full bg-blue-600 text-white font-bold py-2 rounded text-xs">Enroll Student</button>
        </form>
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border shadow-sm overflow-x-auto">
          <h2 className="font-bold text-lg mb-4">Student Directory</h2>
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b text-xs text-slate-500"><th className="pb-2">Reg No</th><th>Name</th><th>School</th><th>Phone</th></tr></thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id || s._id} className="border-b"><td className="py-2 font-mono">{s.studentNumber}</td><td className="font-semibold">{s.fullName}</td><td>{s.school || '-'}</td><td>{s.phone || '-'}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}`,

'src/pages/admin/AttendanceManager.jsx': `import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { getAllStudents, markAttendance, getStudentAttendance } from '../../api/endpoints';

export default function AttendanceManager() {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getAllStudents().then(res => {
      const list = Array.isArray(res.data) ? res.data : (res.data?.students || []);
      setStudents(list);
      if(list.length) { setSelected(list[0].id || list[0]._id); loadHist(list[0].id || list[0]._id); }
    });
  }, []);

  const loadHist = (id) => getStudentAttendance(id).then(r => setHistory(r.data || [])).catch(()=>setHistory([]));

  const handleMark = async (status) => {
    if(!selected) return;
    await markAttendance({ studentId: selected, date: new Date().toISOString().split('T')[0], status });
    loadHist(selected);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white p-6 rounded-xl border shadow-sm mb-6 flex flex-wrap gap-4 items-center justify-between">
          <select className="p-2 border rounded text-sm flex-1" value={selected} onChange={e => { setSelected(e.target.value); loadHist(e.target.value); }}>
            {students.map(s => <option key={s.id || s._id} value={s.id || s._id}>{s.fullName} ({s.studentNumber})</option>)}
          </select>
          <div className="flex gap-2">
            <button onClick={()=>handleMark('PRESENT')} className="px-4 py-2 bg-emerald-600 text-white rounded text-sm font-bold">Mark Present</button>
            <button onClick={()=>handleMark('ABSENT')} className="px-4 py-2 bg-red-600 text-white rounded text-sm font-bold">Mark Absent</button>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="font-bold mb-3">History Log</h3>
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b text-xs text-slate-500"><th className="pb-2">Date</th><th>Status</th></tr></thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i} className="border-b"><td className="py-2">{h.date ? new Date(h.date).toLocaleDateString() : '-'}</td><td className="font-bold">{h.status}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}`,

'src/pages/admin/ExamList.jsx': `import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { getAllExams, createExam } from '../../api/endpoints';

export default function ExamList() {
  const [exams, setExams] = useState([]);
  const [form, setForm] = useState({ title: '', subject: '', examDate: '2026-08-20', description: '', maxMarks: 100 });

  const load = () => getAllExams().then(res => setExams(Array.isArray(res.data) ? res.data : (res.data?.exams || [])));
  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createExam(form);
    setForm({ title: '', subject: '', examDate: '2026-08-20', description: '', maxMarks: 100 });
    load();
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="max-w-6xl mx-auto p-8 grid lg:grid-cols-3 gap-8">
        <form onSubmit={handleCreate} className="bg-white p-6 rounded-xl border shadow-sm space-y-3 h-fit">
          <h3 className="font-bold text-lg">Create Exam</h3>
          <input className="w-full p-2 border rounded text-xs" placeholder="Exam Title" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} required />
          <input className="w-full p-2 border rounded text-xs" placeholder="Subject" value={form.subject} onChange={e=>setForm({...form, subject: e.target.value})} required />
          <input type="number" className="w-full p-2 border rounded text-xs" placeholder="Max Marks" value={form.maxMarks} onChange={e=>setForm({...form, maxMarks: Number(e.target.value)})} required />
          <input type="date" className="w-full p-2 border rounded text-xs" value={form.examDate} onChange={e=>setForm({...form, examDate: e.target.value})} required />
          <button className="w-full bg-indigo-600 text-white font-bold py-2 rounded text-xs">Create Exam</button>
        </form>
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          {exams.map(ex => (
            <div key={ex.id || ex._id} className="bg-white p-5 rounded-xl border shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold">{ex.subject}</span>
                <h4 className="font-bold text-base mt-2">{ex.title}</h4>
                <p className="text-xs text-slate-500 mt-1">Max Marks: {ex.maxMarks}</p>
              </div>
              <Link to={\`/admin/marks/\${ex.id || ex._id}\`} className="mt-4 block text-center bg-slate-900 text-white text-xs font-bold py-2 rounded">Enter Marks</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`,

'src/pages/admin/MarkEntry.jsx': `import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { getMarksEntryForm, getAllStudents, submitBulkMarks } from '../../api/endpoints';

export default function MarkEntry() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});

  useEffect(() => {
    getMarksEntryForm(examId).then(res => {
      if(res.data?.students) setStudents(res.data.students);
      else getAllStudents().then(r => setStudents(Array.isArray(r.data) ? r.data : (r.data?.students || [])));
    }).catch(() => getAllStudents().then(r => setStudents(Array.isArray(r.data) ? r.data : (r.data?.students || []))));
  }, [examId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { marks: Object.entries(marks).map(([studentId, marksObtained]) => ({ studentId, marksObtained: Number(marksObtained) })) };
    await submitBulkMarks(examId, payload);
    alert('Marks Submitted!');
    navigate('/admin/exams');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="max-w-3xl mx-auto p-8">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="font-bold text-lg mb-4">Bulk Marks Entry</h2>
          <table className="w-full text-left text-sm mb-6">
            <thead><tr className="border-b text-xs text-slate-500"><th className="pb-2">Student</th><th>Score</th></tr></thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id || s._id} className="border-b">
                  <td className="py-2 font-semibold">{s.fullName} ({s.studentNumber})</td>
                  <td><input type="number" className="p-1 border rounded w-20 text-xs" onChange={e => setMarks({...marks, [s.id || s._id]: e.target.value})} required /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="bg-blue-600 text-white px-6 py-2 rounded text-sm font-bold">Save All Marks</button>
        </form>
      </div>
    </div>
  );
}`,

'src/pages/student/StudentDashboard.jsx': `import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-8 rounded-2xl mb-6">
          <h1 className="text-2xl font-bold">Welcome, {user?.fullName || 'Student'}!</h1>
          <p className="text-blue-200 text-xs mt-1">Roll No: {user?.studentNumber || 'Enrolled'}</p>
        </div>
        <Link to="/student/results" className="bg-white p-6 rounded-xl border shadow-sm block hover:shadow font-bold text-blue-600">View My Results &rarr;</Link>
      </div>
    </div>
  );
}`,

'src/pages/student/MyResults.jsx': `import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { getMyResults } from '../../api/endpoints';

export default function MyResults() {
  const [results, setResults] = useState([]);
  useEffect(() => { getMyResults().then(r => setResults(r.data || [])).catch(console.error); }, []);
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8">
        <h2 className="font-bold text-2xl mb-6">My Results</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {results.map((r, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border shadow-sm">
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold">{r.exam?.subject}</span>
              <h3 className="font-bold text-lg mt-2">{r.exam?.title}</h3>
              <div className="text-2xl font-extrabold text-blue-600 mt-2">{r.marksObtained} <span className="text-xs text-slate-400">/ {r.exam?.maxMarks}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`,

'src/App.jsx': `import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/auth/AdminLogin';
import StudentLogin from './pages/auth/StudentLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentList from './pages/admin/StudentList';
import AttendanceManager from './pages/admin/AttendanceManager';
import ExamList from './pages/admin/ExamList';
import MarkEntry from './pages/admin/MarkEntry';
import StudentDashboard from './pages/student/StudentDashboard';
import MyResults from './pages/student/MyResults';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/login/student" element={<StudentLogin />} />

          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/students" element={<StudentList />} />
            <Route path="/admin/attendance" element={<AttendanceManager />} />
            <Route path="/admin/exams" element={<ExamList />} />
            <Route path="/admin/marks/:examId" element={<MarkEntry />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/results" element={<MyResults />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(process.cwd(), filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
}
console.log('✅ All LMS Frontend files created successfully!');