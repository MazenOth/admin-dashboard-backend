import MatchingService from '../../../src/services/matching.service';
import { Client, Matching } from '../../../src/models';

jest.mock('../../../src/models', () => ({
  Client: {
    findByPk: jest.fn(),
  },
  Helper: {
    findByPk: jest.fn(),
  },
  Matching: {
    findOne: jest.fn(),
  },
}));

describe('MatchingService', () => {
  describe('verfiyMatch', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should verify match for a client and return true if matched', async () => {
      (Client.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
      (Matching.findOne as jest.Mock).mockResolvedValue({ ClientId: 1 });

      const result = await MatchingService.verfiyMatch({
        id: 1,
        role_name: 'client',
      });

      expect(Client.findByPk).toHaveBeenCalledWith(1);
      expect(Matching.findOne).toHaveBeenCalledWith({ where: { ClientId: 1 } });
      expect(result).toBe(true);
    });

    it('should verify match for a client and return false if not matched', async () => {
      (Client.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
      (Matching.findOne as jest.Mock).mockResolvedValue(null);

      const result = await MatchingService.verfiyMatch({
        id: 1,
        role_name: 'client',
      });

      expect(Client.findByPk).toHaveBeenCalledWith(1);
      expect(Matching.findOne).toHaveBeenCalledWith({ where: { ClientId: 1 } });
      expect(result).toBe(false);
    });

    it('should throw an error if client is not found', async () => {
      (Client.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(
        MatchingService.verfiyMatch({ id: 1, role_name: 'client' })
      ).rejects.toThrow('Client not found');

      expect(Client.findByPk).toHaveBeenCalledWith(1);
      expect(Matching.findOne).not.toHaveBeenCalled();
    });
  });
});
