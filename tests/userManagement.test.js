const request = require('supertest');
const app = require('../app'); // Replace with your app instance
const User = require('../models/User');
const mongoose = require('mongoose');

describe('User Management', () => {
  let token;
  let adminToken;
  let userId;
  
  beforeAll(async () => {
    // Create test admin user and token
    const adminUser = new User({ email: 'admin@test.com', password: 'password', role: 'admin' });
    await adminUser.save();
    const loginRes = await request(app).post('/auth/login').send({ email: 'admin@test.com', password: 'password' });
    adminToken = loginRes.body.token;
  });

  afterAll(async () => {
    await User.deleteMany();
    await mongoose.disconnect();
  });

  test('Create a new user', async () => {
    const res = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ email: 'test@example.com', password: 'password', fullName: 'Test User', role: 'user' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    userId = res.body._id;
  });

  test('Get all users', async () => {
    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .query({ role: 'user' });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('Update user role', async () => {
    const res = await request(app)
      .put(`/users/${userId}/role`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'admin' });
    expect(res.statusCode).toBe(200);
    expect(res.body.role).toBe('admin');
  });

  test('Activate user', async () => {
    const res = await request(app)
      .put(`/users/${userId}/activate`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('verified');
  });

  test('Delete user', async () => {
    const res = await request(app)
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User deleted successfully');
  });

  test('Non-admin cannot access admin routes', async () => {
    const res = await request(app).get('/users/admin');
    expect(res.statusCode).toBe(403);
  });
});
