'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import { Building2, Globe, MapPin, AlignLeft } from 'lucide-react';

const companySchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  website: z.string().url('Please enter a valid URL'),
  location: z.string().min(2, 'Location is required'),
});

type CompanyFormValues = z.infer<typeof companySchema>;

export default function NewCompanyPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
  });

  const onSubmit = async (data: CompanyFormValues) => {
    setLoading(true);
    try {
      await api.post('/companies', data);
      toast.success('Company registered successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to register company');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-blue-50/50">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-600 rounded-2xl text-white">
            <Building2 size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Register Company</h1>
            <p className="text-sm text-gray-500">Create your company profile to start posting jobs.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Company Name"
            placeholder="e.g. Google"
            {...register('name')}
            error={errors.name?.message}
          />

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
              <AlignLeft size={16} /> Company Description
            </label>
            <textarea
              className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px] transition-all"
              placeholder="Tell us about your company culture and mission..."
              {...register('description')}
            ></textarea>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Website URL"
              placeholder="https://google.com"
              {...register('website')}
              error={errors.website?.message}
            />
            <Input
              label="Office Location"
              placeholder="e.g. Mountain View, CA"
              {...register('location')}
              error={errors.location?.message}
            />
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full h-14 text-lg rounded-2xl shadow-lg shadow-blue-200" isLoading={loading}>
              Create Company Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
