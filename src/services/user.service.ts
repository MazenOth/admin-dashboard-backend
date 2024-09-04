import Client from '../models/Client';
import { RoleService } from './role.service';
import { City, Helper, User } from '../models';
import { getUsersDto, userDto } from '../dto';
import { CityService } from './city.service';

class UserService {
  async createUser(dto: userDto): Promise<{}> {
    try {
      let result = { user: {}, client: {}, helper: {} };
      const roleId = await RoleService.getRoleId(dto.roleName);
      const cityId = await CityService.getCityId(dto.cityName);

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
        result.user = user;

        if (dto.roleName == 'client') {
          const client = await Client.create({
            UserId: user.id,
          });
          result.client = client;
          return result;
        } else if (dto.roleName == 'helper') {
          const helper = await Helper.create({
            UserId: user.id,
          });
          result.helper = helper;
          return result;
        }
      } else {
        throw new Error('Invalid role or city');
      }

      return result;
    } catch (err: any) {
      console.error('Error creating user:', err.message);
      throw err;
    }
  }

  async updateUser(dto: userDto): Promise<{}> {
    try {
      let result = { user: {}, client: {}, helper: {} };
      const cityId = await CityService.getCityId(dto.cityName);

      if (cityId > 0) {
        const updateData = {
          email: dto.email,
          first_name: dto.first_name,
          last_name: dto.last_name,
          phone_number: dto.phone_number,
          CityId: cityId,
        };
        result.user = await User.update(updateData, {
          where: { id: dto.id },
          returning: true,
        });
        return result;
      }
      return result;
    } catch (err: any) {
      console.error('Error updating user:', err.message);
      throw err;
    }
  }

  async deleteUser(userId: number): Promise<number> {
    try {
      const deleted = await User.destroy({
        where: { id: userId },
      });
      return deleted;
    } catch (err: any) {
      console.error('Error deleting user:', err.message);
      throw err;
    }
  }

  async getAllUsers(dto: getUsersDto): Promise<User[]> {
    try {
      const roleId = await RoleService.getRoleId(dto.roleName);
      const limit = dto.paginationOptions.size || 10;
      const page = dto.paginationOptions.page || 1;
      const offset = (page - 1) * limit;
      let users: User[] = [];

      if (roleId) {
        const users = await User.findAll({
          attributes: [
            ['id', 'user_id'],
            'first_name',
            'last_name',
            'email',
            'phone_number',
          ],
          include: [
            {
              model: City,
              attributes: ['name'],
              as: 'City',
            },
          ],
          where: {
            RoleId: roleId,
          },
          limit: limit,
          offset: offset,
        });
        return users;
      }
      return users;
    } catch (err: any) {
      console.error('Error fetching users by role:', err.message);
      throw err;
    }
  }
}

export default new UserService();
