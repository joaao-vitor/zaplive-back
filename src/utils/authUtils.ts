import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';

export const comparePassword = (userPassword: string, password: string) => {
    return bcrypt.compare(password, userPassword);
};

export interface TokenUser {
    id: number;
    username: string;
    imageUrl: string;
    refreshToken?: string;
}

export const createTokenUser = (user: User): TokenUser => {
    return {
        id: user.id,
        username: user.username,
        imageUrl: user.imageUrl || '',
    };
};
