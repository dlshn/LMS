import React from 'react';
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
}