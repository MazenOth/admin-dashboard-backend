import { City, Client, User } from '../models';

class CityService {
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
