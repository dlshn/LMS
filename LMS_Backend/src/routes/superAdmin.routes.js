const express = require('express');
const router = express.Router();

const { requireSuperAdmin } = require('../middleware/auth.middleware');
const {
  listClasses,
  approveClass,
  suspendClass,
  reactivateClass,
  rejectClass,
  deleteClass,
} = require('../controllers/superAdmin.controller');

router.get('/classes', requireSuperAdmin, listClasses);
router.post('/classes/:id/approve', requireSuperAdmin, approveClass);
router.post('/classes/:id/suspend', requireSuperAdmin, suspendClass);
router.post('/classes/:id/reactivate', requireSuperAdmin, reactivateClass);
router.post('/classes/:id/reject', requireSuperAdmin, rejectClass);
router.delete('/classes/:id', requireSuperAdmin, deleteClass);

module.exports = router;
