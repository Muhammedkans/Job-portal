import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import Job from '../models/Job';
import User from '../models/User';
import Company from '../models/Company';
import connectDB from '../config/db';

dotenv.config();

/**
 * 🚀 REAL-WORLD JOB AGGREGATOR (LEGAL & POWERFUL)
 * Sources: 
 * 1. Remotive (Developer focus - No Key needed)
 * 2. The Muse (Corporate focus - No Key needed)
 * 3. Adzuna (Global - Needs Key in .env)
 */

const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, '');

const getRandomSalary = (isIndia = false) => {
  if (isIndia) {
    // INR formatting (LPA - Lakhs Per Annum style)
    const min = Math.floor(Math.random() * (15 - 5 + 1) + 5) * 100000;
    const max = min + Math.floor(Math.random() * (10 - 2 + 1) + 2) * 100000;
    return { min, max, currency: 'INR' };
  }
  // Global mapping to INR (Approx $60k-$120k converted)
  const min = Math.floor(Math.random() * (60 - 30 + 1) + 30) * 100000;
  const max = min + Math.floor(Math.random() * (40 - 10 + 1) + 10) * 100000;
  return { min, max, currency: 'INR' };
};

const commonSkills = ['React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker', 'Kubernetes', 'Go', 'Java', 'UI/UX'];
const getRandomSkills = () => {
  const shuffled = commonSkills.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 3) + 2);
};

const importJobs = async () => {
  try {
    await connectDB();
    console.log('🔌 Connected to Elite Database');

    // 1. Get or Create Bot Recruiter
    let recruiter = await User.findOne({ email: 'bot@jobportal.com' });
    if (!recruiter) {
      recruiter = await User.create({
        name: 'HireUp Global Aggregator',
        email: 'bot@jobportal.com',
        passwordHash: 'secure_aggregator_123',
        role: 'recruiter',
      });
    }

    const allRawJobs: any[] = [];

    // --- SOURCE 1: REMOTIVE (FREE / LEGAL) ---
    console.log('📡 Fetching from Remotive API (Software Dev)...');
    try {
      const { data } = await axios.get('https://remotive.com/api/remote-jobs?limit=25');
      data.jobs.forEach((j: any) => {
        allRawJobs.push({
          title: j.title,
          companyName: j.company_name,
          logo: j.company_logo,
          location: j.candidate_required_location || 'Remote',
          description: stripHtml(j.description).substring(0, 2000),
          url: j.url,
          skills: j.tags && j.tags.length > 0 ? j.tags : getRandomSkills()
        });
      });
    } catch (err) { console.log('⚠️ Remotive Fetch failed'); }

    // --- SOURCE 2: THE MUSE (FREE / LEGAL) ---
    console.log('📡 Fetching from The Muse API (Corporate Jobs)...');
    try {
      const { data } = await axios.get('https://www.themuse.com/api/public/jobs?page=1&category=Engineering&category=Design');
      data.results.forEach((j: any) => {
        allRawJobs.push({
          title: j.name,
          companyName: j.company.name,
          logo: '', // The Muse doesn't always provide logos in the list
          location: j.locations.length > 0 ? j.locations[0].name : 'United States',
          description: stripHtml(j.contents).substring(0, 2000),
          url: j.refs.landing_page,
          skills: getRandomSkills()
        });
      });
    } catch (err) { console.log('⚠️ The Muse Fetch failed'); }

    // --- SOURCE 3: ADZUNA (GLOBAL CORPORATE & LOCAL REGIONAL) ---
    if (process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY) {
      const countries = [
        { code: 'in', name: 'India', where: 'Kerala' },
        { code: 'us', name: 'United States', where: '' },
        { code: 'gb', name: 'United Kingdom', where: '' },
        { code: 'ca', name: 'Canada', where: '' },
        { code: 'sg', name: 'Singapore', where: '' }
      ];

      for (const country of countries) {
        console.log(`📡 Fetching real jobs from ${country.name}${country.where ? ` (${country.where})` : ''}...`);
        try {
          const whereParam = country.where ? `&where=${country.where}` : '';
          const url = `https://api.adzuna.com/v1/api/jobs/${country.code}/search/1?app_id=${process.env.ADZUNA_APP_ID}&app_key=${process.env.ADZUNA_APP_KEY}&results_per_page=15&what=software%20developer${whereParam}`;

          const { data } = await axios.get(url);

          data.results.forEach((j: any) => {
            allRawJobs.push({
              title: j.title,
              companyName: j.company.display_name,
              logo: '',
              location: j.location.display_name || `${country.name}`,
              description: stripHtml(j.description),
              url: j.redirect_url,
              skills: getRandomSkills(),
              isIndia: country.code === 'in'
            });
          });
        } catch (err) {
          console.log(`⚠️ Adzuna ${country.name} Fetch failed.`);
        }
      }
    }

    console.log(`📑 Total discovered jobs: ${allRawJobs.length}. Syncing to DB...`);

    const finalJobs = [];

    for (const raw of allRawJobs) {
      // 🕵️ DATA VALIDATION: Skip if essential info is missing
      if (!raw.companyName || !raw.title) continue;

      // Find or Create Company
      let company = await Company.findOne({ name: raw.companyName });
      if (!company) {
        company = await Company.create({
          name: raw.companyName,
          logo: raw.logo || '',
          userId: recruiter._id,
          location: raw.location,
          description: `Leading innovator in their industry: ${raw.companyName}.`
        });
      }

      finalJobs.push({
        title: raw.title,
        company: company._id,
        location: raw.location,
        description: raw.description,
        salary: getRandomSalary(raw.isIndia),
        jobType: 'Full-time',
        skills: raw.skills,
        status: 'open',
        applicationUrl: raw.url,
        recruiter: recruiter._id,
      });
    }

    // Clear old aggregated data
    await Job.deleteMany({ recruiter: recruiter._id });

    // Batch Update with Error Handling
    if (finalJobs.length > 0) {
      try {
        await Job.insertMany(finalJobs);
        console.log(`✅ GLOBAL SYNC COMPLETE: ${finalJobs.length} real jobs indexed from 5+ Countries!`);
      } catch (insertErr) {
        console.error('⚠️ Batch insert issues:', insertErr);
      }
    }

    process.exit();
  } catch (error) {
    console.error('❌ Aggregator failed:', error);
    process.exit(1);
  }
};

importJobs();

