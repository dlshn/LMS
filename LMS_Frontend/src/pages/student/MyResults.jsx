import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { getMyResults } from '../../api/endpoints';

export default function MyResults() {
  const [results, setResults] = useState([]);
  useEffect(() => { getMyResults().then(r => setResults(r.data || [])).catch(console.error); }, []);
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8">
        <h2 className="font-bold text-2xl mb-6">My Results</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {results.map((r, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border shadow-sm">
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold">{r.exam?.subject}</span>
              <h3 className="font-bold text-lg mt-2">{r.exam?.title}</h3>
              <div className="text-2xl font-extrabold text-blue-600 mt-2">{r.marksObtained} <span className="text-xs text-slate-400">/ {r.exam?.maxMarks}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}