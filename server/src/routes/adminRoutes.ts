import express from 'express';
import { getAdminStats, deleteUser, deleteJobAdmin } from '../controllers/adminController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/stats', getAdminStats);
router.delete('/users/:id', deleteUser);
router.delete('/jobs/:id', deleteJobAdmin);

export default router;
