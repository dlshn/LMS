import React, { useEffect, useState } from 'react';
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
}