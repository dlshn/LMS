const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const { createExam, getAllExams, updateExam, publishExam, deleteExam } = require('../controllers/exam.controller');

router.post('/', requireAuth, createExam);
router.get('/', requireAuth, getAllExams);
router.patch('/:id/publish', requireAuth, publishExam);
router.patch('/:id', requireAuth, updateExam);
router.delete('/:id', requireAuth, deleteExam);

module.exports = router;