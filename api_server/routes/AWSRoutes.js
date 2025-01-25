import express from 'express';
import AWSController from '../controllers/AWSController.js';

const router = express.Router();

router.post('/price', AWSController.getServicePrice);
router.get('/service/:service_code', AWSController.getServiceConfigs);
router.get('/service/:service_code/:config_name', AWSController.getConfigurationValues);

export default router;
