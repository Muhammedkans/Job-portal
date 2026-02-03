import { Request, Response, NextFunction } from 'express';
import Job from '../models/Job';
import User from '../models/User';
import Application from '../models/Application';

// @desc    Get public homepage stats
// @route   GET /api/public/stats
// @access  Public
export const getPublicStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobCount = await Job.countDocuments({ status: 'open' });
    const companyCount = await User.countDocuments({ role: 'recruiter' });
    const applicationCount = await Application.countDocuments();

    // Get 3 latest jobs for "Featured" section
    const featuredJobs = await Job.find({ status: 'open' })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('recruiter', 'name')
      .populate('company', 'name logo');

    res.json({
      jobs: jobCount,
      companies: companyCount,
      successStories: applicationCount, // Using applications as a proxy for activity
      featuredJobs
    });
  } catch (error) {
    next(error);
  }
};
