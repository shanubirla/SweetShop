const { describe, it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../src/models/User');
const Sweet = require('../src/models/Sweet');
const PurchaseLog = require('../src/models/PurchaseLog');
const { connectDB, disconnectDB } = require('../src/config/database');

describe('Sweets Endpoints - TDD', () => {
  let adminToken;
  let userToken;
  let adminUser;
  let regularUser;

  beforeAll(async () => {
    // Connect to MongoDB
    await connectDB();
  });

  beforeEach(async () => {
    // Clean up database
    await PurchaseLog.deleteMany({});
    await Sweet.deleteMany({});
    await User.deleteMany({});

    // Create admin user
    adminUser = await User.create({
      email: 'admin@test.com',
      passwordHash: 'hashed_password',
      role: 'admin',
    });

    adminToken = jwt.sign(
      {
        id: adminUser._id,
        email: adminUser.email,
        role: 'admin',
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Create regular user
    regularUser = await User.create({
      data: {
        email: 'user@test.com',
        passwordHash: 'hashed_password',
        role: 'user',
      },
    });

    userToken = jwt.sign(
      {
        id: regularUser._id,
        email: regularUser.email,
        role: 'user',
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  });

  afterAll(async () => {
    await disconnectDB();
  });

  // RED: Test create sweet (admin only)
  describe('POST /api/sweets', () => {
    it('should create a sweet as admin', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Chocolate Cake',
          category: 'Cakes',
          price: 25.99,
          quantity: 10,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('sweet');
      expect(response.body.sweet.name).toBe('Chocolate Cake');
      expect(response.body.sweet.quantity).toBe(10);
    });

    it('should not allow regular user to create sweet', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Chocolate Cake',
          category: 'Cakes',
          price: 25.99,
          quantity: 10,
        });

      expect(response.status).toBe(403);
    });

    it('should not create sweet without authentication', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .send({
          name: 'Chocolate Cake',
          category: 'Cakes',
          price: 25.99,
          quantity: 10,
        });

      expect(response.status).toBe(401);
    });
  });

  // RED: Test get all sweets
  describe('GET /api/sweets', () => {
    beforeEach(async () => {
      await prisma.sweet.createMany({
        data: [
          {
            name: 'Chocolate Cake',
            category: 'Cakes',
            price: 25.99,
            quantity: 10,
          },
          {
            name: 'Vanilla Cupcake',
            category: 'Cupcakes',
            price: 5.99,
            quantity: 20,
          },
          {
            name: 'Strawberry Tart',
            category: 'Tarts',
            price: 35.99,
            quantity: 5,
          },
        ],
      });
    });

    it('should get all sweets', async () => {
      const response = await request(app).get('/api/sweets');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('sweets');
      expect(response.body.sweets).toHaveLength(3);
    });

    it('should get sweets without authentication', async () => {
      const response = await request(app).get('/api/sweets');

      expect(response.status).toBe(200);
      expect(response.body.sweets[0]).toHaveProperty('name');
    });
  });

  // RED: Test search sweets
  describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
      await prisma.sweet.createMany({
        data: [
          {
            name: 'Chocolate Cake',
            category: 'Cakes',
            price: 25.99,
            quantity: 10,
          },
          {
            name: 'Vanilla Cupcake',
            category: 'Cupcakes',
            price: 5.99,
            quantity: 20,
          },
          {
            name: 'Strawberry Tart',
            category: 'Tarts',
            price: 35.99,
            quantity: 5,
          },
        ],
      });
    });

    it('should search sweets by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search')
        .query({ name: 'Chocolate' });

      expect(response.status).toBe(200);
      expect(response.body.sweets).toHaveLength(1);
      expect(response.body.sweets[0].name).toBe('Chocolate Cake');
    });

    it('should search sweets by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search')
        .query({ category: 'Cupcakes' });

      expect(response.status).toBe(200);
      expect(response.body.sweets).toHaveLength(1);
      expect(response.body.sweets[0].category).toBe('Cupcakes');
    });

    it('should search sweets by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search')
        .query({ minPrice: 20, maxPrice: 40 });

      expect(response.status).toBe(200);
      expect(response.body.sweets.length).toBeGreaterThan(0);
      expect(response.body.sweets.every(s => s.price >= 20 && s.price <= 40)).toBe(true);
    });
  });

  // RED: Test purchase sweet
  describe('POST /api/sweets/:id/purchase', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await prisma.sweet.create({
        data: {
          name: 'Chocolate Cake',
          category: 'Cakes',
          price: 25.99,
          quantity: 10,
        },
      });
      sweetId = sweet.id;
    });

    it('should purchase sweet and decrease quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 3 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('sweet');
      expect(response.body.sweet.quantity).toBe(7);
    });

    it('should not purchase more than available quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 20 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should not purchase when quantity is 0', async () => {
      // First, purchase all
      await prisma.sweet.update({
        where: { id: sweetId },
        data: { quantity: 0 },
      });

      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 });

      expect(response.status).toBe(400);
    });
  });

  // RED: Test restock sweet (admin only)
  describe('POST /api/sweets/:id/restock', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await prisma.sweet.create({
        data: {
          name: 'Chocolate Cake',
          category: 'Cakes',
          price: 25.99,
          quantity: 10,
        },
      });
      sweetId = sweet.id;
    });

    it('should restock sweet as admin', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 5 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('sweet');
      expect(response.body.sweet.quantity).toBe(15);
    });

    it('should not allow regular user to restock', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 5 });

      expect(response.status).toBe(403);
    });
  });

  // RED: Test update sweet (admin only)
  describe('PUT /api/sweets/:id', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await prisma.sweet.create({
        data: {
          name: 'Chocolate Cake',
          category: 'Cakes',
          price: 25.99,
          quantity: 10,
        },
      });
      sweetId = sweet.id;
    });

    it('should update sweet as admin', async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Dark Chocolate Cake',
          price: 29.99,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('sweet');
      expect(response.body.sweet.name).toBe('Dark Chocolate Cake');
    });
  });

  // RED: Test delete sweet (admin only)
  describe('DELETE /api/sweets/:id', () => {
    let sweetId;

    beforeEach(async () => {
      const sweet = await prisma.sweet.create({
        data: {
          name: 'Chocolate Cake',
          category: 'Cakes',
          price: 25.99,
          quantity: 10,
        },
      });
      sweetId = sweet.id;
    });

    it('should delete sweet as admin', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');

      // Verify deletion
      const sweet = await prisma.sweet.findUnique({
        where: { id: sweetId },
      });
      expect(sweet).toBeNull();
    });
  });
});
