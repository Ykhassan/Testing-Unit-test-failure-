import CommentController from "../../controllers/CommentController";
import { Comment, ProjectComments, Reply } from '../../models/index.js';

jest.mock('../../models/index.js', () => ({
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
    ProjectComments: {
        create: jest.fn(),
        findOne: jest.fn(),
        findAll: jest.fn()
    }
}));

describe('CommentController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test creating a Comment
    test('createComment - success', async () => {
        const mockReq = { params: { project_id: 1 }, body: { user_id: 'u1', content: 'test content', parent_comment_id: 0 } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        const mockComment = { comment_id: 1, content: 'test content', up_votes: 0, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' };
        Comment.create.mockResolvedValue(mockComment);
        ProjectComments.create.mockResolvedValue({ project_id: 1 ,comment_id: 1 });

        await CommentController.createComment(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({ comment: mockComment, parent_comment: undefined });
    })

    test('createComment reply - success', async () => {
        const mockReq = { params: { project_id: 1 }, body: { user_id: 'u2', content: 'reply to 1', parent_comment_id: 1 } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        const mockComment = { comment_id: 2, content: 'reply to 1', up_votes: 0, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' };
        const mockParentComment = { comment_id: 1, content: 'test content', up_votes: 0, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' };
        Comment.create.mockResolvedValue(mockComment);
        ProjectComments.create.mockResolvedValue({ project_id: 1 ,comment_id: 2 });
        Reply.create.mockResolvedValue({ comment_id: 2, parent_comment_id: 1 });
        Comment.findByPk.mockResolvedValue(mockParentComment);

        await CommentController.createComment(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({ comment: mockComment, parent_comment: mockParentComment });
    })

    test('createComment - error', async () => {
        const mockReq = { params: { project_id: 1 }, body: { user_id: 'u1', content: 'test content', parent_comment_id: 0 } };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Comment.create.mockRejectedValue(new Error('Creating failed'));

        await CommentController.createComment(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error creating comment", error: 'Creating failed' });
    })

    // Test getting all Comments
    test('getAllProjectComments - success', async () => {
        const mockReq = { params: {project_id: 1} };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        ProjectComments.findAll.mockResolvedValue([{ user_id: 'u1', comment_id: 1, content: 'test content', up_votes: 0, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' }]);

        await CommentController.getAllProjectComments(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith([{ user_id: 'u1', comment_id: 1, content: 'test content', up_votes: 0, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' }]);
    })

    test('getAllProjectComments - error', async () => {
        const mockReq = { params: {project_id: 1} };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        ProjectComments.findAll.mockRejectedValue(new Error('Fetching failed'));

        await CommentController.getAllProjectComments(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error fetching comments", error: 'Fetching failed' });
    })

    // Test getting a Comment by id
    test('getCommentById - success', async () => {
        const mockReq = { params: {project_id: 1, comment_id: 1}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Comment.findByPk.mockResolvedValue({ comment_id: 1, content: 'test content', up_votes: 0, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' });

        await CommentController.getCommentById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ comment_id: 1, content: 'test content', up_votes: 0, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' });
    })

    test('getCommentById - not found', async () => {
        const mockReq = { params: {project_id: 1, comment_id: 999}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Comment.findByPk.mockResolvedValue(null);

        await CommentController.getCommentById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({message: 'Comment not found'});
    })

    test('getCommentById - error', async () => {
        const mockReq = { params: {project_id: 1, comment_id: 1} };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Comment.findByPk.mockRejectedValue(new Error('Fetching failed'));

        await CommentController.getCommentById(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error fetching comment", error: 'Fetching failed' });
    })

    // Test update a Comment by id
    test('updateComment content - success', async () => {
        const mockReq = { params: {project_id: 1, comment_id: 1}, query: {}, body: {content: 'updated content'}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Comment.findByPk.mockResolvedValue({ comment_id: 1, content: 'test content', up_votes: 0, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' });
        Comment.update.mockResolvedValue([1]);
        Comment.findByPk.mockResolvedValue({ comment_id: 1, content: 'updated content', up_votes: 0, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' })

        await CommentController.updateComment(mockReq, mockRes);

        // [NOTE] should we return the updated object??
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ comment_id: 1, content: 'updated content', up_votes: 0, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' });
    })

    test('updateComment - not found', async () => {
        const mockReq = { params: {project_id: 1, comment_id: 999}, query: {}, body: {content: 'updated content'}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Comment.findByPk.mockResolvedValue(null);

        await CommentController.updateComment(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Comment not found" });
    })

    test('updateComment up_vote - success', async () => {
        const mockReq = { params: {project_id: 1, comment_id: 1}, query: {actions: 'up_vote'}, body: {}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Comment.findByPk.mockResolvedValue({ comment_id: 1, content: 'test content', up_votes: 0, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' });
        Comment.update.mockResolvedValue([1]);
        Comment.findByPk.mockResolvedValue({ comment_id: 1, content: 'test content', up_votes: 1, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' })

        await CommentController.updateComment(mockReq, mockRes);

        // [NOTE] should we return the updated object??
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ comment_id: 1, content: 'test content', up_votes: 1, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' });
    })

    test('updateComment remove_up_vote - success', async () => {
        const mockReq = { params: {project_id: 1, comment_id: 1}, query: {actions: 'remove_up_vote'}, body: {}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Comment.findByPk.mockResolvedValue({ comment_id: 1, content: 'test content', up_votes: 1, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' });
        Comment.update.mockResolvedValue([1]);
        Comment.findByPk.mockResolvedValue({ comment_id: 1, content: 'test content', up_votes: 0, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' })

        await CommentController.updateComment(mockReq, mockRes);

        // [NOTE] should we return the updated object??
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ comment_id: 1, content: 'test content', up_votes: 0, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' });
    })

    test('updateComment down_vote - success', async () => {
        const mockReq = { params: {project_id: 1, comment_id: 1}, query: {actions: 'down_vote'}, body: {}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Comment.findByPk.mockResolvedValue({ comment_id: 1, content: 'test content', up_votes: 0, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' });
        Comment.update.mockResolvedValue([1]);
        Comment.findByPk.mockResolvedValue({ comment_id: 1, content: 'test content', up_votes: 0, down_votes: 1, last_modified: '2023-10-02T14:23:45Z' })

        await CommentController.updateComment(mockReq, mockRes);

        // [NOTE] should we return the updated object??
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ comment_id: 1, content: 'test content', up_votes: 0, down_votes: 1, last_modified: '2023-10-02T14:23:45Z' });
    })

    test('updateComment remove_down_vote - success', async () => {
        const mockReq = { params: {project_id: 1, comment_id: 1}, query: {actions: 'remove_down_vote'}, body: {}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Comment.findByPk.mockResolvedValue({ comment_id: 1, content: 'test content', up_votes: 0, down_votes: 1, last_modified: '2023-10-02T14:23:45Z' });
        Comment.update.mockResolvedValue([1]);
        Comment.findByPk.mockResolvedValue({ comment_id: 1, content: 'test content', up_votes: 0, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' })

        await CommentController.updateComment(mockReq, mockRes);

        // [NOTE] should we return the updated object??
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ comment_id: 1, content: 'test content', up_votes: 0, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' });
    })

    test('updateComment - error', async () => {
        const mockReq = { params: {project_id: 1, comment_id: 1}, query: {}, body: {}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Comment.findByPk.mockResolvedValue({ comment_id: 1, content: 'test content', up_votes: 0, down_votes: 0, last_modified: '2023-10-02T14:23:45Z' });
        Comment.update.mockRejectedValue(new Error('Updating failed'));

        await CommentController.updateComment(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error updating comment", error: 'Updating failed' });
    })

    // Test deleting a Comment by id
    test('deleteComment - success', async () => {
        const mockReq = { params: {project_id: 1, comment_id: 1}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Comment.destroy.mockResolvedValue(1);

        await CommentController.deleteComment(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(204);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Comment deleted" });
    })

    test('deleteComment - not found', async () => {
        const mockReq = { params: {project_id: 1, comment_id: 999}};
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Comment.destroy.mockResolvedValue(0);

        await CommentController.deleteComment(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Comment not found" });
    })

    test('deleteComment - error', async () => {
        const mockReq = { params: {project_id: 1, comment_id: 999} };
        const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        Comment.destroy.mockRejectedValue(new Error('Deleting failed'));

        await CommentController.deleteComment(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Error deleting comment", error: 'Deleting failed' });
    })
});
