const { authenticate, requireRole } = require('./auth.middleware');

function requireStudentAuth(req, res, next) {
  authenticate(req, res, (err) => {
    if (err) return next(err);
    requireRole('STUDENT')(req, res, next);
  });
}

module.exports = { requireStudentAuth };
