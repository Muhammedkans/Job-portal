'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import { JobFilters } from '@/components/jobs/JobFilters';
import { JobCard } from '@/components/jobs/JobCard';
import { Search, ChevronLeft, ChevronRight, FilterX } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [filters, setFilters] = useState<any>({});

  const JOBS_PER_PAGE = 30;

  const fetchJobs = useCallback(async (pageNum: number, searchKeyword: string) => {
    setLoading(true);
    try {
      // We send page and limit to backend
      const { data } = await api.get(`/jobs`, {
        params: {
          page: pageNum,
          limit: JOBS_PER_PAGE,
          keyword: searchKeyword
        }
      });

      setJobs(data.jobs);
      setTotalPages(data.pages);
      setTotalJobs(data.total);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs(page, keyword);
  }, [page, fetchJobs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to page 1 on new search
    fetchJobs(1, keyword);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Premium Header */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 pt-20 pb-28 px-4 sm:px-6 lg:px-8 shadow-2xl relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl font-black text-white sm:text-6xl tracking-tight leading-tight">
            Level Up Your <span className="text-blue-200 underline decoration-blue-100/30">Career</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-100 font-medium opacity-90">
            Explore {totalJobs}+ verified vacancies from global industry leaders.
          </p>

          {/* Search Bar: Premium Floating Glass Look */}
          <div className="max-w-4xl mx-auto mt-12">
            <form onSubmit={handleSearch} className="flex p-2 bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/20 shadow-2xl transition-all focus-within:bg-white/15 focus-within:scale-[1.02]">
              <div className="flex-1 flex items-center px-6">
                <Search className="text-blue-100/60 mr-4" size={24} />
                <input
                  className="w-full h-14 bg-transparent outline-none text-white text-lg placeholder-blue-100/50 font-medium"
                  placeholder="Titles, Skills, or Companies..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="h-14 px-12 rounded-[1.5rem] text-lg font-bold bg-white text-blue-600 hover:bg-gray-100 border-0 shadow-lg transition-transform active:scale-95">
                Quick Search
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-blue-50/50 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900">Advanced Filters</h3>
                <FilterX className="text-gray-300 hover:text-red-500 cursor-pointer transition-colors" size={18} onClick={() => window.location.reload()} />
              </div>
              {/* We use a simplified version for this demo, or keep JobFilters if it's connected */}
              <JobFilters onFilterChange={(f) => console.log(f)} />
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
              <div>
                <h2 className="text-2xl font-black text-gray-900">{totalJobs} Results</h2>
                <p className="text-sm text-gray-500 font-medium">Showing page {page} of {totalPages}</p>
              </div>
              <div className="flex gap-2">
                <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold uppercase tracking-widest">Active Listings</span>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 bg-gray-200 rounded-[2.5rem]"></div>)}
              </div>
            ) : (
              <>
                {jobs.length === 0 ? (
                  <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="text-gray-300" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">No vacancies found</h3>
                    <p className="text-gray-500 mt-2 max-w-xs mx-auto">Try adjusting your search terms or filters to find more results.</p>
                    <Button variant="outline" className="mt-8 rounded-xl" onClick={() => window.location.reload()}>Reset Search</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {jobs.map((job) => (
                      <JobCard key={job._id} job={job} />
                    ))}
                  </div>
                )}

                {/* Monster Tier Pagination UI */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 pt-12">
                    <Button
                      variant="outline"
                      className="rounded-xl w-12 h-12 p-0 flex items-center justify-center border-gray-200 hover:border-blue-500 hover:text-blue-600 disabled:opacity-30"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                    >
                      <ChevronLeft size={20} />
                    </Button>

                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                        // Show only current, first, last, and neighbours
                        if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                          return (
                            <button
                              key={p}
                              onClick={() => handlePageChange(p)}
                              className={`w-12 h-12 rounded-xl text-sm font-bold transition-all ${p === page ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'}`}
                            >
                              {p}
                            </button>
                          );
                        } else if (p === page - 2 || p === page + 2) {
                          return <span key={p} className="flex items-end pb-2 font-bold text-gray-300">...</span>;
                        }
                        return null;
                      })}
                    </div>

                    <Button
                      variant="outline"
                      className="rounded-xl w-12 h-12 p-0 flex items-center justify-center border-gray-200 hover:border-blue-500 hover:text-blue-600 disabled:opacity-30"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                    >
                      <ChevronRight size={20} />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
