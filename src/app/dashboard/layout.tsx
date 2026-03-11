'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { stripeAPI } from '@/lib/api';
import { Toaster } from 'react-hot-toast';
import { DashboardSidebar } from '@/components/dashboard';
import { Menu } from 'lucide-react';
import Link from 'next/link';

/** Map pathname to nav bar page title */
function getDashboardPageTitle(pathname: string | null): string {
  if (!pathname) return 'Dashboard';
  if (pathname === '/dashboard') return 'Dashboard';
  if (pathname === '/dashboard/domains') return 'Domains';
  if (pathname.startsWith('/dashboard/settings/')) {
    const rest = pathname.replace('/dashboard/settings/', '') || 'general';
    const labels: Record<string, string> = {
      general: 'General',
      notifications: 'Notifications',
      subscription: 'Subscription',
      ledger: 'Ledger',
    };
    const sub = labels[rest] || rest;
    return `Settings / ${sub}`;
  }
  if (pathname === '/dashboard/settings') return 'Settings';
  if (pathname.includes('/dashboard/editor/') && pathname.endsWith('/leads')) return 'Editor / Leads';
  if (pathname.includes('/dashboard/editor/')) return 'Editor';
  if (pathname.includes('/dashboard/preview-editor')) return 'Preview Editor';
  return 'Dashboard';
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pageTitle = getDashboardPageTitle(pathname);

  // Check if we're on the editor page (no padding needed)
  const isEditorPage = pathname?.includes('/dashboard/editor/');

  const [mounted, setMounted] = useState(false);

  const { data: subscription } = useQuery({
    queryKey: ['stripe-subscription'],
    queryFn: async () => {
      const res = await stripeAPI.getSubscription();
      return res.data as { plan?: { name: string } } | null;
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated()) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted) return null;
  if (!isAuthenticated()) return null;

  return (
    <div className="h-screen bg-black flex overflow-hidden">
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

      {/* Sidebar: controlled on mobile/tablet via hamburger */}
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-0">
        {/* Top bar: hamburger + page name (logo is in sidebar) */}
        <nav className="h-16 flex-shrink-0 flex items-center justify-between gap-3 border-b border-neutral-800 bg-black px-4 md:px-6">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-md text-neutral-400 hover:text-white hover:bg-[#262626] transition-colors flex-shrink-0"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-sm font-light text-neutral-300 truncate">
              {pageTitle}
            </h1>
          </div>
          {subscription?.plan?.name && (
            <Link
              href="/dashboard/settings/subscription"
              className="flex-shrink-0 inline-flex items-center rounded-full border border-neutral-700 bg-neutral-900/80 px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-200 hover:border-neutral-600 hover:bg-neutral-800/80 transition-colors"
            >
              <span className="text-neutral-500">Current plan:</span>
              <span className="ml-1.5 font-medium text-neutral-300">{subscription.plan.name}</span>
            </Link>
          )}
        </nav>

        <main
          className={`flex-1 overflow-auto ${
            isEditorPage ? '' : 'px-0 xl:px-12 py-4 sm:py-6'
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
