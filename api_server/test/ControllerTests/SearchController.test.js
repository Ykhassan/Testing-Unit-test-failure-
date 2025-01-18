import SearchController from "../../controllers/SearchController";
import { Project, User } from '../../models/index.js';

jest.mock('../../models/index.js', () => ({
    Project: {
        findAll: jest.fn()
    },
    User: {
        findAll: jest.fn()
    },
}));

describe('SearchController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test searching Projects
    test('searchProjects - success', async () => {
        const mockReq = { query: { q: 'web app' } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        const mockProject = {
            name: 'test', description: 'test proj', visibility: 'public', cloud_provider: 'AWS',
            project_id: 'p1', user_id: 'u1',
            estimated_cost: 1000.00, availability: 99.0, durability: 90.0,
            like_count: 10,
            blob_url: 'https://someurl.com',
            last_modified: "2025-01-17T14:48:00.000Z"
        }

        Project.findAll.mockResolvedValue([mockProject, mockProject]);

        await SearchController.searchProjects(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith([mockProject, mockProject]);
    })

    test('searchProjects - Missing search query', async () => {
        const mockReq = { query: {} };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await SearchController.searchProjects(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Missing search query" });
    })

    test('searchProjects - error', async () => {
        const mockReq = { query: { q: 'web app' } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Project.findAll.mockRejectedValue(new Error('Fetching failed'));

        await SearchController.searchProjects(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error searching projects", error: 'Fetching failed' });
    })

    // Test searching Users
    test('searchUsers - success', async () => {
        const mockReq = { query: { q: 'testuser' } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        const mockUser = {
            user_id: "u2",
            username: "testuser",
            fullname: "John Doe",
            email: "johndoe@example.com",
            profile_img_url: "http://example.com/profile.jpg",
            bio: "Software developer with 10 years of experience.",
            createdAt: "2023-10-01T12:34:56Z",
            updatedAt: "2023-10-01T12:34:56Z"
        }

        User.findAll.mockResolvedValue([mockUser, mockUser]);

        await SearchController.searchUsers(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith([mockUser, mockUser]);
    })

    test('searchUsers - Missing search query', async () => {
        const mockReq = { query: { } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await SearchController.searchUsers(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Missing search query" });
    })

    test('searchUsers - error', async () => {
        const mockReq = { query: { q: 'testuser' } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        User.findAll.mockRejectedValue(new Error('Fetching failed'));

        await SearchController.searchUsers(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error searching users", error: 'Fetching failed' });
    })
});
