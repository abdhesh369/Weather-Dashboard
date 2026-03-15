import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { addFavorite, getFavorites, removeFavorite } from '../controllers/favoritesController.js';
import { validateFavorite } from '../middleware/validate.js';

const router = express.Router();

router.use(protect); // All favorites routes are protected

router.post('/', validateFavorite, addFavorite);
router.get('/', getFavorites);
router.delete('/', removeFavorite);

export default router;
