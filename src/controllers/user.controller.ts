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
        return;
      }
      const result = await UserService.createUser(value);
      if (result) {
        res.status(201).json(result);
        return;
      }
    } catch (error: any) {
      if (error.message === 'Validation error') {
        res.status(400).json({ message: 'User already exists' });
        return;
      } else if (error.message === 'City not found') {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: error.message });
      return;
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const user_id = parseInt(req.params.id, 10);
      req.body.user_id = user_id;
      console.log(req.body);
      const { error, value } = updateUserRequestDto.validate(req.body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
      }
      const result = await UserService.updateUser(value);
      if (result) {
        res.status(200).json(result);
        return;
      }
    } catch (error: any) {
      if (error.message === 'User not found') {
        res.status(400).json({ message: 'User not found' });
        return;
      }
      res.status(500).json({ message: error.message });
      return;
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = deleteUserRequestDto.validate(req.params);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
      }
      const { destroyed_rows } = await UserService.deleteUser(value);
      if (destroyed_rows) {
        res.status(204).json({ message: 'User deleted' });
        return;
      } else {
        res.status(400).json({ message: 'User not found' });
        return;
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
      return;
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = getAllUsersRequestDto.validate(req.query);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
      }

      const users = await UserService.getAllUsers(value);
      if (users) {
        res.status(200).json(users);
        return;
      } else {
        res.status(400).json({ message: 'No users found' });
        return;
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
      return;
    }
  }
}

export default new UserController();
