import express from 'express';
import FileController from '../controllers/FileController.js';

const router = express.Router();

router.post('/:project_id', FileController.createFile);
router.get('/:project_id', FileController.getAllProjectFiles);
router.get('/:project_id/:file_id', FileController.getFileById);
router.put('/:project_id/:file_id', FileController.updateFile);
router.delete('/:project_id/:file_id', FileController.deleteFile);

export default router;
