import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  description: string;
  company: mongoose.Types.ObjectId; // Reference to Company Model
  companyLogo?: string; // Optional override logo
  recruiter: mongoose.Types.ObjectId; // User who posted it
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship';
  skills: string[];
  applicationUrl?: string;
  status: 'open' | 'closed' | 'draft';
}

const jobSchema: Schema<IJob> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    companyLogo: {
      type: String, // URL to logo
      default: '',
    },
    recruiter: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    salary: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      currency: { type: String, default: 'USD' },
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'],
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    applicationUrl: {
      type: String, // If present, redirect here instead of internal apply
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for Search Performance
jobSchema.index({ title: 'text', description: 'text', skills: 'text' });

const Job: Model<IJob> = mongoose.model<IJob>('Job', jobSchema);

export default Job;
