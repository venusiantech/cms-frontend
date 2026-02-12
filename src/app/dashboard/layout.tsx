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
  
  // Check if we're on the editor page (no padding needed)
  const isEditorPage = pathname?.includes('/dashboard/editor/');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated()) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: 'white',
            color: '#1f2937',
            border: '1px solid #e5e7eb',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          },
          success: {
            duration: 3000,
            style: {
              background: '#f0fdf4',
              border: '1px solid #86efac',
            },
            iconTheme: {
              primary: '#16a34a',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#fef2f2',
              border: '1px solid #fecaca',
            },
            iconTheme: {
              primary: '#dc2626',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-100">
        <div className="px-4 sm:px-8 lg:px-16 xl:px-24 h-16 sm:h-20 flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/dashboard" className="flex items-center group">
            <Image 
              src="/templateA/assets/images/jaal.png" 
              alt="Jaal Logo" 
              width={220}
              height={80}
              className="h-24 sm:h-32 w-auto group-hover:scale-105 transition-transform duration-200"
            />
          </Link>

          {/* Right: User Avatar & Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <ChevronDown size={16} className={`text-gray-500 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in zoom-in duration-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                    {user?.role === 'SUPER_ADMIN' && (
                      <span className="inline-block mt-1.5 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                        Super Admin
                      </span>
                    )}
                  </div>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                  >
                    <Settings size={18} />
                    <span className="font-medium">Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 group"
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
      <main className={`${isEditorPage ? '' : 'px-4 sm:px-8 lg:px-16 xl:px-24 pt-8 sm:pt-12 pb-12 sm:pb-16'}`}>
        {children}
      </main>
    </div>
  );
}
