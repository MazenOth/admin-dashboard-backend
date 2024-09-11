import CityService from './city.service';
import { Matching, Client, Helper, User, City, sequelize } from '../models';
import {
  IGetUnmatchedClientsResponseDto,
  IGetUnmatchedClientsRequestDto,
  IGetMatchedUsersRequestDto,
  IGetMatchedUsersResponseDto,
  IAssignHelperRequestDto,
  IAssignHelperResponseDto,
  IUnassignHelperRequestDto,
  IUnassignHelperResponseDto,
  IGetPotentialMatchesRequestDto,
  IGetPotentialMatchesResponseDto,
  IVerifyMatchRequestDto,
} from '../dto';
import { Op, Sequelize, QueryTypes } from 'sequelize';

class MatchingService {
  async getUnmatchedClients(
    dto: IGetUnmatchedClientsRequestDto
  ): Promise<IGetUnmatchedClientsResponseDto> {
    try {
      const limit = dto.size || 10;
      const page = dto.page || 1;
      const offset = (page - 1) * limit;

      const [clients, total] = await Promise.all([
        Client.findAll({
          attributes: [
            [Sequelize.col('User.id'), 'user_id'],
            [Sequelize.col('Client.id'), 'client_id'],
            [Sequelize.col('User.first_name'), 'first_name'],
            [Sequelize.col('User.last_name'), 'last_name'],
            [Sequelize.col('User.email'), 'email'],
            [Sequelize.col('User.phone_number'), 'phone_number'],
            [Sequelize.col('User.City.name'), 'city_name'],
            [Sequelize.col('User.City.id'), 'city_id'],
          ],
          include: [
            {
              model: User,
              attributes: [],
              include: [
                {
                  model: City,
                  attributes: [],
                },
              ],
            },
          ],
          where: {
            id: {
              [Op.notIn]: Sequelize.literal(
                '(SELECT "ClientId" FROM "Matchings")'
              ),
            },
          },
          limit,
          offset,
        }),
        Client.count({
          where: {
            id: {
              [Op.notIn]: Sequelize.literal(
                '(SELECT "ClientId" FROM "Matchings")'
              ),
            },
          },
        }),
      ]);

      return {
        total,
        clients,
      };
    } catch (err: any) {
      console.error('Error fetching unmatched clients:', err.message);
      throw err;
    }
  }
  async getPotentialMatches(
    dto: IGetPotentialMatchesRequestDto
  ): Promise<IGetPotentialMatchesResponseDto> {
    try {
      const limit = dto.size || 10;
      const page = dto.page || 1;
      const offset = (page - 1) * limit;

      const cityId = await CityService.getCityIdByClient(dto.client_id);
      if (!cityId) throw new Error('City not found');

      const isMatched = await this.verfiyMatch({
        id: dto.client_id,
        role_name: 'client',
      });

      if (isMatched) throw new Error('Client already matched');

      const [potentialHelpers, total] = await Promise.all([
        Helper.findAll({
          attributes: [
            [Sequelize.col('Helper.id'), 'helper_id'],
            [Sequelize.col('User.id'), 'user_id'],
            [Sequelize.col('User.first_name'), 'first_name'],
            [Sequelize.col('User.last_name'), 'last_name'],
            [Sequelize.col('User.email'), 'email'],
            [Sequelize.col('User.phone_number'), 'phone_number'],
          ],
          include: [
            {
              model: User,
              attributes: [],
              where: {
                CityId: cityId,
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
          limit,
          offset,
        }),
        Helper.count({
          include: [
            {
              model: User,
              attributes: [],
              where: {
                CityId: cityId,
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
        }),
      ]);

      return {
        total,
        potentialHelpers,
      };
    } catch (error) {
      console.error('Error fetching potential matches:', error);
      throw error;
    }
  }

  async getMatchedUsers(
    dto: IGetMatchedUsersRequestDto
  ): Promise<IGetMatchedUsersResponseDto> {
    try {
      const limit = dto.size || 10;
      const page = dto.page || 1;
      const offset = (page - 1) * limit;

      const [matchings, total] = await Promise.all([
        sequelize.query(
          `
          SELECT
            h.id AS helper_id,
            c.id AS client_id,
            m.id AS matching_id,
            uc.first_name AS client_first_name,
            uc.last_name AS client_last_name,
            uc.email AS client_email,
            uc.phone_number AS client_phone_number,
            uh.first_name AS helper_first_name,
            uh.last_name AS helper_last_name,
            uh.email AS helper_email,
            uh.phone_number AS helper_phone_number,
            ci."name" AS city_name
          FROM "Matchings" m
          JOIN "Clients" c ON m."ClientId" = c.id
          JOIN "Helpers" h ON m."HelperId" = h.id
          JOIN "Users" uh ON uh.id = h."UserId"
          JOIN "Users" uc ON uc.id = c."UserId"
          JOIN "Cities" ci ON uc."CityId" = ci.id
          WHERE uh."CityId" = uc."CityId"
          ORDER BY m.id DESC
          LIMIT :limit
          OFFSET :offset
          `,
          {
            type: QueryTypes.SELECT,
            replacements: {
              limit: limit,
              offset: offset,
            },
          }
        ),
        Matching.count(),
      ]);

      return {
        total: total,
        matchings,
      };
    } catch (error) {
      console.error('Error fetching matched users:', error);
      throw error;
    }
  }

  async assignHelper(
    dto: IAssignHelperRequestDto
  ): Promise<IAssignHelperResponseDto> {
    try {
      const isClientMatched = await this.verfiyMatch({
        id: dto.client_id,
        role_name: 'client',
      });

      if (isClientMatched) throw new Error('Client already matched');

      const isHelperMatched = await this.verfiyMatch({
        id: dto.helper_id,
        role_name: 'helper',
      });

      if (isHelperMatched) throw new Error('Helper already matched');

      const matching = await Matching.create({
        ClientId: dto.client_id,
        HelperId: dto.helper_id,
      });
      return matching;
    } catch (error) {
      console.error('Error assigning helper:', error);
      throw error;
    }
  }

  async unassignHelper(
    dto: IUnassignHelperRequestDto
  ): Promise<IUnassignHelperResponseDto> {
    try {
      const deleted = await Matching.destroy({
        where: { ClientId: dto.client_id, HelperId: dto.helper_id },
      });
      if (!deleted) {
        throw new Error('No matching found between this client and helper');
      }
      return { destroyed_rows: deleted };
    } catch (error) {
      console.error('Error unassigning helper:', error);
      throw error;
    }
  }

  async verfiyMatch(dto: IVerifyMatchRequestDto): Promise<boolean> {
    try {
      let isMatched = false;
      if (dto.role_name == 'client') {
        const client = await Client.findByPk(dto.id);
        if (!client) throw new Error('Client not found');
        const match = await Matching.findOne({ where: { ClientId: dto.id } });
        match ? (isMatched = true) : (isMatched = false);
        return isMatched;
      } else if (dto.role_name == 'helper') {
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
