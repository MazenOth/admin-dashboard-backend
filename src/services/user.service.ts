import Client from '../models/Client';
import User from '../models/User';
import Country from '../models/City';
import { RoleService } from './role.service';
import { Helper } from '../models';
import { userDto } from '../dto';
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
    } catch (err) {
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
    } catch (err) {
      throw err;
    }
  }
}

export default new UserService();
