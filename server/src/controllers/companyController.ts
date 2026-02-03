import { Request, Response, NextFunction } from 'express';
import Company from '../models/Company';

// @desc    Register a new company
// @route   POST /api/companies
// @access  Private/Recruiter
export const registerCompany = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { name, description, website, location } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Company name is required' });
    }

    let company = await Company.findOne({ name });
    if (company) {
      return res.status(400).json({ message: 'Company already exists' });
    }

    company = await Company.create({
      name,
      description,
      website,
      location,
      userId: req.user._id,
    });

    res.status(201).json(company);
  } catch (error) {
    next(error);
  }
};

// @desc    Get companies for current recruiter
// @route   GET /api/companies
// @access  Private/Recruiter
export const getMyCompanies = async (req: any, res: Response, next: NextFunction) => {
  try {
    const companies = await Company.find({ userId: req.user._id });
    res.json(companies);
  } catch (error) {
    next(error);
  }
};

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Public
export const getCompanyById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    next(error);
  }
};
