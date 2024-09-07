import { Router } from 'express';
import userRoutes from './user.route';
import matchingRoutes from './matching.route';

const router = Router();

router.use('/api', userRoutes);
router.use('/api', matchingRoutes);

export default router;
