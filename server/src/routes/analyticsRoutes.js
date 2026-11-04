import express from 'express';
import {
  getDashboardSummary,
  getMonthlyComparison,
  getCategoryBreakdown,
  getWeeklySpending,
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/dashboard', getDashboardSummary);
router.get('/monthly-comparison', getMonthlyComparison);
router.get('/category-breakdown', getCategoryBreakdown);
router.get('/weekly-spending', getWeeklySpending);

export default router;
