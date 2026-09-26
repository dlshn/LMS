const prisma = require('../utils/prisma');

// Accepts youtube.com/watch?v=, youtu.be/, and youtube.com/embed/ links and
// pulls out the 11-char video id — that id is all the frontend needs to
// build an embed URL, and validating it here rejects garbage links early.
const YOUTUBE_ID_REGEX =
  /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;

function extractYoutubeId(url) {
  const match = String(url || '').match(YOUTUBE_ID_REGEX);
  return match ? match[1] : null;
}

async function createVideo(req, res) {
  try {
    const tuitionClassId = req.admin.tuitionClassId;
    const { title, youtubeUrl } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'title is required' });
    }
    if (!extractYoutubeId(youtubeUrl)) {
      return res.status(400).json({ error: 'youtubeUrl must be a valid YouTube link' });
    }

    const video = await prisma.video.create({
      data: { tuitionClassId, title: title.trim(), youtubeUrl: youtubeUrl.trim() },
    });

    res.status(201).json({ message: 'Recording added', video });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while adding the recording' });
  }
}

async function getAllVideos(req, res) {
  try {
    const tuitionClassId = req.admin.tuitionClassId;
    const videos = await prisma.video.findMany({
      where: { tuitionClassId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ count: videos.length, videos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while fetching recordings' });
  }
}

async function deleteVideo(req, res) {
  try {
    const tuitionClassId = req.admin.tuitionClassId;
    const { id } = req.params;

    const video = await prisma.video.findFirst({ where: { id, tuitionClassId } });
    if (!video) {
      return res.status(404).json({ error: 'Recording not found in your tuition class' });
    }

    await prisma.video.delete({ where: { id } });
    res.json({ message: 'Recording deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while deleting the recording' });
  }
}

async function getVideosForStudent(req, res) {
  try {
    const tuitionClassId = req.student.tuitionClassId;
    const videos = await prisma.video.findMany({
      where: { tuitionClassId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ count: videos.length, videos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while fetching recordings' });
  }
}

module.exports = { createVideo, getAllVideos, deleteVideo, getVideosForStudent };
