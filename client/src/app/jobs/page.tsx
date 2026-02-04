'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import { JobFilters } from '@/components/jobs/JobFilters';
import { JobCard } from '@/components/jobs/JobCard';
import { Search, MapPin, ChevronLeft, ChevronRight, FilterX, Briefcase, Sparkles, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [filters, setFilters] = useState<any>({});

  const JOBS_PER_PAGE = 30;

  const fetchJobs = useCallback(async (pageNum: number, searchKeyword: string, searchLocation: string, currentFilters: any) => {
    setLoading(true);
    try {
      const params: any = {
        page: pageNum,
        limit: JOBS_PER_PAGE,
        keyword: searchKeyword,
        location: searchLocation,
        minSalary: currentFilters.minSalary > 0 ? currentFilters.minSalary : undefined,
        remoteOnly: currentFilters.remoteOnly || undefined,
        daysAgo: currentFilters.daysAgo || undefined,
      };

      if (currentFilters.jobTypes && currentFilters.jobTypes.length > 0) {
        params.jobTypes = currentFilters.jobTypes.join(',');
      }

      if (currentFilters.experienceLevels && currentFilters.experienceLevels.length > 0) {
        params.experienceLevels = currentFilters.experienceLevels.join(',');
      }

      const { data } = await api.get(`/jobs`, { params });

      setJobs(data.jobs);
      setTotalPages(data.pages);
      setTotalJobs(data.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Use an effect that depends on filters too
  useEffect(() => {
    fetchJobs(page, keyword, location, filters);
  }, [page, filters, fetchJobs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchJobs(1, keyword, location, filters);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setPage(1); // Reset to page 1 when filters change
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      {/* 🚀 ELITE HERO SEARCH SECTION */}
      <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] pt-24 pb-32 px-4 shadow-2xl relative overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full mb-8 backdrop-blur-md">
            <Sparkles className="text-blue-400" size={16} />
            <span className="text-blue-200 text-xs font-bold uppercase tracking-[0.2em]">Monster Tier Aggregator Live</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight mb-6">
            Find Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">Absolute Best</span> Role
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 font-medium mb-12">
            Connecting world-class talent with {totalJobs}+ verified opportunities across India and Global Tech Hubs.
          </p>

          {/* 🔍 REAL-WORLD DUAL SEARCH BAR */}
          <div className="max-w-5xl mx-auto bg-white/5 backdrop-blur-xl p-2 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-2">
              <div className="flex-1 w-full flex items-center px-6 py-4 bg-white/5 rounded-[2rem] border border-transparent focus-within:border-blue-500/50 transition-all">
                <Search className="text-slate-500 mr-4" size={22} />
                <input
                  className="w-full bg-transparent outline-none text-white text-lg placeholder-slate-500 font-medium"
                  placeholder="Titles, Skills, or Companies..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>

              <div className="hidden md:block w-[1px] h-10 bg-white/10"></div>

              <div className="flex-1 w-full flex items-center px-6 py-4 bg-white/5 rounded-[2rem] border border-transparent focus-within:border-blue-500/50 transition-all">
                <MapPin className="text-slate-500 mr-4" size={22} />
                <input
                  className="w-full bg-transparent outline-none text-white text-lg placeholder-slate-500 font-medium"
                  placeholder="Location (Kerala, India...)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <Button type="submit" size="lg" className="h-16 px-12 w-full md:w-auto rounded-[1.8rem] text-lg font-black bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/20 active:scale-95 transition-all">
                Search
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

          {/* 🛠️ SIDEBAR: PROFESSIONAL FILTERS */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 sticky top-24">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black text-[#0f172a] tracking-tight">Refine Results</h3>
                <div
                  className="p-2 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl cursor-pointer transition-all"
                  onClick={() => window.location.reload()}
                >
                  <FilterX size={20} />
                </div>
              </div>

              <div className="space-y-2">
                <JobFilters onFilterChange={handleFilterChange} />

                <div className="pt-8 border-t border-slate-50">
                  <div className="bg-blue-600 rounded-2xl p-6 text-white text-center relative overflow-hidden group">
                    <div className="relative z-10">
                      <h4 className="font-bold text-sm mb-2">Want better results?</h4>
                      <p className="text-[10px] text-blue-100 mb-4 opacity-80 leading-relaxed uppercase tracking-widest font-black">Complete your career id now</p>
                      <Button variant="outline" className="w-full bg-white/10 border-white/20 hover:bg-white text-white hover:text-blue-600 rounded-xl text-xs font-bold py-3">Update Profile</Button>
                    </div>
                    <Sparkles className="absolute -top-4 -right-4 text-white/10 group-hover:scale-150 transition-transform duration-700" size={80} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 📋 MAIN RESULTS AREA */}
          <div className="lg:col-span-3 space-y-8">
            {/* Results Header Card */}
            <div className="bg-white px-8 py-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-5 text-center md:text-left">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
                  <Briefcase className="text-indigo-600" size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">{totalJobs} Vacancies Found</h2>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">
                    Page {page} of {totalPages}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Status</p>
                  <p className="text-sm font-bold text-green-600 flex items-center gap-1">Live Feed <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span></p>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-[2.5rem] p-8 space-y-4 border border-slate-50 animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-6 bg-slate-100 rounded-md w-3/4"></div>
                        <div className="h-4 bg-slate-100 rounded-md w-1/2"></div>
                      </div>
                    </div>
                    <div className="h-20 bg-slate-50 rounded-2xl"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {jobs.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8">
                      <Briefcase className="text-blue-600" size={40} />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 mb-4">No vacancies yet</h3>
                    <p className="text-slate-400 mt-2 max-w-sm mx-auto font-medium">
                      Be the first to attract top talent. Post your high-impact role today and scale your team.
                    </p>
                    <Link href="/dashboard/jobs/new">
                      <Button className="mt-10 rounded-2xl px-12 py-6 bg-blue-600 hover:bg-blue-500 font-bold shadow-xl shadow-blue-200">Post First Job</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {jobs.map((job) => (
                      <JobCard key={job._id} job={job} />
                    ))}
                  </div>
                )}

                {/* 📄 ELITE PAGINATION INTERFACE */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-8 pt-12 pb-10">
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">
                      Results {(page - 1) * JOBS_PER_PAGE + 1} - {Math.min(page * JOBS_PER_PAGE, totalJobs)} of {totalJobs}
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        className="rounded-2xl w-14 h-14 p-0 flex items-center justify-center border-slate-200 bg-white hover:border-blue-500 hover:text-blue-600 disabled:opacity-20 shadow-lg shadow-slate-100 transition-all font-bold"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                      >
                        <ChevronLeft size={24} />
                      </Button>

                      <div className="flex gap-3 px-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                          if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                            return (
                              <button
                                key={p}
                                onClick={() => handlePageChange(p)}
                                className={`w-14 h-14 rounded-2xl text-lg font-black transition-all duration-300 shadow-lg ${p === page ? 'bg-[#0f172a] text-white shadow-[#0f172a]/20 scale-110 z-10' : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50 shadow-slate-200/50'}`}
                              >
                                {p}
                              </button>
                            );
                          } else if (p === page - 2 || p === page + 2) {
                            return <span key={p} className="flex items-end pb-3 font-black text-slate-300 text-xl tracking-tighter">•••</span>;
                          }
                          return null;
                        })}
                      </div>

                      <Button
                        variant="outline"
                        className="rounded-2xl w-14 h-14 p-0 flex items-center justify-center border-slate-200 bg-white hover:border-blue-500 hover:text-blue-600 disabled:opacity-20 shadow-lg shadow-slate-100 transition-all font-bold"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                      >
                        <ChevronRight size={24} />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* 🚀 BOTTOM CTA FOR EMPLOYERS */}
      <div className="max-w-7xl mx-auto px-4 mt-20">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[3rem] p-12 overflow-hidden relative group">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 text-center lg:text-left">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-black text-white mb-4 leading-tight tracking-tight">Post Your Vacancy Globally</h2>
              <p className="text-blue-100 text-lg font-medium opacity-90">Are you an employer in Kerala or Abroad? List your vacancies and find the elite talent you deserve.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <Link href="/dashboard/jobs/new" className="flex-1">
                <Button className="w-full h-18 px-12 rounded-2xl bg-white text-blue-600 hover:bg-slate-50 font-black text-lg shadow-2xl transition-all active:scale-95">Post Job Now</Button>
              </Link>
              <Link href="/dashboard/companies/new" className="flex-1">
                <Button className="w-full h-18 px-12 rounded-2xl bg-blue-500/20 text-white border border-white/30 hover:bg-white/10 font-black text-lg backdrop-blur-md transition-all active:scale-95">Brand Register</Button>
              </Link>
            </div>
          </div>
          {/* Background Decor */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-120 transition-transform duration-1000"></div>
          <Building2 className="absolute -bottom-8 -left-8 text-white/10 group-hover:rotate-12 transition-transform duration-500" size={200} />
        </div>
      </div>
    </div>
  );
}
