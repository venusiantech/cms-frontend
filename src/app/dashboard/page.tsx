'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '@/lib/api';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  Globe, Zap, FileText, Users, TrendingUp, CreditCard,
  Loader2, AlertCircle, ArrowUpRight, Sparkles,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ChartPoint { date: string; value: number }

interface DashboardData {
  subscription: {
    planName: string;
    status: string;
    creditsRemaining: number;
    creditsPerMonth: number;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: string | null;
    websitesUsed: number;
    maxWebsites: number;
    isCustomPlan: boolean;
  } | null;
  counts: {
    domains: number;
    activeDomains: number;
    websites: number;
    totalBlogsGenerated: number;
    totalLeads: number;
    leadsThisMonth: number;
  };
  charts: {
    creditsUsed: ChartPoint[];
    blogsGenerated: ChartPoint[];
    leads: ChartPoint[];
  };
}

// ─── Animated Number ─────────────────────────────────────────────────────────

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 18 });
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString());

  useEffect(() => { motionVal.set(value); }, [value, motionVal]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

// ─── Glow Card ───────────────────────────────────────────────────────────────

function GlowCard({
  children,
  className = '',
  glowColor = 'rgba(255,255,255,0.06)',
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`relative overflow-hidden rounded-2xl border border-neutral-800 bg-[#080808] ${className}`}
      style={{
        background: isHovered
          ? `radial-gradient(350px circle at ${pos.x}px ${pos.y}px, ${glowColor}, transparent 60%), #080808`
          : '#080808',
        transition: 'background 0.3s ease',
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  delay = 0,
}: {
  label: string;
  value: number;
  sub?: string;
  icon: React.ElementType;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    >
      <GlowCard glowColor={`${color}18`} className="p-5 h-full relative overflow-hidden">
        {/* Watermark icon — large, bottom-right */}
        <Icon
          size={90}
          className="absolute -bottom-4 -right-4 opacity-[0.07] pointer-events-none"
          style={{ color }}
        />

        {/* Top row: colored circle icon + sub-label */}
        <div className="flex items-center justify-between mb-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${color}22` }}
          >
            <Icon size={14} style={{ color }} />
          </div>
          {sub && (
            <span className="text-[10px] text-neutral-600 font-medium tracking-widest uppercase">
              {sub}
            </span>
          )}
        </div>

        {/* Value */}
        <p className="text-[28px] font-bold text-white tabular-nums leading-none mb-1.5">
          <AnimatedNumber value={value} />
        </p>

        {/* Label */}
        <p className="text-xs text-neutral-500">{label}</p>
      </GlowCard>
    </motion.div>
  );
}

// ─── Usage Ring ──────────────────────────────────────────────────────────────

function UsageRing({
  label,
  used,
  max,
  color,
}: {
  label: string;
  used: number;
  max: number;
  color: string;
}) {
  const p = max === 0 ? 100 : Math.min(100, Math.round((used / max) * 100));
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (p / 100) * circ;

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-16 h-16 flex-shrink-0">
        <svg width="64" height="64" className="-rotate-90">
          <circle cx="32" cy="32" r={r} fill="none" stroke="#1a1a1a" strokeWidth="5" />
          <motion.circle
            cx="32" cy="32" r={r} fill="none"
            stroke={color} strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - dash }}
            transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white">{p}%</span>
        </div>
      </div>
      <div>
        <p className="text-xs text-neutral-400 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-white tabular-nums">
          {used.toLocaleString()}
          <span className="text-neutral-600 font-normal"> / {max.toLocaleString()}</span>
        </p>
      </div>
    </div>
  );
}

// ─── Chart Card ──────────────────────────────────────────────────────────────

