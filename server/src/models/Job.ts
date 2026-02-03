import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  description: string;
  company: string; // Ideally this would be a ref to a Company model, but keeping it simple for now
  recruiter: mongoose.Types.ObjectId; // User who posted it
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship';
  skills: string[];
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
      type: String,
      required: true, // In a real app, strict relation to Company model
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
    skills: [String],
    status: {
      type: String,
      enum: ['open', 'closed', 'draft'],
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
