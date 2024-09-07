import { Router } from 'express';
import MatchingController from '../controllers/matching.controller';

const router = Router();

router.get(
  '/matchings/unmatched/clients',
  MatchingController.getUnmatchedClients
);
router.get(
  '/matchings/potential/:clientId',
  MatchingController.getPotentialMatches
);
router.get('/matchings/users', MatchingController.getMatchedUsers);
router.post('/matchings/assign', MatchingController.assignHelper);
router.post('/matchings/unassign', MatchingController.unassignHelper);
export default router;
