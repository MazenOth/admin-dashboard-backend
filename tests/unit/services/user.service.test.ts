import { Sequelize } from 'sequelize';
import { User, Client, Helper, City } from '../../../src/models';
import CityService from '../../../src/services/city.service';
import RoleService from '../../../src/services/role.service';
import UserService from '../../../src/services/user.service';

// Dependencies
jest.mock('../../../src/models/User', () => {
  return {
    hasOne: jest.fn(),
    belongsTo: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    findAll: jest.fn(),
  };
});
jest.mock('../../../src/models/Client', () => {
  return {
    hasOne: jest.fn(),
    belongsTo: jest.fn(),
    create: jest.fn(),
  };
});
jest.mock('../../../src/models/Helper', () => {
  return {
    hasOne: jest.fn(),
    belongsTo: jest.fn(),
    create: jest.fn(),
  };
});
jest.mock('../../../src/models/Matching', () => {
  return {
    hasOne: jest.fn(),
    belongsTo: jest.fn(),
  };
});
jest.mock('../../../src/models/City');

// External
jest.mock('../../../src/services/city.service');
jest.mock('../../../src/services/role.service');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user and a client when role is "client"', async () => {
      const dto = {
        email: 'test@example.com',
        first_name: 'Mark',
        last_name: 'Adams',
        phone_number: '1234567890',
        role_name: 'client',
        city_name: 'Munchen',
      };

      (RoleService.getRoleId as jest.Mock).mockResolvedValue(1);
      (CityService.getCityId as jest.Mock).mockResolvedValue(1);
      (User.create as jest.Mock).mockResolvedValue({
        id: 1,
        first_name: 'Mark',
        last_name: 'Adams',
        email: 'test@example.com',
        phone_number: '1234567890',
        RoleId: 1,
        CityId: 1,
      });
      (Client.create as jest.Mock).mockResolvedValue({ id: 1, UserId: 1 });

      const result = await UserService.createUser(dto);

      expect(RoleService.getRoleId).toHaveBeenCalledWith('client');
      expect(CityService.getCityId).toHaveBeenCalledWith('Munchen');
      expect(User.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        first_name: 'Mark',
        last_name: 'Adams',
        phone_number: '1234567890',
        RoleId: 1,
        CityId: 1,
      });
      expect(Client.create).toHaveBeenCalledWith({ UserId: 1 });
      expect(result).toEqual({
        user: {
          id: 1,
          first_name: 'Mark',
          last_name: 'Adams',
          email: 'test@example.com',
          phone_number: '1234567890',
          RoleId: 1,
          CityId: 1,
        },
        role: { id: 1, UserId: 1 },
      });
    });

    it('should create a user and a helper when role is "helper"', async () => {
      const dto = {
        email: 'helper@example.com',
        first_name: 'Julie',
        last_name: 'Anderson',
        phone_number: '0347654321',
        role_name: 'helper',
        city_name: 'Berlin',
      };

      (RoleService.getRoleId as jest.Mock).mockResolvedValue(2);
      (CityService.getCityId as jest.Mock).mockResolvedValue(2);
      (User.create as jest.Mock).mockResolvedValue({
        id: 2,
        email: 'helper@example.com',
        first_name: 'Julie',
        last_name: 'Anderson',
        phone_number: '0347654321',
        RoleId: 2,
        CityId: 2,
      });
      (Helper.create as jest.Mock).mockResolvedValue({ id: 2, UserId: 2 });

      const result = await UserService.createUser(dto);

      expect(User.create).toHaveBeenCalledWith({
        email: 'helper@example.com',
        first_name: 'Julie',
        last_name: 'Anderson',
        phone_number: '0347654321',
        RoleId: 2,
        CityId: 2,
      });
      expect(Helper.create).toHaveBeenCalledWith({ UserId: 2 });
      expect(result).toEqual({
        user: {
          id: 2,
          email: 'helper@example.com',
          first_name: 'Julie',
          last_name: 'Anderson',
          phone_number: '0347654321',
          RoleId: 2,
          CityId: 2,
        },
        role: { id: 2, UserId: 2 },
      });
    });

    it('should throw an error if role or city is invalid', async () => {
      const dto = {
        email: 'invalid@example.com',
        first_name: 'Invalid',
        last_name: 'User',
        phone_number: '0000000000',
        role_name: 'invalidRole',
        city_name: 'invalidCity',
      };

      (RoleService.getRoleId as jest.Mock).mockResolvedValue(null);
      (CityService.getCityId as jest.Mock).mockResolvedValue(null);

      await expect(UserService.createUser(dto)).rejects.toThrow(
        'Invalid role or city'
      );
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const dto = {
        user_id: 1,
        email: 'updated@example.com',
        first_name: 'Updated',
        last_name: 'User',
        phone_number: '1111111111',
        city_name: 'Updated City',
      };

      (CityService.getCityId as jest.Mock).mockResolvedValue(3);
      (User.update as jest.Mock).mockResolvedValue([
        1,
        [{ id: 1, ...dto, CityId: 3 }],
      ]);

      const result = await UserService.updateUser(dto);

      expect(User.update).toHaveBeenCalledWith(
        {
          email: 'updated@example.com',
          first_name: 'Updated',
          last_name: 'User',
          phone_number: '1111111111',
          CityId: 3,
        },
        { where: { id: 1 }, returning: true }
      );
      expect(result).toEqual({ id: 1, ...dto, CityId: 3 });
    });

    it('should throw an error if city is invalid', async () => {
      const dto = {
        user_id: 1,
        email: 'invalid@example.com',
        first_name: 'Invalid',
        last_name: 'User',
        phone_number: '0000000000',
        city_name: 'invalidCity',
      };

      (CityService.getCityId as jest.Mock).mockResolvedValue(null);

      await expect(UserService.updateUser(dto)).rejects.toThrow(
        'Failed to update user'
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      const dto = { id: 1 };
      (User.destroy as jest.Mock).mockResolvedValue(1);

      const result = await UserService.deleteUser(dto);

      expect(User.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual({ destroyed_rows: 1 });
    });

    it('should handle errors when deleting a user', async () => {
      const dto = { id: 1 };
      (User.destroy as jest.Mock).mockRejectedValue(new Error('Delete failed'));

      await expect(UserService.deleteUser(dto)).rejects.toThrow(
        'Delete failed'
      );
    });
  });

  describe('getAllUsers', () => {
    it('should fetch all users by role', async () => {
      const dto = { role_name: 'client', size: 10, page: 1 };
      (RoleService.getRoleId as jest.Mock).mockResolvedValue(1);
      (User.findAll as jest.Mock).mockResolvedValue([
        {
          user_id: 1,
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          phone_number: '1234567890',
          city_name: 'Test City',
        },
      ]);

      const result = await UserService.getAllUsers(dto);

      expect(User.findAll).toHaveBeenCalledWith({
        attributes: [
          ['id', 'user_id'],
          'first_name',
          'last_name',
          'email',
          'phone_number',
          [Sequelize.col('City.name'), 'city_name'],
        ],
        include: [{ model: City, attributes: [] }],
        where: { RoleId: 1 },
        order: [['user_id', 'DESC']],
        limit: 10,
        offset: 0,
      });
      expect(result).toEqual([
        {
          user_id: 1,
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          phone_number: '1234567890',
          city_name: 'Test City',
        },
      ]);
    });

    it('should handle errors when fetching users', async () => {
      const dto = { role_name: 'invalidRole', size: 10, page: 1 };
      (RoleService.getRoleId as jest.Mock).mockResolvedValue(null);

      await expect(UserService.getAllUsers(dto)).rejects.toThrow(
        'Failed to fetch users by role'
      );
    });
  });
});
