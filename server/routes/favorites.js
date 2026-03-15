import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { addFavorite, getFavorites, removeFavorite } from '../controllers/favoritesController.js';

const router = express.Router();

router.use(protect); // All favorites routes are protected

router.post('/', addFavorite);
router.get('/', getFavorites);
router.delete('/', removeFavorite);

export default router;
