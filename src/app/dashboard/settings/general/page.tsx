'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { Pencil, Loader2, CheckCircle } from 'lucide-react';

export default function SettingsGeneralPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const res = await usersAPI.getProfile();
      return res.data;
    },
  });

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setDateOfBirth(profile.dateOfBirth || '');
      setMobileNumber(profile.mobileNumber || '');
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof usersAPI.updateProfile>[0]) =>
      usersAPI.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast.success('Settings saved successfully!');
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to save settings');
    },
  });

  const handleSave = () => {
    mutation.mutate({
      firstName: firstName.trim() || undefined,
      lastName: lastName.trim() || undefined,
      dateOfBirth: dateOfBirth.trim() || undefined,
      mobileNumber: mobileNumber.trim() || undefined,
    });
  };

  const handleCancel = () => {
    if (profile) {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setDateOfBirth(profile.dateOfBirth || '');
      setMobileNumber(profile.mobileNumber || '');
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="px-4 lg:px-6 flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-6 w-full max-w-7xl mx-auto">
      <div className="space-y-5">
        <div className="bg-[#0a0a0a] border border-neutral-700 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-700 bg-black">
            <div>
              <h2 className="text-sm font-semibold text-neutral-100">Account Information</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Update your account information</p>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-600 text-xs text-neutral-300 hover:bg-[#262626] transition-colors"
              >
                <Pencil size={12} />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  disabled={mutation.isPending}
                  className="px-3 py-1.5 rounded-lg border border-neutral-600 text-xs text-neutral-400 hover:bg-[#262626] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={mutation.isPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-black text-xs font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50"
                >
                  {mutation.isPending ? (
                    <Loader2 size={11} className="animate-spin" />
                  ) : (
                    <CheckCircle size={11} />
                  )}
                  Save
                </button>
              </div>
            )}
          </div>

          <div className="px-6 py-5">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
              Personal Information
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-neutral-500 mb-1.5">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={!isEditing}
                  placeholder={isEditing ? 'Enter first name' : '—'}
                  className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-neutral-500 transition-colors disabled:opacity-60 disabled:cursor-default"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1.5">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={!isEditing}
                  placeholder={isEditing ? 'Enter last name' : '—'}
                  className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors disabled:opacity-60 disabled:cursor-default"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1.5">Date of Birth</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  disabled={!isEditing}
                  className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-neutral-500 transition-colors disabled:opacity-60 disabled:cursor-default [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1.5">Mobile Number</label>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  disabled={!isEditing}
                  placeholder={isEditing ? '+1 234 567 8900' : '—'}
                  className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors disabled:opacity-60 disabled:cursor-default"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-neutral-500 mb-1.5">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-400 cursor-default select-none focus:outline-none"
                />
                <p className="text-xs text-neutral-600 mt-1">Email cannot be changed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
