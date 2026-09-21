import React, { useState } from 'react';
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
}