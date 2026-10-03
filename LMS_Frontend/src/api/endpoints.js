import api from './client';

// --- Auth ---
export const registerAdmin = (data) => api.post('/api/auth/register', data);
export const loginAdmin = (data) => api.post('/api/auth/login', data);
export const loginStudent = (data) => api.post('/api/auth/student/login', data);
export const registerStudentSelf = (data) => api.post('/api/auth/student/register', data);
export const refreshAdminToken = (refreshToken) =>
  api.post('/api/auth/refresh', { refreshToken });
export const refreshStudentToken = (refreshToken) =>
  api.post('/api/auth/refresh', { refreshToken });

// --- Students (admin) ---
export const registerStudent = (data) => api.post('/api/students', data);
export const getAllStudents = () => api.get('/api/students');
export const getStudentById = (id) => api.get(`/api/students/${id}`);

// --- Students (student, requires student token) ---
export const getMyProfile = () => api.get('/api/students/me', { useStudentAuth: true });
export const updateStudent = (id, data) => api.patch(`/api/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/api/students/${id}`);

// --- Attendance (admin) ---
export const markAttendance = (data) => api.post('/api/attendance', data);
export const getStudentAttendance = (studentId) =>
  api.get(`/api/attendance/student/${studentId}`);

// --- Attendance (student, requires student token) ---
export const getMyAttendance = () =>
  api.get('/api/attendance/my-attendance', { useStudentAuth: true });

// --- Exams (admin) ---
export const createExam = (data) => api.post('/api/exams', data);
export const getAllExams = () => api.get('/api/exams');
export const updateExam = (id, data) => api.patch(`/api/exams/${id}`, data);
export const publishExam = (id) => api.patch(`/api/exams/${id}/publish`);

// --- Marks (admin) ---
export const getMarksEntryForm = (examId) => api.get(`/api/marks/${examId}/form`);
export const submitBulkMarks = (examId, marks) =>
  api.post(`/api/marks/${examId}/bulk`, { marks });

// --- Marks (student, requires student token) ---
export const getMyResults = () =>
  api.get('/api/marks/my-results', { useStudentAuth: true });

// --- Notes (admin) ---
export const uploadNote = (formData) =>
  api.post('/api/notes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const getAllNotes = () => api.get('/api/notes');
export const deleteNote = (id) => api.delete(`/api/notes/${id}`);

// --- Notes (student, requires student token) ---
export const getMyNotes = () => api.get('/api/notes/my-notes', { useStudentAuth: true });

// --- Notices (admin) ---
export const createNotice = (data) => api.post('/api/notices', data);
export const getAllNotices = () => api.get('/api/notices');
export const deleteNotice = (id) => api.delete(`/api/notices/${id}`);

// --- Notices (student, requires student token) ---
export const getActiveNotices = () =>
  api.get('/api/notices/active', { useStudentAuth: true });

// --- Recordings (admin) ---
export const createVideo = (data) => api.post('/api/videos', data);
export const getAllVideos = () => api.get('/api/videos');
export const deleteVideo = (id) => api.delete(`/api/videos/${id}`);

// --- Recordings (student, requires student token) ---
export const getMyVideos = () => api.get('/api/videos/my-videos', { useStudentAuth: true });

// --- Poster (admin) ---
export const getPoster = () => api.get('/api/poster');
export const uploadPoster = (formData) =>
  api.post('/api/poster', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const deletePoster = () => api.delete('/api/poster');
