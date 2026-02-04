import express from 'express';
import { getJobs, getJobById, createJob, deleteJob, getMyJobs, toggleSaveJob, getSavedJobs } from '../controllers/jobController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(getJobs)
  .post(protect, authorize('recruiter', 'admin'), createJob);

router.get('/my', protect, authorize('recruiter'), getMyJobs);

router.route('/:id')
  .get(getJobById)
  .delete(protect, authorize('recruiter', 'admin'), deleteJob);

router.post('/:id/save', protect, authorize('candidate'), toggleSaveJob);
router.get('/saved/all', protect, authorize('candidate'), getSavedJobs);

export default router;
