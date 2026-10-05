const prisma = require('../utils/prisma');

async function listPendingClasses(req, res) {
  try {
    const classes = await prisma.tuitionClass.findMany({
      where: { isApproved: false },
      orderBy: { createdAt: 'asc' },
      include: {
        admins: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    res.json({
      classes: classes.map((c) => ({
        id: c.id,
        name: c.name,
        subject: c.subject,
        classType: c.classType,
        createdAt: c.createdAt,
        admin: c.admins[0] || null,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not load pending classes' });
  }
}

async function approveClass(req, res) {
  try {
    const tuitionClass = await prisma.tuitionClass.findUnique({ where: { id: req.params.id } });
    if (!tuitionClass) {
      return res.status(404).json({ error: 'Class not found' });
    }
    if (tuitionClass.isApproved) {
      return res.status(409).json({ error: 'This class is already approved' });
    }

    await prisma.tuitionClass.update({ where: { id: tuitionClass.id }, data: { isApproved: true } });
    res.json({ message: 'Class approved' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not approve class' });
  }
}

// Rejecting removes the pending teacher account and class. Pending classes
// can't have students or content yet (their join code and login are gated),
// so nothing else needs cascading.
async function rejectClass(req, res) {
  try {
    const tuitionClass = await prisma.tuitionClass.findUnique({ where: { id: req.params.id } });
    if (!tuitionClass) {
      return res.status(404).json({ error: 'Class not found' });
    }
    if (tuitionClass.isApproved) {
      return res.status(409).json({ error: 'Approved classes cannot be rejected' });
    }

    await prisma.$transaction([
      prisma.admin.deleteMany({ where: { tuitionClassId: tuitionClass.id } }),
      prisma.tuitionClass.delete({ where: { id: tuitionClass.id } }),
    ]);
    res.json({ message: 'Registration rejected' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not reject registration' });
  }
}

module.exports = { listPendingClasses, approveClass, rejectClass };
