import express from 'express';
import { getWeatherData, getGeocodeData } from '../controllers/weatherController.js';
import { validateWeatherQuery } from '../middleware/validate.js';

const router = express.Router();

router.get('/', validateWeatherQuery, getWeatherData);
router.get('/coords', validateWeatherQuery, getWeatherData);
router.get('/geocode', getGeocodeData);

export default router;
