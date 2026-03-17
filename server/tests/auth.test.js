import { jest, describe, it, expect } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/auth.js';

import User from '../models/User.js';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('POST /api/auth/register', () => {
  it('returns 422 if password is too short', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@test.com', password: '123' });
    expect(res.status).toBe(422);
    expect(res.body.errors[0].msg).toMatch(/at least 8 characters/);
  });

  it('returns 422 if email is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ password: 'valid123' });
    expect(res.status).toBe(422);
  });
});

describe('POST /api/auth/login', () => {
  it('returns 400 with invalid credentials message', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@test.com', password: 'wrong' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid email or password.');
  });
});

