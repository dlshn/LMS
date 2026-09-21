const prisma = require('../utils/prisma');
const cloudinary = require('../utils/cloudinary');
const streamifier = require('streamifier');

function sanitizeForFilename(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function streamUpload(fileBuffer, folder, publicId) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id: publicId, resource_type: 'auto' },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
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
    const folder = `stlms/${env}/${tuitionClassId}/notes`;
    const publicId = `${sanitizeForFilename(title)}-${Date.now()}`;

    const result = await streamUpload(req.file.buffer, folder, publicId);

    const note = await prisma.note.create({
      data: {
        tuitionClassId,
        title,
        fileUrl: result.secure_url,
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

module.exports = { uploadNote, getAllNotes };