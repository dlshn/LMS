const prisma = require('../utils/prisma');

/**
 * ලකුණු අනුව Rank එක සහ පන්තියේ සාමාන්‍යයන් (Stats) ගණනය කරන Function එක
 */
function calculateRankings(allMarks) {
  if (!allMarks || allMarks.length === 0) {
    return { ranked: [], stats: { totalStudents: 0, averageMarks: 0, highestMarks: 0, lowestMarks: 0 } };
  }

  // 1. ලකුණු වැඩිම කෙනාගේ සිට අඩුම කෙනා දක්වා Sort කිරීම
  const sorted = [...allMarks].sort((a, b) => b.marksObtained - a.marksObtained);

  // 2. Rank එක එකතු කිරීම
  let currentRank = 1;
  const ranked = sorted.map((mark, index) => {
    if (index > 0 && mark.marksObtained < sorted[index - 1].marksObtained) {
      currentRank = index + 1;
    }
    return {
      ...mark,
      rank: currentRank
    };
  });

  // 3. පන්තියේ පොදු සංඛ්‍යාලේඛන (Class Stats) ගණනය කිරීම
  const totalStudents = allMarks.length;
  const totalMarks = allMarks.reduce((sum, m) => sum + m.marksObtained, 0);
  const average = totalMarks / totalStudents;
  
  // 🎯 නිවැරදි කිරීම: Array එකක පළමු සහ අවසාන Element එකෙන් අගයන් ලබා ගැනීම
  const highest = sorted[0].marksObtained;
  const lowest = sorted[sorted.length - 1].marksObtained;

  return {
    ranked,
    stats: {
      totalStudents,
      averageMarks: parseFloat(average.toFixed(2)),
      highestMarks: highest,
      lowestMarks: lowest
    }
  };
}

/**
 * Student Number එක මඟින් නවතම ප්‍රකාශිත ප්‍රතිඵල ලබාගන්නා Controller එක
 */
async function getPublicResultByNumber(req, res) {
  try {
    const { studentNumber } = req.params;

    // 1. ශිෂ්‍යයා ලබා ගැනීම
    const student = await prisma.student.findUnique({
      where: { studentNumber },
      select: { id: true, fullName: true, studentNumber: true },
    });

    if (!student) {
      return res.status(404).json({ error: 'No student found with that student number' });
    }

    // 2. නවතම ප්‍රකාශිත ලකුණ සොයා ගැනීම (පැරණි ස්ථාවර ක්‍රමය)
    const latestMark = await prisma.mark.findFirst({
      where: { studentId: student.id, exam: { status: 'PUBLISHED' } },
      orderBy: { exam: { examDate: 'desc' } },
      include: { exam: true },
    });

    if (!latestMark) {
      return res.status(404).json({ error: 'No published result found for this student yet' });
    }

    // 3. අදාළ Exam එකට අදාළ අනෙක් සියලුම ළමුන්ගේ ලකුණු ලබා ගැනීම
    const allMarks = await prisma.mark.findMany({
      where: { examId: latestMark.examId },
      select: { studentId: true, marksObtained: true },
    });

    // 4. Rank සහ Stats ගණනය කිරීම
    const { ranked, stats } = calculateRankings(allMarks);
    
    // 5. Safety Check - App එක Crash වීම වැළැක්වීම
    const myEntry = ranked.find((m) => m.studentId === student.id);
    if (!myEntry) {
      return res.status(404).json({ error: 'Student ranking details could not be calculated' });
    }

    // 6. සාර්ථක ප්‍රතිචාරය (Success Response)
    res.json({
      student: { fullName: student.fullName, studentNumber: student.studentNumber },
      exam: {
        title: latestMark.exam.title,
        subject: latestMark.exam.subject,
        examDate: latestMark.exam.examDate,
        maxMarks: latestMark.exam.maxMarks,
      },
      myResult: { marksObtained: myEntry.marksObtained, rank: myEntry.rank },
      classStats: stats,
    });

  } catch (error) {
    console.error(error); // Backend console එකේ error stack එක බලාගත හැක
    res.status(500).json({ error: 'Something went wrong while fetching the result' });
  }
}

module.exports = { getPublicResultByNumber };
