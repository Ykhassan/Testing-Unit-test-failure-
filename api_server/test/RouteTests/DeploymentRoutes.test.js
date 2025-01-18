import request from 'supertest';
import express from 'express';
import router from '../../routes/DeploymentRoutes';
import DeploymentController from '../../controllers/DeploymentController';

jest.mock('../../controllers/DeploymentController'); // Mock the controller methods

const app = express();
app.use(express.json());
app.use('/deployments', router);

describe('DeploymentRoutes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test for POST /deployments/:project_id
    test('POST /deployments/:project_id calls createDeployment', async () => {
        DeploymentController.createDeployment.mockImplementation((req, res) => res.status(200).json({
            deployment_id: 'd1',
            user_id: req.body.user_id,
            project_id: req.params.project_id,
            status: 'success',
            cloud_provider: req.body.cloud_provider,
            version: req.body.version,
            total_duration: '5 minutes',
            connection_id: req.body.connection_id,
        }));

        const response = await request(app)
            .post('/deployments/p1')
            .send({
                user_id: 'u1',
                version: '1.0.0',
                cloud_provider: 'AWS',
                connection_id: 'c1'
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            deployment_id: 'd1',
            user_id: 'u1',
            project_id: 'p1',
            status: 'success',
            cloud_provider: 'AWS',
            version: '1.0.0',
            total_duration: '5 minutes',
            connection_id: 'c1'
        });
        expect(DeploymentController.createDeployment).toHaveBeenCalledTimes(1);
    });

    // Test for GET /deployments/:project_id
    test('GET /deployments/:project_id calls getAllProjectDeployments', async () => {
        DeploymentController.getAllProjectDeployments.mockImplementation((req, res) => res.status(200).json([{
            deployment_id: 'd1',
            user_id: 'u1',
            project_id: 'p1',
            status: 'success',
            cloud_provider: 'AWS',
            version: '1.0.0',
            total_duration: '5 minutes',
            connection_id: 'c1',
        }]));

        const response = await request(app).get('/deployments/p1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{
            deployment_id: 'd1',
            user_id: 'u1',
            project_id: 'p1',
            status: 'success',
            cloud_provider: 'AWS',
            version: '1.0.0',
            total_duration: '5 minutes',
            connection_id: 'c1',
        }]);
        expect(DeploymentController.getAllProjectDeployments).toHaveBeenCalledTimes(1);
    });

    // Test for GET /deployments/:project_id/:deployment_id
    test('GET /deployments/:project_id/:deployment_id calls getDeploymentById', async () => {
        DeploymentController.getDeploymentById.mockImplementation((req, res) => res.status(200).json({
            deployment_id: req.params.deployment_id,
            user_id: 'u1',
            project_id: req.params.project_id,
            status: 'success',
            cloud_provider: 'AWS',
            version: '1.0.0',
            total_duration: '5 minutes',
            connection_id: 'c1',
        }));

        const response = await request(app).get('/deployments/p1/d1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            deployment_id: 'd1',
            user_id: 'u1',
            project_id: 'p1',
            status: 'success',
            cloud_provider: 'AWS',
            version: '1.0.0',
            total_duration: '5 minutes',
            connection_id: 'c1',
        });
        expect(DeploymentController.getDeploymentById).toHaveBeenCalledTimes(1);
    });

    // Test for PUT /deployments/:project_id/:deployment_id/cancel
    test('PUT /deployments/:project_id/:deployment_id/cancel calls cancelDeployment', async () => {
        DeploymentController.cancelDeployment.mockImplementation((req, res) => res.status(200).send('Deployment canceled'));

        const response = await request(app).put('/deployments/p1/d1/cancel');

        expect(response.status).toBe(200);
        expect(response.text).toBe('Deployment canceled');
        expect(DeploymentController.cancelDeployment).toHaveBeenCalledTimes(1);
    });

    // Test for DELETE /deployments/:project_id/:deployment_id
    test('DELETE /deployments/:project_id/:deployment_id calls deleteDeployment', async () => {
        DeploymentController.deleteDeployment.mockImplementation((req, res) => res.status(200).send('Deleted deployment'));

        const response = await request(app).delete('/deployments/p1/d1');

        expect(response.status).toBe(200);
        expect(response.text).toBe('Deleted deployment');
        expect(DeploymentController.deleteDeployment).toHaveBeenCalledTimes(1);
    });
});
