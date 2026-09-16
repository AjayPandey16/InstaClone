const jwt = require('jsonwebtoken');

const getJwtSecret = () => process.env.JWT_SECRET || 'development-only-secret';

const signToken = (userId) => jwt.sign({ userId }, getJwtSecret(), { expiresIn: '7d' });

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : req.body?.token;

  if (!token) {
    return res.status(401).json({ success: false, msg: 'Authentication required' });
  }

  try {
    req.userId = jwt.verify(token, getJwtSecret()).userId;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, msg: 'Invalid or expired token' });
  }
};

module.exports = { getJwtSecret, requireAuth, signToken };