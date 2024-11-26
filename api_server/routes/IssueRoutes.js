import express from 'express';
import IssueController from '../controllers/IssueController.js';

const router = express.Router();

router.post('/:project_id', IssueController.createIssue);
router.get('/:project_id', IssueController.getAllProjectIssues);
router.get('/:project_id/:issue_id', IssueController.getIssueById);
router.put('/:project_id/:issue_id', IssueController.updateIssue);
router.delete('/:project_id/:issue_id', IssueController.deleteIssue)

router.post('/:project_id/:issue_id/comments', IssueController.createIssueComment);
router.get('/:project_id/:issue_id/comments', IssueController.getAllIssueComments);
router.put('/:project_id/:issue_id/comments/:comment_id', IssueController.updateIssueComment);
router.delete('/:project_id/:issue_id/comments/:comment_id', IssueController.deleteIssueComment);

export default router;
