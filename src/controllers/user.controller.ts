import { Request, Response } from 'express';
import UserService from '../services/user.service';

class UserController {
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const result = await UserService.createUser(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      req.body.id = userId;
      const result = await UserService.updateUser(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await UserService.deleteUser(parseInt(req.params.id, 10));
      if (deleted) {
        res.status(204).json();
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserService.getAllUsers(req.body);
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new UserController();
