import { TokenUser } from '@utils/authUtils';

declare global {
    namespace Express {
        interface Request {
            user: TokenUser;
        }
    }
}
