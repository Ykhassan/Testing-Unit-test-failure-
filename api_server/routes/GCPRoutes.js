import express from 'express';
import GCPController from '../controllers/GCPController.js';

const router = express.Router();

router.get('/:product_name', GCPController.getProductPrice);

export default router;
