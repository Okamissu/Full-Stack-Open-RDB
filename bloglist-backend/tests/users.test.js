import bcrypt from 'bcrypt';

import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from 'vitest';

import request from 'supertest';

import app from '../index.js';
import { User, syncModels } from '../models/index.js';
import { sequelize, connectToDatabase } from '../util/db.js';

describe('User API', () => {
  let userId;

  beforeAll(async () => {
    await connectToDatabase();
    await syncModels();
  });

  beforeEach(async () => {
    await User.destroy({ where: {} });

    const user = await User.create({
      username: 'alibaba@poczta.onet.pl',
      name: 'Alice',
      passwordHash: await bcrypt.hash('testpassword', 10),
    });

    userId = user.id;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('GET /api/users returns all users', async () => {
    const response = await request(app).get('/api/users').expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].username).toBe('alibaba@poczta.onet.pl');
    expect(response.body[0].name).toBe('Alice');

    expect(response.body[0].createdAt).toBeDefined();
    expect(response.body[0].updatedAt).toBeDefined();

    expect(new Date(response.body[0].createdAt).toString()).not.toBe(
      'Invalid Date',
    );
    expect(new Date(response.body[0].updatedAt).toString()).not.toBe(
      'Invalid Date',
    );
  });

  test('GET /api/users/:id returns specified user', async () => {
    const response = await request(app).get(`/api/users/${userId}`).expect(200);

    expect(response.body.username).toBe('alibaba@poczta.onet.pl');
    expect(response.body.name).toBe('Alice');
  });

  test('PUT /api/users/:username updates updated_at when username changes', async () => {
    const userBefore = await User.findByPk(userId);

    await new Promise((resolve) => setTimeout(resolve, 20));

    const response = await request(app)
      .put(`/api/users/${userBefore.username}`)
      .send({ name: 'UpdatedName' })
      .expect(200);

    const userAfter = await User.findByPk(userId);

    expect(userAfter.name).toBe('UpdatedName');
    expect(userAfter.updatedAt.getTime()).toBeGreaterThan(
      userBefore.updatedAt.getTime(),
    );
  });

  test('POST /api/users creates a new user', async () => {
    const newUser = {
      username: 'xraxus@poczta.onet.pl',
      name: 'Camillo',
      password: 'Test12',
    };

    const response = await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(201);

    expect(response.body.user?.passwordHash).toBeUndefined();
    expect(response.body.user?.password).toBeUndefined();

    expect(response.body.username).toBe('xraxus@poczta.onet.pl');
    expect(response.body.name).toBe('Camillo');
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.updatedAt).toBeDefined();
  });
});
