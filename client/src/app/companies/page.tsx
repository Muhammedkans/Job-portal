'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import Link from 'next/link';
import { Building2, Search, ArrowRight, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Company {
  _id: string;
  name: string;
  logo?: string;
  location?: string;
  count: number;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await api.get('/jobs');

        const companyMap = new Map<string, Company>();

        data.forEach((job: any) => {
          // Handle both string and object versions of company
          const companyObj = typeof job.company === 'object' ? job.company : { name: job.company };
          const name = companyObj?.name || 'Unknown';
          const logo = companyObj?.logo;
          const location = job.location; // Fallback location
          const id = companyObj?._id || job._id;

          if (!companyMap.has(name)) {
            companyMap.set(name, {
              _id: id,
              name,
              logo,
              location: companyObj?.location || location,
              count: 0
            });
          }
          companyMap.get(name)!.count++;
        });

        setCompanies(Array.from(companyMap.values()).sort((a, b) => b.count - a.count));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto py-16 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            World-Class <span className="text-blue-600">Companies</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 font-medium">
            Explore the top technology firms and startups currently expanding their teams.
          </p>

          <div className="max-w-xl mx-auto relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Filter by company name..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-[2rem]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCompanies.map((company) => (
              <div key={company.name} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-blue-50/20 hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex justify-between items-start mb-6">
                  {company.logo ? (
                    <img src={company.logo} alt={company.name} className="w-20 h-20 rounded-2xl object-contain bg-gray-50 border border-gray-100 p-2" />
                  ) : (
                    <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl font-bold text-blue-600 border border-blue-100">
                      {company.name.charAt(0)}
                    </div>
                  )}
                  <span className="bg-blue-50 text-blue-700 text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                    {company.count} Jobs
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2 truncate">{company.name}</h3>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-6 font-medium">
                  <Building2 size={16} className="text-gray-400" />
                  {company.location || 'Global Headquarters'}
                </div>

                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                  <Link href={`/jobs?keyword=${company.name}`} className="flex-1">
                    <Button variant="outline" className="w-full rounded-xl group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all font-bold">
                      View Open Roles
                    </Button>
                  </Link>
                </div>
              </div>
            ))}

            {filteredCompanies.length === 0 && (
              <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
                <Building2 className="mx-auto text-gray-200 mb-4" size={64} />
                <h3 className="text-xl font-bold text-gray-900">No companies found</h3>
                <p className="text-gray-500 mt-1">Try searching for a different brand.</p>
                <Button variant="ghost" className="mt-6 text-blue-600" onClick={() => setSearchTerm('')}>Clear Search</Button>
              </div>
            )}
          </div>
        )}

        {/* Recruitment CTA */}
        <div className="mt-20 bg-blue-600 rounded-[3rem] p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <h2 className="text-3xl font-black mb-4 tracking-tight">Are you hiring?</h2>
            <p className="text-blue-100 text-lg font-medium">Join 5,000+ companies who use HireUp to find their next exceptional teammates.</p>
          </div>
          <div className="relative z-10 w-full md:auto">
            <Link href="/dashboard/companies/new">
              <Button className="w-full md:w-auto h-16 px-10 rounded-2xl bg-white text-blue-600 hover:bg-gray-100 font-bold text-lg shadow-xl uppercase tracking-widest">
                List Your Company <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
          </div>
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400 rounded-full -translate-x-1/2 translate-y-1/2"></div>
        </div>
      </div>
    </div>
  );
}
