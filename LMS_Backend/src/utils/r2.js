const { S3Client } = require('@aws-sdk/client-s3');

// R2 is S3-compatible, so the regular S3 SDK works against it — just point
// the endpoint at the account's R2 URL instead of AWS. Region is a required
// field for the SDK but R2 ignores its value.
const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

module.exports = r2;
