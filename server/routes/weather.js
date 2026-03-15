import express from 'express';
import { getWeatherData } from '../controllers/weatherController.js';

const router = express.Router();

router.get('/', getWeatherData);
router.get('/coords', getWeatherData);

export default router;
