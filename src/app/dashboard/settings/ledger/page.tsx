'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { stripeAPI } from '@/lib/api';
import { motion } from 'framer-motion';
import {
  Loader2, AlertCircle, Zap, ArrowUpRight, ArrowDownRight,
  ChevronLeft, ChevronRight, FileText,
} from 'lucide-react';

interface LedgerEntry {
  id: string;
  amount: number;
  type: string;
  description: string;
  createdAt: string;
}

interface LedgerResponse {
  entries: LedgerEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function typeLabel(type: string): string {
  const map: Record<string, string> = {
    BLOG_GENERATION: 'Blog Generation',
    CREDIT_GRANT: 'Credit Grant',
    PLAN_UPGRADE: 'Plan Upgrade',
    PLAN_RENEWAL: 'Monthly Renewal',
    MANUAL_ADJUSTMENT: 'Manual Adjustment',
    REFUND: 'Refund',
  };
  return map[type] ?? type.replace(/_/g, ' ');
}

function typeColor(type: string): string {
  if (['CREDIT_GRANT', 'PLAN_UPGRADE', 'PLAN_RENEWAL', 'REFUND'].includes(type)) return 'emerald';
  if (['BLOG_GENERATION'].includes(type)) return 'violet';
  return 'neutral';
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function LedgerPage() {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, error } = useQuery<LedgerResponse>({
    queryKey: ['ledger', page],
    queryFn: async () => {
      const res = await stripeAPI.getLedger(page, limit);
      return res.data;
    },
    staleTime: 30_000,
  });

  if (isLoading) {
    return (
      <div className="px-4 lg:px-6 flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
          </div>
          <p className="text-xs text-neutral-600">Loading ledger...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="px-4 lg:px-6 flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-3">
          <AlertCircle size={22} className="text-neutral-700" />
          <p className="text-sm text-neutral-500">Failed to load ledger</p>
        </div>
      </div>
    );
  }

  const { entries, pagination } = data;
  const credits = entries.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="px-4 lg:px-6 space-y-4 pb-10 w-full max-w-7xl mx-auto">

      {/* Summary strip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="grid grid-cols-3 gap-3"
      >
        {[
          { label: 'Total Entries', value: pagination.total.toLocaleString(), icon: FileText, color: 'text-neutral-400' },
          { label: 'Credits Earned', value: `+${entries.filter(e => e.amount > 0).reduce((s, e) => s + e.amount, 0)}`, icon: ArrowDownRight, color: 'text-emerald-400' },
          { label: 'Credits Spent', value: `${entries.filter(e => e.amount < 0).reduce((s, e) => s + e.amount, 0)}`, icon: ArrowUpRight, color: 'text-violet-400' },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-neutral-800 bg-[#080808] px-5 py-4 flex items-center gap-3">
            <item.icon size={16} className={item.color} />
            <div>
              <p className="text-[10px] text-neutral-600 uppercase tracking-wider mb-0.5">{item.label}</p>
              <p className="text-lg font-bold text-white tabular-nums">{item.value}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="rounded-2xl border border-neutral-800 bg-[#080808] overflow-hidden"
      >
        {/* Table header */}
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-3 border-b border-neutral-800 bg-neutral-900/40">
          <span className="text-[10px] text-neutral-600 uppercase tracking-wider">Description</span>
          <span className="text-[10px] text-neutral-600 uppercase tracking-wider text-right">Date</span>
          <span className="text-[10px] text-neutral-600 uppercase tracking-wider text-right w-20">Credits</span>
        </div>

        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Zap size={24} className="text-neutral-700" />
            <p className="text-sm text-neutral-500">No credit transactions yet</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-800/60">
            {entries.map((entry, i) => {
              const isPositive = entry.amount >= 0;
              const color = typeColor(entry.type);
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.02 }}
                  className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-3.5 items-center hover:bg-neutral-800/20 transition-colors"
                >
                  {/* Left: type badge + description */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      color === 'emerald' ? 'bg-emerald-500/10' :
                      color === 'violet'  ? 'bg-violet-500/10'  : 'bg-neutral-800'
                    }`}>
                      {isPositive
                        ? <ArrowDownRight size={13} className={color === 'emerald' ? 'text-emerald-400' : 'text-neutral-400'} />
                        : <ArrowUpRight   size={13} className="text-violet-400" />
                      }
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-neutral-200 truncate">{typeLabel(entry.type)}</p>
                      {entry.description && (
                        <p className="text-xs text-neutral-600 truncate">{entry.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Date */}
                  <span className="text-xs text-neutral-500 whitespace-nowrap text-right">
                    {formatDate(entry.createdAt)}
                  </span>

                  {/* Amount */}
                  <span className={`text-sm font-bold tabular-nums text-right w-20 ${
                    isPositive ? 'text-emerald-400' : 'text-violet-400'
                  }`}>
                    {isPositive ? `+${entry.amount}` : entry.amount}
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-800 bg-neutral-900/40">
            <p className="text-xs text-neutral-600">
              Page {pagination.page} of {pagination.totalPages} &middot; {pagination.total} entries
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="p-1.5 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

    </div>
  );
}
