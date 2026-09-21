import { createContext, useContext, useState } from 'react';
import * as endpoints from '../api/endpoints';
import { decodeJwtPayload } from '../api/jwt';

const AdminAuthContext = createContext(null);

function loadAdminFromStorage() {
  const accessToken = localStorage.getItem('adminAccessToken');
  const adminName = localStorage.getItem('adminName');
  const tuitionClassName = localStorage.getItem('tuitionClassName');
  const tuitionClassId = localStorage.getItem('tuitionClassId');
  if (!accessToken) return null;
  return { accessToken, adminName, tuitionClassName, tuitionClassId };
}

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(loadAdminFromStorage);

  function persist({ accessToken, refreshToken, admin: adminInfo, tuitionClass }) {
    localStorage.setItem('adminAccessToken', accessToken);
    localStorage.setItem('adminRefreshToken', refreshToken);
    localStorage.setItem('adminName', adminInfo.name);

    // Register returns tuitionClass directly; login doesn't, so we
    // read it out of the token payload instead (see api/jwt.js).
    const tuitionClassId = tuitionClass?.id || decodeJwtPayload(accessToken)?.tuitionClassId;
    const tuitionClassName = tuitionClass?.name || localStorage.getItem('tuitionClassName');

    if (tuitionClassId) localStorage.setItem('tuitionClassId', tuitionClassId);
    if (tuitionClassName) localStorage.setItem('tuitionClassName', tuitionClassName);

    setAdmin({ accessToken, adminName: adminInfo.name, tuitionClassId, tuitionClassName });
  }

  async function register(payload) {
    const { data } = await endpoints.registerAdmin(payload);
    persist(data);
    return data;
  }

  async function login(payload) {
    const { data } = await endpoints.loginAdmin(payload);
    persist(data);
    return data;
  }

  function logout() {
    localStorage.removeItem('adminAccessToken');
    localStorage.removeItem('adminRefreshToken');
    localStorage.removeItem('adminName');
    localStorage.removeItem('tuitionClassId');
    localStorage.removeItem('tuitionClassName');
    setAdmin(null);
  }

  return (
    <AdminAuthContext.Provider value={{ admin, register, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
