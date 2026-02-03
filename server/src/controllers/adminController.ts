import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Job from '../models/Job';

// @desc    Get all stats (Admin)
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userCount = await User.countDocuments();
    const jobCount = await Job.countDocuments();
    const jobs = await Job.find({}).sort({ createdAt: -1 }).limit(5).populate('recruiter', 'name');
    const users = await User.find({}).sort({ createdAt: -1 }).limit(5);

    res.json({
      counts: {
        users: userCount,
        jobs: jobCount,
      },
      recentJobs: jobs,
      recentUsers: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (Admin)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job (Admin)
// @route   DELETE /api/admin/jobs/:id
// @access  Private/Admin
export const deleteJobAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }
    await job.deleteOne();
    res.json({ message: 'Job removed' });
  } catch (error) {
    next(error);
  }
};
