const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const { requireStudentAuth } = require('../middleware/studentAuth.middleware');
const { uploadNote, getAllNotes, deleteNote, getNotesForStudent } = require('../controllers/note.controller');

router.post('/', requireAuth, upload.single('file'), uploadNote);
router.get('/', requireAuth, getAllNotes);
router.delete('/:id', requireAuth, deleteNote);
router.get('/my-notes', requireStudentAuth, getNotesForStudent);

module.exports = router;