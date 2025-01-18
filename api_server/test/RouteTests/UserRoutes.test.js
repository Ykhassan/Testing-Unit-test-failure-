import request from 'supertest';
import express from 'express';
import router from '../../routes/UserRoutes';
import UserController from '../../controllers/UserController';

jest.mock('../../controllers/UserController'); // mock the controller methods

const app = express();
app.use(express.json());
app.use('/users', router);

describe('UserRoutes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test for POST /users
    test('POST /users calls createUser', async () => {
        UserController.createUser.mockImplementation((req, res) => res.status(201).json({ message: 'User created' }));

        const response = await request(app)
            .post('/users')
            .send({ user_id: 't1', username: 'testy', fullname: 'Yousera Ali', email: 't@test.com' });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({message: 'User created'});
        expect(UserController.createUser).toHaveBeenCalledTimes(1);
    });

    // Test for GET /users
    test('GET /users calls getAllUsers', async () => {
        UserController.getAllUsers.mockImplementation((req, res) => res.status(200).json([{ user_id: 't1', username: 'testy', fullname: 'Yousera Ali', email: 't@test.com' }]));

        const response = await request(app).get('/users');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ user_id: 't1', username: 'testy', fullname: 'Yousera Ali', email: 't@test.com' }]);
        expect(UserController.getAllUsers).toHaveBeenCalledTimes(1);
    });

    // Test for GET /users/:user_id
    test('GET /users/:user_id calls getUserById', async () => {
        UserController.getUserById.mockImplementation((req, res) => res.status(200).json([{ user_id: req.params.user_id, username: 'testy', fullname: 'Yousera Ali', email: 't@test.com' }]));

        const response = await request(app).get('/users/t1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ user_id: 't1', username: 'testy', fullname: 'Yousera Ali', email: 't@test.com' }]);
        expect(UserController.getUserById).toHaveBeenCalledTimes(1);
    });

    // Test for PUT /users/:user_id
    test('PUT /users/:user_id calls updateUser', async () => {
        UserController.updateUser.mockImplementation((req, res) => res.status(200).json([{ user_id: req.params.user_id, username: 'updated t', fullname: 'Yousera Ali', email: 't@test.com' }]));

        const response = await request(app)
            .put('/users/t1')
            .send({ username: 'updated t', fullname: 'Yousera Ali', email: 't@test.com' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ user_id: 't1', username: 'updated t', fullname: 'Yousera Ali', email: 't@test.com' }]);
        expect(UserController.updateUser).toHaveBeenCalledTimes(1);
    });

    // Test for DELETE /users/:user_id
    test('DELETE /users/:user_id calls deleteUser', async () => {
        UserController.deleteUser.mockImplementation((req, res) => res.status(200).json({ message: 'User deleted' }));

        const response = await request(app).delete('/users/t1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'User deleted' });
        expect(UserController.deleteUser).toHaveBeenCalledTimes(1);
    });
})