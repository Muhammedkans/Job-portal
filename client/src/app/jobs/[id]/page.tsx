'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import api from '@/services/api';
import Link from 'next/link';
import { toast } from 'sonner';

// We cannot useParams directly in a component if it's not wrapped in React.use() in Next 15,
// but for Next 14 App Router, we usually use useParams() hook. 
// However, Page components receive params as a prop.
// Let's use the hook for simplicity inside the component.

export default function JobDetailsPage() {
  const { id } = useParams() as { id: string };
  const { user } = useAuth();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data);
      } catch (error) {
        console.error('Job not found', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (job.applicationUrl) {
      window.open(job.applicationUrl, '_blank');
      return;
    }

    if (!user) {
      router.push(`/login?redirect=/jobs/${id}`);
      return;
    }

    setApplying(true);
    try {
      await api.post('/applications', {
        jobId: job._id,
        coverLetter: 'I am very interested in this role.',
      });
      setApplied(true);
      toast.success('Application submitted successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to apply');
      if (error.response?.data?.message?.includes('already applied')) {
        setApplied(true);
      }
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="text-center py-20 animate-pulse text-gray-400">Loading Opportunity...</div>;
  if (!job) return <div className="text-center py-20">Job not found</div>;

  const companyName = typeof job.company === 'object' ? job.company?.name : job.company;
  const companyLogo = typeof job.company === 'object' ? job.company?.logo : undefined;

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link href="/jobs" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-8 transition-colors">
          ← Back to All Jobs
        </Link>

        {/* Header Hero Section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-xl shadow-blue-50/50 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="flex gap-6 items-center">
              {companyLogo ? (
                <img src={companyLogo} alt={companyName} className="w-20 h-20 rounded-2xl object-contain bg-gray-50 border border-gray-100 p-2" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-3xl">
                  {companyName?.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">{job.title}</h1>
                <p className="text-xl text-blue-600 font-bold mt-1 hover:underline cursor-pointer">{companyName}</p>
                <div className="flex flex-wrap gap-4 mt-4 text-sm font-medium text-gray-500">
                  <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">📍 {job.location}</span>
                  <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">💼 {job.jobType}</span>
                  <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full">💰 {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(job.salary.min)} - {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(job.salary.max)} /yr</span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto">
              {user?.role !== 'recruiter' && (
                <Button
                  size="lg"
                  onClick={handleApply}
                  isLoading={applying}
                  disabled={applied || (applying && !job.applicationUrl)}
                  className={`w-full md:w-auto h-16 px-10 rounded-2xl text-lg font-bold shadow-lg transition-transform hover:scale-105 ${applied ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 shadow-blue-200'}`}
                >
                  {applied
                    ? 'Applied ✅'
                    : job.applicationUrl
                      ? 'Apply on Official Site ↗'
                      : 'One-Click Apply'
                  }
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content Tabs-like Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                Job Overview
              </h2>
              <div className="prose max-w-none text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                {job.description}
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Skills & Requirements</h2>
              <div className="flex flex-wrap gap-3">
                {job.skills.map((skill: string, index: number) => (
                  <span key={index} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold border border-gray-200 hover:border-blue-300 transition-colors">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* About Company Card */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About the Company</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center font-bold text-blue-600 border border-gray-100">
                    {companyLogo ? <img src={companyLogo} className="w-full h-full object-contain" /> : companyName?.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{companyName}</div>
                    <div className="text-xs text-gray-500">10k+ Employees • {job.location}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {typeof job.company === 'object' && job.company?.description ? job.company.description : `Join ${companyName} and contribute to breakthrough innovations.`}
                </p>
                <Button variant="outline" className="w-full rounded-xl">View Company Profile</Button>
              </div>
            </div>

            {/* Recruiter Card */}
            <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <h2 className="text-lg font-bold mb-2">Hiring Manager</h2>
                <p className="text-blue-100 text-sm mb-4">Reach out if you have questions about the role.</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                    {job.recruiter?.name?.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold">{job.recruiter?.name}</div>
                    <div className="text-xs text-blue-200">Verified Recruiter</div>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-120 transition-transform"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
