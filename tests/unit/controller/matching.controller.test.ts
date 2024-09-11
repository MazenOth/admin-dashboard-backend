import MatchingController from '../../../src/controllers/matching.controller';
import MatchingService from '../../../src/services/matching.service';
import {
  assignHelperRequestDto,
  getMatchedUsersRequest,
  getPotentialMatchesRequestDto,
  getUnmatchedClientsRequest,
  unassignHelperRequestDto,
} from '../../../src/dto';
import { ValidationResult } from 'joi';

jest.mock('../../../src/services/matching.service');

describe('MatchingController', () => {
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    mockReq = { body: {}, params: {}, query: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('getUnmatchedClients', () => {
    it('should return 200 and unmatched clients', async () => {
      const mockUnmatchedClients = [{ id: 1, name: 'Mark' }];
      (MatchingService.getUnmatchedClients as jest.Mock).mockResolvedValue(
        mockUnmatchedClients
      );

      await MatchingController.getUnmatchedClients(mockReq, mockRes);

      expect(MatchingService.getUnmatchedClients).toHaveBeenCalledWith(
        mockReq.query
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUnmatchedClients);
    });

    it('should return 400 if validation fails', async () => {
      const mockValidationError = { details: [{ message: 'Invalid query' }] };
      jest.spyOn(getUnmatchedClientsRequest, 'validate').mockReturnValue({
        error: mockValidationError,
        value: null,
      } as ValidationResult<any>);

      await MatchingController.getUnmatchedClients(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid query' });
    });

    it('should return 500 if an error occurs inside the service', async () => {
      (MatchingService.getUnmatchedClients as jest.Mock).mockRejectedValue(
        new Error('Error fetching unmatched clients')
      );

      await MatchingController.getUnmatchedClients(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error fetching unmatched clients',
      });
    });
  });

  describe('getPotentialMatches', () => {
    it('should return 200 and potential matches', async () => {
      const mockPotentialMatches = [{ id: 1, name: 'Helper A' }];
      (MatchingService.getPotentialMatches as jest.Mock).mockResolvedValue(
        mockPotentialMatches
      );

      await MatchingController.getPotentialMatches(mockReq, mockRes);

      expect(MatchingService.getPotentialMatches).toHaveBeenCalledWith(
        mockReq.body
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockPotentialMatches);
    });

    it('should return 400 if validation fails', async () => {
      const mockValidationError = { details: [{ message: 'Invalid body' }] };
      jest.spyOn(getPotentialMatchesRequestDto, 'validate').mockReturnValue({
        error: mockValidationError,
        value: null,
      } as ValidationResult<any>);

      await MatchingController.getPotentialMatches(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid body' });
    });

    it('should return 500 if an error occurs inside the service', async () => {
      (MatchingService.getPotentialMatches as jest.Mock).mockRejectedValue(
        new Error('Error fetching potential matches')
      );

      await MatchingController.getPotentialMatches(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error fetching potential matches',
      });
    });
  });

  describe('getMatchedUsers', () => {
    it('should return 200 and matched users', async () => {
      const mockMatchedUsers = [{ id: 1, name: 'User A' }];
      (MatchingService.getMatchedUsers as jest.Mock).mockResolvedValue(
        mockMatchedUsers
      );

      await MatchingController.getMatchedUsers(mockReq, mockRes);

      expect(MatchingService.getMatchedUsers).toHaveBeenCalledWith(
        mockReq.query
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockMatchedUsers);
    });

    it('should return 400 if validation fails', async () => {
      const mockValidationError = { details: [{ message: 'Invalid query' }] };
      jest.spyOn(getMatchedUsersRequest, 'validate').mockReturnValue({
        error: mockValidationError,
        value: null,
      } as ValidationResult<any>);

      await MatchingController.getMatchedUsers(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid query' });
    });

    it('should return 500 if an error occurs inside the service', async () => {
      (MatchingService.getMatchedUsers as jest.Mock).mockRejectedValue(
        new Error('Error fetching matched users')
      );

      await MatchingController.getMatchedUsers(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error fetching matched users',
      });
    });
  });

  describe('assignHelper', () => {
    it('should return 201 when helper is assigned successfully', async () => {
      const mockAssignedHelper = { id: 1, clientId: 1, helperId: 2 };
      (MatchingService.assignHelper as jest.Mock).mockResolvedValue(
        mockAssignedHelper
      );

      await MatchingController.assignHelper(mockReq, mockRes);

      expect(MatchingService.assignHelper).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockAssignedHelper);
    });

    it('should return 400 if validation fails', async () => {
      const mockValidationError = { details: [{ message: 'Invalid body' }] };
      jest.spyOn(assignHelperRequestDto, 'validate').mockReturnValue({
        error: mockValidationError,
        value: null,
      } as ValidationResult<any>);

      await MatchingController.assignHelper(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid body' });
    });

    it('should return 500 if an error occurs inside the service', async () => {
      (MatchingService.assignHelper as jest.Mock).mockRejectedValue(
        new Error('Failed to assign helper')
      );

      await MatchingController.assignHelper(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Failed to assign helper',
      });
    });
  });

  describe('unassignHelper', () => {
    it('should return 204 when helper is unassigned successfully', async () => {
      (MatchingService.unassignHelper as jest.Mock).mockResolvedValue({
        destroyed_rows: 1,
      });

      await MatchingController.unassignHelper(mockReq, mockRes);

      expect(MatchingService.unassignHelper).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(204);
    });

    it('should return 400 if validation fails', async () => {
      const mockValidationError = { details: [{ message: 'Invalid body' }] };
      jest.spyOn(unassignHelperRequestDto, 'validate').mockReturnValue({
        error: mockValidationError,
        value: null,
      } as ValidationResult<any>);

      await MatchingController.unassignHelper(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid body' });
    });

    it('should return 500 if an error occurs inside the service', async () => {
      (MatchingService.unassignHelper as jest.Mock).mockRejectedValue(
        new Error('Failed to unassign helper')
      );

      await MatchingController.unassignHelper(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Failed to unassign helper',
      });
    });
  });
});
