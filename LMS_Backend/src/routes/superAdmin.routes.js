const express = require('express');
const router = express.Router();

const { requireSuperAdmin } = require('../middleware/auth.middleware');
const { listPendingClasses, approveClass, rejectClass } = require('../controllers/superAdmin.controller');

router.get('/classes/pending', requireSuperAdmin, listPendingClasses);
router.post('/classes/:id/approve', requireSuperAdmin, approveClass);
router.post('/classes/:id/reject', requireSuperAdmin, rejectClass);

module.exports = router;
