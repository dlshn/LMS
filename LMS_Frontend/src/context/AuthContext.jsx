import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('accessToken') || localStorage.getItem('studentAccessToken') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [user, setUser] = useState(() => {
    const s = localStorage.getItem('userData');
    return s ? JSON.parse(s) : null;
  });

  const loginAsAdmin = (data) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('role', 'ADMIN');
    localStorage.setItem('userData', JSON.stringify(data.admin || { email: data.email }));
    setToken(data.accessToken);
    setRole('ADMIN');
    setUser(data.admin || { email: data.email });
  };

  const loginAsStudent = (data) => {
    localStorage.setItem('studentAccessToken', data.accessToken);
    localStorage.setItem('studentId', data.student?.id || '');
    localStorage.setItem('role', 'STUDENT');
    localStorage.setItem('userData', JSON.stringify(data.student || {}));
    setToken(data.accessToken);
    setRole('STUDENT');
    setUser(data.student || {});
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, user, loginAsAdmin, loginAsStudent, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);