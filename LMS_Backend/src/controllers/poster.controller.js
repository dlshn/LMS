const prisma = require('../utils/prisma');
const r2 = require('../utils/r2');
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

// Replacing the poster re-uses the same key every time (not timestamped
// like notes) — there's only ever one poster per class, so there's no
// reason to leave the old object behind in the bucket.
async function getPoster(req, res) {
  try {
    const tuitionClassId = req.admin.tuitionClassId;
    const tuitionClass = await prisma.tuitionClass.findUnique({
      where: { id: tuitionClassId },
      select: { posterImageUrl: true },
    });
    res.json({ posterImageUrl: tuitionClass?.posterImageUrl || null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while fetching the poster' });
  }
}

async function uploadPoster(req, res) {
  try {
    const tuitionClassId = req.admin.tuitionClassId;

    if (!req.file) {
      return res.status(400).json({ error: 'An image file is required' });
    }
    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ error: 'File must be an image' });
    }

    const env = process.env.NODE_ENV || 'development';
    const fileKey = `${env}/${tuitionClassId}/poster`;

    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

    // Cache-bust so the new image shows up immediately instead of a stale
    // cached version at the same URL.
    const posterImageUrl = `${process.env.R2_PUBLIC_URL}/${fileKey}?v=${Date.now()}`;

    const tuitionClass = await prisma.tuitionClass.update({
      where: { id: tuitionClassId },
      data: { posterImageKey: fileKey, posterImageUrl },
    });

    res.json({ message: 'Poster uploaded', posterImageUrl: tuitionClass.posterImageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while uploading the poster' });
  }
}

async function deletePoster(req, res) {
  try {
    const tuitionClassId = req.admin.tuitionClassId;

    const tuitionClass = await prisma.tuitionClass.findUnique({ where: { id: tuitionClassId } });
    if (!tuitionClass?.posterImageKey) {
      return res.status(404).json({ error: 'No poster image set for your class' });
    }

    await r2.send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: tuitionClass.posterImageKey }));

    await prisma.tuitionClass.update({
      where: { id: tuitionClassId },
      data: { posterImageKey: null, posterImageUrl: null },
    });

    res.json({ message: 'Poster deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while deleting the poster' });
  }
}

module.exports = { getPoster, uploadPoster, deletePoster };
