const request = require('supertest');

const { app } = require('../src/server');
const { usersStorage } = require('../src/store/users');

describe('User service:', () => {
  let accessToken;
  const agent = request.agent(app);
  const testUser = {
    name: 'Test Test',
    email: 'test@test.com',
    password: 'pa$Sw0Rd',
    age: 37,
  };

  beforeAll(async () => {
    usersStorage.clear();

    await agent.post('/api/v1/users').send(testUser).expect(201);

    const response = await agent
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(200);

    ({ accessToken } = response.body.data);
  });

  beforeEach(() => {
    usersStorage.clear();
  });

  it('should create user', async () => {
    const email = 'some.email@test.com';

    const createdUser = await agent
      .post('/api/v1/users')
      .send({
        ...testUser,
        email,
      })
      .expect(201);

    expect(usersStorage.findAll()).toHaveLength(1);
    expect(usersStorage.findAll()).toEqual([
      {
        name: 'Test Test',
        email: 'some.email@test.com',
        age: 37,
        id: 1,
        password: 'pa$Sw0Rd',
      },
    ]);
    expect(createdUser.status).toBe(201);
    expect(createdUser.body).toMatchObject({
      status: 'ok',
      data: {
        accessToken: expect.any(String),
        name: testUser.name,
        email: email,
        age: testUser.age,
        id: 1,
      },
    });
  });

  it('should return all users', async () => {
    const email = 'some.email@test.com';

    await agent
      .post('/api/v1/users')
      .send({
        ...testUser,
        email,
      })
      .expect(201);

    const response = await agent
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect('Content-Type', /application\/json/);

    expect(usersStorage.findAll()).toHaveLength(1);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      data: [
        {
          name: testUser.name,
          email: email,
          age: testUser.age,
          id: 1,
        },
      ],
    });
  });

  it('should return one user by id', async () => {
    const secondUserEmail = 'some.email@test.com';

    const firstUserResponse = await agent.post('/api/v1/users').send(testUser).expect(201);
    const firstUserId = firstUserResponse.body.data.id;

    const secondUserResponse = await agent
      .post('/api/v1/users')
      .send({
        ...testUser,
        email: secondUserEmail,
      })
      .expect(201);

    const response = await agent
      .get(`/api/v1/users/${firstUserId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect('Content-Type', /application\/json/);

    expect(usersStorage.findAll()).toHaveLength(2);
    expect(response.status).toBe(200);

    const { name, email, age, id } = firstUserResponse.body.data;

    expect(response.body).toEqual({
      status: 'ok',
      data: {
        name,
        email,
        age,
        id,
      },
    });
  });

  it('should update user', async () => {
    const email = 'some.email@test.com';
    const newEmail = 'updated.email@test.com';

    const firstUserResponse = await agent.post('/api/v1/users').send(testUser).expect(201);
    const firstUserId = firstUserResponse.body.data.id;

    const secondUserResponse = await agent
      .post('/api/v1/users')
      .send({
        ...testUser,
        email,
      })
      .expect(201);

    const response = await agent
      .put(`/api/v1/users/${firstUserId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        ...testUser,
        email: newEmail,
      })
      .expect('Content-Type', /application\/json/);

    expect(usersStorage.findAll()).toHaveLength(2);
    expect(usersStorage.findByFilter(secondUserResponse.body.data.email, true)).toEqual([
      {
        ...testUser,
        email,
        id: secondUserResponse.body.data.id,
      },
    ]);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      data: {
        name: testUser.name,
        email: newEmail,
        age: testUser.age,
        id: 1,
      },
    });
  });

  it('should remove user', async () => {
    const email = 'some.email@test.com';
    const newEmail = 'updated.email@test.com';

    const firstUserResponse = await agent.post('/api/v1/users').send(testUser).expect(201);
    const firstUserId = firstUserResponse.body.data.id;

    const secondUserResponse = await agent
      .post('/api/v1/users')
      .send({
        ...testUser,
        email,
      })
      .expect(201);

    const response = await agent.delete(`/api/v1/users/${firstUserId}`).set('Authorization', `Bearer ${accessToken}`);

    expect(usersStorage.findAll()).toHaveLength(1);
    expect(usersStorage.findByFilter(secondUserResponse.body.data.email, true)).toEqual([
      {
        ...testUser,
        email,
        id: secondUserResponse.body.data.id,
      },
    ]);
    expect(response.status).toBe(204);
  });
});
