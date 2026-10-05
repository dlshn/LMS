// Usage (run from LMS_Backend):
//   node scripts/create-super-admin.js <email>
//
// Creates a platform super admin, or updates an existing account to be one.
// The password is typed at a hidden prompt, never passed as an argument, so it
// stays out of shell history. The account gets no tuition class.
// If the email already belongs to a teacher, that teacher's class is kept.

require('dotenv').config();
const readline = require('readline');
const prisma = require('../src/utils/prisma');
const { hashPassword } = require('../src/utils/hash');

const MIN_PASSWORD_LENGTH = 8;
const isTTY = Boolean(process.stdin.isTTY);

// One readline interface for the whole run. Lines are read in order from an
// async iterator, so piped input works too (a second question is never lost).
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: isTTY });
const lines = rl[Symbol.asyncIterator]();

// While a password is being typed, readline's echo is muted. This relies on
// readline's internal _writeToOutput hook, fine for a one-off ops script.
let muted = false;
rl._writeToOutput = (text) => {
  if (!muted) rl.output.write(text);
};

async function ask(question, hidden = false) {
  process.stdout.write(question);
  muted = hidden && isTTY;
  const { value } = await lines.next();
  muted = false;
  process.stdout.write('\n');
  return value ?? '';
}

async function main() {
  const email = (process.argv[2] || '').trim();
  if (!email) {
    console.error('Missing email.');
    console.error('Usage: node scripts/create-super-admin.js <email>');
    process.exitCode = 1;
    return;
  }

  const password = await ask('Password: ', true);
  if (password.length < MIN_PASSWORD_LENGTH) {
    console.error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
    process.exitCode = 1;
    return;
  }
  const confirm = await ask('Confirm password: ', true);
  if (password !== confirm) {
    console.error('Passwords do not match.');
    process.exitCode = 1;
    return;
  }

  const passwordHash = await hashPassword(password);
  const existing = await prisma.admin.findUnique({ where: { email } });

  if (existing) {
    await prisma.admin.update({
      where: { id: existing.id },
      data: { role: 'SUPER_ADMIN', passwordHash },
    });
    console.log(`Updated ${email}: now SUPER_ADMIN with the new password.`);
  } else {
    await prisma.admin.create({
      data: { name: 'Platform admin', email, passwordHash, role: 'SUPER_ADMIN' },
    });
    console.log(`Created SUPER_ADMIN account: ${email}`);
  }
}

main()
  .catch((error) => {
    console.error('Could not create the super admin:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    rl.close();
    await prisma.$disconnect();
  });
