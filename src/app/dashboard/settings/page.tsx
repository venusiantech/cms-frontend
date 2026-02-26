'use client';

import { useAuthStore } from '@/store/authStore';

export default function SettingsPage() {
  const { user } = useAuthStore();

  return (
    <div className="px-4 lg:px-8">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-neutral-100">Settings</h1>
      </div>

      <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-100 mb-4">Account Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-neutral-500 mb-1">Email</label>
            <p className="font-medium text-neutral-100">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm text-neutral-500 mb-1">Role</label>
            <p className="font-medium text-neutral-100">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

