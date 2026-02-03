'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Briefcase, Users, Star, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import api from '@/services/api';
import { JobCard } from '@/components/jobs/JobCard';

export default function Home() {
  const [stats, setStats] = useState({ jobs: 0, companies: 0, successStories: 0, featuredJobs: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/public/stats');
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight"
            >
              Discover Your <span className="text-blue-600">Future</span> <br />
              Build Your <span className="text-blue-600">Dream</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto"
            >
              The most advanced job portal connecting top talent with world-class companies.
              Join thousands of developers, designers, and leaders today.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 flex justify-center gap-4"
            >
              <Link href="/jobs">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
                  Browse Jobs <Search className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Abstract Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-10 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Trust Section: Company Logos */}
      <section className="py-12 bg-white border-b border-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Trusted by industry leaders in tech</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" alt="Netflix" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png" alt="Tesla" className="h-6" />
          </div>
        </div>
      </section>

      {/* Stats Section (Real Data) */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Briefcase, label: 'Active Jobs', value: loading ? '...' : stats.jobs },
              { icon: Users, label: 'Companies', value: loading ? '...' : stats.companies },
              { icon: Star, label: 'Applications Sent', value: loading ? '...' : stats.successStories },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="p-6"
              >
                <stat.icon className="w-10 h-10 mx-auto text-blue-600 mb-4" />
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-500 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section (Real Data) */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Featured Opportunities</h2>
            <p className="mt-4 text-gray-600">Top roles selected for you.</p>
          </div>

          {loading ? (
            <div className="text-center">Loading jobs...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.featuredJobs && stats.featuredJobs.map((job: any) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/jobs">
              <Button variant="outline" size="lg">View All Jobs</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to start your journey?</h2>
          <p className="text-blue-100 mb-8 text-lg">Create your profile today and get discovered by the world's best companies.</p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 h-14 px-10 text-lg rounded-full font-bold">
              Create Free Account
            </Button>
          </Link>
        </div>
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/2 translate-y-1/2"></div>
      </section>
    </div>
  );
}
