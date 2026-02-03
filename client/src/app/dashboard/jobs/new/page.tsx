'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/services/api';
import { toast } from 'sonner';
import { Building2, Briefcase, Plus, Trash2 } from 'lucide-react';

const jobSchema = z.object({
  title: z.string().min(3, 'Title is too short'),
  company: z.string().min(1, 'Please select a company'),
  location: z.string().min(2, 'Location is required'),
  description: z.string().min(20, 'Description must be detailed (min 20 chars)'),
  salaryMin: z.number().min(0),
  salaryMax: z.number().min(0),
  jobType: z.enum(['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship']),
  skills: z.array(z.object({ value: z.string() })).min(1, 'Add at least one skill'),
});

type JobFormValues = z.infer<typeof jobSchema>;

export default function PostJobPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  const [fetchingCompanies, setFetchingCompanies] = useState(true);

  const { register, control, handleSubmit, formState: { errors } } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      jobType: 'Full-time',
      skills: [{ value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills',
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await api.get('/companies');
        setCompanies(data);
      } catch (error) {
        toast.error('Failed to load companies');
      } finally {
        setFetchingCompanies(false);
      }
    };
    fetchCompanies();
  }, []);

  const onSubmit = async (data: JobFormValues) => {
    setIsSubmitting(true);
    try {
      const apiData = {
        title: data.title,
        company: data.company, // Sending the ID
        location: data.location,
        description: data.description,
        salary: {
          min: data.salaryMin,
          max: data.salaryMax,
          currency: 'USD',
        },
        jobType: data.jobType,
        skills: data.skills.map(s => s.value).filter(Boolean),
      };

      await api.post('/jobs', apiData);
      toast.success('Job posted successfully! 🚀');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to post job');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (fetchingCompanies) return <div className="text-center py-20">Loading hiring profile...</div>;

  if (companies.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl">
          <Building2 size={64} className="mx-auto text-blue-100 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900">No Company Registered</h2>
          <p className="text-gray-500 mt-2 mb-8">You need to register your company brand before you can post a job vacancy.</p>
          <Button onClick={() => router.push('/dashboard/companies/new')} size="lg">
            Register Company First
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white shadow-2xl shadow-blue-50 rounded-3xl p-10 border border-gray-50">
        <div className="mb-10 text-center">
          <div className="inline-flex p-4 bg-blue-50 rounded-2xl text-blue-600 mb-4">
            <Plus size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Publish Opportunity</h2>
          <p className="text-gray-500 mt-2">Scale your team with elite global talent.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input
              label="Job Title"
              placeholder="e.g. Lead React Architect"
              {...register('title')}
              error={errors.title?.message}
            />

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Select Company (Brand)</label>
              <select
                {...register('company')}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                <option value="">Select a company...</option>
                {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input
              label="Job Location"
              placeholder="e.g. Remote / Dubai"
              {...register('location')}
              error={errors.location?.message}
            />
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Employment Type</label>
              <select
                {...register('jobType')}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                {['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 ml-1 block mb-2">Detailed Description</label>
            <textarea
              className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none min-h-[160px] transition-all"
              placeholder="Responsibilities, requirements, and what it's like to work here..."
              {...register('description')}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200">
            <Input
              label="Minimum Salary (USD)"
              type="number"
              {...register('salaryMin', { valueAsNumber: true })}
              error={errors.salaryMin?.message}
            />
            <Input
              label="Maximum Salary (USD)"
              type="number"
              {...register('salaryMax', { valueAsNumber: true })}
              error={errors.salaryMax?.message}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-gray-700 ml-1">Tech Stack / Skills</label>
              <Button type="button" variant="ghost" size="sm" onClick={() => append({ value: '' })} className="text-blue-600">
                + Add Skill
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {fields.map((field, index) => (
                <div key={field.id} className="relative">
                  <Input
                    label=""
                    placeholder="React"
                    {...register(`skills.${index}.value` as const)}
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full shadow-md border hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            {errors.skills && <p className="text-red-500 text-xs mt-4">{errors.skills.message}</p>}
          </div>

          <div className="pt-8">
            <Button type="submit" isLoading={isSubmitting} className="w-full h-16 text-lg rounded-2xl shadow-xl shadow-blue-100">
              Post Job Opportunity
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
