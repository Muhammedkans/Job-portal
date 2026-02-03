import express from 'express';
import { uploadFile } from '../controllers/uploadController';
import { protect } from '../middleware/authMiddleware';
import upload from '../config/cloudinary';

const router = express.Router();

// 'file' must match the form-data key from frontend
router.post('/', protect, upload.single('file'), uploadFile);

export default router;
