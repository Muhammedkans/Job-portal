import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import Application from '../models/Application';
import Job from '../models/Job';
import Profile from '../models/Profile';

interface AuthRequest extends Request {
  user?: any;
}

const applicationSchema = z.object({
  jobId: z.string(),
  coverLetter: z.string().optional(),
});

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Candidate only)
export const applyForJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { jobId, coverLetter } = applicationSchema.parse(req.body);

    // 1. Check if Job exists and is Open
    const job = await Job.findById(jobId);
    if (!job || job.status !== 'open') {
      res.status(404);
      throw new Error('Job not found or no longer accepting applications');
    }

    // 2. Check Role
    if (req.user.role !== 'candidate') {
      res.status(403);
      throw new Error('Only candidates can apply for jobs');
    }

    // 3. Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.user._id,
    });

    if (existingApplication) {
      res.status(400);
      throw new Error('You have already applied for this job');
    }

    // 4. Get Resume from Profile (Snapshotting)
    const profile = await Profile.findOne({ user: req.user._id });
    // For MVP, if no resume url, use a placeholder or require one. 
    // In production, we'd block application without a resume.
    const resumeUrl = profile?.resumeUrl || 'pending_upload';

    const application = await Application.create({
      job: jobId,
      candidate: req.user._id,
      resumeUrl,
      coverLetter,
    });

    res.status(201).json(application);

  } catch (error) {
    next(error);
  }
};

// @desc    Get applications for a specific job (Recruiter View)
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter only)
export const getJobApplications = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      res.status(404);
      throw new Error('Job not found');
    }

    // Security: Only the owner of the job can see applicants
    if (job.recruiter.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to view applications for this job');
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('candidate', 'name email')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter only)
export const updateApplicationStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      res.status(404);
      throw new Error('Application not found');
    }

    // Type guard for populated job
    const job = application.job as any;

    // Security: Only the owner of the job can update status
    if (job.recruiter.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this application');
    }

    application.status = status;
    await application.save();

    res.json(application);
  } catch (error) {
    next(error);
  }
};

// @desc    Get my applications (Candidate View)
// @route   GET /api/applications/me
// @access  Private (Candidate)
export const getMyApplications = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate('job', 'title company location status')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    next(error);
  }
};
