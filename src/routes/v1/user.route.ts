import express from 'express';
import { getRecommendedUsers, showMe } from '@controllers/user.controller';
import { authenticateUser } from '@middlewares/auth.mid';

const router = express.Router();

router.route('/me').get(authenticateUser, showMe);
router.route('/recommended').get(authenticateUser, getRecommendedUsers);

export default router;
