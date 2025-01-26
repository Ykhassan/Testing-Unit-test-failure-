import express from 'express';
import AzureController from '../controllers/AzureController.js';

const router = express.Router();

router.post('/', AzureController.fetchResourcePrice);

export default router;