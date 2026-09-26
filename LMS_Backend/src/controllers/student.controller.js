const prisma = require('../utils/prisma');

// Admin creates the roster entry only — studentNumber + fullName. The
// student later claims this entry themselves via the class join code
// (see auth.controller#registerStudentSelf), setting their own
// username/password and contact details at that point.
async function registerStudent(req, res) {
  try {
    const { studentNumber, fullName } = req.body;

    if (!studentNumber || !fullName) {
      return res.status(400).json({ error: 'studentNumber and fullName are required' });
    }

    const tuitionClassId = req.admin.tuitionClassId;

    const existingNumber = await prisma.student.findUnique({ where: { studentNumber } });
    if (existingNumber) {
      return res.status(409).json({ error: 'Student number already in use' });
    }

    const student = await prisma.student.create({
      data: {
        tuitionClassId,
        studentNumber,
        fullName,
      },
    });

    res.status(201).json({
      message: 'Student added. Share your class join code with them so they can complete registration.',
      student: {
        id: student.id,
        studentNumber: student.studentNumber,
        fullName: student.fullName,
        isActivated: student.isActivated,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while registering the student' });
  }
}

async function getAllStudents(req, res) {
  try {
    const tuitionClassId = req.admin.tuitionClassId;

    const students = await prisma.student.findMany({
      where: { tuitionClassId },
      select: {
        id: true,
        studentNumber: true,
        fullName: true,
        username: true,
        school: true,
        phone: true,
        parentPhone: true,
        isActivated: true,
        createdAt: true,
      },
      orderBy: { fullName: 'asc' },
    });

    res.json({ count: students.length, students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while fetching students' });
  }
}

async function getStudentById(req, res) {
  try {
    const tuitionClassId = req.admin.tuitionClassId;
    const { id } = req.params;

    const student = await prisma.student.findFirst({
      where: { id, tuitionClassId },
      select: {
        id: true,
        studentNumber: true,
        fullName: true,
        username: true,
        school: true,
        phone: true,
        parentPhone: true,
        isActivated: true,
        createdAt: true,
      },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while fetching the student' });
  }
}

async function updateStudent(req, res) {
  try {
    const tuitionClassId = req.admin.tuitionClassId;
    const { id } = req.params;
    const { fullName, school, phone, parentPhone } = req.body;

    const student = await prisma.student.findFirst({ where: { id, tuitionClassId } });
    if (!student) {
      return res.status(404).json({ error: 'Student not found in your tuition class' });
    }

    const updated = await prisma.student.update({
      where: { id },
      data: { fullName, school, phone, parentPhone },
    });

    res.json({
      message: 'Student updated',
      student: {
        id: updated.id,
        studentNumber: updated.studentNumber,
        fullName: updated.fullName,
        school: updated.school,
        phone: updated.phone,
        parentPhone: updated.parentPhone,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while updating the student' });
  }
}

async function deleteStudent(req, res) {
  try {
    const tuitionClassId = req.admin.tuitionClassId;
    const { id } = req.params;

    const student = await prisma.student.findFirst({ where: { id, tuitionClassId } });
    if (!student) {
      return res.status(404).json({ error: 'Student not found in your tuition class' });
    }

    await prisma.$transaction([
      prisma.mark.deleteMany({ where: { studentId: id } }),
      prisma.attendance.deleteMany({ where: { studentId: id } }),
      prisma.student.delete({ where: { id } }),
    ]);

    res.json({ message: 'Student and their records deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while deleting the student' });
  }
}

// A student's own profile — their dashboard needs their school and their
// tuition class's name, neither of which the login/results endpoints return.
async function getMyProfile(req, res) {
  try {
    const studentId = req.student.studentId;

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        fullName: true,
        studentNumber: true,
        school: true,
        tuitionClass: { select: { name: true } },
      },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({
      fullName: student.fullName,
      studentNumber: student.studentNumber,
      school: student.school,
      tuitionClassName: student.tuitionClass.name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while fetching your profile' });
  }
}

module.exports = { registerStudent, getAllStudents, getStudentById, updateStudent, deleteStudent, getMyProfile };
