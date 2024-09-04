import { Request, Response } from 'express';
import UserService from '../services/user.service';

class UserController {
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const result = await UserService.createUser(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async updateClient(req: Request, res: Response): Promise<void> {
    try {
      const result = await UserService.updateUser(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}

export default new UserController();
