'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/services/api';
import { Button } from '@/components/ui/Button';

export default function JobApplicationsPage() {
  const { id } = useParams() as { id: string };
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const { data } = await api.get(`/applications/job/${id}`);
        setApplications(data);
      } catch (error) {
        console.error('Failed to fetch applications', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [id]);

  const updateStatus = async (appId: string, newStatus: string) => {
    try {
      await api.put(`/applications/${appId}/status`, { status: newStatus });
      // Optimistic update
      setApplications(prev => prev.map(app =>
        app._id === appId ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div>Loading applicants...</div>;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Manage Applicants</h1>

      {applications.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-white rounded-lg border border-gray-200">
          No one has applied to this job yet.
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
          <ul className="divide-y divide-gray-200">
            {applications.map((app) => (
              <li key={app._id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-medium text-blue-600 truncate">
                      {app.candidate.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {app.candidate.email}
                    </p>
                    <div className="mt-2">
                      {app.resumeUrl && (
                        <a href={app.resumeUrl} target="_blank" className="text-sm text-blue-500 hover:underline">
                          View Resume / Profile
                        </a>
                      )}
                    </div>
                    {app.coverLetter && (
                      <p className="mt-2 text-sm text-gray-600 italic border-l-2 border-gray-300 pl-3">
                        "{app.coverLetter}"
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${app.status === 'applied' ? 'bg-yellow-100 text-yellow-800' :
                        app.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'}`}>
                      {app.status.toUpperCase()}
                    </span>

                    <div className="flex gap-2 mt-2">
                      {app.status !== 'shortlisted' && (
                        <Button size="sm" onClick={() => updateStatus(app._id, 'shortlisted')} className="bg-green-600 hover:bg-green-700">
                          Shortlist
                        </Button>
                      )}
                      {app.status !== 'rejected' && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus(app._id, 'rejected')} className="text-red-600 border-red-200 hover:bg-red-50">
                          Reject
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
