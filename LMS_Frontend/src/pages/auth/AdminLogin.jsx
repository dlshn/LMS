import React, { useState } from 'react';
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
}