import React from 'react';
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
}