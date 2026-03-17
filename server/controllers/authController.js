import User    from '../models/User.js';
import bcrypt  from 'bcryptjs';
import jwt     from 'jsonwebtoken';

const ACCESS_EXPIRY  = '1h';
const REFRESH_EXPIRY = '7d';
const SALT_ROUNDS    = 12;

const generateAccessToken = (id) =>
  jwt.sign({ user: { id } }, process.env.JWT_SECRET, { expiresIn: ACCESS_EXPIRY });

const generateRefreshToken = (id) =>
  jwt.sign({ user: { id } }, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET, { expiresIn: REFRESH_EXPIRY });

const setAuthCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   3_600_000,
  });
};

const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   7 * 24 * 3_600_000,
    path:     '/api/auth/refresh', // scoped — only sent on refresh endpoint
  });
};

export const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await new User({ email, password: hash }).save();

    const accessToken  = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    user.refreshToken = refreshToken;
    user.lastLogin    = new Date();
    await user.save();

    setAuthCookie(res, accessToken);
    setRefreshCookie(res, refreshToken);

    res.status(201).json({ message: 'Account created!', user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error('[Auth] Register error:', err.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      // Uniform message to prevent email enumeration
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const accessToken  = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    user.refreshToken  = refreshToken;
    user.lastLogin     = new Date();
    await user.save();

    setAuthCookie(res, accessToken);
    setRefreshCookie(res, refreshToken);

    res.status(200).json({ user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error('[Auth] Login error:', err.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const logout = async (req, res) => {
  // Invalidate stored refresh token
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET);
      await User.findByIdAndUpdate(decoded.user.id, { $unset: { refreshToken: 1 } });
    }
  } catch { /* token already invalid — that's fine */ }

  res.cookie('token',        '', { httpOnly: true, expires: new Date(0) });
  res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0), path: '/api/auth/refresh' });
  res.status(200).json({ message: 'Logged out successfully' });
};

export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token provided' });

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET);
    const user    = await User.findById(decoded.user.id);

    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ message: 'Refresh token revoked or invalid' });
    }

    const newAccess  = generateAccessToken(user.id);
    const newRefresh = generateRefreshToken(user.id);
    user.refreshToken = newRefresh;
    await user.save();

    setAuthCookie(res, newAccess);
    setRefreshCookie(res, newRefresh);

    res.json({ user: { id: user.id, email: user.email } });
  } catch {
    res.status(401).json({ message: 'Refresh token expired. Please log in again.' });
  }
};
