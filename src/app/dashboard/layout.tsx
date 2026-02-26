'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, ChevronDown, Settings } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, logout, user } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check if we're on the editor page (no padding needed)
  const isEditorPage = pathname?.includes('/dashboard/editor/');

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated()) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  if (!isAuthenticated()) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#262626',
            color: '#fafafa',
            border: '1px solid #404040',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
          },
          success: {
            duration: 3000,
            style: {
              background: '#14532d',
              border: '1px solid #166534',
            },
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#450a0a',
              border: '1px solid #991b1b',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Top Navbar - Vercel-style dark */}
      <nav className="bg-black ">
        <div className="px-4 py-4 sm:px-8 lg:px-16 xl:px-24 h-14 flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center group">
            <div className="flex items-center">
              <img
                src="/logo/fastofy.png"
                alt="Fastofy Logo"
                className="w-18 h-20 opacity-90"
              />
              <span className="text-2xl font-tracking-tight">
                <span className="text-white">FASTOFY</span>
              </span>
            </div>
          </Link>

          {/* Right: User Avatar & Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-neutral-700 rounded-lg flex items-center justify-center text-neutral-100 font-semibold text-sm">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <ChevronDown size={16} className={`text-neutral-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-neutral-900 rounded-lg shadow-xl border border-neutral-700 py-2 z-50">
                  <div className="px-4 py-3 border-b border-neutral-800">
                    <p className="text-sm font-medium text-neutral-100 truncate">{user?.email}</p>
                    {user?.role === 'SUPER_ADMIN' && (
                      <span className="inline-block mt-1.5 px-2 py-0.5 bg-neutral-800 text-neutral-300 text-xs rounded-md font-medium">
                        Super Admin
                      </span>
                    )}
                  </div>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all duration-200"
                  >
                    <Settings size={18} />
                    <span className="font-medium">Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-neutral-300 hover:text-red-400 hover:bg-neutral-800 transition-all duration-200 group"
                  >
                    <LogOut size={18} className="group-hover:rotate-12 transition-transform duration-200" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className={`min-h-screen bg-black ${isEditorPage ? '' : 'px-4 sm:px-8 lg:px-16 xl:px-24 pt-8 sm:pt-12 pb-12 sm:pb-16'}`}>
        {children}
      </main>
    </div>
  );
}
