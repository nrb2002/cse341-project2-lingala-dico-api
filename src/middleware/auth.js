const jwt = require('jsonwebtoken');

const requiresAuth = (...allowedRoles) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized access!' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      req.user = user;

      // Role-based check
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Forbidden: insufficient role' });
      }

      next();
    } catch (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
  };
};


module.exports = { requiresAuth };
