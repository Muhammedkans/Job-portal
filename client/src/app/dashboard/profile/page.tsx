'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/services/api';

const profileSchema = z.object({
  headline: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');

  const { register, handleSubmit, reset } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  // Fetch existing profile on mount
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
        }
      } catch (error) {
        // No profile found is okay, we start blank
        console.log('No existing profile');
      }
    };

    fetchProfile();
  }, [reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    setSuccess('');
    try {
      // Transform flat form data to nested API structure
      const apiData = {
        headline: data.headline,
        bio: data.bio,
        location: data.location,
        socials: {
          website: data.website,
          linkedin: data.linkedin,
          github: data.github,
        },
      };

      await api.post('/profile', apiData);
      setSuccess('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h2>

        {success && (
          <div className="bg-green-50 text-green-700 p-3 rounded mb-6 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Headline"
            placeholder="e.g. Senior Frontend Engineer"
            {...register('headline')}
          />

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
              placeholder="Tell us about yourself..."
              {...register('bio')}
            />
          </div>

          <Input
            label="Location"
            placeholder="e.g. New York, USA"
            {...register('location')}
          />

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Social Links</h3>
            <div className="space-y-4">
              <Input
                label="LinkedIn URL"
                placeholder="https://linkedin.com/in/..."
                {...register('linkedin')}
              />
              <Input
                label="GitHub URL"
                placeholder="https://github.com/..."
                {...register('github')}
              />
              <Input
                label="Personal Website"
                placeholder="https://..."
                {...register('website')}
              />
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <Button type="submit" isLoading={isSaving}>
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
