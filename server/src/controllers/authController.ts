import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import User from '../models/User';
import generateToken from '../utils/generateToken';

// Zod Schema for Validation
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['candidate', 'recruiter']).optional(), // Admin cannot be created publicly
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Validate Input
    const validatedData = registerSchema.parse(req.body);

    // 2. Check Exists
    const userExists = await User.findOne({ email: validatedData.email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // 3. Create User
    const user = await User.create({
      name: validatedData.name,
      email: validatedData.email,
      passwordHash: validatedData.password, // Pre-save hook will hash this
      role: validatedData.role || 'candidate',
    });

    if (user) {
      // 4. Generate Token (Session)
      generateToken(res, user._id as unknown as string);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error); // Pass to global error handler
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id as unknown as string);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req: Request, res: Response) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};
