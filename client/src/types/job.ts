export interface Job {
  _id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: { min: number; max: number; currency: string };
  jobType: string;
  skills: string[];
  recruiter: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}