function ChartCard({
  title,
  data,
  color,
  type,
  delay = 0,
}: {
  title: string;
  data: ChartPoint[];
  color: string;
  type: 'area' | 'bar';
  delay?: number;
}) {
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));
  const total = data.reduce((s, d) => s + d.value, 0);
  const gradId = `g-${color.replace('#', '')}`;

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: '#0d0d0d',
      border: '1px solid #1f1f1f',
      borderRadius: '10px',
      fontSize: '12px',
      color: '#e5e5e5',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    },
    labelStyle: { color: '#555', marginBottom: 4, fontSize: 11 },
    cursor: { stroke: '#2a2a2a', strokeWidth: 1 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
    >
      <GlowCard glowColor={`${color}12`} className="p-5">
        <div className="flex items-start justify-between mb-1">
          <p className="text-sm font-semibold text-neutral-200">{title}</p>
          <span className="flex items-center gap-1 text-[10px] text-neutral-600 bg-neutral-900 px-2 py-1 rounded-full border border-neutral-800">
            <ArrowUpRight size={9} />
            30d
          </span>
        </div>
        <p className="text-3xl font-bold text-white tabular-nums mb-5" style={{ textShadow: `0 0 30px ${color}40` }}>
          <AnimatedNumber value={total} />
        </p>

        <ResponsiveContainer width="100%" height={110}>
          {type === 'area' ? (
            <AreaChart data={formatted} margin={{ top: 2, right: 2, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#141414" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#404040' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 9, fill: '#404040' }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip {...tooltipStyle} formatter={(v) => [v, title]} labelFormatter={(l) => l} />
              <Area
                type="monotone" dataKey="value"
                stroke={color} strokeWidth={2}
                fill={`url(#${gradId})`}
                dot={false} activeDot={{ r: 4, fill: color, stroke: '#0a0a0a', strokeWidth: 2 }}
              />
            </AreaChart>
          ) : (
            <BarChart data={formatted} margin={{ top: 2, right: 2, left: -28, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#141414" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#404040' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 9, fill: '#404040' }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip {...tooltipStyle} formatter={(v) => [v, title]} labelFormatter={(l) => l} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={20}>
                {formatted.map((_, i) => (
                  <motion.rect key={i} />
                ))}
              </Bar>
              <Bar dataKey="value" fill={color} fillOpacity={0.85} radius={[4, 4, 0, 0]} maxBarSize={20} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </GlowCard>
    </motion.div>
  );
}

// ─── Dot Grid Background ─────────────────────────────────────────────────────

function DotGrid() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
      style={{
        backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    />
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await dashboardAPI.get();
      return res.data;
    },
    staleTime: 60_000,
  });

  if (isLoading) {
    return (
      <div className="px-4 lg:px-6 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
          </div>
          <p className="text-xs text-neutral-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="px-4 lg:px-6 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <AlertCircle size={24} className="text-neutral-700" />
          <p className="text-sm text-neutral-500">Failed to load dashboard</p>
        </div>
      </div>
    );
  }

  const { subscription, counts, charts } = data;
  const creditsUsed = subscription
    ? Math.max(0, subscription.creditsPerMonth - subscription.creditsRemaining)
    : 0;

  const statusLabel = subscription
    ? subscription.cancelAtPeriodEnd
      ? `Cancels ${subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}`
      : subscription.status === 'ACTIVE' ? 'Active'
      : subscription.status === 'PENDING_PAYMENT' ? 'Pending Payment'
      : 'Cancelled'
    : null;

  const statusColor = subscription
    ? subscription.cancelAtPeriodEnd ? 'text-orange-400 bg-orange-500/8 border-orange-500/20'
    : subscription.status === 'ACTIVE' ? 'text-emerald-400 bg-emerald-500/8 border-emerald-500/20'
    : subscription.status === 'PENDING_PAYMENT' ? 'text-amber-400 bg-amber-500/8 border-amber-500/20'
    : 'text-neutral-400 bg-neutral-500/8 border-neutral-500/20'
    : '';

  return (
    <>
      <DotGrid />
      <div className="relative z-10 px-4 lg:px-6 space-y-6 pb-10">

        {/* ── Subscription Card ────────────────────────────────────── */}
        {subscription && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="rounded-2xl border border-neutral-800 overflow-hidden"
          >
            {/* Coloured header band */}
            <div className={`px-6 py-4 flex items-center justify-between ${
              subscription.cancelAtPeriodEnd
                ? 'bg-orange-500/15'
                : subscription.status === 'ACTIVE'
                ? 'bg-violet-600/20'
                : subscription.status === 'PENDING_PAYMENT'
                ? 'bg-amber-500/15'
                : 'bg-neutral-800/60'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <CreditCard size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-[11px] text-white/50 leading-none mb-0.5 uppercase tracking-wider">Current Plan</p>
                  <p className="text-lg font-bold text-white leading-none">{subscription.planName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Status pill */}
                <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${
                  subscription.cancelAtPeriodEnd
                    ? 'bg-orange-500/25 text-orange-300'
                    : subscription.status === 'ACTIVE'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : subscription.status === 'PENDING_PAYMENT'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-neutral-700 text-neutral-400'
                }`}>
                  {subscription.cancelAtPeriodEnd ? 'Cancelling' : subscription.status === 'ACTIVE' ? 'Active' : subscription.status === 'PENDING_PAYMENT' ? 'Pending' : 'Cancelled'}
                </span>

                {subscription.currentPeriodEnd && (
                  <div className="hidden sm:block text-right">
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">
                      {subscription.cancelAtPeriodEnd ? 'Access ends' : 'Renews'}
                    </p>
                    <p className="text-sm font-semibold text-white">
                      {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="bg-[#080808] px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Credits bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-neutral-300">Credits Used</span>
                  <span className="text-xs tabular-nums text-neutral-400">
                    <span className="text-white font-semibold">{creditsUsed.toLocaleString()}</span>
                    {' '}/ {subscription.creditsPerMonth.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-violet-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${subscription.creditsPerMonth === 0 ? 100 : Math.min(100, Math.round((creditsUsed / subscription.creditsPerMonth) * 100))}%` }}
                    transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                  />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-2xl font-bold text-white tabular-nums">{subscription.creditsRemaining.toLocaleString()}</span>
                  <span className="text-xs text-neutral-500">credits remaining</span>
                </div>
              </div>

              {/* Websites bar */}
              {!subscription.isCustomPlan ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-neutral-300">Websites Used</span>
                    <span className="text-xs tabular-nums text-neutral-400">
                      <span className="text-white font-semibold">{subscription.websitesUsed}</span>
                      {' '}/ {subscription.maxWebsites}
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-emerald-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${subscription.maxWebsites === 0 ? 100 : Math.min(100, Math.round((subscription.websitesUsed / subscription.maxWebsites) * 100))}%` }}
                      transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-2xl font-bold text-white tabular-nums">
                      {Math.max(0, subscription.maxWebsites - subscription.websitesUsed)}
                    </span>
                    <span className="text-xs text-neutral-500">websites remaining</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
                    <Sparkles size={16} className="text-violet-400" />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 mb-0.5">Custom Plan</p>
                    <p className="text-sm font-semibold text-white">Unlimited websites</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer stat strip */}
            <div className="bg-neutral-900/50 border-t border-neutral-800 px-6 py-3 grid grid-cols-2 sm:grid-cols-4 divide-x divide-neutral-800">
              {[
                { label: 'Total Quota',     value: subscription.isCustomPlan ? 'Custom' : `${subscription.creditsPerMonth.toLocaleString()} credits` },
                { label: 'Credits Left',    value: subscription.creditsRemaining.toLocaleString() },
                { label: 'Websites',        value: `${subscription.websitesUsed} / ${subscription.isCustomPlan ? '∞' : subscription.maxWebsites}` },
                { label: 'Blogs Generated', value: counts.totalBlogsGenerated.toLocaleString() },
              ].map((item) => (
                <div key={item.label} className="px-4 first:pl-0 last:pr-0">
                  <p className="text-[10px] text-neutral-600 uppercase tracking-wider mb-0.5">{item.label}</p>
                  <p className="text-sm font-bold text-white tabular-nums">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Stat Cards ───────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard label="Total Domains"      value={counts.domains}             icon={Globe}       color="#60a5fa" sub="all time"    delay={0}    />
          <StatCard label="Active Domains"     value={counts.activeDomains}       icon={Sparkles}    color="#34d399" sub="live"        delay={0.05} />
          <StatCard label="Websites"           value={counts.websites}            icon={TrendingUp}  color="#f59e0b" sub="deployed"    delay={0.1}  />
          <StatCard label="Blogs Generated"    value={counts.totalBlogsGenerated} icon={FileText}    color="#a78bfa" sub="all time"    delay={0.15} />
          <StatCard label="Total Leads"        value={counts.totalLeads}          icon={Users}       color="#f472b6" sub="all time"    delay={0.2}  />
          <StatCard label="Leads This Month"   value={counts.leadsThisMonth}      icon={Zap}         color="#fb923c" sub="this month"  delay={0.25} />
        </div>

        {/* ── Charts ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ChartCard title="Blogs Generated" data={charts.blogsGenerated} color="#a78bfa" type="bar"  delay={0.1} />
          <ChartCard title="Credits Used"    data={charts.creditsUsed}    color="#60a5fa" type="area" delay={0.15} />
          <ChartCard title="New Leads"       data={charts.leads}          color="#34d399" type="area" delay={0.2} />
        </div>

      </div>
    </>
  );
}
