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

/** Map pathname to nav bar page title + subtitle */
function getPageMeta(pathname: string | null): { title: string; subtitle: string } {
  if (!pathname) return { title: 'Dashboard', subtitle: 'Your account at a glance' };
  if (pathname === '/dashboard') return { title: 'Dashboard', subtitle: 'Your account at a glance' };
  if (pathname === '/dashboard/domains')  return { title: 'Domains',  subtitle: 'Manage your domains and websites' };
  if (pathname === '/dashboard/schedule') return { title: 'Schedule', subtitle: 'Manage content generation schedules' };
  if (pathname === '/dashboard/domains') return { title: 'Domains', subtitle: 'Manage your domains and websites' };
  if (pathname.startsWith('/dashboard/settings/')) {
    const rest = pathname.replace('/dashboard/settings/', '') || 'general';
    const map: Record<string, { title: string; subtitle: string }> = {
      general:       { title: 'General',       subtitle: 'Manage your account details' },
      notifications: { title: 'Notifications', subtitle: 'Control your notification preferences' },
      subscription:  { title: 'Subscription',  subtitle: 'Manage your plan and billing' },
      ledger:        { title: 'Ledger',         subtitle: 'Your credit usage history' },
    };
    return map[rest] ?? { title: rest, subtitle: '' };
  }
  if (pathname === '/dashboard/settings') return { title: 'Settings', subtitle: 'Manage your account details' };
  if (pathname.includes('/dashboard/editor/') && pathname.endsWith('/leads')) return { title: 'Leads', subtitle: 'Contact form submissions' };
  if (pathname.includes('/dashboard/editor/')) return { title: 'Editor', subtitle: 'Edit your website content' };
  if (pathname.includes('/dashboard/preview-editor')) return { title: 'Preview Editor', subtitle: '' };
  return { title: 'Dashboard', subtitle: 'Your account at a glance' };
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
  const { title: pageTitle, subtitle: pageSubtitle } = getPageMeta(pathname);

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
            <div className="min-w-0">
              <h1 className="text-xl text-white tracking-tight leading-none truncate">
                {pageTitle}
              </h1>
              {/* {pageSubtitle && (
                <p className="text-xs text-neutral-500 mt-0.5 truncate">{pageSubtitle}</p>
              )} */}
            </div>
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
            isEditorPage ? '' : 'py-4 sm:py-6'
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
