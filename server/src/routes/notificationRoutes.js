import express from 'express';
import {
  getNotifications,
  markAsRead,
  markAllRead,
  clearAllNotifications,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/').get(getNotifications).delete(clearAllNotifications);
router.put('/mark-all-read', markAllRead);
router.put('/:id/read', markAsRead);

export default router;
