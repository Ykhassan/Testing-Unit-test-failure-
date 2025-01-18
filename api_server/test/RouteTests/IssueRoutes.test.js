import request from 'supertest';
import express from 'express';
import router from '../../routes/IssueRoutes';
import IssueController from '../../controllers/IssueController';

jest.mock('../../controllers/IssueController');

const app = express();
app.use(express.json());
app.use('/issues', router);

describe('IssueRoutes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test for POST /issues/:project_id
    test('POST /issues/:project_id calls createIssue', async () => {
        IssueController.createIssue.mockImplementation((req, res) => res.status(200).json({
            issue_id: 'i1',
            project_id: req.params.project_id,
            user_id: req.body.user_id,
            title: req.body.title,
            description: req.body.description,
            status: 'open',
            closed_at: null
        }));

        const response = await request(app)
            .post('/issues/p1')
            .send({
                user_id: 'u1',
                title: 'Issue with deployment',
                description: 'There is an issue with the deployment pipeline.'
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            issue_id: 'i1',
            project_id: 'p1',
            user_id: 'u1',
            title: 'Issue with deployment',
            description: 'There is an issue with the deployment pipeline.',
            status: 'open',
            closed_at: null
        });
        expect(IssueController.createIssue).toHaveBeenCalledTimes(1);
    });

    // Test for GET /issues/:project_id
    test('GET /issues/:project_id calls getAllProjectIssues', async () => {
        IssueController.getAllProjectIssues.mockImplementation((req, res) => res.status(200).json([{
            issue_id: 'i1',
            project_id: 'p1',
            user_id: 'u1',
            title: 'Issue with deployment',
            description: 'There is an issue with the deployment pipeline.',
            status: 'open',
            closed_at: null
        }]));

        const response = await request(app).get('/issues/p1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{
            issue_id: 'i1',
            project_id: 'p1',
            user_id: 'u1',
            title: 'Issue with deployment',
            description: 'There is an issue with the deployment pipeline.',
            status: 'open',
            closed_at: null
        }]);
        expect(IssueController.getAllProjectIssues).toHaveBeenCalledTimes(1);
    });

    // Test for GET /issues/:project_id/:issue_id
    test('GET /issues/:project_id/:issue_id calls getIssueById', async () => {
        IssueController.getIssueById.mockImplementation((req, res) => res.status(200).json({
            issue_id: req.params.issue_id,
            project_id: req.params.project_id,
            user_id: 'u1',
            title: 'Issue with deployment',
            description: 'There is an issue with the deployment pipeline.',
            status: 'open',
            closed_at: null
        }));

        const response = await request(app).get('/issues/p1/i1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            issue_id: 'i1',
            project_id: 'p1',
            user_id: 'u1',
            title: 'Issue with deployment',
            description: 'There is an issue with the deployment pipeline.',
            status: 'open',
            closed_at: null
        });
        expect(IssueController.getIssueById).toHaveBeenCalledTimes(1);
    });

    // Test for PUT /issues/:project_id/:issue_id
    test('PUT /issues/:project_id/:issue_id calls updateIssue', async () => {
        IssueController.updateIssue.mockImplementation((req, res) => res.status(200).json({
            message: 'Issue updated'
        }));

        const response = await request(app)
            .put('/issues/p1/i1')
            .send({
                title: 'Updated issue title',
                description: 'Updated description for the deployment issue.'
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: 'Issue updated'
        });
        expect(IssueController.updateIssue).toHaveBeenCalledTimes(1);
    });

    // Test for DELETE /issues/:project_id/:issue_id
    test('DELETE /issues/:project_id/:issue_id calls deleteIssue', async () => {
        IssueController.deleteIssue.mockImplementation((req, res) => res.status(200).json({ message: 'Issue deleted' }));

        const response = await request(app).delete('/issues/p1/i1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Issue deleted' });
        expect(IssueController.deleteIssue).toHaveBeenCalledTimes(1);
    });

    // Test for POST /issues/:project_id/:issue_id/comments
    test('POST /issues/:project_id/:issue_id/comments calls createIssueComment', async () => {
        IssueController.createIssueComment.mockImplementation((req, res) => res.status(200).json({
            comment_id: 'c1',
            issue_id: req.params.issue_id,
            user_id: req.body.user_id,
            comment: req.body.comment,
            created_at: '2025-01-17T14:48:00.000Z'
        }));

        const response = await request(app)
            .post('/issues/p1/i1/comments')
            .send({
                user_id: 'u1',
                comment: 'This is a comment on the issue.'
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            comment_id: 'c1',
            issue_id: 'i1',
            user_id: 'u1',
            comment: 'This is a comment on the issue.',
            created_at: expect.any(String)
        });
        expect(IssueController.createIssueComment).toHaveBeenCalledTimes(1);
    });

    // Test for GET /issues/:project_id/:issue_id/comments
    test('GET /issues/:project_id/:issue_id/comments calls getAllIssueComments', async () => {
        IssueController.getAllIssueComments.mockImplementation((req, res) => res.status(200).json([{
            comment_id: 'c1',
            issue_id: 'i1',
            user_id: 'u1',
            comment: 'This is a comment on the issue.',
            created_at: '2025-01-17T14:48:00.000Z'
        }]));

        const response = await request(app).get('/issues/p1/i1/comments');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{
            comment_id: 'c1',
            issue_id: 'i1',
            user_id: 'u1',
            comment: 'This is a comment on the issue.',
            created_at: expect.any(String)
        }]);
        expect(IssueController.getAllIssueComments).toHaveBeenCalledTimes(1);
    });

    // Test for PUT /issues/:project_id/:issue_id/comments/:comment_id
    test('PUT /issues/:project_id/:issue_id/comments/:comment_id calls updateIssueComment', async () => {
        IssueController.updateIssueComment.mockImplementation((req, res) => res.status(200).json({
            message: 'Comment updated'
        }));

        const response = await request(app)
            .put('/issues/p1/i1/comments/c1')
            .send({
                comment: 'Updated comment text.'
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: 'Comment updated'
        });
        expect(IssueController.updateIssueComment).toHaveBeenCalledTimes(1);
    });

    // Test for DELETE /issues/:project_id/:issue_id/comments/:comment_id
    test('DELETE /issues/:project_id/:issue_id/comments/:comment_id calls deleteIssueComment', async () => {
        IssueController.deleteIssueComment.mockImplementation((req, res) => res.status(200).json({
            message: 'Comment deleted'
        }));

        const response = await request(app).delete('/issues/p1/i1/comments/c1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: 'Comment deleted'
        });
        expect(IssueController.deleteIssueComment).toHaveBeenCalledTimes(1);
    });
});
