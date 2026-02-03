import { Request, Response } from 'express';
import Job from '../models/Job';
import User from '../models/User';
import Company from '../models/Company';

export const forceSeedJobs = async (req: Request, res: Response) => {
  try {
    // 1. Create a Bot Recruiter if missing
    let recruiter = await User.findOne({ email: 'bot@jobportal.com' });
    if (!recruiter) {
      recruiter = await User.create({
        name: 'Job Aggregator Bot',
        email: 'bot@jobportal.com',
        passwordHash: 'password123',
        role: 'recruiter',
      });
    }

    // 2. Define High-Quality Real Jobs with their data
    const rawData = [
      {
        title: 'Senior Frontend Engineer',
        companyName: 'Google',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png',
        location: 'Mountain View, CA',
        skills: ['React', 'Next.js', 'TypeScript', 'GraphQL'],
        url: 'https://careers.google.com/',
        description: 'Join the Google Search team to build the next generation of search interfaces.'
      },
      {
        title: 'Software Engineer',
        companyName: 'Microsoft',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png',
        location: 'Redmond, WA',
        skills: ['C#', '.NET', 'Azure', 'React'],
        url: 'https://careers.microsoft.com/',
        description: 'Build scalable cloud applications on Azure.'
      },
      {
        title: 'Product Designer',
        companyName: 'Airbnb',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/2560px-Airbnb_Logo_B%C3%A9lo.svg.png',
        location: 'San Francisco, CA',
        skills: ['Figma', 'UI/UX', 'Prototyping'],
        url: 'https://careers.airbnb.com/',
        description: 'Design beautiful interfaces for the next billion travelers.'
      }
    ];

    const finalJobs = [];

    for (const item of rawData) {
      // Find or create company
      let company = await Company.findOne({ name: item.companyName });
      if (!company) {
        company = await Company.create({
          name: item.companyName,
          logo: item.logo,
          userId: recruiter._id,
          location: item.location,
          description: `Leading technology firm ${item.companyName}.`
        });
      }

      finalJobs.push({
        title: item.title,
        company: company._id,
        location: item.location,
        skills: item.skills,
        applicationUrl: item.url,
        description: item.description,
        salary: { min: 140000, max: 220000, currency: 'USD' },
        jobType: 'Full-time',
        status: 'open',
        recruiter: recruiter._id
      });
    }

    // 3. Clear and Insert
    await Job.deleteMany({ recruiter: recruiter._id });
    await Job.insertMany(finalJobs);

    res.json({ message: 'Database reset with Real Jobs successfully!', count: finalJobs.length });
  } catch (error) {
    res.status(500).json({ message: 'Seed failed', error });
  }
};
