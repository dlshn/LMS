import React, { useState, useEffect } from 'react';
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
              <Link to={`/admin/marks/${ex.id || ex._id}`} className="mt-4 block text-center bg-slate-900 text-white text-xs font-bold py-2 rounded">Enter Marks</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}