const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const { requireStudentAuth } = require('../middleware/studentAuth.middleware');
const {
  createNotice,
  getAllNotices,
  deleteNotice,
  getActiveNoticesForStudent,
} = require('../controllers/notice.controller');

router.post('/', requireAuth, createNotice);
router.get('/', requireAuth, getAllNotices);
router.delete('/:id', requireAuth, deleteNotice);
router.get('/active', requireStudentAuth, getActiveNoticesForStudent);

module.exports = router;
