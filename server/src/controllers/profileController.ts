import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import Profile from '../models/Profile';

interface AuthRequest extends Request {
  user?: any;
}

// Zod Validation Schema for Profile
const profileSchema = z.object({
  headline: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().optional(),
  skills: z.array(z.string()).max(20).optional(),
  socials: z.object({
    linkedin: z.string().url().optional().or(z.literal('')),
    github: z.string().url().optional().or(z.literal('')),
    website: z.string().url().optional().or(z.literal('')),
  }).optional(),
  resumeUrl: z.string().url().optional().or(z.literal('')),
  // Note: Complex objects like Experience/Education usually need their own separate update endpoints or careful validation
  // keeping it simple for structure now
});

// @desc    Get current user profile
// @route   GET /api/profile/me
// @access  Private
export const getCurrentProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id }).populate('user', 'name email role');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    next(error);
  }
};

// @desc    Create or Update user profile
// @route   POST /api/profile
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const validatedData = profileSchema.parse(req.body);

    const profileFields = {
      user: req.user._id,
      ...validatedData,
    };

    // Upsert: Update if exists, Create if not
    let profile = await Profile.findOne({ user: req.user._id });

    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate(
        { user: req.user._id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }

    // Create
    profile = await Profile.create(profileFields);
    res.json(profile);

  } catch (error) {
    next(error);
  }
};

// @desc    Get profile by User ID (Public - for Recruiters)
// @route   GET /api/profile/user/:user_id
// @access  Public
export const getProfileByUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', 'name email role');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    next(error);
  }
};
