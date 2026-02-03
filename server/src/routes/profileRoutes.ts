import express from 'express';
import { getCurrentProfile, updateProfile, getProfileByUserId } from '../controllers/profileController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .post(protect, updateProfile); // Create or Update

router.get('/me', protect, getCurrentProfile);

router.get('/user/:user_id', getProfileByUserId); // Publicly viewable (e.g. by recruiters)

export default router;
