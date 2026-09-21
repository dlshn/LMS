const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const { uploadNote, getAllNotes } = require('../controllers/note.controller');

router.post('/', requireAuth, upload.single('file'), uploadNote);
router.get('/', requireAuth, getAllNotes);

module.exports = router;