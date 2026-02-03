import express from 'express';
import { applyForJob, getJobApplications, getMyApplications, updateApplicationStatus } from '../controllers/applicationController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, authorize('candidate'), applyForJob);
router.get('/me', protect, authorize('candidate'), getMyApplications);
router.get('/job/:jobId', protect, authorize('recruiter'), getJobApplications);
router.put('/:id/status', protect, authorize('recruiter'), updateApplicationStatus);

export default router;
