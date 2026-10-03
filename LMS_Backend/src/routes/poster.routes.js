const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const { getPoster, uploadPoster, deletePoster } = require('../controllers/poster.controller');

router.get('/', requireAuth, getPoster);
router.post('/', requireAuth, upload.single('file'), uploadPoster);
router.delete('/', requireAuth, deletePoster);

module.exports = router;
