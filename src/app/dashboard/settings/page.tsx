'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { Pencil, Loader2, Bell, Mail, Trash2, Shield, CheckCircle } from 'lucide-react';

type Tab = 'general' | 'verification' | 'security';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [isEditing, setIsEditing] = useState(false);

  // ── Form state ─────────────────────────────────────────────────
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  // ── Notification state ─────────────────────────────────────────
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [notificationEmails, setNotificationEmails] = useState<string[]>(['', '']);

  // ── Fetch profile ──────────────────────────────────────────────
  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const res = await usersAPI.getProfile();
      return res.data;
    },
  });

  // Populate form when data arrives
  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setDateOfBirth(profile.dateOfBirth || '');
      setMobileNumber(profile.mobileNumber || '');
      setEmailNotificationsEnabled(profile.emailNotificationsEnabled ?? true);
      const emails = profile.notificationEmails ?? [];
      setNotificationEmails([emails[0] || '', emails[1] || '']);
    }
  }, [profile]);

  // ── Save mutation ──────────────────────────────────────────────
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
    const validExtras = notificationEmails.filter((e) => e.trim() !== '');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const e of validExtras) {
      if (!emailRegex.test(e)) {
        toast.error(`"${e}" is not a valid email address`);
        return;
      }
    }
    mutation.mutate({
      firstName: firstName.trim() || undefined,
      lastName: lastName.trim() || undefined,
      dateOfBirth: dateOfBirth.trim() || undefined,
      mobileNumber: mobileNumber.trim() || undefined,
      emailNotificationsEnabled,
      notificationEmails: validExtras,
    });
  };

  const handleCancel = () => {
    if (profile) {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setDateOfBirth(profile.dateOfBirth || '');
      setMobileNumber(profile.mobileNumber || '');
      setEmailNotificationsEnabled(profile.emailNotificationsEnabled ?? true);
      const emails = profile.notificationEmails ?? [];
      setNotificationEmails([emails[0] || '', emails[1] || '']);
    }
    setIsEditing(false);
  };

  const setNotifEmail = (index: number, value: string) => {
    setNotificationEmails((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const TABS: { id: Tab; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'verification', label: 'Verification' },
    { id: 'security', label: 'Security' },
  ];

  if (isLoading) {
    return (
      <div className="px-4 lg:px-8 flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-8 w-full max-w-full">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-neutral-100">Settings</h1>
      </div>

      {/* ── Tabs ──────────────────────────────────────────────────── */}
      <div className="flex gap-0 border-b border-neutral-700 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? 'border-white text-neutral-100'
                : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── General Tab ───────────────────────────────────────────── */}
      {activeTab === 'general' && (
        <div className="space-y-5">
          {/* Account Information */}
          <div className="bg-[#0a0a0a] border border-neutral-700 rounded-xl overflow-hidden">
            {/* Section header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-700">
              <div>
                <h2 className="text-sm font-semibold text-neutral-100">Account Information</h2>
                <p className="text-xs text-neutral-500 mt-0.5">Update your account information</p>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-600 text-xs text-neutral-300 hover:bg-neutral-800 transition-colors"
                >
                  <Pencil size={12} />
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    disabled={mutation.isPending}
                    className="px-3 py-1.5 rounded-lg border border-neutral-600 text-xs text-neutral-400 hover:bg-neutral-800 transition-colors disabled:opacity-50"
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

            {/* Personal Information */}
            <div className="px-6 py-5">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                Personal Information
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="block text-xs text-neutral-500 mb-1.5">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={!isEditing}
                    placeholder={isEditing ? 'Enter first name' : '—'}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors disabled:opacity-60 disabled:cursor-default"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-xs text-neutral-500 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={!isEditing}
                    placeholder={isEditing ? 'Enter last name' : '—'}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors disabled:opacity-60 disabled:cursor-default"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-xs text-neutral-500 mb-1.5">Date of Birth</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    disabled={!isEditing}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-neutral-500 transition-colors disabled:opacity-60 disabled:cursor-default [color-scheme:dark]"
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs text-neutral-500 mb-1.5">Mobile Number</label>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    disabled={!isEditing}
                    placeholder={isEditing ? '+1 234 567 8900' : '—'}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors disabled:opacity-60 disabled:cursor-default"
                  />
                </div>

                {/* Email — full width, always read-only */}
                <div className="sm:col-span-2">
                  <label className="block text-xs text-neutral-500 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-400 cursor-default select-none focus:outline-none"
                  />
                  <p className="text-xs text-neutral-600 mt-1">Email cannot be changed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Email Notifications */}
          <div className="bg-[#0a0a0a] border border-neutral-700 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-4 border-b border-neutral-700">
              <Bell size={14} className="text-neutral-400" />
              <div>
                <h2 className="text-sm font-semibold text-neutral-100">Email Notifications</h2>
                <p className="text-xs text-neutral-500 mt-0.5">Control when and where you receive email alerts</p>
              </div>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Master toggle */}
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

              {/* Extra recipients */}
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
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-8 pr-3 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
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

              {/* Save notifications button */}
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
      )}

      {/* ── Verification Tab ──────────────────────────────────────── */}
      {activeTab === 'verification' && (
        <div className="bg-[#0a0a0a] border border-neutral-700 rounded-xl p-8 flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center">
            <Shield size={20} className="text-neutral-400" />
          </div>
          <h3 className="text-sm font-semibold text-neutral-200">Identity Verification</h3>
          <p className="text-xs text-neutral-500 max-w-xs">
            Verification features are coming soon. You'll be able to verify your identity and domain ownership here.
          </p>
        </div>
      )}

      {/* ── Security Tab ─────────────────────────────────────────── */}
      {activeTab === 'security' && (
        <div className="bg-[#0a0a0a] border border-neutral-700 rounded-xl p-8 flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center">
            <Shield size={20} className="text-neutral-400" />
          </div>
          <h3 className="text-sm font-semibold text-neutral-200">Security Settings</h3>
          <p className="text-xs text-neutral-500 max-w-xs">
            Security features like password change and two-factor authentication are coming soon.
          </p>
        </div>
      )}
    </div>
  );
}
