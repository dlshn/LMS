const prisma = require('../utils/prisma');

async function getSettings(req, res) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.admin.adminId },
      select: {
        name: true,
        phone: true,
        email: true,
        tuitionClass: { select: { name: true, subject: true, classType: true } },
      },
    });

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json({
      adminName: admin.name,
      phone: admin.phone,
      email: admin.email,
      tuitionClassName: admin.tuitionClass?.name,
      subject: admin.tuitionClass?.subject,
      classType: admin.tuitionClass?.classType,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while fetching settings' });
  }
}

// Email isn't editable here — it's the login identifier, and changing it
// safely needs its own uniqueness/verification flow, not a plain field
// in a general settings form.
async function updateSettings(req, res) {
  try {
    const { adminName, phone, tuitionClassName, subject, classType } = req.body;

    if (!adminName || !phone || !tuitionClassName || !subject || !classType) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!['PHYSICAL', 'ONLINE'].includes(classType)) {
      return res.status(400).json({ error: 'classType must be PHYSICAL or ONLINE' });
    }

    await prisma.admin.update({
      where: { id: req.admin.adminId },
      data: { name: adminName, phone },
    });

    const tuitionClass = await prisma.tuitionClass.update({
      where: { id: req.admin.tuitionClassId },
      data: { name: tuitionClassName, subject, classType },
    });

    res.json({
      message: 'Settings updated',
      adminName,
      phone,
      tuitionClassName: tuitionClass.name,
      subject: tuitionClass.subject,
      classType: tuitionClass.classType,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while updating settings' });
  }
}

module.exports = { getSettings, updateSettings };
