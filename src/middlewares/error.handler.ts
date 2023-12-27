import httpStatus, { BAD_REQUEST, INTERNAL_SERVER_ERROR } from 'http-status';
import { Response, Request, NextFunction } from 'express';
import ApiError from '@utils/ApiError';

export const errorHandler = (
    err: ApiError | Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!(err instanceof ApiError)) {
        console.error('Erro não tratado:', err.stack || err);
        const statusCode = INTERNAL_SERVER_ERROR;
        const message = `Something went wrong! ${httpStatus[statusCode]}`;
        err = new ApiError(statusCode, message);
    }

    // Type assertion para informar ao TypeScript que 'err' é uma instância de 'ApiError'
    return res.status((err as ApiError).statusCode).json({
        code: (err as ApiError).statusCode,
        message: err.message,
    });
};
