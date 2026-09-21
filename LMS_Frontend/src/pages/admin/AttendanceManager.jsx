import React, { useState, useEffect } from 'react';
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
}