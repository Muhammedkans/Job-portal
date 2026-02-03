import { Request, Response, NextFunction } from 'express';

// @desc    Upload a single file
// @route   POST /api/upload
// @access  Private
export const uploadFile = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No file uploaded');
    }

    // Cloudinary returns the URL in `path`
    res.json({
      message: 'File uploaded successfully',
      url: req.file.path,
      secure_url: req.file.path, // In cloudinary-multer, path is usually the url
      filename: req.file.filename,
    });
  } catch (error) {
    next(error);
  }
};
