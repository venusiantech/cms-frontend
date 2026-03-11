'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Globe,
  Settings,
  ChevronRight,
  ArrowLeft,
  LogOut,
  Bell,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

type MainNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  hasSubMenu?: boolean;
};

const MAIN_NAV: MainNavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/domains', label: 'Domains', icon: Globe },
  { href: '/dashboard/settings/general', label: 'Settings', icon: Settings, hasSubMenu: true },
];

const SETTINGS_NAV = [
  { href: '/dashboard/settings/general', label: 'General' },
  { href: '/dashboard/settings/notifications', label: 'Notifications' },
  { href: '/dashboard/settings/subscription', label: 'Subscription' },
  { href: '/dashboard/settings/ledger', label: 'Ledger' },
] as const;

export interface DashboardSidebarProps {
  /** When true (mobile/tablet), sidebar is open as overlay */
  open?: boolean;
  /** Called when sidebar should close (e.g. link click, overlay click, close button) */
  onClose?: () => void;
}

export function DashboardSidebar({ open = false, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const closeSidebar = () => onClose?.();

  const isSettingsActive = pathname?.startsWith('/dashboard/settings');
  const showSettingsSubMenu = isSettingsActive;

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname === href || (href !== '/dashboard' && pathname?.startsWith(href));
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-4 py-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between border-b border-neutral-800">
        <Link href="/" className="flex items-center group" onClick={closeSidebar}>
          <img
            src="/logo/fastofy.png"
            alt="Fastofy Logo"
            className="w-14 h-14 opacity-90"
          />
          <span className="text-xl font-tracking-tight ml-2">
            <span className="text-white">FASTOFY</span>
          </span>
        </Link>
        {/* Close button for mobile overlay */}
        <button
          type="button"
          onClick={closeSidebar}
          className="md:hidden p-2 rounded-md text-neutral-400 hover:text-white hover:bg-[#262626] transition-colors"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        {showSettingsSubMenu ? (
          <>
            <div className="flex items-center px-4 py-4 border-neutral-800">
              <Link
                href="/dashboard"
                className="p-1.5 -ml-1 rounded-md text-neutral-400 hover:text-white hover:bg-[#262626] transition-colors"
                aria-label="Back to dashboard"
                onClick={closeSidebar}
              >
                <ArrowLeft size={18} />
              </Link>
              <span className="text-sm font-light text-neutral-400">Settings</span>
            </div>
            <nav className=" px-2">
              {SETTINGS_NAV.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeSidebar}
                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-light transition-colors ${active
                        ? 'bg-[#262626] text-neutral-100'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#171717]'
                      }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </>
        ) : (
          <nav className="py-4 px-2 space-y-0.5">
            {MAIN_NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeSidebar}
                  className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm font-light transition-colors group ${active
                      ? 'bg-[#262626] text-neutral-100'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#171717]'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className="flex-shrink-0 text-neutral-500 group-hover:text-neutral-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.hasSubMenu && (
                    <ChevronRight size={16} className="flex-shrink-0 text-neutral-500 opacity-0 group-hover:opacity-100" />
                  )}
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      {/* User profile and logout at bottom */}
      <div className="border-t border-neutral-800 p-2 space-y-2">
        {/* Profile card */}
        <div className="flex items-center gap-3 rounded-xl bg-[#171717] border border-neutral-800 p-2">
          <div className="w-10 h-10 bg-[#404040] rounded-lg flex items-center justify-center text-neutral-100 font-semibold text-sm flex-shrink-0">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-neutral-100 truncate">
              {user?.email?.split('@')[0] ?? 'User'}
            </p>
            <p className="text-xs text-neutral-500 truncate">{user?.email ?? ''}</p>
          </div>
          <button
            type="button"
            className="p-1.5 rounded-md text-neutral-500 hover:text-neutral-300 hover:bg-[#262626] transition-colors flex-shrink-0"
            aria-label="Notifications"
          >
            <Bell size={16} />
          </button>
        </div>
        {/* Logout button */}
        <button
          type="button"
          onClick={() => {
            logout();
            window.location.href = '/login';
          }}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-transparent py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:border-red-500/60 transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile/tablet overlay backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={closeSidebar}
          aria-hidden
        />
      )}
      {/* Sidebar: fixed overlay on mobile when open, static on desktop */}
      <aside
        className={`
          w-64 flex-shrink-0 flex flex-col h-screen bg-black border-r border-neutral-800
          md:relative md:translate-x-0
          fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
