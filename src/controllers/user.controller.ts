import { db } from '@prisma';
import { Request, Response } from 'express';
import { OK } from 'http-status';

export const showMe = async (req: Request, res: Response) => {
    res.status(OK).json({ code: OK, user: req.user });
};

export const getRecommendedUsers = async (req: Request, res: Response) => {
    const users = await db.user.findMany({
        where: {
            NOT: {
                id: req.user.id,
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
        include: { stream: {} },
    });

    res.status(OK).json({ code: OK, users });
};
