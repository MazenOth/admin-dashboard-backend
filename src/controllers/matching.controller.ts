import { Request, Response } from 'express';
import MatchingService from '../services/matching.service';
import {
  assignHelperRequestDto,
  getMatchedUsersRequest,
  getPotentialMatchesRequestDto,
  getUnmatchedClientsRequest,
  unassignHelperRequestDto,
} from '../dto';

class MatchingController {
  async getUnmatchedClients(req: Request, res: Response) {
    try {
      const { error, value } = getUnmatchedClientsRequest.validate(req.query);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
      }
      const unmatchedClients = await MatchingService.getUnmatchedClients(value);
      if (unmatchedClients) {
        res.status(200).json(unmatchedClients);
      } else {
        res.status(400).json({ message: 'Unmatched clients not found' });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  async getPotentialMatches(req: Request, res: Response) {
    try {
      const clientId = req.params.clientId;
      req.body.clientId = clientId;
      req.body.paginationOptions = { ...req.query };
      console.log(req.body);
      const { error, value } = getPotentialMatchesRequestDto.validate(req.body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
      }
      const potentialHelpers = await MatchingService.getPotentialMatches(value);
      if (potentialHelpers) {
        res.status(200).json(potentialHelpers);
      } else {
        res.status(400).json({ message: 'Potential helpers not found' });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getMatchedUsers(req: Request, res: Response) {
    try {
      const { error, value } = getMatchedUsersRequest.validate(req.query);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
      }
      const matchedUsers = await MatchingService.getMatchedUsers(value);
      if (matchedUsers) {
        res.status(200).json(matchedUsers);
      } else {
        res.status(400).json({ message: 'Matched users not found' });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async assignHelper(req: Request, res: Response) {
    try {
      const { error, value } = assignHelperRequestDto.validate(req.body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
      }
      const matching = await MatchingService.assignHelper(value);
      if (matching) {
        res.status(201).json(matching);
      } else {
        res.status(400).json({ message: 'Failed to assign helper' });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async unassignHelper(req: Request, res: Response) {
    try {
      const { error, value } = unassignHelperRequestDto.validate(req.body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
      }
      const { destroyed_rows } = await MatchingService.unassignHelper(value);
      if (destroyed_rows) {
        res.status(204).json({ message: 'Helper unassigned successfully' });
      } else {
        res.status(400).json({ message: 'Failed to unassign helper' });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new MatchingController();
