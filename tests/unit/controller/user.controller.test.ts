import UserController from '../../../src/controllers/user.controller';
import UserService from '../../../src/services/user.service';
import {
  createUserRequestDto,
  updateUserRequestDto,
  deleteUserRequestDto,
  getAllUsersRequestDto,
} from '../../../src/dto';
import { ValidationResult } from 'joi';

jest.mock('../../../src/services/user.service');

describe('UserController', () => {
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    mockReq = { body: {}, params: {}, query: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should return 201 when user is created successfully', async () => {
      const mockBody = {
        email: 'test@example.com',
        first_name: 'Mark',
        last_name: 'Adams',
        phone_number: '1234567890',
        role_name: 'client',
        city_name: 'Munich',
      };
      mockReq.body = mockBody;

      const mockUserResponse = {
        id: 1,
        email: 'test@example.com',
        first_name: 'Mark',
        last_name: 'Adams',
        phone_number: '1234567890',
        RoleId: 1,
        CityId: 1,
      };
      (UserService.createUser as jest.Mock).mockResolvedValue(mockUserResponse);

      await UserController.createUser(mockReq, mockRes);

      expect(UserService.createUser).toHaveBeenCalledWith(mockBody);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockUserResponse);
    });

    it('should return 400 if validation fails', async () => {
      const mockValidationError = { details: [{ message: 'Invalid email' }] };
      jest.spyOn(createUserRequestDto, 'validate').mockReturnValue({
        error: mockValidationError,
        value: null,
      } as ValidationResult<any>);

      await UserController.createUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid email' });
    });

    it('should return 500 if an error occurs during user creation', async () => {
      const mockBody = {
        email: 'test@example.com',
        first_name: 'Mark',
        last_name: 'Adams',
        phone_number: '1234567890',
        role_name: 'client',
        city_name: 'Munich',
      };
      mockReq.body = mockBody;

      (UserService.createUser as jest.Mock).mockRejectedValue(
        new Error('User creation failed')
      );

      await UserController.createUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User creation failed',
      });
    });
  });

  describe('updateUser', () => {
    it('should return 200 when user is updated successfully', async () => {
      const mockBody = {
        email: 'updated@example.com',
        first_name: 'Updated',
        last_name: 'User',
        phone_number: '1234567890',
        city_name: 'Berlin',
      };
      mockReq.body = mockBody;
      mockReq.params = { id: '1' };

      const mockUpdateResponse = { id: 1, ...mockBody, CityId: 2 };
      (UserService.updateUser as jest.Mock).mockResolvedValue(
        mockUpdateResponse
      );

      await UserController.updateUser(mockReq, mockRes);

      expect(UserService.updateUser).toHaveBeenCalledWith({
        ...mockBody,
        user_id: 1,
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUpdateResponse);
    });

    it('should return 400 if validation fails', async () => {
      const mockValidationError = { details: [{ message: 'Invalid input' }] };
      jest.spyOn(updateUserRequestDto, 'validate').mockReturnValue({
        error: mockValidationError,
        value: null,
      } as ValidationResult<any>);

      await UserController.updateUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Invalid input',
      });
    });

    it('should return 500 if an error occurs during user update', async () => {
      const mockBody = {
        email: 'updated@example.com',
        first_name: 'Updated',
        last_name: 'User',
        phone_number: '1234567890',
        city_name: 'Berlin',
      };
      mockReq.body = mockBody;
      mockReq.params = { id: 1 };

      (UserService.updateUser as jest.Mock).mockRejectedValue(
        new Error('User update failed')
      );

      await UserController.updateUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User update failed',
      });
    });
  });

  describe('deleteUser', () => {
    it('should return 204 when user is deleted successfully', async () => {
      mockReq.params = { id: 1 };

      (UserService.deleteUser as jest.Mock).mockResolvedValue({
        destroyed_rows: 1,
      });

      await UserController.deleteUser(mockReq, mockRes);

      expect(UserService.deleteUser).toHaveBeenCalledWith({ id: 1 });
      expect(mockRes.status).toHaveBeenCalledWith(204);
    });

    it('should return 400 if validation fails', async () => {
      const mockValidationError = { details: [{ message: 'Invalid ID' }] };
      jest.spyOn(deleteUserRequestDto, 'validate').mockReturnValue({
        error: mockValidationError,
        value: null,
      } as ValidationResult<any>);

      await UserController.deleteUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid ID' });
    });

    it('should return 500 if an error occurs during user deletion', async () => {
      mockReq.params = { id: 1 };

      (UserService.deleteUser as jest.Mock).mockRejectedValue(
        new Error('User deletion failed')
      );

      await UserController.deleteUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User deletion failed',
      });
    });
  });

  describe('getAllUsers', () => {
    it('should return 200 and list users successfully', async () => {
      const mockQuery = { role_name: 'client', size: 10, page: 1 };
      mockReq.query = mockQuery;

      const mockUsers = [
        {
          id: 1,
          first_name: 'Mark',
          last_name: 'Adams',
          email: 'test@example.com',
        },
      ];
      (UserService.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

      await UserController.getAllUsers(mockReq, mockRes);

      expect(UserService.getAllUsers).toHaveBeenCalledWith(mockQuery);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should return 400 if validation fails', async () => {
      const mockValidationError = { details: [{ message: 'Invalid query' }] };
      jest.spyOn(getAllUsersRequestDto, 'validate').mockReturnValue({
        error: mockValidationError,
        value: null,
      } as ValidationResult<any>);

      await UserController.getAllUsers(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid query' });
    });

    it('should return 500 if an error occurs during fetching users', async () => {
      const mockQuery = { role_name: 'client', size: 10, page: 1 };
      mockReq.query = mockQuery;

      (UserService.getAllUsers as jest.Mock).mockRejectedValue(
        new Error('Error fetching users')
      );

      await UserController.getAllUsers(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error fetching users',
      });
    });
  });
});
