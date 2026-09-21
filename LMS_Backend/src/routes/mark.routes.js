const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const { requireStudentAuth } = require('../middleware/studentAuth.middleware');
const { getMarksEntryForm, submitBulkMarks, getMyResults } = require('../controllers/mark.controller');

// ස්ථාවර (Static) Routes මුලින්ම
router.get('/my-results', requireStudentAuth, getMyResults);

// Parameters සහිත Routes පසුව
router.get('/:examId/form', requireAuth, getMarksEntryForm);
router.post('/:examId/bulk', requireAuth, submitBulkMarks);

module.exports = router;
