import MatchingService from '../../../src/services/matching.service';
import CityService from '../../../src/services/city.service';
import { Matching, Client, Helper, sequelize } from '../../../src/models';
import { Op, QueryTypes } from 'sequelize';

jest.mock('../../../src/models', () => ({
  Client: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
  Helper: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
  Matching: {
    create: jest.fn(),
    findOne: jest.fn(),
    destroy: jest.fn(),
  },
  sequelize: {
    query: jest.fn(),
  },
}));

jest.mock('../../../src/services/city.service', () => ({
  getCityIdByClient: jest.fn(),
}));

describe('MatchingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUnmatchedClients', () => {
    it('should return unmatched clients', async () => {
      const mockClients = [
        {
          user_id: 1,
          client_id: 1,
          first_name: 'Mark',
          last_name: 'Adams',
          email: 'Mark.Adams@example.com',
          phone_number: '1234567890',
          city_name: 'Munchen',
          city_id: 1,
        },
      ];

      (Client.findAll as jest.Mock).mockResolvedValue(mockClients);

      const result = await MatchingService.getUnmatchedClients({
        page: 1,
        size: 10,
      });

      expect(Client.findAll).toHaveBeenCalledWith({
        attributes: expect.any(Array),
        include: expect.any(Array),
        where: {
          id: {
            [Op.notIn]: expect.any(Object),
          },
        },
        limit: 10,
        offset: 0,
      });
      expect(result).toEqual(mockClients);
    });

    it('should throw an error if fetching clients fails', async () => {
      (Client.findAll as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        MatchingService.getUnmatchedClients({ page: 1, size: 10 })
      ).rejects.toThrow('Database error');
    });
  });

  describe('getPotentialMatches', () => {
    it('should return potential matches for a client', async () => {
      (CityService.getCityIdByClient as jest.Mock).mockResolvedValue(1);
      jest.spyOn(MatchingService, 'verfiyMatch').mockResolvedValue(false);

      const mockHelpers = [
        {
          helper_id: 1,
          user_id: 2,
          first_name: 'Julie',
          last_name: 'Anderson',
          email: 'Julie.Anderson@example.com',
          phone_number: '6787654321',
        },
      ];

      (Helper.findAll as jest.Mock).mockResolvedValue(mockHelpers);

      const result = await MatchingService.getPotentialMatches({
        client_id: 1,
        page: 1,
        size: 10,
      });

      expect(CityService.getCityIdByClient).toHaveBeenCalledWith(1);
      expect(Helper.findAll).toHaveBeenCalledWith({
        attributes: expect.any(Array),
        include: expect.any(Array),
        where: {
          id: {
            [Op.notIn]: expect.any(Object),
          },
        },
        limit: 10,
        offset: 0,
      });
      expect(result).toEqual(mockHelpers);
    });

    it('should throw an error if the client is already matched', async () => {
      (CityService.getCityIdByClient as jest.Mock).mockResolvedValue(1);
      jest.spyOn(MatchingService, 'verfiyMatch').mockResolvedValue(true);

      await expect(
        MatchingService.getPotentialMatches({ client_id: 1, page: 1, size: 10 })
      ).rejects.toThrow('Client already matched');
    });
  });

  describe('getMatchedUsers', () => {
    it('should return matched users', async () => {
      const mockMatches = [
        {
          helper_id: 1,
          client_id: 1,
          matching_id: 1,
          client_first_name: 'Mark',
          client_last_name: 'Adams',
          client_email: 'Mark.Adams@example.com',
          client_phone_number: '1234567890',
          helper_first_name: 'Julie',
          helper_last_name: 'Anderson',
          helper_email: 'Julie.Anderson@example.com',
          helper_phone_number: '0987654321',
          city_name: 'Munchen',
        },
      ];

      (sequelize.query as jest.Mock).mockResolvedValue(mockMatches);

      const result = await MatchingService.getMatchedUsers({
        page: 1,
        size: 10,
      });

      expect(sequelize.query).toHaveBeenCalledWith(expect.any(String), {
        type: QueryTypes.SELECT,
        replacements: { limit: 10, offset: 0 },
      });
      expect(result).toEqual(mockMatches);
    });

    it('should throw an error if fetching matched users fails', async () => {
      (sequelize.query as jest.Mock).mockRejectedValue(
        new Error('Query error')
      );

      await expect(
        MatchingService.getMatchedUsers({ page: 1, size: 10 })
      ).rejects.toThrow('Query error');
    });
  });

  describe('assignHelper', () => {
    it('should assign a helper to a client', async () => {
      jest.spyOn(MatchingService, 'verfiyMatch').mockResolvedValue(false);

      const mockMatching = { id: 1, ClientId: 1, HelperId: 2 };
      (Matching.create as jest.Mock).mockResolvedValue(mockMatching);

      const result = await MatchingService.assignHelper({
        client_id: 1,
        helper_id: 2,
      });

      expect(MatchingService.verfiyMatch).toHaveBeenCalledWith({
        id: 1,
        role_name: 'client',
      });
      expect(MatchingService.verfiyMatch).toHaveBeenCalledWith({
        id: 2,
        role_name: 'helper',
      });
      expect(Matching.create).toHaveBeenCalledWith({
        ClientId: 1,
        HelperId: 2,
      });
      expect(result).toEqual(mockMatching);
    });

    it('should throw an error if client is already matched', async () => {
      (MatchingService.verfiyMatch as jest.Mock).mockResolvedValueOnce(true);

      await expect(
        MatchingService.assignHelper({ client_id: 1, helper_id: 2 })
      ).rejects.toThrow('Client already matched');
    });
  });

  describe('unassignHelper', () => {
    it('should unassign a helper from a client', async () => {
      (Matching.destroy as jest.Mock).mockResolvedValue(1);

      const result = await MatchingService.unassignHelper({
        client_id: 1,
        helper_id: 2,
      });

      expect(Matching.destroy).toHaveBeenCalledWith({
        where: { ClientId: 1, HelperId: 2 },
      });
      expect(result).toEqual({ destroyed_rows: 1 });
    });

    it('should throw an error if no matching is found', async () => {
      (Matching.destroy as jest.Mock).mockResolvedValue(0);

      await expect(
        MatchingService.unassignHelper({ client_id: 1, helper_id: 2 })
      ).rejects.toThrow('No matching found between this client and helper');
    });
  });
});
