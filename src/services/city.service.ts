import { IGetAllCitiesResponseDto } from '../dto';
import { City, Client, User } from '../models';

class CityService {
  async getAllCities(): Promise<IGetAllCitiesResponseDto[]> {
    try {
      const cities = await City.findAll({
        attributes: [
          ['id', 'city_id'],
          ['name', 'city_name'],
        ],
        order: [['name', 'ASC']],
      });

      return cities;
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw new Error('Failed to fetch cities');
    }
  }
  async getCityId(cityName: string): Promise<number> {
    try {
      const city = await City.findOne({
        where: { name: cityName },
      });
      if (!city) {
        throw new Error('City not found');
      } else {
        console.log('City found');
        return city.id;
      }
    } catch (err) {
      throw err;
    }
  }
  async getCityIdByClient(clientId: number): Promise<number> {
    try {
      const client = await Client.findByPk(clientId);
      if (!client) {
        throw new Error('Client not found');
      }
      const user = await User.findByPk(client.UserId);
      if (!user) {
        throw new Error('User not found');
      } else {
        console.log('User found');
        return user.CityId;
      }
    } catch (err) {
      throw err;
    }
  }
}

export default new CityService();
