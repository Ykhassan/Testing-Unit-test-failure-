import request from 'supertest';
import express from 'express';
import router from '../../routes/ProjectRoutes';
import ProjectController from '../../controllers/ProjectController';

jest.mock('../../controllers/ProjectController'); // mock the controller methods

const app = express();
app.use(express.json());
app.use('/projects', router);

describe('ProjectRoutes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test for POST /projects/:user_id
    test('POST /projects/:user_id calls createProject', async () => {
        ProjectController.createProject.mockImplementation((req, res) => res.status(201).json({
            project_id: 'p1',
            user_id: req.params.user_id,
            name: req.body.name,
            description: req.body.description,
            visibility: req.body.visibility,
            cloud_provider: req.body.cloud_provider,
            estimated_cost: 1000.00,
            availability: 100.0,
            durability: 90.0,
            like_count: 10,
            blob_url: 'https://someurl.com',
            last_modified: "2025-01-17T14:48:00.000Z"
        }));

        const response = await request(app)
            .post('/projects/u1')
            .send({
                name: 'Test Project',
                description: 'This is a test project.',
                visibility: 'public',
                cloud_provider: 'AWS'
            });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            project_id: 'p1',
            user_id: 'u1',
            name: 'Test Project',
            description: 'This is a test project.',
            visibility: 'public',
            cloud_provider: 'AWS',
            estimated_cost: 1000.00,
            availability: 100.0,
            durability: 90.0,
            like_count: 10,
            blob_url: 'https://someurl.com',
            last_modified: expect.any(String) // Checking if the last_modified field is a valid date string
        });
        expect(ProjectController.createProject).toHaveBeenCalledTimes(1);
    });

    // Test for GET /projects/:user_id
    test('GET /projects/:user_id calls getAllUserProjects', async () => {
        ProjectController.getAllUserProjects.mockImplementation((req, res) => res.status(200).json([{
            project_id: 'p1',
            user_id: 'u1',
            name: 'Test Project',
            description: 'Test description',
            visibility: 'public',
            estimated_cost: 1000.00,
            availability: 100.0,
            durability: 90.0,
            cloud_provider: 'AWS',
            like_count: 10,
            blob_url: 'https://someurl.com',
            last_modified: "2025-01-17T14:48:00.000Z"
        }]));

        const response = await request(app).get('/projects/u1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{
            project_id: 'p1',
            user_id: 'u1',
            name: 'Test Project',
            description: 'Test description',
            visibility: 'public',
            estimated_cost: 1000.00,
            availability: 100.0,
            durability: 90.0,
            cloud_provider: 'AWS',
            like_count: 10,
            blob_url: 'https://someurl.com',
            last_modified: expect.any(String)
        }]);
        expect(ProjectController.getAllUserProjects).toHaveBeenCalledTimes(1);
    });

    // Test for GET /projects/:user_id/:project_id
    test('GET /projects/:user_id/:project_id calls getProjectById', async () => {
        ProjectController.getProjectById.mockImplementation((req, res) => res.status(200).json({
            project_id: req.params.project_id,
            user_id: req.params.user_id,
            name: 'Test Project',
            description: 'Test description',
            visibility: 'public',
            estimated_cost: 1000.00,
            availability: 100.0,
            durability: 90.0,
            cloud_provider: 'AWS',
            like_count: 10,
            blob_url: 'https://someurl.com',
            last_modified: "2025-01-17T14:48:00.000Z"
        }));

        const response = await request(app).get('/projects/u1/p1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            project_id: 'p1',
            user_id: 'u1',
            name: 'Test Project',
            description: 'Test description',
            visibility: 'public',
            estimated_cost: 1000.00,
            availability: 100.0,
            durability: 90.0,
            cloud_provider: 'AWS',
            like_count: 10,
            blob_url: 'https://someurl.com',
            last_modified: expect.any(String)
        });
        expect(ProjectController.getProjectById).toHaveBeenCalledTimes(1);
    });

    // Test for PUT /projects/:user_id/:project_id
    test('PUT /projects/:user_id/:project_id calls updateProject', async () => {
        ProjectController.updateProject.mockImplementation((req, res) => res.status(200).json({
            project_id: req.params.project_id,
            user_id: req.params.user_id,
            name: 'Updated Project',
            description: 'Updated description',
            visibility: 'private',
            cloud_provider: 'Azure',
            estimated_cost: 1200.00,
            availability: 80.0,
            durability: 85.0,
            like_count: 20,
            blob_url: 'https://updatedurl.com',
            last_modified: "2025-01-17T14:48:00.000Z"
        }));

        const response = await request(app)
            .put('/projects/u1/p1')
            .send({
                name: 'Updated Project',
                description: 'Updated description',
                visibility: 'private',
                cloud_provider: 'Azure'
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            project_id: 'p1',
            user_id: 'u1',
            name: 'Updated Project',
            description: 'Updated description',
            visibility: 'private',
            cloud_provider: 'Azure',
            estimated_cost: 1200.00,
            availability: 80.0,
            durability: 85.0,
            like_count: 20,
            blob_url: 'https://updatedurl.com',
            last_modified: expect.any(String)
        });
        expect(ProjectController.updateProject).toHaveBeenCalledTimes(1);
    });

    // Test for DELETE /projects/:user_id/:project_id
    test('DELETE /projects/:user_id/:project_id calls deleteProject', async () => {
        ProjectController.deleteProject.mockImplementation((req, res) => res.status(200).json({ message: 'Project deleted' }));

        const response = await request(app).delete('/projects/u1/p1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Project deleted' });
        expect(ProjectController.deleteProject).toHaveBeenCalledTimes(1);
    });
});
