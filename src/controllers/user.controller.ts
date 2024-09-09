import { Request, Response } from 'express';
import UserService from '../services/user.service';
import {
  createUserRequestDto,
  deleteUserRequestDto,
  getAllUsersRequestDto,
  updateUserRequestDto,
} from '../dto';

class UserController {
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = createUserRequestDto.validate(req.body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
      }
      const result = await UserService.createUser(value);
      if (result) {
        res.status(201).json(result);
      } else {
        res.status(400).json({ message: 'User already exists' });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      req.body.id = userId;
      const { error, value } = updateUserRequestDto.validate(req.body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
      }
      const result = await UserService.updateUser(value);
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(400).json({ message: 'User not found' });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = deleteUserRequestDto.validate(req.params.id);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
      }
      const { destroyed_rows } = await UserService.deleteUser(value);
      if (destroyed_rows) {
        res.status(204).json({ message: 'User deleted' });
      } else {
        res.status(400).json({ message: 'User not found' });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = getAllUsersRequestDto.validate(req.query);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
      }

      const users = await UserService.getAllUsers(value);
      if (users) {
        res.status(200).json(users);
      } else {
        res.status(400).json({ message: 'No users found' });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new UserController();
