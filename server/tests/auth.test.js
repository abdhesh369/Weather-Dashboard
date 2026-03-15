import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/auth.js';

// Mock mongoose User model
import User from '../models/User.js';
jest.mock('../models/User.js');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('POST /api/auth/register', () => {
  it('returns 400 if password is too short', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@test.com', password: '123' });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/6 characters/);
  });

  it('returns 400 if email is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ password: 'valid123' });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  it('returns 400 with invalid credentials message', async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@test.com', password: 'wrong' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid Credentials');
  });
});

