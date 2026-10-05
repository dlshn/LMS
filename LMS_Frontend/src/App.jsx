import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { StudentAuthProvider } from './context/StudentAuthContext';
import { ConfirmDialogProvider } from './context/ConfirmDialogContext';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import StudentProtectedRoute from './components/StudentProtectedRoute';

import AdminRegister from './pages/admin/Register';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import Students from './pages/admin/Students';
import Attendance from './pages/admin/Attendance';
import Exams from './pages/admin/Exams';
import MarksEntry from './pages/admin/MarksEntry';
import Notes from './pages/admin/Notes';
import Notices from './pages/admin/Notices';
import Recordings from './pages/admin/Recordings';
import Settings from './pages/admin/Settings';
import PendingClasses from './pages/super/PendingClasses';
import SuperAdminRoute from './components/SuperAdminRoute';

import StudentLogin from './pages/student/Login';
import StudentRegister from './pages/student/Register';
import StudentDashboard from './pages/student/Dashboard';

import Home from './pages/public/Home';
import Help from './pages/public/Help';
import Contact from './pages/public/Contact';

export default function App() {
  return (
    <AdminAuthProvider>
      <StudentAuthProvider>
        <ConfirmDialogProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/help" element={<Help />} />
            <Route path="/contact" element={<Contact />} />

            {/* Admin */}
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/students"
              element={
                <AdminProtectedRoute>
                  <Students />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/attendance"
              element={
                <AdminProtectedRoute>
                  <Attendance />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/exams"
              element={
                <AdminProtectedRoute>
                  <Exams />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/exams/:examId/marks"
              element={
                <AdminProtectedRoute>
                  <MarksEntry />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/notes"
              element={
                <AdminProtectedRoute>
                  <Notes />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/admin/notices"
              element={
                <AdminProtectedRoute>
                  <Notices />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/admin/recordings"
              element={
                <AdminProtectedRoute>
                  <Recordings />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/admin/settings"
              element={
                <AdminProtectedRoute>
                  <Settings />
                </AdminProtectedRoute>
              }
            />

            {/* Super admin */}
            <Route
              path="/super/classes"
              element={
                <SuperAdminRoute>
                  <PendingClasses />
                </SuperAdminRoute>
              }
            />

            {/* Student */}
            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="/student/register" element={<StudentRegister />} />
            <Route
              path="/student/dashboard"
              element={
                <StudentProtectedRoute>
                  <StudentDashboard />
                </StudentProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        </ConfirmDialogProvider>
      </StudentAuthProvider>
    </AdminAuthProvider>
  );
}
