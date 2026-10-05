const { verifyAccessToken } = require('../utils/token');

// Every access token carries the same three claims:
//   sub      — the principal's id (Admin.id or Student.id)
//   role     — ADMIN | SUPER_ADMIN | STUDENT
//   tenantId — the tuition class the principal belongs to (null for SUPER_ADMIN without a class)
// Routes decide access by role, not by which fields happen to be present.
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    if (!decoded.sub || !decoded.role) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.user = { id: decoded.sub, role: decoded.role, tenantId: decoded.tenantId ?? null };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'You do not have access to this resource' });
    }
    next();
  };
}

// Tenant admin routes: a teacher (or the super admin acting on their own class)
// with a class attached. Everything in those controllers scopes by req.user.tenantId.
function requireAuth(req, res, next) {
  authenticate(req, res, (err) => {
    if (err) return next(err);
    requireRole('ADMIN', 'SUPER_ADMIN')(req, res, () => {
      if (!req.user.tenantId) {
        return res.status(403).json({ error: 'No tuition class is linked to this account' });
      }
      next();
    });
  });
}

function requireSuperAdmin(req, res, next) {
  authenticate(req, res, (err) => {
    if (err) return next(err);
    requireRole('SUPER_ADMIN')(req, res, next);
  });
}

module.exports = { authenticate, requireRole, requireAuth, requireSuperAdmin };
