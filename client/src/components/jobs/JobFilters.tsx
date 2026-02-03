'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface JobFiltersProps {
  onFilterChange: (filters: any) => void;
}

export const JobFilters = ({ onFilterChange }: JobFiltersProps) => {
  const [minSalary, setMinSalary] = useState(50000);
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [remoteOnly, setRemoteOnly] = useState(false);

  const handleTypeChange = (type: string) => {
    const newTypes = jobTypes.includes(type)
      ? jobTypes.filter((t) => t !== type)
      : [...jobTypes, type];
    setJobTypes(newTypes);
    onFilterChange({ jobTypes: newTypes, minSalary, remoteOnly });
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Filters</h3>

      {/* Salary Range */}
      <div className="mb-8">
        <label className="text-sm font-medium text-gray-900 mb-2 block">
          Min Salary: ${new Intl.NumberFormat().format(minSalary)}
        </label>
        <input
          type="range"
          min="10000"
          max="200000"
          step="10000"
          value={minSalary}
          onChange={(e) => {
            setMinSalary(Number(e.target.value));
            onFilterChange({ jobTypes, minSalary: Number(e.target.value), remoteOnly });
          }}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      {/* Job Type */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Job Type</h4>
        <div className="space-y-3">
          {['Full-time', 'Part-time', 'Contract', 'Freelance'].map((type) => (
            <label key={type} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                checked={jobTypes.includes(type)}
                onChange={() => handleTypeChange(type)}
              />
              <span className="text-gray-600 text-sm">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Remote Only */}
      <div className="mb-6">
        <label className="flex items-center gap-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 transition-colors">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            checked={remoteOnly}
            onChange={(e) => {
              setRemoteOnly(e.target.checked);
              onFilterChange({ jobTypes, minSalary, remoteOnly: e.target.checked });
            }}
          />
          <span className="text-gray-900 font-medium text-sm">Remote Only 🏠</span>
        </label>
      </div>

      <Button variant="outline" className="w-full text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => window.location.reload()}>
        Reset Filters
      </Button>
    </div>
  );
};
