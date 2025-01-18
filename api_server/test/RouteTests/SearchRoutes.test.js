import request from 'supertest';
import express from 'express';
import router from '../../routes/SearchRoutes';
import SearchController from '../../controllers/SearchController';

jest.mock('../../controllers/SearchController');

const app = express();
app.use(express.json());
app.use('/search', router);

describe('SearchRoutes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test for GET /search/projects
    test('GET /search/projects calls searchProjects', async () => {
        SearchController.searchProjects.mockImplementation((req, res) => res.status(200).json([{
            project_id: 'p1',
            name: 'Project 1',
            description: 'A test project.',
            visibility: 'public',
            cloud_provider: 'AWS',
            estimated_cost: 1000.00,
            availability: 100.0,
            durability: 90.0,
            like_count: 10,
            blob_url: 'https://someurl.com',
            last_modified: "2025-01-17T14:48:00.000Z"
        }]));

        const response = await request(app).get('/search/projects?q=test');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{
            project_id: 'p1',
            name: 'Project 1',
            description: 'A test project.',
            visibility: 'public',
            cloud_provider: 'AWS',
            estimated_cost: 1000.00,
            availability: 100.0,
            durability: 90.0,
            like_count: 10,
            blob_url: 'https://someurl.com',
            last_modified: expect.any(String)
        }]);
        expect(SearchController.searchProjects).toHaveBeenCalledTimes(1);
    });

    // Test for GET /search/projects (missing query)
    test('GET /search/projects returns 400 when search query is missing', async () => {
        SearchController.searchProjects.mockImplementation((req, res) => res.status(400).json({ message: "Missing search query" }));

        const response = await request(app).get('/search/projects');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "Missing search query" });
        expect(SearchController.searchProjects).toHaveBeenCalledTimes(1);
    });

    // Test for GET /search/users
    test('GET /search/users calls searchUsers', async () => {
        SearchController.searchUsers.mockImplementation((req, res) => res.status(200).json([{
            user_id: 'u1',
            username: 'testuser',
            fullname: 'Test User',
            email: 'testuser@example.com'
        }]));

        const response = await request(app).get('/search/users?q=testuser');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{
            user_id: 'u1',
            username: 'testuser',
            fullname: 'Test User',
            email: 'testuser@example.com'
        }]);
        expect(SearchController.searchUsers).toHaveBeenCalledTimes(1);
    });

    // Test for GET /search/users (missing query)
    test('GET /search/users returns 400 when search query is missing', async () => {
        SearchController.searchUsers.mockImplementation((req, res) => res.status(400).json({ message: "Missing search query" }));

        const response = await request(app).get('/search/users');

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "Missing search query" });
        expect(SearchController.searchUsers).toHaveBeenCalledTimes(1);
    });
});
