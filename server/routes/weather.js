import express from 'express';
import { getWeatherData } from '../controllers/weatherController.js';
import { validateWeatherQuery } from '../middleware/validate.js';

const router = express.Router();

router.get('/', validateWeatherQuery, getWeatherData);
router.get('/coords', validateWeatherQuery, getWeatherData);

export default router;
