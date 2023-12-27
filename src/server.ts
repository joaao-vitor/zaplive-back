import dotenv from 'dotenv';
dotenv.config();
import 'express-async-errors';

import express from 'express';
import router from './routes/v1';

import { errorHandler } from './middlewares/error.handler';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(cookieParser(process.env.JWT_SECRET));
app.use(bodyParser.json());
app.use(router);
app.use(errorHandler);
app.listen(3000, () => {
    console.log(`Server working on port ${process.env.PORT} 🚀`);
});
