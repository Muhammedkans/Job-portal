'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import Link from 'next/link';

export default function CandidateApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const { data } = await api.get('/applications/me');
        setApplications(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>

      {applications.length === 0 ? (
        <p>You haven't applied to any jobs yet.</p>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {applications.map((app) => (
              <li key={app._id}>
                <Link href={`/jobs/${app.job._id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">{app.job.title}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${app.status === 'applied' ? 'bg-yellow-100 text-yellow-800' :
                            app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-green-100 text-green-800'}`}>
                          {app.status}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {app.job.company}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          Applied on {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
