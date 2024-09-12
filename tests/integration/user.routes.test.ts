import request from 'supertest';
import app from '../../src/app';

describe('User Routes Integration Tests', () => {
  let userId: number;
  let createdId: number;
  let duplicateId: number;

  beforeEach(async () => {
    const createResponse = await request(app).post('/api/users').send({
      first_name: 'Test',
      last_name: 'User',
      email: 'testuser@example.com',
      phone_number: '12345678901',
      role_name: 'client',
      city_name: 'Cairo', // any existing city name
    });

    userId = createResponse.body.user.id; 
  });

  afterEach(async () => {
    if (userId) {
      await request(app).delete(`/api/users/${userId}`);
    }
    if (duplicateId) {
      await request(app).delete(`/api/users/${duplicateId}`);
    }
  });

  afterAll(async () => {
    if (createdId) {
      await request(app).delete(`/api/users/${createdId}`);
    }
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const response = await request(app).post('/api/users').send({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone_number: '12345678901',
        role_name: 'client',
        city_name: 'Cairo',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe('john@example.com');

      createdId = response.body.user.id;
    });

    it('should return 400 for invalid input', async () => {
      const response = await request(app).post('/api/users').send({
        first_name: 'John',
        email: 'invalid-email', 
        phone_number: '12345678902',
        role_name: 'client',
        city_name: 'Cairo',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 when creating a user with an already existing email', async () => {
        const firstResponse = await request(app).post('/api/users').send({
          first_name: 'Mark',
          last_name: 'Anderson',
          email: 'mark@example.com',
          phone_number: '12345678901',
          role_name: 'client',
          city_name: 'Cairo',
        });
    
        expect(firstResponse.status).toBe(201);
        expect(firstResponse.body).toHaveProperty('user');
        duplicateId = firstResponse.body.user.id; 
    
        const duplicateResponse = await request(app).post('/api/users').send({
          first_name: 'Antoite',
          last_name: 'Doe',
          email: 'mark@example.com',
          phone_number: '98765432101',
          role_name: 'client',
          city_name: 'Giza',
        });
    
        expect(duplicateResponse.status).toBe(400);
        expect(duplicateResponse.body).toHaveProperty('message', 'User already exists');
      });
  });

  describe('PUT /users/:id', () => {
    it('should update an existing user', async () => {
      const updateResponse = await request(app)
        .put(`/api/users/${userId}`)
        .send({
          first_name: 'JaneUpdated',
          last_name: 'Doe',
          email: 'jane_updated@example.com',
          phone_number: '98765432110',
          city_name: 'Giza',
        });

      expect(updateResponse.status).toBe(200);
    });

    it('should return 400 if the user is not found', async () => {
      const id = 9999;
      const response = await request(app).put(`/api/users/${id}`).send({
        first_name: 'Nonexistent',
        last_name: 'User',
        email: 'nonexistent@example.com',
        phone_number: '123456789303',
        city_name: 'Cairo',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'User not found');
    }, 10000);
  });

  describe('DELETE /users/:id', () => {
    it('should delete an existing user', async () => {
      const deleteResponse = await request(app).delete(`/api/users/${userId}`);
      expect(deleteResponse.status).toBe(204);
    });

    it('should return 400 if the user is not found', async () => {
      const response = await request(app).delete('/api/users/9999');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'User not found');
    });
  });

  describe('GET /users', () => {
    it('should fetch all users', async () => {
      await request(app).post('/api/users').send({
        first_name: 'Alice',
        last_name: 'Manrop',
        email: 'alice@example.com',
        phone_number: '1234567890',
        role_name: 'client',
        city_name: 'Cairo',
      });

      await request(app).post('/api/users').send({
        first_name: 'Bob',
        last_name: 'Jones',
        email: 'bob@example.com',
        phone_number: '9876543210',
        role_name: 'helper',
        city_name: 'Cairo',
      });

      const response = await request(app)
        .get('/api/users')
        .query({ role_name: 'client', size: 10, page: 1 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('total');
      expect(response.body.users.length).toBeGreaterThan(0);
    });

    it('should return 400 if invalid query parameters are provided', async () => {
      const response = await request(app)
        .get('/api/users')
        .query({ role_name: 'unknown_role' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });
});
