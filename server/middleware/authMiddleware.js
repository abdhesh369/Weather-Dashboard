import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  if (!req.headers.authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

