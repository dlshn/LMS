import React from 'react';
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
}