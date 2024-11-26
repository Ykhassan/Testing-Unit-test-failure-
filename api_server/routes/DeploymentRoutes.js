import express from 'express';
import DeploymentController from '../controllers/DeploymentController.js';

const router = express.Router();

router.post('/:project_id', DeploymentController.createDeployment);
router.get('/:project_id', DeploymentController.getAllProjectDeployments);
router.get('/:project_id/:deployment_id', DeploymentController.getDeploymentById);
router.put('/:project_id/:deployment_id/cancel', DeploymentController.cancelDeployment);
router.delete('/:project_id/:deployment_id', DeploymentController.deleteDeployment);

export default router;
