import { db } from '@prisma';
import ApiError from '@utils/ApiError';
import {
    RefreshTokenPayload,
    attachCookiesToResponse,
    validateToken,
} from '@utils/jwt';
import { Request, Response, NextFunction } from 'express';
import { UNAUTHORIZED } from 'http-status';

export const authenticateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { accessToken } = req.signedCookies;

    if (accessToken) {
        const payload = (await validateToken(
            accessToken
        )) as RefreshTokenPayload;
        req.user = payload.user;
        return next();
    }

    const payload = (await validateToken(accessToken)) as RefreshTokenPayload;

    const existingToken = await db.token.findFirst({
        where: {
            userId: payload.user.id,
            refreshToken: payload.refreshToken,
        },
    });

    if (!existingToken || !existingToken?.isValid)
        throw new ApiError(
            UNAUTHORIZED,
            'Authentication Expired, sign-in again'
        );

    attachCookiesToResponse(res, payload.user, existingToken.refreshToken);

    req.user = payload.user;
    next();
};
