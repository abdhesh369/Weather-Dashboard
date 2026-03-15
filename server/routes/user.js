import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getProfile, updatePreferences } from '../controllers/userController.js';

const router = express.Router();

router.get('/me', protect, getProfile);
router.patch('/preferences', protect, updatePreferences);

export default router;
