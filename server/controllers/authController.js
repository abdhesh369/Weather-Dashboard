import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ user: { id } }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

const setAuthCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600000, // 1 hour
  });
};

const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 3600000, // 7 days
  });
};

export const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    user = new User({ email, password: hashedPassword });
    await user.save();
    
    // Auto-login after registration
    const token = generateToken(user.id);
    const refreshToken = jwt.sign({ user: { id: user.id } }, process.env.REFRESH_TOKEN_SECRET || 'secret', { expiresIn: '7d' });
    user.refreshToken = refreshToken;
    await user.save();

    setAuthCookie(res, token);
    setRefreshCookie(res, refreshToken);
    
    res.status(201).json({ 
      message: 'User registered successfully!',
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const token = generateToken(user.id);
    const refreshToken = jwt.sign({ user: { id: user.id } }, process.env.REFRESH_TOKEN_SECRET || 'secret', { expiresIn: '7d' });
    user.refreshToken = refreshToken;
    await user.save();

    setAuthCookie(res, token);
    setRefreshCookie(res, refreshToken);

    res.status(200).json({ 
      token, // Still returning token for legacy client if needed, but primary is cookie
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token' });

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || 'secret');
    const user = await User.findById(decoded.user.id);

    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = generateToken(user.id);
    setAuthCookie(res, newAccessToken);
    res.json({ user: { id: user.id, email: user.email } });
  } catch {
    res.status(401).json({ message: 'Refresh token expired' });
  }
};
