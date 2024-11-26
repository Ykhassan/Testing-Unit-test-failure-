import express from 'express';
import ConnectionController from '../controllers/ConnectionController.js';

const router = express.Router();

router.post('/:user_id', ConnectionController.createConnection);
router.get('/:user_id', ConnectionController.getAllUserConnections);
router.get('/:user_id/:connection_id', ConnectionController.getConnectionById);
router.put('/:user_id/:connection_id', ConnectionController.updateConnection);
router.delete('/:user_id/:connection_id', ConnectionController.deleteConnection);

export default router;
