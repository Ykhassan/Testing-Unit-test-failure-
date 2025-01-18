import request from 'supertest';
import express from 'express';
import router from '../../routes/CommentRoutes';
import CommentController from '../../controllers/CommentController';

jest.mock('../../controllers/CommentController'); // mock the controller methods

const app = express();
app.use(express.json());
app.use('/comments', router);

describe('CommentRoutes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test for POST /comments/:project_id
    test('POST /comments/:project_id calls createComment', async () => {
        CommentController.createComment.mockImplementation((req, res) => res.status(201).json({
            comment_id: 'co1',
            user_id: req.body.user_id,
            content: req.body.content,
            up_votes: 0,
            down_votes: 0,
            last_modified: "2025-01-17T14:48:00.000Z"
        }));

        const response = await request(app)
            .post('/comments/p1')
            .send({
                user_id: 'u1',
                content: 'This is a test comment.'
            });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            comment_id: 'co1',
            user_id: 'u1',
            content: 'This is a test comment.',
            up_votes: 0,
            down_votes: 0,
            last_modified: "2025-01-17T14:48:00.000Z"
        });
        expect(CommentController.createComment).toHaveBeenCalledTimes(1);
    });

    // Test for GET /comments/:project_id
    test('GET /comments/:project_id calls getAllProjectComments', async () => {
        CommentController.getAllProjectComments.mockImplementation((req, res) => res.status(200).json([
            {
                comment_id: 'co1',
                user_id: 'u1',
                content: 'This is a test comment.',
                up_votes: 0,
                down_votes: 0,
                last_modified: "2025-01-17T14:48:00.000Z"
            }
        ]));

        const response = await request(app).get('/comments/p1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            {
                comment_id: 'co1',
                user_id: 'u1',
                content: 'This is a test comment.',
                up_votes: 0,
                down_votes: 0,
                last_modified: "2025-01-17T14:48:00.000Z"
            }
        ]);
        expect(CommentController.getAllProjectComments).toHaveBeenCalledTimes(1);
    });

    // Test for GET /comments/:project_id/:comment_id
    test('GET /comments/:project_id/:comment_id calls getCommentById', async () => {
        CommentController.getCommentById.mockImplementation((req, res) => res.status(200).json({
            comment_id: req.params.comment_id,
            user_id: 'u1',
            content: 'This is a test comment.',
            up_votes: 0,
            down_votes: 0,
            last_modified: "2025-01-17T14:48:00.000Z"
        }));

        const response = await request(app).get('/comments/p1/co1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            comment_id: 'co1',
            user_id: 'u1',
            content: 'This is a test comment.',
            up_votes: 0,
            down_votes: 0,
            last_modified: "2025-01-17T14:48:00.000Z"
        });
        expect(CommentController.getCommentById).toHaveBeenCalledTimes(1);
    });

    // Test for PUT /comments/:project_id/:comment_id
    test('PUT /comments/:project_id/:comment_id calls updateComment', async () => {
        CommentController.updateComment.mockImplementation((req, res) => res.status(200).json({
            comment_id: req.params.comment_id,
            user_id: req.body.user_id,
            content: req.body.content,
            up_votes: req.body.up_votes,
            down_votes: req.body.down_votes,
            last_modified: "2025-01-17T14:48:00.000Z"
        }));

        const response = await request(app)
            .put('/comments/p1/co1')
            .send({
                user_id: 'u1',
                content: 'Updated test comment.',
                up_votes: 1,
                down_votes: 0
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            comment_id: 'co1',
            user_id: 'u1',
            content: 'Updated test comment.',
            up_votes: 1,
            down_votes: 0,
            last_modified: "2025-01-17T14:48:00.000Z"
        });
        expect(CommentController.updateComment).toHaveBeenCalledTimes(1);
    });

    // Test for DELETE /comments/:project_id/:comment_id
    test('DELETE /comments/:project_id/:comment_id calls deleteComment', async () => {
        CommentController.deleteComment.mockImplementation((req, res) => res.status(200).json({ message: 'Comment deleted' }));

        const response = await request(app).delete('/comments/p1/co1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Comment deleted' });
        expect(CommentController.deleteComment).toHaveBeenCalledTimes(1);
    });
});
