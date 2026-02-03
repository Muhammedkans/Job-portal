'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FileUpload } from '@/components/common/FileUpload';
import api from '@/services/api';
import { toast } from 'sonner';
import { User, Mail, MapPin, Globe, Linkedin, Github, FileText, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

const profileSchema = z.object({
  headline: z.string().max(100).optional(),
  bio: z.string().max(1000).optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [completeness, setCompleteness] = useState(0);

  const { register, handleSubmit, reset, watch } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  const formData = watch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/profile/me');
        if (data) {
          reset({
            headline: data.headline || '',
            bio: data.bio || '',
            location: data.location || '',
            website: data.socials?.website || '',
            linkedin: data.socials?.linkedin || '',
            github: data.socials?.github || '',
          });
          setResumeUrl(data.resumeUrl || '');
        }
      } catch (error) {
        console.log('No existing profile');
      }
    };
    fetchProfile();
  }, [reset]);

  // Calculate completeness
  useEffect(() => {
    let score = 0;
    if (formData.headline) score += 20;
    if (formData.bio) score += 20;
    if (formData.location) score += 20;
    if (resumeUrl) score += 30;
    if (formData.linkedin || formData.github) score += 10;
    setCompleteness(score);
  }, [formData, resumeUrl]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    try {
      const apiData = {
        headline: data.headline,
        bio: data.bio,
        location: data.location,
        socials: {
          website: data.website,
          linkedin: data.linkedin,
          github: data.github,
        },
        resumeUrl,
      };

      await api.post('/profile', apiData);
      toast.success('Professional profile updated! 🌟');
    } catch (error) {
      toast.error('Failed to sync profile. Try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Side: Identity Card */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-blue-50/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>

              <div className="relative z-10 text-center">
                <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
                  {user?.name?.charAt(0)}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-500 text-sm mb-6 uppercase tracking-widest font-bold">{user?.role}</p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl text-gray-600 text-sm">
                    <Mail size={18} className="text-blue-500" />
                    {user?.email}
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl text-gray-600 text-sm font-medium">
                    <ShieldCheck size={18} className="text-green-500" />
                    Verified Account
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-100">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-gray-700">Profile Strength</span>
                  <span className="text-blue-600 font-bold">{completeness}%</span>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full transition-all duration-1000 ease-out"
                    style={{ width: `${completeness}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">Complete your profile to unlock elite job recommendations.</p>
              </div>
            </div>

            {/* Quick Stats / Achievements */}
            <div className="bg-blue-600 rounded-[2rem] p-8 text-white">
              <Zap className="mb-4 text-yellow-300" size={32} />
              <h3 className="text-xl font-bold mb-2">Job Magnet Mode</h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-6">Profiles with 100% completion receive 4x more recruiter messages.</p>
              <Button variant="ghost" className="w-full bg-white/10 hover:bg-white/20 text-white rounded-xl border-0">
                Enable Pro Badge
              </Button>
            </div>
          </div>

          {/* Right Side: Editors */}
          <div className="lg:col-span-2 space-y-8">

            {/* Resume Card */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-xl shadow-blue-50/50">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Elite Portfolio & Resume</h3>
                  <p className="text-sm text-gray-500">Recruiters spend 6 seconds on a resume. Make it count.</p>
                </div>
              </div>

              <div className="group relative">
                {resumeUrl && (
                  <div className="flex items-center justify-between mb-4 p-4 bg-green-50 border border-green-100 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="text-green-600" size={20} />
                      <span className="text-sm font-bold text-green-700 truncate max-w-[200px]">Current_Resume.pdf</span>
                    </div>
                    <a href={resumeUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-green-700 underline uppercase tracking-tighter">View File</a>
                  </div>
                )}
                <FileUpload
                  label={resumeUrl ? "Replace with New Resume" : "Upload Professional PDF"}
                  accept=".pdf"
                  onUpload={(url) => {
                    setResumeUrl(url);
                    toast.success('Resume synchronized!');
                  }}
                />
              </div>
            </div>

            {/* Profile Content */}
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-xl shadow-blue-50/50">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Career Identification</h3>
                  <p className="text-sm text-gray-500">Update your headline and bio to reflect your expertise.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Professional Headline"
                    placeholder="e.g. Full Stack Architect @ Silicon Valley"
                    {...register('headline')}
                    className="rounded-2xl"
                  />
                  <Input
                    label="Primary Location"
                    placeholder="e.g. Remote / London"
                    {...register('location')}
                    className="rounded-2xl"
                  />
                </div>

                <div className="w-full">
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Professional Impact (Bio)</label>
                  <textarea
                    className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none h-40 transition-all text-gray-600 leading-relaxed font-medium"
                    placeholder="Describe your achievements and technological focus..."
                    {...register('bio')}
                  />
                </div>

                <div className="pt-8 border-t border-gray-50">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 px-1">Social Ecosystem</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Input
                      label="Portfolio Site"
                      icon={<Globe size={18} />}
                      placeholder="https://yourname.com"
                      {...register('website')}
                    />
                    <Input
                      label="LinkedIn Profile"
                      icon={<Linkedin size={18} />}
                      placeholder="linkedin.com/..."
                      {...register('linkedin')}
                    />
                    <Input
                      label="GitHub Profile"
                      icon={<Github size={18} />}
                      placeholder="github.com/..."
                      {...register('github')}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-10">
                  <Button type="submit" isLoading={isSaving} className="h-16 px-12 rounded-2xl text-lg shadow-xl shadow-blue-100">
                    Sync Professional Profile
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
