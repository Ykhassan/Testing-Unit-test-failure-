import ProjectController from "../../controllers/ProjectController";
import { Project } from '../../models/index.js';

jest.mock('../../models/index.js');

describe('ProjectController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test creating a Project
    test('createProject - success', async () => {
        const mockReq = { params: { user_id: 'u1' }, body: { name: 'test', description: 'test proj', visibility: 'public', cloud_provider: 'AWS' } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        const mockProject = {
            ...mockReq.body,
            project_id: 'p1',
            user_id: 'u1',
            estimated_cost: 1000.00,
            availability: 99.0,
            durability: 90.0,
            like_count: 10,
            blob_url: 'https://someurl.com',
            last_modified: "2025-01-17T14:48:00.000Z"
        }

        Project.create.mockResolvedValue(mockProject);

        await ProjectController.createProject(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockProject);
    })

    test('createProject - error', async () => {
        const mockReq = { params: { user_id: 'u1' }, body: { name: 'test', description: 'test proj', visibility: 'public', cloud_provider: 'AWS' } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Project.create.mockRejectedValue(new Error('Creating failed'));

        await ProjectController.createProject(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error creating project", error: 'Creating failed' });
    })

    // Test getting all Projects
    test('getAllUserProjects - success', async () => {
        const mockReq = { params: { user_id: 'u1' } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        const mockProject = {
            name: 'test', description: 'test proj', visibility: 'public', cloud_provider: 'AWS',
            project_id: 'p1',
            user_id: 'u1',
            estimated_cost: 1000.00,
            availability: 99.0,
            durability: 90.0,
            like_count: 10,
            blob_url: 'https://someurl.com',
            last_modified: "2025-01-17T14:48:00.000Z"
        }

        Project.findAll.mockResolvedValue([mockProject]);

        await ProjectController.getAllUserProjects(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith([mockProject]);
    })

    test('getAllUserProjects - error', async () => {
        const mockReq = { params: { user_id: 'u1' } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Project.findAll.mockRejectedValue(new Error('Fetching failed'));

        await ProjectController.getAllUserProjects(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error fetching projects", error: 'Fetching failed' });
    })

    // Test getting a Project by id
    test('getProjectById - success', async () => {
        const mockReq = { params: { user_id: 'u1', project_id: 1 } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        const mockProject = {
            name: 'test', description: 'test proj', visibility: 'public', cloud_provider: 'AWS',
            project_id: 'p1',
            user_id: 'u1',
            estimated_cost: 1000.00,
            availability: 99.0,
            durability: 90.0,
            like_count: 10,
            blob_url: 'https://someurl.com',
            last_modified: "2025-01-17T14:48:00.000Z"
        }

        Project.findOne.mockResolvedValue(mockProject);

        await ProjectController.getProjectById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockProject);
    })

    test('getProjectById - Project not found', async () => {
        const mockReq = { params: { user_id: 'u1', project_id: 999 } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Project.findOne.mockResolvedValue(null);

        await ProjectController.getProjectById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Project not found' });
    })

    test('getProjectById - error', async () => {
        const mockReq = { params: { user_id: 'u1', project_id: 1 } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Project.findOne.mockRejectedValue(new Error('Fetching failed'));

        await ProjectController.getProjectById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error fetching project", error: 'Fetching failed' });
    })

    // Test update a Project by id
    test('updateProject - success', async () => {
        const mockReq = { params: { user_id: 'u1', project_id: 1 }, body: {name: 'updated name'} };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        const mockProject = {
            ...mockReq.body,
            description: 'test proj', visibility: 'public', cloud_provider: 'AWS',
            project_id: 'p1',
            user_id: 'u1',
            estimated_cost: 1000.00,
            availability: 99.0,
            durability: 90.0,
            like_count: 10,
            blob_url: 'https://someurl.com',
            last_modified: "2025-01-17T14:48:00.000Z"
        }

        Project.update.mockResolvedValue([1]);

        Project.findByPk.mockResolvedValue(mockProject);

        await ProjectController.updateProject(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Updated project' });
    })

    test('updateProject - Project not found', async () => {
        const mockReq = { params: { user_id: 'u1', project_id: 999 }, body: {name: 'updated name'} };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Project.update.mockResolvedValue([0]);

        await ProjectController.updateProject(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Project not found' });
    })

    test('updateProject - error', async () => {
        const mockReq = { params: { user_id: 'u1', project_id: 1 }, body: {name: 'updated name'} };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Project.update.mockRejectedValue(new Error('Updating failed'));

        await ProjectController.updateProject(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error updating project", error: 'Updating failed' });
    })

    // Test deleting a Project by id
    test('deleteProject - success', async () => {
        const mockReq = { params: { user_id: 'u1', project_id: 1 } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Project.destroy.mockResolvedValue(1);

        await ProjectController.deleteProject(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(204);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Project deleted" });
    })

    test('deleteProject - Project not found', async () => {
        const mockReq = { params: { user_id: 'u1', project_id: 999 } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Project.destroy.mockResolvedValue(0);

        await ProjectController.deleteProject(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Project not found" });
    })

    test('deleteProject - error', async () => {
        const mockReq = { params: { user_id: 'u1', project_id: 999 } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Project.destroy.mockRejectedValue(new Error('Deleting failed'));

        await ProjectController.deleteProject(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error deleting project", error: 'Deleting failed' });
    })
});

