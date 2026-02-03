import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IApplication extends Document {
  job: mongoose.Types.ObjectId;
  candidate: mongoose.Types.ObjectId;
  resumeUrl: string; // Snapshot of resume at time of application
  coverLetter?: string;
  status: 'applied' | 'viewed' | 'shortlisted' | 'rejected' | 'hired';
}

const applicationSchema: Schema<IApplication> = new Schema(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    candidate: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resumeUrl: {
      type: String,
      required: true, // Mandatory for professional platforms
    },
    coverLetter: {
      type: String,
      maxLength: 1000,
    },
    status: {
      type: String,
      enum: ['applied', 'viewed', 'shortlisted', 'rejected', 'hired'],
      default: 'applied',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

const Application: Model<IApplication> = mongoose.model<IApplication>('Application', applicationSchema);

export default Application;
