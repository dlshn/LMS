const prisma = require('../utils/prisma');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const { generateJoinCode } = require('../utils/joinCode');
const jwt = require('jsonwebtoken');

const MIN_PASSWORD_LENGTH = 6;

// Join codes are short and random, so a collision is very unlikely but not
// impossible — retry a few times against the unique constraint before
// giving up.
async function createTuitionClassWithJoinCode(name, subject, classType) {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await prisma.tuitionClass.create({
        data: { name, subject, classType, joinCode: generateJoinCode() },
      });
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('joinCode')) {
        continue;
      }
      throw error;
    }
  }
  throw new Error('Could not generate a unique join code');
}

async function registerAdmin(req, res) {
  try {
    const { tuitionClassName, adminName, phone, subject, classType, email, password } = req.body;

    if (!tuitionClassName || !adminName || !phone || !subject || !classType || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!['PHYSICAL', 'ONLINE'].includes(classType)) {
      return res.status(400).json({ error: 'classType must be PHYSICAL or ONLINE' });
    }

    const existingAdmin = await prisma.admin.findUnique({ where: { email } });
    if (existingAdmin) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const tuitionClass = await createTuitionClassWithJoinCode(tuitionClassName, subject, classType);

    const passwordHash = await hashPassword(password);

    const admin = await prisma.admin.create({
      data: {
        name: adminName,
        phone,
        email,
        passwordHash,
        tuitionClassId: tuitionClass.id,
      },
    });

    const payload = { adminId: admin.id, tuitionClassId: tuitionClass.id, role: admin.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.status(201).json({
      message: 'Tuition class registered successfully',
      admin: { id: admin.id, name: admin.name, email: admin.email, phone: admin.phone },
      tuitionClass: {
        id: tuitionClass.id,
        name: tuitionClass.name,
        subject: tuitionClass.subject,
        classType: tuitionClass.classType,
        joinCode: tuitionClass.joinCode,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong during registration' });
  }
}

async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const admin = await prisma.admin.findUnique({ where: { email }, include: { tuitionClass: true } });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await comparePassword(password, admin.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const payload = { adminId: admin.id, tuitionClassId: admin.tuitionClassId, role: admin.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.json({
      message: 'Login successful',
      admin: { id: admin.id, name: admin.name, email: admin.email },
      tuitionClass: admin.tuitionClass
        ? { id: admin.tuitionClass.id, name: admin.tuitionClass.name, joinCode: admin.tuitionClass.joinCode }
        : null,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong during login' });
  }
}

// A student's roster entry is created by their admin (studentNumber +
// fullName only). The student then claims that entry themselves using the
// class join code, choosing their own username/password. This keeps the
// admin in control of who is really enrolled while letting each student
// own their login credentials.
async function registerStudentSelf(req, res) {
  try {
    const { studentNumber, joinCode, username, password, phone, school, parentPhone } = req.body;

    if (!studentNumber || !joinCode || !username || !password) {
      return res.status(400).json({ error: 'studentNumber, joinCode, username and password are required' });
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
    }

    const tuitionClass = await prisma.tuitionClass.findUnique({ where: { joinCode: joinCode.trim().toUpperCase() } });
    if (!tuitionClass) {
      return res.status(404).json({ error: 'Invalid class join code' });
    }

    const student = await prisma.student.findUnique({ where: { studentNumber } });
    if (!student || student.tuitionClassId !== tuitionClass.id) {
      return res.status(404).json({ error: 'That student number was not found for this class. Ask your admin to add you first.' });
    }

    if (student.isActivated) {
      return res.status(409).json({ error: 'This student number has already been registered. Please log in instead.' });
    }

    const existingUsername = await prisma.student.findUnique({ where: { username } });
    if (existingUsername) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    const passwordHash = await hashPassword(password);

    const updated = await prisma.student.update({
      where: { id: student.id },
      data: {
        username,
        passwordHash,
        phone: phone || student.phone,
        school: school || student.school,
        parentPhone: parentPhone || student.parentPhone,
        isActivated: true,
      },
    });

    const payload = { studentId: updated.id, tuitionClassId: updated.tuitionClassId, type: 'student' };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.status(201).json({
      message: 'Registration complete',
      student: { id: updated.id, fullName: updated.fullName, studentNumber: updated.studentNumber },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while completing registration' });
  }
}

async function loginStudent(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const student = await prisma.student.findUnique({ where: { username } });
    if (!student || !student.passwordHash) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isPasswordValid = await comparePassword(password, student.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const payload = { studentId: student.id, tuitionClassId: student.tuitionClassId, type: 'student' };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.json({
      message: 'Login successful',
      student: { id: student.id, fullName: student.fullName, studentNumber: student.studentNumber },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong during login' });
  }
}

async function refreshToken(req, res) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'refreshToken is required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const payload = decoded.type === 'student'
      ? { studentId: decoded.studentId, tuitionClassId: decoded.tuitionClassId, type: 'student' }
      : { adminId: decoded.adminId, tuitionClassId: decoded.tuitionClassId, role: decoded.role };

    const newAccessToken = generateAccessToken(payload);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while refreshing the token' });
  }
}

module.exports = { registerAdmin, loginAdmin, loginStudent, registerStudentSelf, refreshToken };
