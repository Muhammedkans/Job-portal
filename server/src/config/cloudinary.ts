import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Storage Engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: any, file: any) => {
    return {
      folder: 'job-portal-uploads',
      resource_type: 'auto', // Auto-detect (image, pdf, video)
      allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'doc', 'docx'],
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`, // Unique filename
    };
  },
});

// Validation Filter
const fileFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/msword'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
  fileFilter: fileFilter,
});

export default upload;
