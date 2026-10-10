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
import { Blog, syncModels, User } from '../models/index.js';
import { sequelize, connectToDatabase } from '../util/db.js';
import bcrypt from 'bcrypt';

describe('Blog API', () => {
  let blogId;
  let userId;
  let token;

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
    expect(userId).toBeDefined();

    const response = await request(app)
      .post('/api/login')
      .send({
        username: 'alibaba@poczta.onet.pl',
        password: 'testpassword',
      })
      .expect(200);

    token = response.body.token;
    expect(token).toBeDefined();
  });

  beforeEach(async () => {
    await Blog.destroy({ where: {} });

    const blog = await Blog.create({
      title: 'Test blog',
      author: 'Alice',
      url: 'https://example.com',
      likes: 5,
      userId: userId,
    });

    blogId = blog.id;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('GET /api/blogs returns all blogs', async () => {
    const response = await request(app).get('/api/blogs').expect(200);
    console.log(response.body);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe('Test blog');
    expect(response.body[0].likes).toBe(5);
  });

  test('GET /api/blogs/:id returns specified blog', async () => {
    const response = await request(app).get(`/api/blogs/${blogId}`).expect(200);

    expect(response.body.title).toBe('Test blog');
    expect(response.body.author).toBe('Alice');
    expect(response.body.likes).toBe(5);
  });

  test('GET /api/blogs/:id of non-existent id returns an error', async () => {
    await request(app).get('/api/blogs/999999').expect(404);
  });

  test('POST /api/blogs creates a blog', async () => {
    const response = await request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test blog 2',
        author: 'Ali',
        url: 'https://exampul.com',
        userId: userId,
      })
      .expect(201);

    expect(response.body.title).toBe('Test blog 2');
    expect(response.body.author).toBe('Ali');
    expect(response.body.url).toBe('https://exampul.com');
    expect(response.body.likes).toBe(0);
    expect(response.body.id).toBeDefined();

    const blogs = await Blog.findAll();
    expect(blogs).toHaveLength(2);
  });

  test('POST /api/blogs with missing title returns an error', async () => {
    const response = await request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        author: 'Ali',
        url: 'https://exampul.com',
      })
      .expect(400);

    const blogs = await Blog.findAll();
    expect(blogs).toHaveLength(1);
  });

  test('PUT /api/blogs/:id updates specified blog', async () => {
    const response = await request(app)
      .put(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ likes: 67 })
      .expect(200);

    expect(response.body.likes).toBe(67);
  });

  test('DELETE /api/blogs/:id deleted specified blog', async () => {
    const response = await request(app)
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const blogs = await Blog.findAll();
    expect(blogs).toHaveLength(0);
  });
});
