const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const { requireStudentAuth } = require('../middleware/studentAuth.middleware');
const { registerStudent, getAllStudents, getStudentById, updateStudent, deleteStudent, getMyProfile } = require('../controllers/student.controller');

router.post('/', requireAuth, registerStudent);
router.get('/', requireAuth, getAllStudents);
router.get('/me', requireStudentAuth, getMyProfile);
router.get('/:id', requireAuth, getStudentById);
router.patch('/:id', requireAuth, updateStudent);
router.delete('/:id', requireAuth, deleteStudent);

module.exports = router;