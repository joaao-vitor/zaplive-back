import { NextFunction, Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import ApiError from '@utils/ApiError';
import { INTERNAL_SERVER_ERROR, OK } from 'http-status';

export const uploadImage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const uploadedFile = req.file;
    if (!uploadedFile) {
        return res.status(400).json({ error: 'No files sent.' });
    }
    const result = await cloudinary.uploader
        .upload_stream(
            {
                resource_type: 'auto',
            },
            (err, result) => {
                if (err)
                    throw new ApiError(
                        INTERNAL_SERVER_ERROR,
                        'Error while uploading the image'
                    );

                req.body.imageUrl = result?.secure_url;
                next();
            }
        )
        .end(uploadedFile.buffer);
};
