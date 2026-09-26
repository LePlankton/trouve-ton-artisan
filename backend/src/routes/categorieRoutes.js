import { Router } from 'express';
import { listerCategories } from '../controllers/categorieController.js';

const router = Router();

router.get('/', listerCategories);

export default router;
