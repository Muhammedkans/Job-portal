import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Job from '../models/Job';
import Profile from '../models/Profile';
import connectDB from '../config/db';

dotenv.config();

const users = [
  {
    name: 'Google Recruiter',
    email: 'careers@google.com',
    password: 'password123',
    role: 'recruiter',
  },
  {
    name: 'Netflix Talent',
    email: 'talent@netflix.com',
    password: 'password123',
    role: 'recruiter',
  },
  {
    name: 'Amazon HR',
    email: 'hiring@amazon.com',
    password: 'password123',
    role: 'recruiter',
  },
  {
    name: 'John Doe (Candidate)',
    email: 'john@example.com',
    password: 'password123',
    role: 'candidate',
  }
];

const jobs = [
  {
    title: 'Senior React Engineer',
    company: 'Google',
    location: 'Mountain View, CA (Hybrid)',
    description: `About the job
Google is looking for a Senior React Engineer to join the YouTube team. You will be responsible for building the next generation of video consumption interfaces.

Responsibilities:
- Build pixel-perfect, buttery smooth UIs across both mobile and web platforms.
- Leverage native APIs for deep integrations with both platforms.
- Diagnose and fix bugs and performance bottlenecks for performance that feels native.
- Maintain code and write automated tests to ensure the product is of the highest quality.

Requirements:
- 5+ years of experience with JavaScript/TypeScript.
- Deep understanding of React and its core principles.
- Experience with Redux, Relay, or Apollo.
- Familiarity with modern front-end build pipelines and tools.`,
    salary: { min: 180000, max: 250000, currency: 'USD' },
    jobType: 'Full-time',
    skills: ['React', 'TypeScript', 'Next.js', 'System Design'],
    status: 'open',
    applicationUrl: 'https://www.google.com/about/careers/applications/jobs/results/',
  },
  {
    title: 'Backend Engineer (Node.js)',
    company: 'Netflix',
    location: 'Remote (US/Canada)',
    description: `Detailed Description
Netflix is reinventing how the world watches movies. We are looking for a backend engineer to help scale our streaming infrastructure.

What you will do:
- Design and build scalable microservices using Node.js and gRPC.
- Optimize database queries for high-throughput MongoDB clusters.
- Collaborate with frontend teams to deliver data efficiently.

What we value:
- Experience with high-scale distributed systems.
- Proficiency in Node.js, Express, and Docker.
- Understanding of eventual consistency and message queues (Kafka).`,
    salary: { min: 160000, max: 240000, currency: 'USD' },
    jobType: 'Full-time',
    skills: ['Node.js', 'MongoDB', 'Microservices', 'AWS'],
    status: 'open',
  },
  {
    title: 'Product Designer',
    company: 'Airbnb',
    location: 'San Francisco, CA',
    description: `We are looking for a Product Designer to join our core Design System team. You will define the visual language of Airbnb.

Requirements:
- A portfolio demonstrating experience in shipping high-quality mobile and web products.
- Mastery of Figma and prototyping tools.
- Ability to work with engineers to ensure design feasibility.`,
    salary: { min: 140000, max: 200000, currency: 'USD' },
    jobType: 'Full-time',
    skills: ['Figma', 'UI/UX', 'Prototyping'],
    status: 'open',
  },
  {
    title: 'Junior Frontend Developer',
    company: 'Spotify',
    location: 'New York, NY',
    description: `Join the team that brings music to millions. We are looking for a junior developer to work on our web player.

    Requirements:
    - Solid understanding of HTML, CSS, Javascript.
    - Experience with React is a plus.
    - Passion for music and technology.`,
    salary: { min: 90000, max: 120000, currency: 'USD' },
    jobType: 'Full-time',
    skills: ['JavaScript', 'CSS', 'React'],
    status: 'open',
  },
];

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Job.deleteMany();
    await Profile.deleteMany();

    console.log('Data Destroyed...');

    // Create Users
    const createdUsers = await User.create(users);

    // Assign jobs to random recruiters
    const recruiters = createdUsers.filter(u => u.role === 'recruiter');

    const sampleJobs = jobs.map((job, index) => {
      return {
        ...job,
        recruiter: recruiters[index % recruiters.length]._id
      };
    });

    await Job.create(sampleJobs);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
