import jwt from 'jsonwebtoken';
import ApiError from './ApiError';
import { INTERNAL_SERVER_ERROR } from 'http-status';
import { TokenUser } from './authUtils';
import { Response } from 'express';

export const generateJWT = async (payload: Object) => {
    let token = '';

    if (process.env.JWT_SECRET)
        token = jwt.sign(payload, process.env.JWT_SECRET);
    else
        throw new ApiError(
            INTERNAL_SERVER_ERROR,
            'ERROR WHILE GENERATING TOKEN'
        );

    return token;
};

export const validateToken = async (token: string) => {
    if (process.env.JWT_SECRET)
        return jwt.verify(token, process.env.JWT_SECRET);

    throw new ApiError(INTERNAL_SERVER_ERROR, 'ERROR WHILE VALIDATING TOKEN');
};

export interface RefreshTokenPayload {
    user: TokenUser;
    refreshToken: string;
}

export const attachCookiesToResponse = (
    res: Response,
    user: TokenUser,
    refreshToken: string
) => {
    const accessTokenJWT = generateJWT(user);
    const refreshTokenJWT = generateJWT({ user, refreshToken });

    const oneDay = 1000 * 60 * 60 * 24;
    const longerExp = 1000 * 60 * 60 * 24 * 30;

    res.cookie('accessToken', accessTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        expires: new Date(Date.now() + oneDay),
    });

    res.cookie('refreshToken', refreshTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        expires: new Date(Date.now() + longerExp),
    });
};
