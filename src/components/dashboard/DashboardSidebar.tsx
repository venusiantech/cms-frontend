'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Globe,
  Settings,
  ChevronRight,
  ArrowLeft,
  LogOut,
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
  { href: '/dashboard',         label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/domains', label: 'Domains',   icon: Globe },
  { href: '/dashboard/settings/general', label: 'Settings', icon: Settings, hasSubMenu: true },
];

const SETTINGS_NAV = [
  { href: '/dashboard/settings/general',       label: 'General' },
  { href: '/dashboard/settings/notifications', label: 'Notifications' },
  { href: '/dashboard/settings/subscription',  label: 'Subscription' },
  { href: '/dashboard/settings/ledger',        label: 'Ledger' },
] as const;

export interface DashboardSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

// ── Individual nav link with animated hover bg ───────────────────────────────

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  hasSubMenu,
  onClick,
  indent = false,
}: {
  href: string;
  label: string;
  icon?: LucideIcon;
  active: boolean;
  hasSubMenu?: boolean;
  onClick?: () => void;
  indent?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative flex items-center justify-between gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors group ${
        indent ? 'pl-4' : ''
      } ${
        active
          ? 'text-white'
          : 'text-neutral-500 hover:text-neutral-200'
      }`}
    >
      {/* Animated background */}
      {active && (
        <motion.span
          layoutId="nav-active-bg"
          className="absolute inset-0 rounded-lg bg-neutral-800"
          transition={{ type: 'spring', stiffness: 380, damping: 35 }}
        />
      )}

      {/* Left accent bar for active */}
      {active && (
        <motion.span
          layoutId="nav-accent"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-white"
          transition={{ type: 'spring', stiffness: 380, damping: 35 }}
        />
      )}

      <div className="relative flex items-center gap-3 min-w-0">
        {Icon && (
          <Icon
            size={16}
            className={`flex-shrink-0 transition-colors ${active ? 'text-white' : 'text-neutral-600 group-hover:text-neutral-400'}`}
          />
        )}
        <span className="truncate font-medium">{label}</span>
      </div>

      {hasSubMenu && (
        <ChevronRight
          size={14}
          className={`relative flex-shrink-0 transition-all ${active ? 'text-neutral-400' : 'text-neutral-700 group-hover:text-neutral-500'}`}
        />
      )}
    </Link>
  );
}

// ── Sub nav link (no icon, indent) ───────────────────────────────────────────

function SubNavLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors group ${
        active ? 'text-white' : 'text-neutral-500 hover:text-neutral-200'
      }`}
    >
      {active && (
        <motion.span
          layoutId="sub-active-bg"
          className="absolute inset-0 rounded-lg bg-neutral-800"
          transition={{ type: 'spring', stiffness: 380, damping: 35 }}
        />
      )}
      {active && (
        <motion.span
          layoutId="sub-accent"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-white"
          transition={{ type: 'spring', stiffness: 380, damping: 35 }}
        />
      )}

      {/* dot indicator */}
      <span
        className={`relative w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${
          active ? 'bg-white' : 'bg-neutral-700 group-hover:bg-neutral-500'
        }`}
      />
      <span className="relative font-medium">{label}</span>
    </Link>
  );
}

// ── Main Sidebar ─────────────────────────────────────────────────────────────

export function DashboardSidebar({ open = false, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const closeSidebar = () => onClose?.();
  const isSettingsActive = pathname?.startsWith('/dashboard/settings');

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname === href || (href !== '/dashboard' && pathname?.startsWith(href));
  };

  const avatarLetter = user?.email?.charAt(0).toUpperCase() ?? 'U';
  const username = user?.email?.split('@')[0] ?? 'User';

  const sidebarContent = (
    <div className="flex flex-col h-full">

      {/* ── Logo ── */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-800/60 flex-shrink-0">
        <Link href="/" className="flex items-center group" onClick={closeSidebar}>
          <img src="/logo/fastofy.png" alt="Fastofy Logo" className="w-14 h-14 opacity-90" />
          <span className="text-xl ml-2 text-white font-semibold tracking-tight">FASTOFY</span>
        </Link>
        <button
          type="button"
          onClick={closeSidebar}
          className="md:hidden p-1.5 rounded-md text-neutral-600 hover:text-white hover:bg-neutral-800 transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── Nav ── */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <AnimatePresence mode="wait" initial={false}>
          {isSettingsActive ? (
            <motion.div
              key="settings-nav"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {/* Back */}
              <Link
                href="/dashboard"
                onClick={closeSidebar}
                className="flex items-center gap-2 px-3 py-2 mb-3 rounded-lg text-xs text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/60 transition-colors group"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                Back to Dashboard
              </Link>

              {/* Section label */}
              <p className="px-3 mb-2 text-[10px] font-semibold text-neutral-600 uppercase tracking-widest">
                Settings
              </p>

              <div className="space-y-0.5">
                {SETTINGS_NAV.map((item) => (
                  <SubNavLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    active={pathname === item.href}
                    onClick={closeSidebar}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="main-nav"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="space-y-0.5"
            >
              {/* Section label */}
              <p className="px-3 mb-2 text-[10px] font-semibold text-neutral-600 uppercase tracking-widest">
                Menu
              </p>

              {MAIN_NAV.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={isActive(item.href)}
                  hasSubMenu={item.hasSubMenu}
                  onClick={closeSidebar}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── User footer ── */}
      <div className="flex-shrink-0 border-t border-neutral-800/60 p-3 space-y-2">
        {/* Profile row */}
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-neutral-800/50 transition-colors group cursor-default">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-lg">
            {avatarLetter}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-neutral-100 truncate leading-none mb-0.5">{username}</p>
            <p className="text-[11px] text-neutral-600 truncate">{user?.email ?? ''}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={() => { logout(); window.location.href = '/login'; }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-neutral-500 hover:text-red-400 hover:bg-red-500/8 transition-colors group"
        >
          <LogOut size={15} className="flex-shrink-0 transition-colors" />
          <span className="font-medium">Log out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          w-60 flex-shrink-0 h-screen bg-[#050505] border-r border-neutral-800/60
          md:relative md:translate-x-0
          fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Subtle top glow */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-violet-500/5 to-transparent" />
        {sidebarContent}
      </aside>
    </>
  );
}
