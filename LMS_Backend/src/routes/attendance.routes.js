const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const { requireStudentAuth } = require('../middleware/studentAuth.middleware');
const {
  getAttendanceForDate,
  markBulkAttendance,
  getStudentAttendance,
  getMyAttendance,
} = require('../controllers/attendance.controller');

router.get('/by-date', requireAuth, getAttendanceForDate);
router.post('/bulk', requireAuth, markBulkAttendance);
router.get('/student/:studentId', requireAuth, getStudentAttendance);
router.get('/my-attendance', requireStudentAuth, getMyAttendance);

module.exports = router;
