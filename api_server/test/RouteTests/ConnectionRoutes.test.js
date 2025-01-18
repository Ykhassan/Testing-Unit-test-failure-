import request from 'supertest';
import express from 'express';
import router from '../../routes/ConnectionRoutes';
import ConnectionController from '../../controllers/ConnectionController';

jest.mock('../../controllers/ConnectionController'); // mock the controller methods

const app = express();
app.use(express.json());
app.use('/connections', router);

describe('ConnectionRoutes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test for POST /connections/:user_id
    test('POST /connections/:user_id calls createConnection', async () => {
        ConnectionController.createConnection.mockImplementation((req, res) => res.status(201).json({
            connection_id: 'c1',
            user_id: req.params.user_id,
            name: req.body.name,
            cloud_provider: req.body.cloud_provider,
            status: req.body.status,
            details: req.body.details,
            createdAt: "2025-01-17T14:48:00.000Z",
            updatedAt: "2025-01-17T14:48:00.000Z"
        }));

        const response = await request(app)
            .post('/connections/t1')
            .send({
                name: 'Test Connection',
                cloud_provider: 'AWS',
                status: 'active',
                details: { description: 'This is a test connection.' }
            });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            connection_id: 'c1',
            user_id: 't1',
            name: 'Test Connection',
            cloud_provider: 'AWS',
            status: 'active',
            details: { description: 'This is a test connection.' },
            createdAt: "2025-01-17T14:48:00.000Z",
            updatedAt: "2025-01-17T14:48:00.000Z"
        });
        expect(ConnectionController.createConnection).toHaveBeenCalledTimes(1);
    });

    // Test for GET /connections/:user_id
    test('GET /connections/:user_id calls getAllUserConnections', async () => {
        ConnectionController.getAllUserConnections.mockImplementation((req, res) => res.status(200).json([{
            connection_id: 'c1',
            user_id: 't1',
            name: 'Test Connection',
            cloud_provider: 'AWS',
            status: 'active',
            details: { description: 'This is a test connection.' },
            createdAt: "2025-01-17T14:48:00.000Z",
            updatedAt: "2025-01-17T14:48:00.000Z"
        }]));

        const response = await request(app).get('/connections/t1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{
            connection_id: 'c1',
            user_id: 't1',
            name: 'Test Connection',
            cloud_provider: 'AWS',
            status: 'active',
            details: { description: 'This is a test connection.' },
            createdAt: "2025-01-17T14:48:00.000Z",
            updatedAt: "2025-01-17T14:48:00.000Z"
        }]);
        expect(ConnectionController.getAllUserConnections).toHaveBeenCalledTimes(1);
    });

    // Test for GET /connections/:user_id/:connection_id
    test('GET /connections/:user_id/:connection_id calls getConnectionById', async () => {
        ConnectionController.getConnectionById.mockImplementation((req, res) => res.status(200).json({
            connection_id: req.params.connection_id,
            user_id: req.params.user_id,
            name: 'Test Connection',
            cloud_provider: 'AWS',
            status: 'active',
            details: { description: 'This is a test connection.' },
            createdAt: "2025-01-17T14:48:00.000Z",
            updatedAt: "2025-01-17T14:48:00.000Z"
        }));

        const response = await request(app).get('/connections/t1/c1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            connection_id: 'c1',
            user_id: 't1',
            name: 'Test Connection',
            cloud_provider: 'AWS',
            status: 'active',
            details: { description: 'This is a test connection.' },
            createdAt: "2025-01-17T14:48:00.000Z",
            updatedAt: "2025-01-17T14:48:00.000Z"
        });
        expect(ConnectionController.getConnectionById).toHaveBeenCalledTimes(1);
    });

    // Test for PUT /connections/:user_id/:connection_id
    test('PUT /connections/:user_id/:connection_id calls updateConnection', async () => {
        ConnectionController.updateConnection.mockImplementation((req, res) => res.status(200).json({
            connection_id: req.params.connection_id,
            user_id: req.params.user_id,
            name: 'Updated Connection',
            cloud_provider: 'Azure',
            status: 'inactive',
            details: { description: 'Updated connection description.' },
            createdAt: "2025-01-17T14:48:00.000Z",
            updatedAt: "2025-01-17T14:48:00.000Z"
        }));

        const response = await request(app)
            .put('/connections/t1/c1')
            .send({
                name: 'Updated Connection',
                cloud_provider: 'Azure',
                status: 'inactive',
                details: { description: 'Updated connection description.' }
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            connection_id: 'c1',
            user_id: 't1',
            name: 'Updated Connection',
            cloud_provider: 'Azure',
            status: 'inactive',
            details: { description: 'Updated connection description.' },
            createdAt: "2025-01-17T14:48:00.000Z",
            updatedAt: "2025-01-17T14:48:00.000Z"
        });
        expect(ConnectionController.updateConnection).toHaveBeenCalledTimes(1);
    });

    // Test for DELETE /connections/:user_id/:connection_id
    test('DELETE /connections/:user_id/:connection_id calls deleteConnection', async () => {
        ConnectionController.deleteConnection.mockImplementation((req, res) => res.status(200).json({ message: 'Connection deleted' }));

        const response = await request(app).delete('/connections/t1/c1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Connection deleted' });
        expect(ConnectionController.deleteConnection).toHaveBeenCalledTimes(1);
    });
});
