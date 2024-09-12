import Client from '../models/Client';
import RoleService from './role.service';
import { City, Helper, User } from '../models';
import {
  ICreateUserRequestDto,
  ICreateUserResponseDto,
  IUpdateUserRequestDto,
  IUpdateUserResponseDto,
  IDeleteUserRequestDto,
  IDeleteUserResponseDto,
  IGetAllUsersRequestDto,
  IGetAllUsersResponseDto,
} from '../dto';
import CityService from './city.service';
import { Sequelize } from 'sequelize';

class UserService {
  async createUser(
    dto: ICreateUserRequestDto
  ): Promise<ICreateUserResponseDto> {
    try {
      let result = { user: {}, role: {} };
      const roleId = await RoleService.getRoleId(dto.role_name);
      const cityId = await CityService.getCityId(dto.city_name);

      console.log({ roleId, cityId });
      if (roleId && cityId) {
        const user = await User.create({
          email: dto.email,
          first_name: dto.first_name,
          last_name: dto.last_name,
          phone_number: dto.phone_number,
          RoleId: roleId,
          CityId: cityId,
        });
        if (!user) {
          throw new Error('Failed to create user');
        }

        if (dto.role_name == 'client') {
          const client = await Client.create({
            UserId: user.id,
          });
          if (!client) {
            throw new Error('Failed to create client for user');
          }
          return {
            user: user,
            role: client,
          };
        } else if (dto.role_name == 'helper') {
          const helper = await Helper.create({
            UserId: user.id,
          });
          if (!helper) {
            throw new Error('Failed to create helper for user');
          }
          result.role = helper;
          return {
            user: user,
            role: helper,
          };
        }
      } else {
        throw new Error('Invalid role or city');
      }
      throw new Error('Failed to create user');
    } catch (err: any) {
      console.error('Error creating user:', err.message);
      throw err;
    }
  }

  async updateUser(
    dto: IUpdateUserRequestDto
  ): Promise<IUpdateUserResponseDto> {
    try {
      const user = await User.findByPk(dto.user_id);
      if (!user) {
        throw new Error('User not found');
      }
      const cityId = await CityService.getCityId(dto.city_name);

      if (cityId) {
        const updateData = {
          email: dto.email,
          first_name: dto.first_name,
          last_name: dto.last_name,
          phone_number: dto.phone_number,
          CityId: cityId,
        };
        const user = await User.update(updateData, {
          where: { id: dto.user_id },
          returning: true,
        });
        return user[1][0];
      }
      throw new Error('Failed to update user');
    } catch (err: any) {
      console.error('Error updating user:', err.message);
      throw err;
    }
  }

  async deleteUser(
    dto: IDeleteUserRequestDto
  ): Promise<IDeleteUserResponseDto> {
    try {
      const deleted = await User.destroy({
        where: { id: dto.id },
      });
      return { destroyed_rows: deleted };
    } catch (err: any) {
      console.error('Error deleting user:', err.message);
      throw err;
    }
  }

  async getAllUsers(
    dto: IGetAllUsersRequestDto
  ): Promise<IGetAllUsersResponseDto> {
    try {
      const roleId = await RoleService.getRoleId(dto.role_name);
      const limit = dto.size || 10;
      const page = dto.page || 1;
      const offset = (page - 1) * limit;

      if (roleId) {
        const [users, total] = await Promise.all([
          User.findAll({
            attributes: [
              ['id', 'user_id'],
              'first_name',
              'last_name',
              'email',
              'phone_number',
              [Sequelize.col('City.name'), 'city_name'],
            ],
            include: [
              {
                model: City,
                attributes: [],
              },
            ],
            where: {
              RoleId: roleId,
            },
            order: [['user_id', 'DESC']],
            limit,
            offset,
          }),
          User.count({
            where: {
              RoleId: roleId,
            },
          }),
        ]);

        return {
          total,
          users,
        };
      }
      throw new Error('Failed to fetch users by role');
    } catch (err: any) {
      console.error('Error fetching users by role:', err.message);
      throw err;
    }
  }
}

export default new UserService();
