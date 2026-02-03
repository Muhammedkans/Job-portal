import mongoose, { Document, Schema } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  description: string;
  website: string;
  location: string;
  logo: string;
  userId: mongoose.Types.ObjectId; // The recruiter who owns this company
  followers: mongoose.Types.ObjectId[];
}

const companySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    website: { type: String },
    location: { type: String },
    logo: { type: String, default: '' },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default mongoose.model<ICompany>('Company', companySchema);
