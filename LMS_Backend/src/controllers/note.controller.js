const prisma = require('../utils/prisma');
const r2 = require('../utils/r2');
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

function sanitizeForFilename(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function uploadNote(req, res) {
  try {
    const tuitionClassId = req.admin.tuitionClassId;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'A file is required' });
    }

    const env = process.env.NODE_ENV || 'development';
    const fileKey = `${env}/${tuitionClassId}/notes/${sanitizeForFilename(title)}-${Date.now()}-${req.file.originalname}`;

    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

    const note = await prisma.note.create({
      data: {
        tuitionClassId,
        title,
        fileKey,
        fileUrl: `${process.env.R2_PUBLIC_URL}/${fileKey}`,
        fileType: req.file.mimetype,
      },
    });

    res.status(201).json({ message: 'Note uploaded', note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while uploading the note' });
  }
}

async function getAllNotes(req, res) {
  try {
    const tuitionClassId = req.admin.tuitionClassId;

    const notes = await prisma.note.findMany({
      where: { tuitionClassId },
      orderBy: { uploadedAt: 'desc' },
    });

    res.json({ count: notes.length, notes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while fetching notes' });
  }
}

async function deleteNote(req, res) {
  try {
    const tuitionClassId = req.admin.tuitionClassId;
    const { id } = req.params;

    const note = await prisma.note.findFirst({ where: { id, tuitionClassId } });
    if (!note) {
      return res.status(404).json({ error: 'Note not found in your tuition class' });
    }

    await r2.send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: note.fileKey }));
    await prisma.note.delete({ where: { id } });

    res.json({ message: 'Note deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while deleting the note' });
  }
}

async function getNotesForStudent(req, res) {
  try {
    const tuitionClassId = req.student.tuitionClassId;

    const notes = await prisma.note.findMany({
      where: { tuitionClassId },
      orderBy: { uploadedAt: 'desc' },
    });

    res.json({ count: notes.length, notes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while fetching notes' });
  }
}

module.exports = { uploadNote, getAllNotes, deleteNote, getNotesForStudent };
