'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {
  Briefcase,
  Users,
  PlusCircle,
  Building2,
  ArrowUpRight,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Dashboard() {
  const { user } = useAuth();

  const isRecruiter = user?.role === 'recruiter';

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Welcome Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Welcome back, <span className="text-blue-600">{user?.name}</span> 👋
        </h1>
        <p className="text-gray-500 mt-2">Here's what's happening with your hiring pipeline today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Active Jobs', value: '8', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Applicants', value: '124', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Interviews', value: '12', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Hired', value: '3', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm font-medium text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {isRecruiter ? (
                <>
                  <Link href="/dashboard/jobs/new" className="group">
                    <div className="p-6 border-2 border-dashed border-gray-100 rounded-2xl group-hover:border-blue-200 group-hover:bg-blue-50 transition-all text-center">
                      <PlusCircle className="mx-auto text-gray-400 group-hover:text-blue-600 mb-3" size={32} />
                      <div className="font-bold text-gray-900">Post a New Job</div>
                      <p className="text-xs text-gray-500 mt-1">Found your next talent today.</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/companies/new" className="group">
                    <div className="p-6 border-2 border-dashed border-gray-100 rounded-2xl group-hover:border-purple-200 group-hover:bg-purple-50 transition-all text-center">
                      <Building2 className="mx-auto text-gray-400 group-hover:text-purple-600 mb-3" size={32} />
                      <div className="font-bold text-gray-900">Register Company</div>
                      <p className="text-xs text-gray-500 mt-1">Set up your brand identity.</p>
                    </div>
                  </Link>
                </>
              ) : (
                <Link href="/jobs" className="group">
                  <div className="p-6 border-2 border-dashed border-gray-100 rounded-2xl group-hover:border-blue-200 group-hover:bg-blue-50 transition-all text-center">
                    <Briefcase className="mx-auto text-gray-400 group-hover:text-blue-600 mb-3" size={32} />
                    <div className="font-bold text-gray-900">Browse Jobs</div>
                    <p className="text-xs text-gray-500 mt-1">Find your next big break.</p>
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* Recent Listings/Applications placeholder */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">J</div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">Frontend Developer at Google</div>
                      <div className="text-xs text-gray-500">24 applicants • Posted 2 days ago</div>
                    </div>
                  </div>
                  <ArrowUpRight size={18} className="text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-8">
          <div className="bg-blue-600 p-8 rounded-3xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2">Hire Smarter.</h3>
              <p className="text-blue-100 text-sm mb-6">Upgrade to Premium for advanced applicant tracking and unlimited listings.</p>
              <Button className="bg-white text-blue-600 hover:bg-gray-100 w-full rounded-2xl font-bold">Upgrade Now</Button>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Complete Your Profile</h3>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-blue-600 w-[65%]"></div>
            </div>
            <p className="text-xs text-gray-500">65% of your profile is complete. Add a profile photo to reach 80%.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
