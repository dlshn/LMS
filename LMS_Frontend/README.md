# STLMS Frontend

React + Vite frontend for the Smart Tuition LMS backend (LMS_Backend).

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env` and point `VITE_API_URL` at your backend (local or your Render URL).

```bash
npm run dev
```

Visit `http://localhost:5173`.

## Pages

| Route | Who | What |
|---|---|---|
| `/admin/register` | Admin | Create a tuition class + admin account |
| `/admin/login` | Admin | Log in |
| `/admin/dashboard` | Admin | Overview, quick links, shows your Tuition Class ID |
| `/admin/students` | Admin | Add / edit / delete students |
| `/admin/attendance` | Admin | Mark attendance, view a student's history |
| `/admin/exams` | Admin | Create / edit / publish exams |
| `/admin/exams/:examId/marks` | Admin | Bulk marks entry form (the "Add Mark" screen) |
| `/admin/notes` | Admin | Upload / download notes (Cloudinary) |
| `/student/login` | Student | Log in with username + password |
| `/student/dashboard` | Student | View all published results |
| `/check-result` | Anyone | No login - check a result by Tuition Class ID + student number |

## Notes on how it's wired to the backend

- `src/api/client.js` - one shared axios instance. Automatically attaches the admin or student access token to every request based on a `useStudentAuth` flag passed per-call.
- `src/api/endpoints.js` - one function per backend route, so no page ever hardcodes a URL string.
- `src/context/AdminAuthContext.jsx` / `StudentAuthContext.jsx` - hold the logged-in admin/student in memory + localStorage, survive a page refresh.
- Admin login doesn't return `tuitionClassId` directly (only register does) - `src/api/jwt.js` decodes it out of the access token payload instead, since it's already public/non-secret in the token.
- Refresh-token endpoints exist in `endpoints.js` but aren't wired into automatic retry-on-401 yet - that's a good next step once you're comfortable with how the app behaves.

## Not built yet (matches backend gaps)

- Automatic token refresh on 401 (currently you'd just get logged out after 15 min and need to log back in)
- Super Admin views
- Delete exam / unpublish exam / delete note (backend doesn't have these endpoints yet either)
