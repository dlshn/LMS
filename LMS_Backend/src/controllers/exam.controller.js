const prisma = require('../utils/prisma');

async function createExam(req, res) {
  try {
    const tuitionClassId = req.admin.tuitionClassId;
    const { title, examDate, description, maxMarks } = req.body;

    if (!title || !examDate || !maxMarks) {
      return res.status(400).json({ error: 'title, examDate and maxMarks are required' });
    }

    // Subject is set once at class registration and shared by every exam
    // in the class — no reason to ask for it again per exam.
    const tuitionClass = await prisma.tuitionClass.findUnique({
      where: { id: tuitionClassId },
      select: { subject: true },
    });

    const exam = await prisma.exam.create({
      data: {
        tuitionClassId,
        title,
        subject: tuitionClass?.subject || '',
        examDate: new Date(examDate),
        description,
        maxMarks: Number(maxMarks),
      },
    });

    res.status(201).json({ message: 'Exam created', exam });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while creating the exam' });
  }
}

async function getAllExams(req, res) {
  try {
    const tuitionClassId = req.admin.tuitionClassId;

    const exams = await prisma.exam.findMany({
      where: { tuitionClassId },
      orderBy: { examDate: 'desc' },
    });

    res.json({ count: exams.length, exams });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while fetching exams' });
  }
}

async function updateExam(req, res) {
  try {
    const tuitionClassId = req.admin.tuitionClassId;
    const { id } = req.params;
    const { title, examDate, description, maxMarks } = req.body;

    const exam = await prisma.exam.findFirst({ where: { id, tuitionClassId } });
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found in your tuition class' });
    }

    if (exam.status === 'PUBLISHED') {
      return res.status(400).json({ error: 'Cannot edit a published exam. Unpublish it first if changes are needed.' });
    }

    const updated = await prisma.exam.update({
      where: { id },
      data: {
        title,
        examDate: examDate ? new Date(examDate) : undefined,
        description,
        maxMarks: maxMarks ? Number(maxMarks) : undefined,
      },
    });

    res.json({ message: 'Exam updated', exam: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while updating the exam' });
  }
}

async function publishExam(req, res) {
  try {
    const tuitionClassId = req.admin.tuitionClassId;
    const { id } = req.params;

    const exam = await prisma.exam.findFirst({ where: { id, tuitionClassId } });
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found in your tuition class' });
    }

    const updated = await prisma.exam.update({
      where: { id },
      data: { status: 'PUBLISHED' },
    });

    res.json({ message: 'Exam published', exam: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while publishing the exam' });
  }
}

async function deleteExam(req, res) {
  try {
    const tuitionClassId = req.admin.tuitionClassId;
    const { id } = req.params;

    const exam = await prisma.exam.findFirst({ where: { id, tuitionClassId } });
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found in your tuition class' });
    }

    // Deleting a published exam wipes any marks already entered/released
    // for it — the confirm dialog on the frontend is what actually warns
    // the admin about that, this just does the cascade.
    await prisma.mark.deleteMany({ where: { examId: id } });
    await prisma.exam.delete({ where: { id } });

    res.json({ message: 'Exam deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while deleting the exam' });
  }
}

module.exports = { createExam, getAllExams, updateExam, publishExam, deleteExam };