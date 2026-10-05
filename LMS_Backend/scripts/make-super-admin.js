// Usage: node scripts/make-super-admin.js <email>
// Promotes an existing admin account to SUPER_ADMIN. Run once per platform operator.
require('dotenv').config();
const prisma = require('../src/utils/prisma');

const email = process.argv[2];
if (!email) {
  console.error('Usage: node scripts/make-super-admin.js <email>');
  process.exit(1);
}

prisma.admin
  .update({ where: { email }, data: { role: 'SUPER_ADMIN' } })
  .then((admin) => {
    console.log(`${admin.email} is now SUPER_ADMIN`);
  })
  .catch((error) => {
    console.error(error.code === 'P2025' ? `No admin found with email ${email}` : error.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
