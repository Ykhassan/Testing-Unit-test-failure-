import IssueController from "../../controllers/IssueController";
import { Issue, IssueIssues, Comment, Reply, IssueComments } from '../../models/index.js';

jest.mock('../../models/index.js', () => ({
    Issue: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn()
    },
    Comment: {
        create: jest.fn(),
        findAll: jest.fn(),
        findByPk: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn()
    },
    Reply: {
        findOne: jest.fn(),
        create: jest.fn()
    },
    IssueComments: {
        create: jest.fn(),
        findOne: jest.fn(),
        findAll: jest.fn()
    }
}));

describe('IssueController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test creating a Issue
    test('createIssue - success', async () => {
        const mockReq = { params: { project_id: 1 }, body: { user_id: 'u1', title: 'issue regarding...', description: 'new issue' } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        const mockIssue = { issue_id: 1, project_id: 1, user_id: 'u1', title: 'issue regarding...', description: 'new issue', status: 'open' };
        Issue.create.mockResolvedValue(mockIssue);

        await IssueController.createIssue(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(mockIssue);
    })

    test('createIssue - error', async () => {
        const mockReq = { params: { project_id: 1 }, body: { user_id: 'u1', title: 'issue regarding...', description: 'new issue' } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Issue.create.mockRejectedValue(new Error('Creating failed'));

        await IssueController.createIssue(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error creating issue", error: 'Creating failed' });
    })

    // Test getting all Issues
    test('getAllProjectIssues - success', async () => {
        const mockReq = { params: {project_id: 1} };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Issue.findAll.mockResolvedValue([{ issue_id: 1, project_id: 1, user_id: 'u1', title: 'issue regarding...', description: 'new issue', status: 'open' }]);

        await IssueController.getAllProjectIssues(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith([{ issue_id: 1, project_id: 1, user_id: 'u1', title: 'issue regarding...', description: 'new issue', status: 'open' }]);
    })

    test('getAllProjectIssues - error', async () => {
        const mockReq = { params: {project_id: 1} };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Issue.findAll.mockRejectedValue(new Error('Fetching failed'));

        await IssueController.getAllProjectIssues(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error fetching issues", error: 'Fetching failed' });
    })

    // Test getting a Issue by id
    test('getIssueById - success', async () => {
        const mockReq = { params: {project_id: 1, issue_id: 1}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Issue.findByPk.mockResolvedValue({ issue_id: 1, project_id: 1, user_id: 'u1', title: 'issue regarding...', description: 'new issue', status: 'open' });

        await IssueController.getIssueById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ issue_id: 1, project_id: 1, user_id: 'u1', title: 'issue regarding...', description: 'new issue', status: 'open' });
    })

    test('getIssueById - not found', async () => {
        const mockReq = { params: {project_id: 1, issue_id: 999}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Issue.findByPk.mockResolvedValue(null);

        await IssueController.getIssueById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({message: 'Issue not found'});
    })

    test('getIssueById - error', async () => {
        const mockReq = { params: {project_id: 1, issue_id: 1} };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Issue.findByPk.mockRejectedValue(new Error('Fetching failed'));

        await IssueController.getIssueById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error fetching issue", error: 'Fetching failed' });
    })

    // Test update a Issue by id
    test('updateIssue content - success', async () => {
        const mockReq = { params: {project_id: 1, issue_id: 1}, body: {description: 'updated'}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Issue.update.mockResolvedValue([1]);
        Issue.findByPk.mockResolvedValue({ issue_id: 1, project_id: 1, user_id: 'u1', title: 'issue regarding...', description: 'updated', status: 'open' })

        await IssueController.updateIssue(mockReq, mockRes);

        // [NOTE] should we return the updated object??
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ issue_id: 1, project_id: 1, user_id: 'u1', title: 'issue regarding...', description: 'updated', status: 'open' });
    })

    test('updateIssue - not found', async () => {
        const mockReq = { params: {project_id: 1, issue_id: 999}, body: {description: 'updated'}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Issue.update.mockResolvedValue([0]);

        await IssueController.updateIssue(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Issue not found" });
    })

    test('updateIssue close status - success', async () => {
        const mockReq = { params: {project_id: 1, issue_id: 1}, body: {status: 'closed'}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Issue.update.mockResolvedValue([1]);
        Issue.findByPk.mockResolvedValue({ issue_id: 1, project_id: 1, user_id: 'u1', title: 'issue regarding...', description: 'updated', status: 'closed', closed_at: '2025-01-20T08:04:27.107Z' })

        await IssueController.updateIssue(mockReq, mockRes);

        // [NOTE] should we return the updated object??
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ issue_id: 1, project_id: 1, user_id: 'u1', title: 'issue regarding...', description: 'updated', status: 'closed', closed_at: '2025-01-20T08:04:27.107Z' });
    })

    test('updateIssue - error', async () => {
        const mockReq = { params: {project_id: 1, issue_id: 1}, body: {}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Issue.update.mockRejectedValue(new Error('Updating failed'));

        await IssueController.updateIssue(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error updating issue", error: 'Updating failed' });
    })

    // Test deleting a Issue by id
    test('deleteIssue - success', async () => {
        const mockReq = { params: {project_id: 1, issue_id: 1}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Issue.destroy.mockResolvedValue(1);

        await IssueController.deleteIssue(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(204);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Issue deleted" });
    })

    test('deleteIssue - not found', async () => {
        const mockReq = { params: {project_id: 1, issue_id: 999}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Issue.destroy.mockResolvedValue(0);

        await IssueController.deleteIssue(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Issue not found" });
    })

    test('deleteIssue - error', async () => {
        const mockReq = { params: {project_id: 1, issue_id: 999} };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Issue.destroy.mockRejectedValue(new Error('Deleting failed'));

        await IssueController.deleteIssue(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error deleting issue", error: 'Deleting failed' });
    })

    // Test creating a comment on an Issue
    test('createIssueComment - success', async () => {
        const mockReq = { params: { project_id: 1, issue_id: 1 }, body: { user_id: 'u1', content: 'test comment', parent_comment_id: 0 } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        const mockComment = { comment_id: 1, content: 'test comment', up_votes: 0, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' };
        Comment.create.mockResolvedValue(mockComment);
        IssueComments.create.mockResolvedValue({ issue_id: 1 ,comment_id: 1 });

        await IssueController.createIssueComment(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({ comment: mockComment, parent_comment: undefined });
    })

    test('createIssueComment reply - success', async () => {
        const mockReq = { params: { project_id: 1, issue_id: 1 }, body: { user_id: 'u1', content: 'reply to 1', parent_comment_id: 1 } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        const mockComment = { comment_id: 2, content: 'reply to 1', up_votes: 0, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' };
        const mockParentComment = { comment_id: 1, content: 'test comment', up_votes: 0, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' };
        Comment.create.mockResolvedValue(mockComment);
        IssueComments.create.mockResolvedValue({ issue_id: 1 ,comment_id: 2 });
        Reply.create.mockResolvedValue({ comment_id: 2, parent_comment_id: 1 });
        Comment.findByPk.mockResolvedValue(mockParentComment);

        await IssueController.createIssueComment(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({ comment: mockComment, parent_comment: mockParentComment });
    })

    test('createIssueComment - error', async () => {
        const mockReq = { params: { project_id: 1, issue_id: 1 }, body: { user_id: 'u1', content: 'reply to 1', parent_comment_id: 1 } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Comment.create.mockRejectedValue(new Error('Creating failed'));

        await IssueController.createIssueComment(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error creating comment for selected issue", error: 'Creating failed' });
    })

    // Test getting all Issue comments
    test('getAllIssueComments - success', async () => {
        const mockReq = { params: { project_id: 1, issue_id: 1 } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        IssueComments.findAll.mockResolvedValue([{ user_id: 'u1', comment_id: 1, content: 'test content', up_votes: 0, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' }]);

        await IssueController.getAllIssueComments(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith([{ user_id: 'u1', comment_id: 1, content: 'test content', up_votes: 0, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' }]);
    })

    test('getAllIssueComments - error', async () => {
        const mockReq = { params: { project_id: 1, issue_id: 1 } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        IssueComments.findAll.mockRejectedValue(new Error('Fetching failed'));

        await IssueController.getAllIssueComments(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error fetching all comments for selected issue", error: 'Fetching failed' });
    })

    // Test update an issue Comment by id
    test('updateIssueComment content - success', async () => {
        const mockReq = { params: {project_id: 1, issue_id: 1, comment_id: 1}, query: {}, body: {content: 'updated content'}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Comment.findByPk.mockResolvedValue({ comment_id: 1, content: 'test content', up_votes: 0, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' });
        Comment.update.mockResolvedValue([1]);
        Comment.findByPk.mockResolvedValue({ comment_id: 1, content: 'updated content', up_votes: 0, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' })

        await IssueController.updateIssueComment(mockReq, mockRes);

        // [NOTE] should we return the updated object??
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ comment_id: 1, content: 'updated content', up_votes: 0, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' });
    })

    test('updateIssueComment - not found', async () => {
        const mockReq = { params: {project_id: 1, issue_id: 1, comment_id: 999}, query: {}, body: {content: 'updated content'}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Comment.findByPk.mockResolvedValue(null);

        await IssueController.updateIssueComment(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Comment not found" });
    })

    test('updateIssueComment up_vote - success', async () => {
        const mockReq = { params: {project_id: 1, issue_id: 1, comment_id: 1}, query: {actions: 'up_vote'}, body: {}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Comment.findByPk.mockResolvedValue({ comment_id: 1, content: 'test content', up_votes: 0, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' });
        Comment.update.mockResolvedValue([1]);
        Comment.findByPk.mockResolvedValue({ comment_id: 1, content: 'test content', up_votes: 1, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' })

        await IssueController.updateIssueComment(mockReq, mockRes);

        // [NOTE] should we return the updated object??
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ comment_id: 1, content: 'test content', up_votes: 1, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' });
    })

    test('updateIssueComment remove_up_vote - success', async () => {
        const mockReq = { params: {project_id: 1, issue_id: 1, comment_id: 1}, query: {actions: 'remove_up_vote'}, body: {}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Comment.findByPk.mockResolvedValue({ comment_id: 1, content: 'test content', up_votes: 1, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' });
        Comment.update.mockResolvedValue([1]);
        Comment.findByPk.mockResolvedValue({ comment_id: 1, content: 'test content', up_votes: 0, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' })

        await IssueController.updateIssueComment(mockReq, mockRes);

        // [NOTE] should we return the updated object??
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ comment_id: 1, content: 'test content', up_votes: 0, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' });
    })

    test('updateIssueComment down_vote - success', async () => {
        const mockReq = { params: {project_id: 1, issue_id: 1, comment_id: 1}, query: {actions: 'down_vote'}, body: {}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Comment.findByPk.mockResolvedValue({ comment_id: 1, content: 'test content', up_votes: 0, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' });
        Comment.update.mockResolvedValue([1]);
        Comment.findByPk.mockResolvedValue({ comment_id: 1, content: 'test content', up_votes: 0, down_votes: 1, last_modified: '2023-10-02T14:23:45Z' })

        await IssueController.updateIssueComment(mockReq, mockRes);

        // [NOTE] should we return the updated object??
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ comment_id: 1, content: 'test content', up_votes: 0, down_votes: 1, last_modified: '2023-10-02T14:23:45Z' });
    })

    test('updateIssueComment remove_down_vote - success', async () => {
        const mockReq = { params: {project_id: 1, issue_id: 1, comment_id: 1}, query: {actions: 'remove_down_vote'}, body: {}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Comment.findByPk.mockResolvedValue({ comment_id: 1, content: 'test content', up_votes: 0, down_votes: 1, last_modified: '2023-10-02T14:23:45Z' });
        Comment.update.mockResolvedValue([1]);
        Comment.findByPk.mockResolvedValue({ comment_id: 1, content: 'test content', up_votes: 0, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' })

        await IssueController.updateIssueComment(mockReq, mockRes);

        // [NOTE] should we return the updated object??
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ comment_id: 1, content: 'test content', up_votes: 0, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' });
    })

    test('updateIssueComment - error', async () => {
        const mockReq = { params: {project_id: 1, issue_id: 1, comment_id: 1}, query: {}, body: {}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Comment.findByPk.mockResolvedValue({ comment_id: 1, content: 'test content', up_votes: 0, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' });
        Comment.update.mockRejectedValue(new Error('Updating failed'));

        await IssueController.updateIssueComment(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error updating comment", error: 'Updating failed' });
    })

    // Test deleting an issue Comment by id
    test('deleteIssueComment - success', async () => {
        const mockReq = { params: {project_id: 1, issue_id: 1, comment_id: 1}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Comment.destroy.mockResolvedValue(1);

        await IssueController.deleteIssueComment(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(204);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Comment deleted" });
    })

    test('deleteIssueComment - not found', async () => {
        const mockReq = { params: {project_id: 1, issue_id: 1, comment_id: 999}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Comment.destroy.mockResolvedValue(0);

        await IssueController.deleteIssueComment(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Comment not found" });
    })

    test('deleteIssueComment - error', async () => {
        const mockReq = { params: {project_id: 1, issue_id: 1, comment_id: 999} };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Comment.destroy.mockRejectedValue(new Error('Deleting failed'));

        await IssueController.deleteIssueComment(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error deleting comment for selected issue", error: 'Deleting failed' });
    })
});
