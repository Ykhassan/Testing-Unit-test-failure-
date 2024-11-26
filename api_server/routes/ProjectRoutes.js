import express from 'express';
import ProjectController from '../controllers/ProjectController.js';

const router = express.Router();

router.post('/:user_id', ProjectController.createProject);
router.get('/:user_id', ProjectController.getAllUserProjects);
router.get('/:user_id/:project_id', ProjectController.getProjectById);
router.put('/:user_id/:project_id', ProjectController.updateProject);
router.delete('/:user_id/:project_id', ProjectController.deleteProject);

export default router;
