import FileController from "../../controllers/FileController";
import { Project } from '../../models/index.js';

jest.mock('../../models/index.js');

describe('FileController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test creating a File
    test('createFile - success', async () => {
        const mockReq = { params: { project_id: 1 }, body: { file_name: 'test file.tf', content: "resource \"aws_instance\"" } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Project.findOne.mockResolvedValue({ dataValues: { blob_url: 'test.com' } });

        await FileController.createFile(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockReq.body); // [NOTE] should check what the accurate return
    })

    test('createFile - Project not found', async () => {
        const mockReq = { params: { project_id: 1 }, body: { file_name: 'test file.tf', content: "resource \"aws_instance\"" } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Project.findOne.mockResolvedValue(null);

        await FileController.createFile(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({message: 'Project not found'});
    })

    test('createFile - error', async () => {
        const mockReq = { params: { project_id: 1 }, body: { file_name: 'test file.tf', content: "resource \"aws_instance\"" } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        // [NOTE] the error can come from something else
        Project.findOne.mockRejectedValue(new Error('Creating failed'));

        await FileController.createFile(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error creating file", error: 'Creating failed' });
    })

    // Test getting all Files
    test('getAllProjectFiles - success', async () => {
        const mockReq = { params: { project_id: 1 } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Project.findOne.mockResolvedValue({ dataValues: { blob_url: 'test.com' } });

        await FileController.getAllProjectFiles(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith([{file: "main.tf"}]); // [NOTE] should check what the accurate return
    })

    test('getAllProjectFiles - Project not found', async () => {
        const mockReq = { params: { project_id: 1 } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Project.findOne.mockResolvedValue(null);

        await FileController.getAllProjectFiles(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({message: 'Project not found'});
    })

    test('getAllProjectFiles - error', async () => {
        const mockReq = { params: { project_id: 1 } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        // [NOTE] the error can come from something else
        Project.findOne.mockRejectedValue(new Error('Fetching failed'));

        await FileController.getAllProjectFiles(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error fetching all project files", error: 'Fetching failed' });
    })

    // Test getting a File by id
    test('getFileById - success', async () => {
        const mockReq = { params: { project_id: 1, file_id: 1 } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Project.findOne.mockResolvedValue({ dataValues: { blob_url: 'test.com' } });

        await FileController.getFileById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith([{file: mockReq.params.file_id}]);
    })

    test('getFileById - Project not found', async () => {
        const mockReq = { params: { project_id: 1, file_id: 1 } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Project.findOne.mockResolvedValue(null);

        await FileController.getFileById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({message: 'Project not found'});
    })

    test('getFileById - error', async () => {
        const mockReq = { params: {project_id: 1, file_id: 1} };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        // [NOTE] the error can come from something else
        Project.findOne.mockRejectedValue(new Error('Fetching failed'));

        await FileController.getFileById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error fetching file by ID", error: 'Fetching failed' });
    })

    // Test update a File by id
    test('updateFile - success', async () => {
        const mockReq = { params: { project_id: 1, file_id: 1 } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Project.findOne.mockResolvedValue({ dataValues: { blob_url: 'test.com' } });

        await FileController.updateFile(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({message:'File update'});
    })

    test('updateFile - Project not found', async () => {
        const mockReq = { params: { project_id: 1, file_id: 1 } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Project.findOne.mockResolvedValue(null);

        await FileController.updateFile(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({message: 'Project not found'});
    })

    test('updateFile - error', async () => {
        const mockReq = { params: { project_id: 1, file_id: 1 } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        // [NOTE] the error can come from something else
        Project.findOne.mockRejectedValue(new Error('Updating failed'));

        await FileController.updateFile(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error updating file", error: 'Updating failed' });
    })

    // Test deleting a File by id
    test('deleteFile - success', async () => {
        const mockReq = { params: { project_id: 1, file_id: 1 } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Project.findOne.mockResolvedValue({ dataValues: { blob_url: 'test.com' } });

        await FileController.deleteFile(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(204);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "File deleted" });
    })

    test('deleteFile - Project not found', async () => {
        const mockReq = { params: { project_id: 1, file_id: 1 } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Project.findOne.mockResolvedValue(null);

        await FileController.deleteFile(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Project not found" });
    })

    test('deleteFile - error', async () => {
        const mockReq = { params: { project_id: 1, file_id: 1 } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        // [NOTE] the error can come from something else
        Project.findOne.mockRejectedValue(new Error('Deleting failed'));

        await FileController.deleteFile(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error deleting file", error: 'Deleting failed' });
    })
});

