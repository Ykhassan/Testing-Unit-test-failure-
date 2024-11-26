import express from 'express';
import CommentController from '../controllers/CommentController.js';

const router = express.Router();

router.post('/:project_id', CommentController.createComment);
router.get('/:project_id', CommentController.getAllProjectComments);
router.get('/:project_id/:comment_id', CommentController.getCommentById);
router.put('/:project_id/:comment_id', CommentController.updateComment);
router.delete('/:project_id/:comment_id', CommentController.deleteComment);

export default router;