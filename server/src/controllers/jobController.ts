import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import Job from '../models/Job';

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

// @desc    Get all jobs (with filtering & pagination)
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pageSize = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
      ? {
        $or: [
          { title: { $regex: req.query.keyword as string, $options: 'i' } },
          { skills: { $regex: req.query.keyword as string, $options: 'i' } }
        ]
      }
      : {};

    const count = await Job.countDocuments({ ...keyword });
    const jobs = await Job.find({ ...keyword })
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
