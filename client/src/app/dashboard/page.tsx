'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  // Route Protection (Role Based)
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, <span className="font-semibold text-gray-900">{user.name}</span>!
            You are logged in as a <span className="capitalize bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium">{user.role}</span>.
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 gap-3">
          <Button onClick={() => router.push('/dashboard/profile')} variant="secondary">
            Edit Profile
          </Button>
          <Button onClick={logout} variant="outline">
            Sign out
          </Button>
          {user.role === 'recruiter' && (
            <Button className="ml-3">Post a Job</Button>
          )}
        </div>
      </div>

      {/* Role Based Content */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {user.role === 'candidate' ? 'Recommended Jobs' : 'Your Job Postings'}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {user.role === 'candidate'
              ? 'Based on your profile and preferences.'
              : 'Manage and track applications for your posted jobs.'}
          </p>
        </div>

        <div className="px-4 py-5 sm:p-6">
          {/* Placeholder for content */}
          <div className="text-center py-10">
            <div className="mx-auto h-12 w-12 text-gray-400">
              {/* Icon placeholder */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No data found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {user.role === 'candidate' ? "You haven't applied to any jobs yet." : "You haven't posted any jobs yet."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
