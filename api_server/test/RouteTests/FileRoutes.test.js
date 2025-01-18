import request from 'supertest';
import express from 'express';
import router from '../../routes/FileRoutes';  // Import your routes
import FileController from '../../controllers/FileController';  // Import your controller

jest.mock('../../controllers/FileController');  // Mock the controller methods

const app = express();
app.use(express.json());
app.use('/files', router);  // Use the router in the app

describe('FileRoutes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test for POST /files/:project_id
    test('POST /files/:project_id calls createFile', async () => {
        FileController.createFile.mockImplementation((req, res) => res.status(200).json({
            file_id: 'f1',
            project_id: req.params.project_id,
            file_name: req.body.file_name,
            content: req.body.content,
            created_at: "2025-01-17T14:48:00.000Z"
        }));

        const response = await request(app)
            .post('/files/p1')  // Using p1 as project_id
            .send({
                file_name: 'new_file.tf',
                content: 'resource "aws_instance" "example" {...}'
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            file_id: 'f1',
            project_id: 'p1',  // project_id is p1
            file_name: 'new_file.tf',
            content: 'resource "aws_instance" "example" {...}',
            created_at: expect.any(String)  // Ensure created_at is a valid date string
        });
        expect(FileController.createFile).toHaveBeenCalledTimes(1);
    });

    // Test for GET /files/:project_id
    test('GET /files/:project_id calls getAllProjectFiles', async () => {
        FileController.getAllProjectFiles.mockImplementation((req, res) => res.status(200).json([{
            file_id: 'f1',
            project_id: 'p1',  // project_id is p1
            file_name: 'main.tf',
            content: 'resource "aws_instance" "example" {...}',
            created_at: "2025-01-17T14:48:00.000Z"
        }]));

        const response = await request(app).get('/files/p1');  // Using p1 as project_id

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{
            file_id: 'f1',
            project_id: 'p1',  // project_id is p1
            file_name: 'main.tf',
            content: 'resource "aws_instance" "example" {...}',
            created_at: expect.any(String)  // Checking if the created_at field is a valid date string
        }]);
        expect(FileController.getAllProjectFiles).toHaveBeenCalledTimes(1);
    });

    // Test for GET /files/:project_id/:file_id
    test('GET /files/:project_id/:file_id calls getFileById', async () => {
        FileController.getFileById.mockImplementation((req, res) => res.status(200).json({
            file_id: req.params.file_id,
            project_id: req.params.project_id,
            file_name: 'main.tf',
            content: 'resource "aws_instance" "example" {...}',
            created_at: "2025-01-17T14:48:00.000Z"
        }));

        const response = await request(app).get('/files/p1/f1');  // Using p1 as project_id and f1 as file_id

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            file_id: 'f1',
            project_id: 'p1',  // project_id is p1
            file_name: 'main.tf',
            content: 'resource "aws_instance" "example" {...}',
            created_at: expect.any(String)  // Checking if the created_at field is a valid date string
        });
        expect(FileController.getFileById).toHaveBeenCalledTimes(1);
    });

    // Test for PUT /files/:project_id/:file_id
    test('PUT /files/:project_id/:file_id calls updateFile', async () => {
        FileController.updateFile.mockImplementation((req, res) => res.status(200).send('File updated'));

        const response = await request(app)
            .put('/files/p1/f1')  // Using p1 as project_id and f1 as file_id
            .send({
                content: 'updated content'
            });

        expect(response.status).toBe(200);
        expect(response.text).toBe('File updated');
        expect(FileController.updateFile).toHaveBeenCalledTimes(1);
    });

    // Test for DELETE /files/:project_id/:file_id
    test('DELETE /files/:project_id/:file_id calls deleteFile', async () => {
        FileController.deleteFile.mockImplementation((req, res) => res.status(200).send('File deleted'));

        const response = await request(app).delete('/files/p1/f1');  // Using p1 as project_id and f1 as file_id

        expect(response.status).toBe(200);
        expect(response.text).toBe('File deleted');
        expect(FileController.deleteFile).toHaveBeenCalledTimes(1);
    });
});
