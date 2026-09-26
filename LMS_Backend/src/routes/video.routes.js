const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const { requireStudentAuth } = require('../middleware/studentAuth.middleware');
const {
  createVideo,
  getAllVideos,
  deleteVideo,
  getVideosForStudent,
} = require('../controllers/video.controller');

router.post('/', requireAuth, createVideo);
router.get('/', requireAuth, getAllVideos);
router.delete('/:id', requireAuth, deleteVideo);
router.get('/my-videos', requireStudentAuth, getVideosForStudent);

module.exports = router;
