const prisma = require('../utils/prisma');

// Admin picks one of these instead of typing a raw date — keeps the UI to a
// simple select and keeps "how long does this stay up" answers consistent.
const DURATION_MS = {
  '1D': 1 * 24 * 60 * 60 * 1000,
  '2D': 2 * 24 * 60 * 60 * 1000,
  '3D': 3 * 24 * 60 * 60 * 1000,
  '7D': 7 * 24 * 60 * 60 * 1000,
  '14D': 14 * 24 * 60 * 60 * 1000,
  '30D': 30 * 24 * 60 * 60 * 1000,
};

async function createNotice(req, res) {
  try {
    const tuitionClassId = req.user.tenantId;
    const { message, duration } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'message is required' });
    }

    const durationMs = DURATION_MS[duration];
    if (!durationMs) {
      return res.status(400).json({ error: `duration must be one of ${Object.keys(DURATION_MS).join(', ')}` });
    }

    const notice = await prisma.notice.create({
      data: {
        tuitionClassId,
        message: message.trim(),
        expiresAt: new Date(Date.now() + durationMs),
      },
    });

    res.status(201).json({ message: 'Notice posted', notice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while posting the notice' });
  }
}

async function getAllNotices(req, res) {
  try {
    const tuitionClassId = req.user.tenantId;
    const notices = await prisma.notice.findMany({
      where: { tuitionClassId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ count: notices.length, notices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while fetching notices' });
  }
}

async function deleteNotice(req, res) {
  try {
    const tuitionClassId = req.user.tenantId;
    const { id } = req.params;

    const notice = await prisma.notice.findFirst({ where: { id, tuitionClassId } });
    if (!notice) {
      return res.status(404).json({ error: 'Notice not found in your tuition class' });
    }

    await prisma.notice.delete({ where: { id } });
    res.json({ message: 'Notice deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while deleting the notice' });
  }
}

// Students only ever see the still-active ones — expiry is enforced here,
// not just cosmetically on the frontend.
async function getActiveNoticesForStudent(req, res) {
  try {
    const tuitionClassId = req.user.tenantId;
    const notices = await prisma.notice.findMany({
      where: { tuitionClassId, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ count: notices.length, notices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while fetching notices' });
  }
}

module.exports = { createNotice, getAllNotices, deleteNotice, getActiveNoticesForStudent };
