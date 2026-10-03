const prisma = require('../utils/prisma');

// One row per student in the class for a given date — any student with
// no attendance record yet for that date comes back with status: null,
// so the form can start blank/unmarked instead of defaulting to Present.
async function getAttendanceForDate(req, res) {
  try {
    const tuitionClassId = req.admin.tuitionClassId;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'date is required' });
    }

    const [students, records] = await Promise.all([
      prisma.student.findMany({
        where: { tuitionClassId },
        orderBy: { fullName: 'asc' },
        select: { id: true, studentNumber: true, fullName: true },
      }),
      prisma.attendance.findMany({
        where: { tuitionClassId, date: new Date(date) },
        select: { studentId: true, status: true },
      }),
    ]);

    const statusByStudent = Object.fromEntries(records.map((r) => [r.studentId, r.status]));

    res.json({
      students: students.map((s) => ({
        studentId: s.id,
        studentNumber: s.studentNumber,
        fullName: s.fullName,
        status: statusByStudent[s.id] || null,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while fetching attendance' });
  }
}

// One save for the whole class instead of one request per student —
// marking a real class of 20-30 students one at a time isn't practical.
async function markBulkAttendance(req, res) {
  try {
    const tuitionClassId = req.admin.tuitionClassId;
    const { date, records } = req.body;

    if (!date || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: 'date and a non-empty records array are required' });
    }

    const invalid = records.find((r) => !r.studentId || !['PRESENT', 'ABSENT'].includes(r.status));
    if (invalid) {
      return res.status(400).json({ error: 'Each record needs a studentId and status of PRESENT or ABSENT' });
    }

    const studentIds = records.map((r) => r.studentId);
    const validCount = await prisma.student.count({ where: { id: { in: studentIds }, tuitionClassId } });
    if (validCount !== studentIds.length) {
      return res.status(404).json({ error: 'One or more students were not found in your tuition class' });
    }

    const parsedDate = new Date(date);
    await prisma.$transaction(
      records.map((r) =>
        prisma.attendance.upsert({
          where: { studentId_date: { studentId: r.studentId, date: parsedDate } },
          update: { status: r.status },
          create: { tuitionClassId, studentId: r.studentId, date: parsedDate, status: r.status },
        })
      )
    );

    res.status(201).json({ message: `Attendance saved for ${records.length} student(s)` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while saving attendance' });
  }
}

async function getStudentAttendance(req, res) {
  try {
    const tuitionClassId = req.admin.tuitionClassId;
    const { studentId } = req.params;

    const student = await prisma.student.findFirst({ where: { id: studentId, tuitionClassId } });
    if (!student) {
      return res.status(404).json({ error: 'Student not found in your tuition class' });
    }

    const records = await prisma.attendance.findMany({
      where: { studentId, tuitionClassId },
      orderBy: { date: 'desc' },
      select: { id: true, date: true, status: true },
    });

    const presentCount = records.filter((r) => r.status === 'PRESENT').length;
    const totalCount = records.length;
    const percentage = totalCount === 0 ? 0 : Math.round((presentCount / totalCount) * 100);

    res.json({
      student: { id: student.id, fullName: student.fullName },
      summary: { totalDays: totalCount, presentDays: presentCount, percentage },
      records,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while fetching attendance' });
  }
}

async function getMyAttendance(req, res) {
  try {
    const studentId = req.student.studentId;

    const records = await prisma.attendance.findMany({
      where: { studentId },
      orderBy: { date: 'desc' },
      select: { id: true, date: true, status: true },
    });

    const presentCount = records.filter((r) => r.status === 'PRESENT').length;
    const totalCount = records.length;
    const percentage = totalCount === 0 ? 0 : Math.round((presentCount / totalCount) * 100);

    res.json({
      summary: { totalDays: totalCount, presentDays: presentCount, percentage },
      records,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while fetching your attendance' });
  }
}

module.exports = {
  getAttendanceForDate,
  markBulkAttendance,
  getStudentAttendance,
  getMyAttendance,
};
