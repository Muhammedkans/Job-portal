import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IExperience {
  title: string;
  company: string;
  location?: string;
  from: Date;
  to?: Date;
  current: boolean;
  description?: string;
}

export interface IEducation {
  school: string;
  degree: string;
  fieldOfStudy: string;
  from: Date;
  to?: Date;
}

export interface IProfile extends Document {
  user: mongoose.Types.ObjectId;
  headline?: string;
  bio?: string;
  location?: string;
  skills: string[];
  experience: IExperience[];
  education: IEducation[];
  socials: {
    linkedin?: string;
    github?: string;
    website?: string;
  };
  resumeUrl?: string;
}

const profileSchema: Schema<IProfile> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One profile per user
    },
    headline: {
      type: String,
      trim: true,
      maxLength: 100,
    },
    bio: {
      type: String,
      maxLength: 500,
    },
    location: {
      type: String,
    },
    skills: {
      type: [String],
      validate: [arrayLimit, '{PATH} exceeds the limit of 20'],
    },
    experience: [
      {
        title: { type: String, required: true },
        company: { type: String, required: true },
        location: String,
        from: { type: Date, required: true },
        to: Date,
        current: { type: Boolean, default: false },
        description: String,
      },
    ],
    education: [
      {
        school: { type: String, required: true },
        degree: { type: String, required: true },
        fieldOfStudy: { type: String, required: true },
        from: { type: Date, required: true },
        to: Date,
      },
    ],
    socials: {
      linkedin: String,
      github: String,
      website: String,
    },
    resumeUrl: String,
  },
  {
    timestamps: true,
  }
);

function arrayLimit(val: string[]) {
  return val.length <= 20;
}

const Profile: Model<IProfile> = mongoose.model<IProfile>('Profile', profileSchema);

export default Profile;
