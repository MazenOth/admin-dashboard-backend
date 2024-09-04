import { Router } from 'express';
import userRoutes from './user.route';

const router = Router();

router.use('/api', userRoutes);

export default router;
