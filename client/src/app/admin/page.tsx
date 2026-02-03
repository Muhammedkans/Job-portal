'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { Button } from '@/components/ui/Button';

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!isLoading && user?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (user?.role === 'admin') fetchStats();
  }, [user, isLoading, router]);

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure? This action is irreversible.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setStats((prev: any) => ({
        ...prev,
        recentUsers: prev.recentUsers.filter((u: any) => u._id !== id),
        counts: { ...prev.counts, users: prev.counts.users - 1 },
      }));
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`/admin/jobs/${id}`);
      setStats((prev: any) => ({
        ...prev,
        recentJobs: prev.recentJobs.filter((j: any) => j._id !== id),
        counts: { ...prev.counts, jobs: prev.counts.jobs - 1 },
      }));
    } catch (error) {
      alert('Failed to delete job');
    }
  };

  if (isLoading || !stats) return <div className="p-10">Loading Admin Panel...</div>;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Users</h3>
          <p className="mt-2 text-4xl font-extrabold text-blue-600">{stats.counts.users}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Jobs</h3>
          <p className="mt-2 text-4xl font-extrabold text-green-600">{stats.counts.jobs}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Recent Users */}
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
          <div className="px-4 py-5 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Users</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {stats.recentUsers.map((u: any) => (
              <li key={u._id} className="px-4 py-4 flex justify-between items-center hover:bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">{u.name}</p>
                  <p className="text-sm text-gray-500">{u.email} ({u.role})</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(u._id)} className="text-red-500 hover:text-red-700">
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
          <div className="px-4 py-5 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Jobs</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {stats.recentJobs.map((j: any) => (
              <li key={j._id} className="px-4 py-4 flex justify-between items-center hover:bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-900">{j.title}</p>
                  <p className="text-sm text-gray-500">{j.company}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteJob(j._id)} className="text-red-500 hover:text-red-700">
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
