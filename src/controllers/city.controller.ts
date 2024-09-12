import { Request, Response } from 'express';
import CityService from '../services/city.service';

class CityController {
  async getAllCities(req: Request, res: Response): Promise<void> {
    try {
      const cities = await CityService.getAllCities();

      if (cities) {
        res.status(200).json(cities);
      } else {
        res.status(400).json({ message: 'No cities found' });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new CityController();
