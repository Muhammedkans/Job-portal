import express from 'express';
import { getPublicStats } from '../controllers/publicController';

const router = express.Router();

router.get('/stats', getPublicStats);

// Temporary Emergency Route
import { forceSeedJobs } from '../controllers/seedController';
router.get('/seed-now', forceSeedJobs);

export default router;
