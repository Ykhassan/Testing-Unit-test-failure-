import ConnectionController from "../../controllers/ConnectionController";
import { Connection } from '../../models/index.js';

jest.mock('../../models/index.js');

describe('ConnectionController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test creating a Connection
    test('createConnection - success', async () => {
        const mockReq = { params: {user_id: 'u1'}, body: { name: 'test conn', cloud_provider: 'AWS',  status: 'active', details: '' } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        const mockConnection = {user_id: 'u1', connection_id: 1, ...mockReq.body};

        Connection.create.mockResolvedValue(mockConnection);

        await ConnectionController.createConnection(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(mockConnection);
    })

    test('createConnection - error', async () => {
        const mockReq = { params: {}, body: {} };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Connection.create.mockRejectedValue(new Error('Create failed'));

        await ConnectionController.createConnection(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error creating connection', error: 'Create failed' });
    })

    // Test getting all Connections
    test('getAllUserConnections - success', async () => {
        const mockReq = { params: {user_id: 'u1'} };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Connection.findAll.mockResolvedValue([{ user_id: 'u1', connection_id: 1, name: 'test conn', cloud_provider: 'AWS',  status: 'active', details: '' }]);

        await ConnectionController.getAllUserConnections(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith([{ user_id: 'u1', connection_id: 1, name: 'test conn', cloud_provider: 'AWS',  status: 'active', details: '' }]);
    })

    test('getAllUserConnections - error', async () => {
        const mockReq = { params: {} };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Connection.findAll.mockRejectedValue(new Error('Fetching failed'));

        await ConnectionController.getAllUserConnections(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error fetching connections", error: 'Fetching failed' });
    })

    // Test getting a Connection by id
    test('getConnectionById - success', async () => {
        const mockReq = { params: { user_id: 'u1', Connection_id: 1}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Connection.findOne.mockResolvedValue({ user_id: 'u1', Connection_id: 1, name: 'test conn', cloud_provider: 'AWS',  status: 'active', details: '' });

        await ConnectionController.getConnectionById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ user_id: 'u1', Connection_id: 1, name: 'test conn', cloud_provider: 'AWS',  status: 'active', details: '' });
    })

    test('getConnectionById - not found', async () => {
        const mockReq = { params: { user_id: 'u1', Connection_id: 999}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Connection.findOne.mockResolvedValue(null);

        await ConnectionController.getConnectionById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({message: 'Connection not found'});
    })

    test('getConnectionById - error', async () => {
        const mockReq = { params: { user_id: 'u1', Connection_id: 999}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Connection.findOne.mockRejectedValue(new Error('Fetching failed'));

        await ConnectionController.getConnectionById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error fetching connection", error: 'Fetching failed' });
    })

    // Test update a Connection by id
    test('updateConnection - success', async () => {
        const mockReq = { params: { user_id: 'u1', Connection_id: 1}, body: {name: 'name updated'}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Connection.update.mockResolvedValue([1]);
        Connection.findByPk.mockResolvedValue({ user_id: 'u1', Connection_id: 1, name: 'name updated', cloud_provider: 'AWS',  status: 'active', details: '' });

        await ConnectionController.updateConnection(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ user_id: 'u1', Connection_id: 1, name: 'name updated', cloud_provider: 'AWS',  status: 'active', details: '' });
    })

    test('updateConnection - not found', async () => {
        const mockReq = { params: { user_id: 'u1', Connection_id: 999}, body: {name: 'Nonexistent'}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Connection.update.mockResolvedValue([0]);

        await ConnectionController.updateConnection(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Connection not found" });
    })

    test('updateConnection - error', async () => {
        const mockReq = { params: { user_id: 'u1', Connection_id: 999}, body: {name: 'name updated'}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Connection.update.mockRejectedValue(new Error('Updating failed'));

        await ConnectionController.updateConnection(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error updating connection", error: 'Updating failed' });
    })

    // Test deleting a Connection by id
    test('deleteConnection - success', async () => {
        const mockReq = { params: { user_id: 'u1', Connection_id: 1}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Connection.destroy.mockResolvedValue(1);

        await ConnectionController.deleteConnection(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(204);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Connection deleted" });
    })

    test('deleteConnection - not found', async () => {
        const mockReq = { params: { user_id: 'u1', Connection_id: 999}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Connection.destroy.mockResolvedValue(0);

        await ConnectionController.deleteConnection(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Connection not found" });
    })

    test('deleteConnection - error', async () => {
        const mockReq = { params: { user_id: 'u1', Connection_id: 999}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Connection.destroy.mockRejectedValue(new Error('Deleting failed'));

        await ConnectionController.deleteConnection(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error deleting connection", error: 'Deleting failed' });
    })
});
