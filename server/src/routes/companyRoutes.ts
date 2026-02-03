import express from 'express';
import { registerCompany, getMyCompanies, getCompanyById } from '../controllers/companyController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, authorize('recruiter'), registerCompany);
router.get('/', protect, authorize('recruiter'), getMyCompanies);
router.get('/:id', getCompanyById);

export default router;
