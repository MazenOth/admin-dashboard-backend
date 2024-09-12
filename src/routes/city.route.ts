import { Router } from 'express';
import CityController from '../controllers/city.controller';

const router = Router();

router.get('/cities', CityController.getAllCities);

export default router;
