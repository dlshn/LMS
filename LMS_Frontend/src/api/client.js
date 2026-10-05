import axios from 'axios';

// One shared axios instance for the whole app - same "single shared
// connection" idea as the backend's prisma.js singleton.
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({ baseURL });

// Attach whichever token is active before every request.
// We store admin and student tokens under separate keys so a browser
// tab could (in theory) hold both without clobbering each other.
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('adminAccessToken');
  const studentToken = localStorage.getItem('studentAccessToken');

  // Requests to student-only endpoints use the student token;
  // everything else defaults to the admin token if present.
  if (config.useStudentAuth && studentToken) {
    config.headers.Authorization = `Bearer ${studentToken}`;
  } else if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }

  return config;
});

// Access tokens expire after 15 minutes (see backend/utils/token.js). Without
// this, any request made after that just fails with "Invalid or expired
// token" and leaves the page stuck showing that error — the refresh token
// sitting in localStorage for 7 days was never actually being used for
// anything. This refreshes silently and retries once; only when the refresh
// token is also gone or invalid does it send the user back to log in.
const SESSION = {
  admin: {
    accessKey: 'adminAccessToken',
    refreshKey: 'adminRefreshToken',
    loginPath: '/admin/login',
    extraKeys: ['adminName', 'adminRole', 'tuitionClassId', 'tuitionClassName', 'tuitionClassJoinCode'],
  },
  student: {
    accessKey: 'studentAccessToken',
    refreshKey: 'studentRefreshToken',
    loginPath: '/student/login',
    extraKeys: ['studentFullName', 'studentNumber'],
  },
};

// Concurrent 401s (e.g. a Promise.all of several requests) should trigger
// one refresh call, not one per request — everyone waiting on the same kind
// of session shares this in-flight promise.
const pendingRefresh = { admin: null, student: null };

function clearSessionAndRedirect(kind) {
  const session = SESSION[kind];
  localStorage.removeItem(session.accessKey);
  localStorage.removeItem(session.refreshKey);
  session.extraKeys.forEach((key) => localStorage.removeItem(key));

  if (!window.location.pathname.startsWith(session.loginPath)) {
    window.location.href = session.loginPath;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    if (!response || response.status !== 401 || !config || config._retry) {
      return Promise.reject(error);
    }

    const kind = config.useStudentAuth ? 'student' : 'admin';
    const session = SESSION[kind];
    const refreshToken = localStorage.getItem(session.refreshKey);

    if (!refreshToken) {
      clearSessionAndRedirect(kind);
      return Promise.reject(error);
    }

    config._retry = true;

    try {
      if (!pendingRefresh[kind]) {
        pendingRefresh[kind] = axios
          .post(`${baseURL}/api/auth/refresh`, { refreshToken })
          .finally(() => {
            pendingRefresh[kind] = null;
          });
      }
      const { data } = await pendingRefresh[kind];
      localStorage.setItem(session.accessKey, data.accessToken);
      config.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(config);
    } catch {
      // The refresh token itself is gone/expired too — nothing left to do
      // but send them back to log in again.
      clearSessionAndRedirect(kind);
      return Promise.reject(error);
    }
  }
);

export default api;
