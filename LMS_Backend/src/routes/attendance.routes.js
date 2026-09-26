const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const { requireStudentAuth } = require('../middleware/studentAuth.middleware');
const { markAttendance, getStudentAttendance, getMyAttendance } = require('../controllers/attendance.controller');

router.post('/', requireAuth, markAttendance);
router.get('/student/:studentId', requireAuth, getStudentAttendance);
router.get('/my-attendance', requireStudentAuth, getMyAttendance);

module.exports = router;
