import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import Job from '../models/Job';
import User from '../models/User';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
  user?: any;
}

const jobSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  company: z.string(), // This will be the Company ID
  location: z.string().min(2),
  salary: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
    currency: z.string().default('USD'),
  }),
  jobType: z.enum(['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship']),
  skills: z.array(z.string()),
  applicationUrl: z.string().optional(),
});

// @desc    Get all jobs (with advanced professional filtering & pagination)
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    let query: any = { status: 'open' };

    // 1. Keyword (Title/Skills)
    if (req.query.keyword) {
      query.$or = [
        { title: { $regex: req.query.keyword as string, $options: 'i' } },
        { skills: { $regex: req.query.keyword as string, $options: 'i' } }
      ];
    }

    // 2. Location
    if (req.query.location) {
      query.location = { $regex: req.query.location as string, $options: 'i' };
    }

    // 3. Job Type (Expects comma separated string or array)
    if (req.query.jobTypes) {
      const types = (req.query.jobTypes as string).split(',');
      query.jobType = { $in: types };
    }

    // 4. Experience Level
    if (req.query.experienceLevels) {
      const levels = (req.query.experienceLevels as string).split(',');
      query.experienceLevel = { $in: levels };
    }

    // 5. Min Salary (INR)
    if (req.query.minSalary) {
      query['salary.max'] = { $gte: Number(req.query.minSalary) };
    }

    // 6. Remote Only
    if (req.query.remoteOnly === 'true') {
      query.location = { $regex: 'remote', $options: 'i' };
    }

    // 7. Date Posted (Days ago)
    if (req.query.daysAgo) {
      const days = Number(req.query.daysAgo);
      const date = new Date();
      date.setDate(date.getDate() - days);
      query.createdAt = { $gte: date };
    }

    const count = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('recruiter', 'name email')
      .populate('company', 'name logo location')
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      jobs,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get jobs posted by logged in recruiter
// @route   GET /api/jobs/my
// @access  Private/Recruiter
export const getMyJobs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id })
      .populate('company', 'name logo');
    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('recruiter', 'name email')
      .populate('company', 'name logo description website location');

    if (job) {
      res.json(job);
    } else {
      res.status(404);
      throw new Error('Job not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private/Recruiter
export const createJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const validatedData = jobSchema.parse(req.body);

    const job = await Job.create({
      ...validatedData,
      recruiter: req.user._id,
    });

    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};


// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private/Recruiter (Owner only)
export const deleteJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const job = await Job.findById(req.params.id);

    if (job) {
      if (job.recruiter.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to delete this job');
      }

      await job.deleteOne();
      res.json({ message: 'Job removed' });
    } else {
      res.status(404);
      throw new Error('Job not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle Save Job
// @route   POST /api/jobs/:id/save
// @access  Private (Candidate)
export const toggleSaveJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const jobIdStr = req.params.id;
    const isSaved = user.savedJobs.some(id => id.toString() === jobIdStr);

    if (!isSaved) {
      user.savedJobs.push(new mongoose.Types.ObjectId(jobIdStr) as any);
      await user.save();
      res.json({ message: 'Job saved', saved: true });
    } else {
      user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobIdStr);
      await user.save();
      res.json({ message: 'Job removed from saved', saved: false });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get saved jobs
// @route   GET /api/jobs/saved/all
// @access  Private (Candidate)
export const getSavedJobs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedJobs',
      populate: { path: 'company', select: 'name logo' }
    });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.json(user.savedJobs);
  } catch (error) {
    next(error);
  }
};
