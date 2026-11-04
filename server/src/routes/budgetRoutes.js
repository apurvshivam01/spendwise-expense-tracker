import express from 'express';
import { getBudget, setBudget } from '../controllers/budgetController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getBudget).post(setBudget);

export default router;
