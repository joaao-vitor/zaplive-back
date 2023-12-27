import { uploadImage } from '@controllers/utils.controller';
import { Router } from 'express';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.post('/upload-image', upload.single('image'), uploadImage);
export default router;
