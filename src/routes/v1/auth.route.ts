import { Router } from 'express';
import {
    logout,
    signIn,
    signUp,
    verifyEmail,
} from '@controllers/auth.controller';
import { authenticateUser } from '@middlewares/auth.mid';

const router = Router();

router.post('/sign-up', signUp);
router.patch('/verify-email', verifyEmail);
router.post('/sign-in', signIn);
router.delete('/logout', authenticateUser, logout);
export default router;
