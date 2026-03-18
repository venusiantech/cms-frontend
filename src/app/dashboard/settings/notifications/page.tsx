'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { Bell, Mail, Trash2, Loader2, CheckCircle } from 'lucide-react';

export default function SettingsNotificationsPage() {
  const queryClient = useQueryClient();
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [notificationEmails, setNotificationEmails] = useState<string[]>(['', '']);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const res = await usersAPI.getProfile();
      return res.data;
    },
  });

  useEffect(() => {
    if (profile) {
      setEmailNotificationsEnabled(profile.emailNotificationsEnabled ?? true);
      const emails = profile.notificationEmails ?? [];
      setNotificationEmails([emails[0] || '', emails[1] || '']);
    }
  }, [profile]);

  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof usersAPI.updateProfile>[0]) =>
      usersAPI.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast.success('Settings saved successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to save settings');
    },
  });

  const handleSave = () => {
    const validExtras = notificationEmails.filter((e) => e.trim() !== '');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const e of validExtras) {
      if (!emailRegex.test(e)) {
        toast.error(`"${e}" is not a valid email address`);
        return;
      }
    }
    mutation.mutate({
      emailNotificationsEnabled,
      notificationEmails: validExtras,
    });
  };

  const setNotifEmail = (index: number, value: string) => {
    setNotificationEmails((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
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
          <div className="flex items-center gap-2 px-6 py-4 border-b border-neutral-700 bg-black">
            <Bell size={14} className="text-neutral-400" />
            <div>
              <h2 className="text-sm font-semibold text-neutral-100">Email Notifications</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Control when and where you receive email alerts</p>
            </div>
          </div>

          <div className="px-6 py-5 space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm text-neutral-200">Enable email notifications</p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Receive emails for website generation, domain deletion, and account activity
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={emailNotificationsEnabled}
                onClick={() => setEmailNotificationsEnabled((v) => !v)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none ml-4 ${
                  emailNotificationsEnabled ? 'bg-white' : 'bg-neutral-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-[#0a0a0a] transition-transform duration-200 ${
                    emailNotificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>

            <div className={`space-y-3 transition-opacity duration-200 ${emailNotificationsEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <div>
                <p className="text-xs font-medium text-neutral-400">Additional recipients</p>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Up to 2 extra emails that also receive all notification emails
                </p>
              </div>
              {notificationEmails.map((email, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setNotifEmail(i, e.target.value)}
                      placeholder={`Recipient ${i + 1} email`}
                      className="w-full bg-black border border-neutral-700 rounded-lg pl-8 pr-3 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>
                  {email && (
                    <button
                      type="button"
                      onClick={() => setNotifEmail(i, '')}
                      className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={handleSave}
                disabled={mutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-neutral-200 text-black rounded-lg text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {mutation.isPending ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <CheckCircle size={13} />
                )}
                Save Notifications
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
