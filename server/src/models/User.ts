import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// 1. Interface (Type Safety)
export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'candidate' | 'recruiter' | 'admin';
  matchPassword: (enteredPassword: string) => Promise<boolean>;
  savedJobs: mongoose.Types.ObjectId[];
  profile: {
    bio?: string;
    skills: string[];
    experience: string;
    education: string;
    website?: string;
    github?: string;
    linkedin?: string;
    resumeUrl?: string;
  };
}

// 2. Schema (Data Structure)
const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true, // Optimizes query performance
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['candidate', 'recruiter', 'admin'],
      default: 'candidate',
    },
    savedJobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
    profile: {
      bio: { type: String, default: '' },
      skills: { type: [String], default: [] },
      experience: { type: String, default: '' },
      education: { type: String, default: '' },
      website: { type: String, default: '' },
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      resumeUrl: { type: String, default: '' },
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// 3. Pre-save Hook (Security - Hash Password)
userSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

// 4. Instance Method (Encapsulation)
userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
