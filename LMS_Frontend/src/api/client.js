import axios from 'axios';

// One shared axios instance for the whole app - same "single shared
// connection" idea as the backend's prisma.js singleton.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

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

export default api;
