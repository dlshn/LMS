import { createContext, useContext, useState } from 'react';
import * as endpoints from '../api/endpoints';
import { decodeJwtPayload } from '../api/jwt';

const AdminAuthContext = createContext(null);

function loadAdminFromStorage() {
  const accessToken = localStorage.getItem('adminAccessToken');
  const adminName = localStorage.getItem('adminName');
  const tuitionClassName = localStorage.getItem('tuitionClassName');
  const tuitionClassId = localStorage.getItem('tuitionClassId');
  const joinCode = localStorage.getItem('tuitionClassJoinCode');
  if (!accessToken) return null;
  return { accessToken, adminName, tuitionClassName, tuitionClassId, joinCode };
}

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(loadAdminFromStorage);

  function persist({ accessToken, refreshToken, admin: adminInfo, tuitionClass }) {
    localStorage.setItem('adminAccessToken', accessToken);
    localStorage.setItem('adminRefreshToken', refreshToken);
    localStorage.setItem('adminName', adminInfo.name);

    // Both register and login now return tuitionClass directly; fall back
    // to the token payload for older cached sessions.
    const tuitionClassId = tuitionClass?.id || decodeJwtPayload(accessToken)?.tuitionClassId;
    const tuitionClassName = tuitionClass?.name || localStorage.getItem('tuitionClassName');
    const joinCode = tuitionClass?.joinCode || localStorage.getItem('tuitionClassJoinCode');

    if (tuitionClassId) localStorage.setItem('tuitionClassId', tuitionClassId);
    if (tuitionClassName) localStorage.setItem('tuitionClassName', tuitionClassName);
    if (joinCode) localStorage.setItem('tuitionClassJoinCode', joinCode);

    setAdmin({ accessToken, adminName: adminInfo.name, tuitionClassId, tuitionClassName, joinCode });
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

  // Settings page updates name/class name on the backend directly (not via
  // the login/register response shape persist() expects) — this just
  // syncs the few fields the UI actually reads from `admin` elsewhere
  // (topbar brand, "Welcome back, ...").
  function updateLocalProfile({ adminName, tuitionClassName }) {
    if (adminName) localStorage.setItem('adminName', adminName);
    if (tuitionClassName) localStorage.setItem('tuitionClassName', tuitionClassName);
    setAdmin((prev) => (prev ? { ...prev, adminName: adminName ?? prev.adminName, tuitionClassName: tuitionClassName ?? prev.tuitionClassName } : prev));
  }

  function logout() {
    localStorage.removeItem('adminAccessToken');
    localStorage.removeItem('adminRefreshToken');
    localStorage.removeItem('adminName');
    localStorage.removeItem('tuitionClassId');
    localStorage.removeItem('tuitionClassName');
    localStorage.removeItem('tuitionClassJoinCode');
    setAdmin(null);
  }

  return (
    <AdminAuthContext.Provider value={{ admin, register, login, logout, updateLocalProfile }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
