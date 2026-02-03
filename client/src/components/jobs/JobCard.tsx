import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface JobCardProps {
  job: {
    _id: string;
    title: string;
    company: {
      name: string;
      logo?: string;
    };
    location: string;
    salary: { min: number; max: number; currency: string };
    jobType: string;
    skills: string[];
    createdAt: string;
  };
}

export const JobCard = ({ job }: JobCardProps) => {
  const companyName = typeof job.company === 'string' ? job.company : job.company?.name || 'Unknown Company';
  const companyLogo = typeof job.company === 'object' ? job.company?.logo : undefined;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 group">
      <div className="flex justify-between items-start gap-4">
        {/* Logo */}
        {companyLogo ? (
          <img src={companyLogo} alt={companyName} className="w-12 h-12 rounded-full object-contain bg-gray-50 border border-gray-100" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
            {companyName.charAt(0)}
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">{job.title}</h3>
            {Math.random() > 0.7 && (
              <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-bold">HOT</span>
            )}
          </div>
          <p className="text-gray-600 font-medium mt-1">{companyName}</p>
        </div>
        <span className="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
          {job.jobType}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
        <div className="flex items-center">
          <svg className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {job.location}
        </div>
        <div className="flex items-center">
          <svg className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(job.salary.min)} -
          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(job.salary.max)}
        </div>
        <div className="flex items-center">
          <svg className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          {new Date(job.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {job.skills.map((skill, index) => (
          <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-6">
        <Link href={`/jobs/${job._id}`} className="w-full block">
          <Button variant="outline" className="w-full">View Details</Button>
        </Link>
      </div>
    </div>
  );
};
