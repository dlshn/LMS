import { createContext, useContext, useState } from 'react';
import * as endpoints from '../api/endpoints';

const StudentAuthContext = createContext(null);

function loadStudentFromStorage() {
  const accessToken = localStorage.getItem('studentAccessToken');
  const fullName = localStorage.getItem('studentFullName');
  const studentNumber = localStorage.getItem('studentNumber');
  if (!accessToken) return null;
  return { accessToken, fullName, studentNumber };
}

export function StudentAuthProvider({ children }) {
  const [student, setStudent] = useState(loadStudentFromStorage); 

  async function login(payload) {
    const { data } = await endpoints.loginStudent(payload);
    localStorage.setItem('studentAccessToken', data.accessToken);
    localStorage.setItem('studentRefreshToken', data.refreshToken);
    localStorage.setItem('studentFullName', data.student.fullName);
    localStorage.setItem('studentNumber', data.student.studentNumber);
    setStudent({
      accessToken: data.accessToken,
      fullName: data.student.fullName,
      studentNumber: data.student.studentNumber,
    });
    return data;
  }

  function logout() {
    localStorage.removeItem('studentAccessToken');
    localStorage.removeItem('studentRefreshToken');
    localStorage.removeItem('studentFullName');
    localStorage.removeItem('studentNumber');
    setStudent(null);
  }

  return (
    <StudentAuthContext.Provider value={{ student, login, logout }}>
      {children}
    </StudentAuthContext.Provider>
  );
}

export function useStudentAuth() {
  return useContext(StudentAuthContext);
}
