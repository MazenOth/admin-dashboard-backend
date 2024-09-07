import { Matching, Client, Helper, User, City } from '../models';
import {
  potentialMatchDto,
  getUsersDto,
  verifyMatchDto,
  paginationDto,
  helperClientIdDto,
} from '../dto';
import { Op, Sequelize } from 'sequelize';

class MatchingService {
  async getUnmatchedClients(dto: paginationDto): Promise<Client[]> {
    try {
      const limit = dto.size || 10;
      const page = dto.page || 1;
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
          id: {
            [Op.notIn]: Sequelize.literal(
              `(SELECT "ClientId" FROM "Matchings" m)`
            ),
          },
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
      if (!city) throw new Error('City not found');

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
          id: {
            [Op.notIn]: Sequelize.literal(
              `(SELECT "HelperId" FROM "Matchings" m)`
            ),
          },
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

  async getMatchedUsers(dto: paginationDto) {
    try {
      const limit = dto.size || 10;
      const page = dto.page || 1;
      const offset = (page - 1) * limit;
      const matchings = await Matching.findAll({
        attributes: ['id'],
        include: [
          {
            model: Client,
            attributes: ['id'],
            include: [
              {
                model: User,
                as: 'ClientUser',
                attributes: [
                  'first_name',
                  'last_name',
                  'email',
                  'phone_number',
                ],
                include: [
                  {
                    model: City,
                    attributes: ['name'],
                  },
                ],
              },
            ],
          },
          {
            model: Helper,
            attributes: ['id'],
            include: [
              {
                model: User,
                as: 'HelperUser',
                attributes: [
                  'first_name',
                  'last_name',
                  'email',
                  'phone_number',
                ],
              },
            ],
          },
        ],
        where: Sequelize.where(
          Sequelize.col('ClientUser.CityId'),
          Op.eq,
          Sequelize.col('HelperUser.CityId')
        ),
        order: [['id', 'ASC']],
        limit: limit,
        offset: offset,
      });
      return matchings;
    } catch (error) {
      console.error('Error fetching matched users:', error);
      throw error;
    }
  }

  async assignHelper(dto: helperClientIdDto) {
    try {
      const isClientMatched = await this.verfiyMatch({
        id: dto.clientId,
        roleName: 'client',
      });

      if (isClientMatched) throw new Error('Client already matched');

      const isHelperMatched = await this.verfiyMatch({
        id: dto.helperId,
        roleName: 'helper',
      });

      if (isHelperMatched) throw new Error('Helper already matched');

      const matching = await Matching.create({
        ClientId: dto.clientId,
        HelperId: dto.helperId,
      });
      return matching;
    } catch (error) {
      console.error('Error assigning helper:', error);
      throw error;
    }
  }

  async unassignHelper(dto: helperClientIdDto) {
    try {
      const matching = await Matching.findOne({
        where: { ClientId: dto.clientId, HelperId: dto.helperId },
      });
      if (!matching) {
        throw new Error('No matching found between this client and helper');
      }

      await matching.destroy();
      return { message: 'Helper unassigned successfully' };
    } catch (error) {
      console.error('Error unassigning helper:', error);
      throw error;
    }
  }

  async verfiyMatch(dto: verifyMatchDto): Promise<boolean> {
    try {
      let isMatched = false;
      if (dto.roleName == 'client') {
        const client = await Client.findByPk(dto.id);
        if (!client) throw new Error('Client not found');
        const match = await Matching.findOne({ where: { ClientId: dto.id } });
        match ? (isMatched = true) : (isMatched = false);
        return isMatched;
      } else if (dto.roleName == 'helper') {
        const helper = await Helper.findByPk(dto.id);
        if (!helper) throw new Error('Helper not found');
        const match = await Matching.findOne({ where: { HelperId: dto.id } });
        match ? (isMatched = true) : (isMatched = false);
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
