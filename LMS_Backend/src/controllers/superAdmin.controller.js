const prisma = require('../utils/prisma');
const r2 = require('../utils/r2');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');

// Each tab on the super admin page maps to one of these filters.
const STATUS_FILTERS = {
  pending: { isApproved: false },
  active: { isApproved: true, isSuspended: false },
  suspended: { isApproved: true, isSuspended: true },
};

function statusOf(tuitionClass) {
  if (!tuitionClass.isApproved) return 'pending';
  return tuitionClass.isSuspended ? 'suspended' : 'active';
}

async function findClassOr404(id, res) {
  const tuitionClass = await prisma.tuitionClass.findUnique({ where: { id } });
  if (!tuitionClass) {
    res.status(404).json({ error: 'Class not found' });
    return null;
  }
  return tuitionClass;
}

async function listClasses(req, res) {
  try {
    const status = req.query.status || 'pending';
    const where = STATUS_FILTERS[status];
    if (!where) {
      return res.status(400).json({ error: 'status must be pending, active or suspended' });
    }

    const [classes, pending, active, suspended] = await Promise.all([
      prisma.tuitionClass.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          admins: { select: { id: true, name: true, email: true, phone: true } },
          _count: { select: { students: true } },
        },
      }),
      prisma.tuitionClass.count({ where: STATUS_FILTERS.pending }),
      prisma.tuitionClass.count({ where: STATUS_FILTERS.active }),
      prisma.tuitionClass.count({ where: STATUS_FILTERS.suspended }),
    ]);

    res.json({
      counts: { pending, active, suspended },
      classes: classes.map((c) => ({
        id: c.id,
        name: c.name,
        subject: c.subject,
        classType: c.classType,
        status: statusOf(c),
        createdAt: c.createdAt,
        studentCount: c._count.students,
        admin: c.admins[0] || null,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not load classes' });
  }
}

async function approveClass(req, res) {
  try {
    const tuitionClass = await findClassOr404(req.params.id, res);
    if (!tuitionClass) return;
    if (tuitionClass.isApproved) {
      return res.status(409).json({ error: 'This class is already approved' });
    }

    await prisma.tuitionClass.update({
      where: { id: tuitionClass.id },
      data: { isApproved: true, isSuspended: false },
    });
    res.json({ message: 'Class approved' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not approve class' });
  }
}

async function suspendClass(req, res) {
  try {
    const tuitionClass = await findClassOr404(req.params.id, res);
    if (!tuitionClass) return;
    if (statusOf(tuitionClass) !== 'active') {
      return res.status(409).json({ error: 'Only active classes can be suspended' });
    }

    await prisma.tuitionClass.update({ where: { id: tuitionClass.id }, data: { isSuspended: true } });
    res.json({ message: 'Class suspended' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not suspend class' });
  }
}

async function reactivateClass(req, res) {
  try {
    const tuitionClass = await findClassOr404(req.params.id, res);
    if (!tuitionClass) return;
    if (statusOf(tuitionClass) !== 'suspended') {
      return res.status(409).json({ error: 'Only suspended classes can be reactivated' });
    }

    await prisma.tuitionClass.update({ where: { id: tuitionClass.id }, data: { isSuspended: false } });
    res.json({ message: 'Class reactivated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not reactivate class' });
  }
}

// Rejecting is only for pending requests. Pending classes have no students or
// content, so there is nothing else to clean up.
async function rejectClass(req, res) {
  try {
    const tuitionClass = await findClassOr404(req.params.id, res);
    if (!tuitionClass) return;
    if (tuitionClass.isApproved) {
      return res.status(409).json({ error: 'Approved classes cannot be rejected. Delete them instead.' });
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

// Hard delete: removes the class and everything under it. The super admin must
// type the exact class name as confirmation.
//
// R2 files are deleted by the exact keys stored in the DB (note.fileKey and
// the class poster key), never by listing a prefix. So files of other classes
// are never touched. R2 deletes run first: if one fails, nothing is removed
// from the DB, and the class can be deleted again later.
async function deleteClass(req, res) {
  try {
    const tuitionClass = await findClassOr404(req.params.id, res);
    if (!tuitionClass) return;

    const confirmName = (req.body?.confirmName || '').trim();
    if (confirmName !== tuitionClass.name) {
      return res.status(400).json({ error: 'Type the exact class name to confirm deletion' });
    }

    const notes = await prisma.note.findMany({ where: { tuitionClassId: tuitionClass.id }, select: { fileKey: true } });
    const r2Keys = notes.map((n) => n.fileKey);
    if (tuitionClass.posterImageKey) r2Keys.push(tuitionClass.posterImageKey);

    for (const Key of r2Keys) {
      await r2.send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key }));
    }

    const tenantId = tuitionClass.id;
    await prisma.$transaction([
      prisma.mark.deleteMany({ where: { exam: { tuitionClassId: tenantId } } }),
      prisma.attendance.deleteMany({ where: { tuitionClassId: tenantId } }),
      prisma.exam.deleteMany({ where: { tuitionClassId: tenantId } }),
      prisma.note.deleteMany({ where: { tuitionClassId: tenantId } }),
      prisma.notice.deleteMany({ where: { tuitionClassId: tenantId } }),
      prisma.video.deleteMany({ where: { tuitionClassId: tenantId } }),
      prisma.student.deleteMany({ where: { tuitionClassId: tenantId } }),
      prisma.admin.deleteMany({ where: { tuitionClassId: tenantId } }),
      prisma.tuitionClass.delete({ where: { id: tenantId } }),
    ]);

    res.json({ message: `${tuitionClass.name} was deleted`, deletedFiles: r2Keys.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not delete class. Nothing was removed from the database.' });
  }
}

module.exports = { listClasses, approveClass, suspendClass, reactivateClass, rejectClass, deleteClass };
