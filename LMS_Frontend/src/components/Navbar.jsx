import React from 'react';
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
}