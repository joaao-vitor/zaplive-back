import { db } from '@prisma';
import ApiError from '@utils/ApiError';
import { Request, Response } from 'express';
import {
    BAD_REQUEST,
    CREATED,
    FORBIDDEN,
    NOT_FOUND,
    OK,
    UNAUTHORIZED,
} from 'http-status';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendVerificationEmail } from '@utils/sendVerificationEmail';
import { comparePassword, createTokenUser } from '@utils/authUtils';
import { attachCookiesToResponse } from '@utils/jwt';

export const signUp = async (req: Request, res: Response) => {
    const { username, email, password, confirmPassword } = req.body;
    console.log(req.body)
    if (!username || !email || !password || !confirmPassword)
        throw new ApiError(BAD_REQUEST, 'Provide all of the fields!');

    if (password !== confirmPassword)
        throw new ApiError(BAD_REQUEST, `Passwords don't match`);

    const usernameExists = !!(await db.user.findFirst({
        where: {
            username,
        },
    }));

    if (usernameExists)
        throw new ApiError(BAD_REQUEST, `Username already exists`);

    const emailExists = !!(await db.user.findFirst({
        where: {
            email,
        },
    }));

    if (emailExists) throw new ApiError(BAD_REQUEST, `Email already exists`);

    const salt = await bcrypt.genSalt(10);
    const cryptedPassword = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(40).toString('hex');

    const user = await db.user.create({
        data: {
            email,
            password: cryptedPassword,
            username,
            verificationToken,
        },
    });
    await sendVerificationEmail({
        name: username,
        email,
        verificationToken,
        origin: process.env.ORIGIN || '',
    });
    res.status(CREATED).json({
        code: CREATED,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
        },
        message: 'GREAT! Verify your email!'
    });
};

export const verifyEmail = async (req: Request, res: Response) => {
    const { verificationToken, email } = req.body;
    let user = await db.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) throw new ApiError(NOT_FOUND, 'User not found');
    if (user.isVerified)
        throw new ApiError(FORBIDDEN, 'Email already verified');

    if (user.verificationToken !== verificationToken)
        throw new ApiError(BAD_REQUEST, 'Wrong verification token');

    user = await db.user.update({
        where: {
            email,
            verificationToken,
        },
        data: {
            verificationToken: '',
            isVerified: true,
        },
    });

    res.status(OK).json({
        code: OK,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
        },
        message: 'GREAT! Email verified!'
    });
};

export const signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password)
        throw new ApiError(BAD_REQUEST, 'Provide all the fields');

    const user = await db.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) throw new ApiError(NOT_FOUND, 'User not found');
    if (!(await comparePassword(user.password, password)))
        throw new ApiError(FORBIDDEN, `Passwords dont't match`);

    if (!user.isVerified) throw new ApiError(BAD_REQUEST, 'Verify your email');

    const tokenUser = createTokenUser(user);

    const existingToken = await db.token.findFirst({
        where: {
            userId: user.id,
        },
    });

    let refreshToken = '';
    if (!!existingToken) {
        const { isValid } = existingToken;
        if (!isValid) throw new ApiError(UNAUTHORIZED, 'Invalid Credentials');
        refreshToken = existingToken.refreshToken;
        attachCookiesToResponse(res, tokenUser, refreshToken);
        res.status(OK).json({
            code: OK,
            user: tokenUser,
        });
    } else {
        refreshToken = crypto.randomBytes(40).toString('hex');
        const userAgent = req.headers['user-agent'];
        const ip = req.ip;

        await db.token.create({
            data: {
                refreshToken,
                ip: ip || '',
                userId: user.id,
                userAgent: userAgent || '',
            },
        });

        attachCookiesToResponse(res, tokenUser, refreshToken);

        res.status(OK).json({
            code: OK,
            user: tokenUser,
        });
    }
};

export const logout = async (req: Request, res: Response) => {
    await db.token.delete({
        where: {
            userId: req.user.id,
        },
    });

    res.cookie('accessToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.cookie('refreshToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    });

    res.status(OK).json({
        code: OK,
        message: 'Logout successfully!',
    });
};
