import DeploymentController from "../../controllers/DeploymentController";
import { Deployment, Project, Connection } from '../../models/index.js';

jest.mock('../../models/index.js', () => ({
    Project: {
        findOne: jest.fn()
    },
    Connection: {
        findOne: jest.fn()
    },
    Deployment: {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn()
    }
}));


describe('DeploymentController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test creating a Deployment
    test('createDeployment - success', async () => {
        const mockReq = { params: { project_id: 1 }, body: { user_id: 'u1', version: "1.0.0", connection_id: 1 } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Project.findOne.mockResolvedValue({ dataValues: { cloud_provider: 'AWS' } });
        Connection.findOne.mockResolvedValue({ dataValues: { status: 'active' } });
        Deployment.create.mockResolvedValue({ deployment_id: 1, user_id: "u1", project_id: 1, status: "completed", cloud_provider: "AWS", version: "1.0.0", total_duration: "1", Connection_id: 1 })

        await DeploymentController.createDeployment(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ deployment_id: 1, user_id: "u1", project_id: 1, status: "completed", cloud_provider: "AWS", version: "1.0.0", total_duration: "1", Connection_id: 1 });
    })

    test('createDeployment - no active connection', async () => {
        const mockReq = { params: { project_id: 1 }, body: { user_id: 'u1', version: "1.0.0", connection_id: 1 } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Project.findOne.mockResolvedValue({ dataValues: { cloud_provider: 'AWS' } });
        Connection.findOne.mockResolvedValue({ dataValues: { status: 'not active' } });

        await DeploymentController.createDeployment(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error creating deployment connection is not active' });
    })

    test('createDeployment - no connection found', async () => {
        const mockReq = { params: { project_id: 1 }, body: { user_id: 'u1', version: "1.0.0", connection_id: 999 } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Project.findOne.mockResolvedValue({ dataValues: { cloud_provider: 'AWS' } });
        Connection.findOne.mockResolvedValue(null);

        await DeploymentController.createDeployment(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'No connection found' });
    })

    test('createDeployment - Project not found', async () => {
        const mockReq = { params: { project_id: 999 }, body: { user_id: 'u1', version: "1.0.0", connection_id: 1 } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Project.findOne.mockResolvedValue(null);

        await DeploymentController.createDeployment(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Project not found' });
    })

    test('createDeployment - error', async () => {
        const mockReq = { params: { project_id: 999 }, body: { user_id: 'u1', version: "1.0.0", connection_id: 1 } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Project.findOne.mockResolvedValue({ dataValues: { cloud_provider: 'AWS' } });
        Connection.findOne.mockResolvedValue({ dataValues: { status: 'active' } });
        Deployment.create.mockRejectedValue(new Error('Creating failed'));

        await DeploymentController.createDeployment(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error creating deployments", error: 'Creating failed' });
    })

    // Test getting all Deployments
    test('getAllProjectDeployments - success', async () => {
        const mockReq = { params: {project_id: 1} };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Deployment.findAll.mockResolvedValue([{ deployment_id: 1, user_id: "u1", project_id: 1, status: "completed", cloud_provider: "AWS", version: "1.0.0", total_duration: "1", Connection_id: 1 }]);

        await DeploymentController.getAllProjectDeployments(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith([{ deployment_id: 1, user_id: "u1", project_id: 1, status: "completed", cloud_provider: "AWS", version: "1.0.0", total_duration: "1", Connection_id: 1 }]);
    })

    test('getAllProjectDeployments - error', async () => {
        const mockReq = { params: {} };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Deployment.findAll.mockRejectedValue(new Error('Fetching failed'));

        await DeploymentController.getAllProjectDeployments(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error fetching deployments", error: 'Fetching failed' });
    })

    // Test getting a Deployment by id
    test('getDeploymentById - success', async () => {
        const mockReq = { params: {project_id: 1, deployment_id: 1}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Deployment.findOne.mockResolvedValue({ deployment_id: 1, user_id: "u1", project_id: 1, status: "completed", cloud_provider: "AWS", version: "1.0.0", total_duration: "1", Connection_id: 1 });

        await DeploymentController.getDeploymentById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ deployment_id: 1, user_id: "u1", project_id: 1, status: "completed", cloud_provider: "AWS", version: "1.0.0", total_duration: "1", Connection_id: 1 });
    })

    test('getDeploymentById - not found', async () => {
        const mockReq = { params: {project_id: 1, deployment_id: 999}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Deployment.findOne.mockResolvedValue(null);

        await DeploymentController.getDeploymentById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({message: 'Deployment not found'});
    })

    test('getDeploymentById - error', async () => {
        const mockReq = { params: {project_id: 1, deployment_id: 1} };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Deployment.findOne.mockRejectedValue(new Error('Fetching failed'));

        await DeploymentController.getDeploymentById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error fetching deployment", error: 'Fetching failed' });
    })

    // Test cancel a Deployment by id
    test('cancelDeployment - success', async () => {
        const mockReq = { params: {project_id: 1, deployment_id: 1}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Deployment.update.mockResolvedValue([1]);

        await DeploymentController.cancelDeployment(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(204);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Deployment canceled'});
    })

    test('cancelDeployment - not found', async () => {
        const mockReq = { params: {project_id: 1, deployment_id: 999}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Deployment.update.mockResolvedValue([0]);

        await DeploymentController.cancelDeployment(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Deployment not found" });
    })

    test('cancelDeployment - error', async () => {
        const mockReq = { params: {project_id: 1, deployment_id: 999} };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Deployment.update.mockRejectedValue(new Error('Updating failed'));

        await DeploymentController.cancelDeployment(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error canceling deployment", error: 'Updating failed' });
    })

    // Test deleting a Deployment by id
    test('deleteDeployment - success', async () => {
        const mockReq = { params: {project_id: 1, deployment_id: 1}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Deployment.destroy.mockResolvedValue(1);

        await DeploymentController.deleteDeployment(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(204);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Deployment deleted" });
    })

    test('deleteDeployment - not found', async () => {
        const mockReq = { params: {project_id: 1, deployment_id: 999}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Deployment.destroy.mockResolvedValue(0);

        await DeploymentController.deleteDeployment(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Deployment not found" });
    })

    test('deleteDeployment - error', async () => {
        const mockReq = { params: {project_id: 1, deployment_id: 999} };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Deployment.destroy.mockRejectedValue(new Error('Deleting failed'));

        await DeploymentController.deleteDeployment(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error deleting deployment", error: 'Deleting failed' });
    })
});
