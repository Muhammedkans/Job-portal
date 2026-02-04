'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { ChevronDown, ChevronUp, Check, Clock, Briefcase, Filter, IndianRupee, BarChart } from 'lucide-react';

interface JobFiltersProps {
  onFilterChange: (filters: any) => void;
}

export const JobFilters = ({ onFilterChange }: JobFiltersProps) => {
  const [minSalary, setMinSalary] = useState(0);
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [experienceLevels, setExperienceLevels] = useState<string[]>([]);
  const [daysAgo, setDaysAgo] = useState<number | null>(null);
  const [remoteOnly, setRemoteOnly] = useState(false);

  // Deep Synchronization with parent
  useEffect(() => {
    onFilterChange({
      jobTypes,
      experienceLevels,
      minSalary,
      daysAgo,
      remoteOnly
    });
  }, [jobTypes, experienceLevels, minSalary, daysAgo, remoteOnly]);

  const toggleList = (list: string[], setList: (val: string[]) => void, item: string) => {
    const newList = list.includes(item)
      ? list.filter((i) => i !== item)
      : [...list, item];
    setList(newList);
  };

  const clearFilters = () => {
    setMinSalary(0);
    setJobTypes([]);
    setExperienceLevels([]);
    setDaysAgo(null);
    setRemoteOnly(false);
  };

  const SectionTitle = ({ title, icon: Icon }: { title: string, icon: any }) => (
    <div className="flex items-center gap-2 mb-4">
      <div className="p-1.5 bg-slate-50 rounded-lg text-slate-500">
        <Icon size={16} />
      </div>
      <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">{title}</h4>
    </div>
  );

  const CheckboxItem = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: () => void }) => (
    <label className="flex items-center justify-between group cursor-pointer py-1">
      <div className="flex items-center gap-3">
        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${checked ? 'bg-blue-600 border-blue-600' : 'border-slate-200 group-hover:border-blue-400'}`}>
          {checked && <Check size={14} className="text-white" />}
        </div>
        <span className={`text-sm font-medium transition-colors ${checked ? 'text-blue-600 font-bold' : 'text-slate-600 group-hover:text-slate-900'}`}>{label}</span>
      </div>
    </label>
  );

  return (
    <div className="space-y-10">
      {/* 🚀 SALARY RANGE (REAL-WORLD INR) */}
      <div>
        <SectionTitle title="Annual Salary" icon={IndianRupee} />
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="5000000"
            step="100000"
            value={minSalary}
            onChange={(e) => setMinSalary(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span>Any</span>
            <span className="text-blue-600 text-sm">₹{minSalary / 100000} Lakhs+</span>
            <span>50L+</span>
          </div>
        </div>
      </div>

      {/* 💼 JOB TYPE */}
      <div>
        <SectionTitle title="Employment" icon={Briefcase} />
        <div className="space-y-3">
          {['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'].map((type) => (
            <div key={type} onClick={() => toggleList(jobTypes, setJobTypes, type)}>
              <CheckboxItem label={type} checked={jobTypes.includes(type)} onChange={() => { }} />
            </div>
          ))}
        </div>
      </div>

      {/* 📊 EXPERIENCE LEVEL */}
      <div>
        <SectionTitle title="Experience" icon={BarChart} />
        <div className="space-y-3">
          {['Entry', 'Junior', 'Mid', 'Senior', 'Lead', 'Executive'].map((level) => (
            <div key={level} onClick={() => toggleList(experienceLevels, setExperienceLevels, level)}>
              <CheckboxItem label={level} checked={experienceLevels.includes(level)} onChange={() => { }} />
            </div>
          ))}
        </div>
      </div>

      {/* ⏰ DATE POSTED */}
      <div>
        <SectionTitle title="Date Posted" icon={Clock} />
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Any', val: null },
            { label: '24h', val: 1 },
            { label: '7d', val: 7 },
            { label: '30d', val: 30 }
          ].map((time) => (
            <button
              key={time.label}
              onClick={() => setDaysAgo(time.val)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${daysAgo === time.val ? 'bg-[#0f172a] text-white border-[#0f172a] shadow-lg shadow-slate-200' : 'bg-white text-slate-500 border-slate-100 hover:border-blue-200'}`}
            >
              {time.label}
            </button>
          ))}
        </div>
      </div>

      {/* 🏠 REMOTE SETTING */}
      <div className="pt-6 border-t border-slate-50">
        <label className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all border-2 ${remoteOnly ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-transparent hover:border-slate-100'}`} onClick={() => setRemoteOnly(!remoteOnly)}>
          <span className={`text-sm font-bold ${remoteOnly ? 'text-blue-700' : 'text-slate-600'}`}>Remote Experience Only</span>
          <div className={`w-10 h-6 rounded-full relative transition-all ${remoteOnly ? 'bg-blue-600' : 'bg-slate-200'}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${remoteOnly ? 'left-5' : 'left-1'}`}></div>
          </div>
        </label>
      </div>

      <Button
        variant="ghost"
        className="w-full text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl text-xs font-bold uppercase tracking-widest pt-4"
        onClick={clearFilters}
      >
        Clear All Refinements
      </Button>
    </div>
  );
};
