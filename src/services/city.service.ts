import { City } from '../models';

export class CityService {
  static async getCityId(cityName: string): Promise<number> {
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
}
