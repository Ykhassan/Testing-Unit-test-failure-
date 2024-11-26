import express from 'express';
import SearchController from '../controllers/SearchController.js';

const router = express.Router();

router.get('/projects', SearchController.searchProjects);
router.get('/users', SearchController.searchUsers);

export default router;
