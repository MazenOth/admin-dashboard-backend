import { Matching, Client, Helper, User, City } from '../models';
import { potentialMatchDto, getUsersDto, verifyMatchDto } from '../dto';

class MatchingService {
  async getUnassignedClients(dto: getUsersDto): Promise<Client[]> {
    try {
      const limit = dto.paginationOptions.size || 10;
      const page = dto.paginationOptions.page || 1;
      const offset = (page - 1) * limit;
      const clients = await Client.findAll({
        attributes: ['id'],
        include: [
          {
            model: User,
            attributes: [
              'id',
              'first_name',
              'last_name',
              'email',
              'phone_number',
            ],
          },
          {
            model: City,
            attributes: ['name'],
          },
        ],
        where: {
          matching_id: null,
        },
        limit: limit,
        offset: offset,
      });
      return clients;
    } catch (err: any) {
      console.error('Error fetching unassigned clients:', err.message);
      throw err;
    }
  }
  async getPotentialMatches(dto: potentialMatchDto): Promise<Helper[]> {
    try {
      const limit = dto.paginationOptions.size || 10;
      const page = dto.paginationOptions.page || 1;
      const offset = (page - 1) * limit;

      const city = await City.findByPk(dto.cityId);
      if (!city) throw new Error('Client not found');

      const isMatched = await this.verfiyMatch({
        id: dto.clientId,
        roleName: 'client',
      });

      if (isMatched) throw new Error('Client already matched');

      const potentialHelpers = await Helper.findAll({
        attributes: ['id'],
        include: [
          {
            model: User,
            attributes: [
              'id',
              'first_name',
              'last_name',
              'email',
              'phone_number',
            ],
            where: {
              CityId: dto.cityId,
            },
          },
        ],
        where: {
          matching_id: null,
        },
        limit: limit,
        offset: offset,
      });

      return potentialHelpers;
    } catch (error) {
      console.error('Error fetching potential matches:', error);
      throw error;
    }
  }

  async verfiyMatch(dto: verifyMatchDto): Promise<boolean> {
    try {
      let isMatched = false;
      if (dto.roleName == 'client') {
        const client = await Client.findByPk(dto.id);
        if (!client) throw new Error('Client not found');
        client.matching_id == null ? (isMatched = false) : (isMatched = true);
        return isMatched;
      } else if (dto.roleName == 'helper') {
        const helper = await Helper.findByPk(dto.id);
        if (!helper) throw new Error('Helper not found');
        helper.matching_id == null ? (isMatched = false) : (isMatched = true);
        return isMatched;
      } else {
        throw new Error('Invalid role name');
      }
    } catch (error) {
      console.error('Error verifying matches:', error);
      throw error;
    }
  }
}

export default new MatchingService();
