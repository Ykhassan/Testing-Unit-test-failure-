import UserController from "../../controllers/UserController";
import { User } from '../../models/index.js';

jest.mock('../../models/index.js');

describe('UserController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test creating a user
    test('createUser - success', async () => {
        const mockReq = { body: { user_id: 'u1', username: 'testy', fullname: 'Yousera Ali', email: 't@test.com' } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        User.create.mockResolvedValue(mockReq.body);

        await UserController.createUser(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(mockReq.body);
    })

    test('createUser - error', async () => {
        const mockReq = { body: {} };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        User.create.mockRejectedValue(new Error('Create failed'));

        await UserController.createUser(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error creating user', error: 'Create failed' });
    })

    // Test getting all users
    test('getAllUsers - success', async () => {
        const mockReq = {};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        User.findAll.mockResolvedValue([{ user_id: 'u1', username: 'testy', fullname: 'Yousera Ali', email: 't@test.com' }, { user_id: 'u2', username: 'alice', fullname: 'Alice', email: 't2@test.com' }]);

        await UserController.getAllUsers(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith([
            { user_id: 'u1', username: 'testy', fullname: 'Yousera Ali', email: 't@test.com' },
            { user_id: 'u2', username: 'alice', fullname: 'Alice', email: 't2@test.com' }
        ]);
    })

    test('getAllUsers - error', async () => {
        const mockReq = {};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        User.findAll.mockRejectedValue(new Error('Fetching failed'));

        await UserController.getAllUsers(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error fetching users", error: 'Fetching failed' });
    })

    // Test getting a user by id
    test('getUserById - success', async () => {
        const mockReq = { params: {user_id: 'u1'}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        User.findByPk.mockResolvedValue({ user_id: 'u1', username: 'testy', fullname: 'Yousera Ali', email: 't@test.com' });

        await UserController.getUserById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ user_id: 'u1', username: 'testy', fullname: 'Yousera Ali', email: 't@test.com' });
    })

    test('getUserById - not found', async () => {
        const mockReq = { params: {user_id: '999'}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        User.findByPk.mockResolvedValue(null);

        await UserController.getUserById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({message: 'User not found'});
    })

    test('getUserById - error', async () => {
        const mockReq = { params: {user_id: 'u1'}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        User.findByPk.mockRejectedValue(new Error('Fetching failed'));

        await UserController.getUserById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error fetching user", error: 'Fetching failed' });
    })

    // Test update a user by id
    test('updateUser - success', async () => {
        const mockReq = { params: {user_id: 'u1'}, body: {fullname: 'Yousera updated'}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        User.update.mockResolvedValue([1]);
        User.findByPk.mockResolvedValue({ user_id: 'u1', username: 'testy', fullname: 'Yousera updated', email: 't@test.com' });

        await UserController.updateUser(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ user_id: 'u1', username: 'testy', fullname: 'Yousera updated', email: 't@test.com' });
    })

    test('updateUser - not found', async () => {
        const mockReq = { params: {user_id: '999'}, body: {fullname: 'Nonexistent'}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        User.update.mockResolvedValue([0]);

        await UserController.updateUser(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "User not found" });
    })

    test('updateUser - error', async () => {
        const mockReq = { params: {user_id: 'u1'}, body: {fullname: 'Updated'}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        User.update.mockRejectedValue(new Error('Updating failed'));

        await UserController.updateUser(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error updating user", error: 'Updating failed' });
    })

    // Test deleting a user by id
    test('deleteUser - success', async () => {
        const mockReq = { params: {user_id: 'u1'}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        User.destroy.mockResolvedValue(1);

        await UserController.deleteUser(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(204);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "User deleted" });
    })

    test('deleteUser - not found', async () => {
        const mockReq = { params: {user_id: '999'}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        User.destroy.mockResolvedValue(0);

        await UserController.deleteUser(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "User not found" });
    })

    test('deleteUser - error', async () => {
        const mockReq = { params: {user_id: '999'}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        User.destroy.mockRejectedValue(new Error('Deleting failed'));

        await UserController.deleteUser(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error deleting user", error: 'Deleting failed' });
    })
});
