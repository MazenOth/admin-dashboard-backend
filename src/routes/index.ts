import { Router } from 'express';
import userRoutes from './user.route';
import matchingRoutes from './matching.route';
import cityRoutes from './city.route';

const router = Router();

router.use('/api', userRoutes);
router.use('/api', matchingRoutes);
router.use('/api', cityRoutes);

export default router;
