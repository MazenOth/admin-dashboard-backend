import { Request, Response } from 'express';
import MatchingService from '../services/matching.service';

class MatchingController {
  async getUnmatchedClients(req: Request, res: Response) {
    try {
      const paginationOptions = {
        size: 10,
        page: 1,
      };
      const unmatchedClients = await MatchingService.getUnmatchedClients(
        paginationOptions
      );
      res.status(200).json(unmatchedClients);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  async getPotentialMatches(req: Request, res: Response) {
    try {
      const potentialHelpers = await MatchingService.getPotentialMatches(
        req.body
      );
      res.status(200).json(potentialHelpers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getMatchedUsers(req: Request, res: Response) {
    try {
      const paginationOptions = {
        size: 10,
        page: 1,
      };
      const matchedUsers = await MatchingService.getMatchedUsers(
        paginationOptions
      );
      res.status(200).json(matchedUsers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async assignHelper(req: Request, res: Response) {
    try {
      const matching = await MatchingService.assignHelper(req.body);
      res.status(201).json(matching);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async unassignHelper(req: Request, res: Response) {
    try {
      const matching = await MatchingService.unassignHelper(req.body);
      res.status(200).json(matching);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new MatchingController();
