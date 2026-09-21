import React, { useEffect, useState } from 'react';
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
}