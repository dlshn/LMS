const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const { getSettings, updateSettings } = require('../controllers/settings.controller');

router.get('/', requireAuth, getSettings);
router.patch('/', requireAuth, updateSettings);

module.exports = router;
