import { Router } from 'express';
import UserController from '../controllers/user.controller';

const router = Router();

router.post('/users/register', UserController.createUser);
router.put('/users/:id', UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);
router.get('/users', UserController.getAllUsers);

export default router;
