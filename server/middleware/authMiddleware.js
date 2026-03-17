import jwt    from 'jsonwebtoken';
import User   from '../models/User.js';

export const protect = async (req, res, next) => {
  // Support both cookie and Authorization header
  const token =
    req.cookies?.token ??
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null);

  if (!token) {
    return res.status(401).json({ message: 'Authentication required. Please sign in.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // password and refreshToken are select:false → safe
    const user = await User.findById(decoded.user.id);

    if (!user) {
      return res.status(401).json({ message: 'Account not found. Please sign in again.' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please sign in again.', expired: true });
    }
    return res.status(401).json({ message: 'Invalid token. Please sign in again.' });
  }
};
