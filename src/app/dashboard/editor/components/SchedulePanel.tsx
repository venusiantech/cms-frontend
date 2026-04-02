'use client';

import { useState, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  CalendarDays, Clock, ChevronLeft, ChevronRight, Shuffle,
  Trash2, Loader2, Plus, Edit3, Check, MoreHorizontal,
  ToggleLeft, ToggleRight, Repeat, ArrowLeft, Sparkles,
} from 'lucide-react';
import { schedulesAPI } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────

type Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY';
type TimeType  = 'SPECIFIC' | 'RANDOM';
type Screen    = 'list' | 'add' | 'edit';

interface Schedule {
  id: string;
  websiteId: string;
  frequency: Frequency;
  timeType: TimeType;
  specificTime: string | null;
  dayOfWeek: number | null;
  dayOfMonth: number | null;
  quantity: number;
  timezone: string;
  isActive: boolean;
  nextRunAt: string;
  lastRunAt: string | null;
  upcomingRuns: string[];
  runs: { id: string; ranAt: string; blogsCount: number; status: string; error: string | null }[];
}

type FormState = {
  frequency: Frequency;
  timeType: TimeType;
  specificTime: string;
  dayOfWeek: number;
  dayOfMonth: number;
  quantity: number;
  timezone: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const DAYS_SHORT  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const COMMON_TZ   = [
  'UTC','America/New_York','America/Chicago','America/Denver','America/Los_Angeles',
  'America/Sao_Paulo','Europe/London','Europe/Paris','Europe/Berlin','Europe/Moscow',
  'Asia/Dubai','Asia/Kolkata','Asia/Singapore','Asia/Tokyo','Asia/Shanghai','Australia/Sydney',
];

const FREQ_META: Record<Frequency, { label: string; short: string; gradient: string; bg: string; text: string }> = {
  DAILY:   { label:'Daily',   short:'D', gradient:'from-slate-600 to-slate-700',  bg:'bg-neutral-900/70 border-neutral-700', text:'text-neutral-200' },
  WEEKLY:  { label:'Weekly',  short:'W', gradient:'from-indigo-600 to-indigo-700', bg:'bg-neutral-900/70 border-neutral-700', text:'text-neutral-200' },
  MONTHLY: { label:'Monthly', short:'M', gradient:'from-zinc-600 to-zinc-700',    bg:'bg-neutral-900/70 border-neutral-700', text:'text-neutral-200' },
};

const DEFAULT_FORM: FormState = {
  frequency: 'WEEKLY', timeType: 'SPECIFIC', specificTime: '09:00',
  dayOfWeek: 1, dayOfMonth: 1, quantity: 3, timezone: 'UTC',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtTime(t: string) {
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

function fmtDate(iso: string, tz: string) {
  try {
    return new Date(iso).toLocaleString('en-US', {
      timeZone: tz, weekday:'short', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit',
    });
  } catch { return new Date(iso).toLocaleString(); }
}

function scheduleSubtitle(s: Schedule) {
  const p: string[] = [];
  if (s.frequency === 'WEEKLY'  && s.dayOfWeek  !== null) p.push(DAYS_SHORT[s.dayOfWeek]);
  if (s.frequency === 'MONTHLY' && s.dayOfMonth !== null) p.push(`Day ${s.dayOfMonth}`);
  p.push(s.timeType === 'SPECIFIC' && s.specificTime ? fmtTime(s.specificTime) : 'Random time');
  return p.join(' · ');
}

/** Client-side preview of upcoming run dates */
function previewRuns(form: FormState, count = 12): Date[] {
  const results: Date[] = [];
  const [h, m] = form.timeType === 'SPECIFIC' ? form.specificTime.split(':').map(Number) : [9, 0];
  let cursor = new Date();

  for (let i = 0; i < count; i++) {
    let next = new Date(cursor);
    if (form.frequency === 'DAILY') {
      next.setDate(next.getDate() + 1);
      next.setHours(h, m, 0, 0);
    } else if (form.frequency === 'WEEKLY') {
      do { next.setDate(next.getDate() + 1); } while (next.getDay() !== form.dayOfWeek);
      next.setHours(h, m, 0, 0);
    } else {
      next.setDate(1);
      if (cursor.getDate() >= form.dayOfMonth) next.setMonth(next.getMonth() + 1);
      const max = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
      next.setDate(Math.min(form.dayOfMonth, max));
      next.setHours(h, m, 0, 0);
    }
    results.push(new Date(next));
    cursor = new Date(next.getTime() + 60_000);
  }
  return results;
}

function scheduledDaySet(runs: Date[], yr: number, mo: number) {
  const s = new Set<number>();
  runs.forEach(d => { if (d.getFullYear() === yr && d.getMonth() === mo) s.add(d.getDate()); });
  return s;
}

// ─── Live Calendar Preview ────────────────────────────────────────────────────

function LiveCalendar({ form }: { form: FormState }) {
  const today = new Date();
  const [yr, setYr] = useState(today.getFullYear());
  const [mo, setMo] = useState(today.getMonth());

  const runs   = previewRuns(form, 14);
  const sched  = scheduledDaySet(runs, yr, mo);

  const prev = () => mo === 0 ? (setMo(11), setYr(y => y - 1)) : setMo(m => m - 1);
  const next = () => mo === 11 ? (setMo(0), setYr(y => y + 1)) : setMo(m => m + 1);

  const firstDay    = new Date(yr, mo, 1).getDay();
  const moOff       = ((firstDay - 1) + 7) % 7;
  const daysInMonth = new Date(yr, mo + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(moOff).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (d: number) => d === today.getDate() && mo === today.getMonth() && yr === today.getFullYear();

  const upcoming = runs.filter(d => d >= today).slice(0, 4);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={prev} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/8 text-neutral-400 hover:text-white transition-colors">
          <ChevronLeft size={14} />
        </button>
        <span className="text-sm font-bold text-white">{MONTH_NAMES[mo]} {yr}</span>
        <button onClick={next} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/8 text-neutral-400 hover:text-white transition-colors">
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {['M','T','W','T','F','S','S'].map((d, i) => (
          <div key={i} className="text-center text-[10px] font-bold text-neutral-600 uppercase">{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} className="h-8" />;
          const scheduled = sched.has(day);
          const tod = isToday(day);

          return (
            <div key={idx} className="h-8 flex items-center justify-center">
              <div className={`
                relative w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold transition-all
                ${scheduled ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/60' : ''}
                ${tod && !scheduled ? 'ring-2 ring-indigo-400/70 text-indigo-300' : ''}
                ${!scheduled && !tod ? 'text-neutral-400 hover:text-neutral-300' : ''}
              `}>
                {day}
                {scheduled && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border-2 border-[#0f0f12]" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming */}
      <div className="mt-5 pt-4 border-t border-white/6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-2.5">Upcoming</p>
        <div className="space-y-1.5">
          {upcoming.map((d, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
              <span className="text-xs text-neutral-400">
                {d.toLocaleString('en-US', { weekday:'short', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Right panel: Frequency + Day picker ─────────────────────────────────────

const DAYS_OF_WEEK = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function CalendarPicker({ form, set }: { form: FormState; set: (p: Partial<FormState>) => void }) {
  return (
    <div className="flex flex-col gap-5">

      {/* Frequency — 3 pills side by side */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-2.5">Frequency</p>
        <div className="flex gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
          {(['DAILY','WEEKLY','MONTHLY'] as Frequency[]).map(f => {
            const active = form.frequency === f;
            return (
              <button key={f} onClick={() => set({ frequency: f })}
                className={`relative flex-1 py-2 rounded-lg text-xs font-semibold transition-all overflow-hidden ${
                  active ? 'text-white' : 'text-neutral-400 hover:text-neutral-300'
                }`}
              >
                {active && (
                  <motion.span layoutId="freq-bg"
                    className="absolute inset-0 bg-indigo-600 rounded-lg shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{FREQ_META[f].label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Day picker */}
      <div>
        <AnimatePresence mode="wait">
          {form.frequency === 'DAILY' && (
            <motion.div key="daily"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col items-center justify-center gap-4 py-10 rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/30"
            >
              <div className="w-11 h-11 rounded-2xl bg-indigo-600/15 flex items-center justify-center">
                <CalendarDays size={20} className="text-indigo-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-white">Every Day</p>
                <p className="text-xs text-neutral-600 mt-1">Blogs generate once daily</p>
              </div>
            </motion.div>
          )}

          {form.frequency === 'WEEKLY' && (
            <motion.div key="weekly"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-3">Pick a day</p>
              <div className="flex flex-col gap-1.5">
                {DAYS_OF_WEEK.map((d, i) => (
                  <button key={i} onClick={() => set({ dayOfWeek: i })}
                    className={`relative flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all overflow-hidden ${
                      form.dayOfWeek === i
                        ? 'text-white'
                        : 'text-neutral-400 hover:text-neutral-300 hover:bg-white/4'
                    }`}
                  >
                    {form.dayOfWeek === i && (
                      <motion.span layoutId="week-bg"
                        className="absolute inset-0 bg-indigo-600/20 border border-indigo-500/30 rounded-xl"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      form.dayOfWeek === i ? 'bg-indigo-600 text-white' : 'bg-white/6 text-neutral-400'
                    }`}>
                      {d.charAt(0)}
                    </span>
                    <span className="relative z-10">{d}</span>
                    {form.dayOfWeek === i && (
                      <span className="relative z-10 ml-auto">
                        <Check size={13} className="text-indigo-400" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {form.frequency === 'MONTHLY' && (
            <motion.div key="monthly"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-3">Pick a date</p>
              {/* Weekday labels for visual reference */}
              <div className="grid grid-cols-7 mb-1">
                {['M','T','W','T','F','S','S'].map((h, i) => (
                  <div key={i} className="text-center text-[9px] font-bold text-neutral-700 uppercase py-1">{h}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                  <button key={d} onClick={() => set({ dayOfMonth: d })}
                    className={`h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                      form.dayOfMonth === d
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-900/50'
                        : 'text-neutral-400 hover:bg-white/6 hover:text-neutral-200'
                    }`}>{d}</button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Form ─────────────────────────────────────────────────────────────────────

function ScheduleForm({
  initial, onSave, onBack, isSaving, isEdit,
}: {
  initial?: FormState; onSave: (d: FormState) => void;
  onBack: () => void; isSaving: boolean; isEdit?: boolean;
}) {
  const [form, setF] = useState<FormState>(initial ?? DEFAULT_FORM);
  const set = useCallback((p: Partial<FormState>) => setF(f => ({ ...f, ...p })), []);

  return (
    <div className="flex flex-col">
      {/* Two-column body — both columns fill the same height */}
      <div className="grid grid-cols-[1fr_320px] gap-0 divide-x divide-white/6 min-h-[460px]">

        {/* ── LEFT: Settings ── */}
        <div className="flex flex-col gap-5 pr-8 py-1 h-full">
          {/* Back */}
          <button onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-300 transition-colors self-start group">
            <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to schedules
          </button>

          {/* Title */}
          <h3 className="text-lg font-bold text-white -mt-1">{isEdit ? 'Edit Schedule' : 'New Schedule'}</h3>

          {/* Time */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-neutral-600 mb-2">Time</label>
            <div className="flex gap-1.5 mb-2.5">
              {(['SPECIFIC','RANDOM'] as TimeType[]).map(t => {
                const active = form.timeType === t;
                return (
                  <button key={t} onClick={() => set({ timeType: t })}
                    className={`relative flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all overflow-hidden border ${
                      active ? 'text-white border-transparent' : 'bg-white/3 text-neutral-400 border-white/6 hover:bg-white/6 hover:text-neutral-300 hover:border-white/10'
                    }`}
                  >
                    {active && (
                      <motion.span layoutId="time-bg"
                        className="absolute inset-0 bg-indigo-600"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      {t === 'SPECIFIC' ? <Clock size={13} /> : <Shuffle size={13} />}
                      {t === 'SPECIFIC' ? 'Specific' : 'Random'}
                    </span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {form.timeType === 'SPECIFIC' ? (
                <motion.div key="specific" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <input type="time" value={form.specificTime}
                    onChange={e => set({ specificTime: e.target.value })}
                    className="w-full bg-white/4 border border-white/8 hover:border-white/14 focus:border-indigo-500/60 rounded-xl px-4 py-3 text-base font-semibold text-white transition-all outline-none [color-scheme:dark]"
                  />
                </motion.div>
              ) : (
                <motion.div key="random" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="flex items-center gap-3 bg-white/3 border border-white/6 rounded-xl px-3 py-3">
                    <Shuffle size={13} className="text-indigo-400 flex-shrink-0" />
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Random between <span className="text-white font-medium">8 AM</span> – <span className="text-white font-medium">10 PM</span>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-neutral-600 mb-2">Timezone</label>
            <select value={form.timezone} onChange={e => set({ timezone: e.target.value })}
              className="w-full bg-white/4 border border-white/8 hover:border-white/14 focus:border-indigo-500/60 rounded-xl px-3 py-3 text-xs font-medium text-white transition-all outline-none">
              {COMMON_TZ.map(tz => <option key={tz} value={tz} className="bg-[#0d1117]">{tz.replace(/_/g,' ')}</option>)}
            </select>
          </div>

          {/* Blogs / Run */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-neutral-600 mb-2">Blogs / Run</label>
            <div className="flex items-center bg-white/4 border border-white/8 rounded-xl overflow-hidden h-[46px]">
              <button onClick={() => set({ quantity: Math.max(1, form.quantity - 1) })} disabled={form.quantity <= 1}
                className="w-11 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-20 text-xl font-light h-full">−</button>
              <span className="flex-1 text-center text-base font-bold text-white">{form.quantity}</span>
              <button onClick={() => set({ quantity: Math.min(5, form.quantity + 1) })} disabled={form.quantity >= 5}
                className="w-11 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-20 text-xl font-light h-full">+</button>
            </div>
          </div>

          {/* Save — pinned to bottom of left column */}
          <div className="mt-auto pt-2">
            <button onClick={() => onSave(form)} disabled={isSaving}
              className="relative w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white overflow-hidden border border-indigo-500/40 shadow-sm disabled:opacity-50 group"
            >
              <span className="absolute inset-0 bg-indigo-600" />
              <span className="absolute inset-0 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-2">
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                {isEdit ? 'Update Schedule' : 'Save Schedule'}
              </span>
            </button>
          </div>
        </div>

        {/* ── RIGHT: Calendar / Day picker ── */}
        <div className="pl-8 py-1 h-full">
          <CalendarPicker form={form} set={set} />
        </div>
      </div>
    </div>
  );
}

// ─── Schedule Row ─────────────────────────────────────────────────────────────

function ScheduleRow({
  schedule, onEdit, onDelete, onToggle, isDeleting, isToggling,
}: {
  schedule: Schedule; onEdit: () => void; onDelete: () => void;
  onToggle: (v: boolean) => void; isDeleting: boolean; isToggling: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const meta = FREQ_META[schedule.frequency];

  function toggleMenu() {
    if (menuOpen) {
      setMenuOpen(false);
      return;
    }
    const rect = menuButtonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const menuWidth = 176;
    const menuHeight = 156;
    const gap = 8;
    const openUp = window.innerHeight - rect.bottom < menuHeight + 16;
    const top = openUp ? rect.top - menuHeight - gap : rect.bottom + gap;
    const left = Math.min(
      Math.max(8, rect.right - menuWidth),
      window.innerWidth - menuWidth - 8,
    );
    setMenuPos({ top, left });
    setMenuOpen(true);
  }

  return (
    <motion.div
      layout
      className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-default ${
        schedule.isActive
          ? `${meta.bg} border-current/20`
          : 'bg-white/2 border-white/5 opacity-50'
      }`}
    >
      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-bold bg-gradient-to-br ${meta.gradient} shadow-lg`}>
        <span className="text-white">{meta.short}</span>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className={`text-sm font-bold ${meta.text}`}>{meta.label} Schedule</p>
          {!schedule.isActive && (
            <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-full bg-neutral-800 text-neutral-600 border border-neutral-700">Paused</span>
          )}
        </div>
        <p className="text-xs text-neutral-400 truncate flex items-center gap-1.5">
          <CalendarDays size={10} className="flex-shrink-0" />
          {scheduleSubtitle(schedule)} · {schedule.quantity} blog{schedule.quantity !== 1 ? 's' : ''}
        </p>
        <p className="text-xs text-neutral-700 mt-0.5 flex items-center gap-1.5 truncate">
          <Repeat size={10} className="flex-shrink-0" />
          {schedule.nextRunAt ? fmtDate(schedule.nextRunAt, schedule.timezone) : '—'}
        </p>
      </div>

      {/* Menu */}
      <div className="relative flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button ref={menuButtonRef} onClick={toggleMenu}
          className="p-1.5 rounded-xl hover:bg-white/8 text-neutral-600 hover:text-neutral-300 transition-colors">
          <MoreHorizontal size={16} />
        </button>

        <AnimatePresence>
          {menuOpen && menuPos && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -6 }}
                transition={{ duration: 0.12 }}
                className="fixed z-[70] w-44 bg-[#161618] border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-1.5"
                style={{ top: menuPos.top, left: menuPos.left }}
              >
                <button onClick={() => { onEdit(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-neutral-300 hover:bg-white/5 hover:text-white transition-colors">
                  <Edit3 size={13} /> Edit Schedule
                </button>
                <button onClick={() => { onToggle(!schedule.isActive); setMenuOpen(false); }} disabled={isToggling}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-neutral-300 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-50">
                  {isToggling ? <Loader2 size={13} className="animate-spin" /> : schedule.isActive ? <ToggleLeft size={13} /> : <ToggleRight size={13} />}
                  {schedule.isActive ? 'Pause' : 'Resume'}
                </button>
                <div className="my-1.5 border-t border-white/6 mx-2" />
                <button onClick={() => { onDelete(); setMenuOpen(false); }} disabled={isDeleting}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-red-400 hover:bg-red-500/8 hover:text-red-300 transition-colors disabled:opacity-50">
                  {isDeleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                  Delete
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── List Screen ──────────────────────────────────────────────────────────────

function ListScreen({
  schedules, isLoading,
  onAdd, onEdit, onDelete, onToggle,
  deletingId, togglingId,
}: {
  schedules: Schedule[]; isLoading: boolean;
  onAdd: () => void; onEdit: (id: string) => void;
  onDelete: (id: string) => void; onToggle: (id: string, v: boolean) => void;
  deletingId: string | null; togglingId: string | null;
}) {
  const activeCount = schedules.filter(s => s.isActive).length;

  return (
    <div className="flex flex-col gap-4">
      {/* Add button */}
      <button onClick={onAdd}
        className="relative w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm font-bold text-white overflow-hidden border border-indigo-500/40 shadow-md shadow-indigo-900/20 group"
      >
        <span className="absolute inset-0 bg-indigo-600" />
        <span className="absolute inset-0 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="relative flex items-center gap-2">
          <Plus size={16} />
          Add Schedule
        </span>
      </button>

      {/* Summary chips */}
      {schedules.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {(['DAILY','WEEKLY','MONTHLY'] as Frequency[]).map(f => {
            const count = schedules.filter(s => s.frequency === f).length;
            if (!count) return null;
            const meta = FREQ_META[f];
            return (
              <span key={f} className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${meta.bg} ${meta.text}`}>
                {count} {meta.label}
              </span>
            );
          })}
          <span className="text-xs text-neutral-600 ml-auto">{activeCount} active</span>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={22} className="animate-spin text-neutral-700" />
        </div>
      ) : schedules.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-14 text-center"
        >
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-2xl bg-indigo-600/20 blur-xl" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-600/20 border border-indigo-500/20 flex items-center justify-center">
              <Sparkles size={22} className="text-indigo-400" />
            </div>
          </div>
          <p className="text-sm font-semibold text-neutral-300">No schedules yet</p>
          <p className="text-xs text-neutral-600 mt-1.5 max-w-[200px] leading-relaxed">
            Create your first schedule and blogs will generate automatically
          </p>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {schedules.map(s => (
              <ScheduleRow
                key={s.id}
                schedule={s}
                onEdit={() => onEdit(s.id)}
                onDelete={() => onDelete(s.id)}
                onToggle={v => onToggle(s.id, v)}
                isDeleting={deletingId === s.id}
                isToggling={togglingId === s.id}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function SchedulePanel({ websiteId }: { websiteId: string }) {
  const queryClient = useQueryClient();
  const [screen,     setScreen]     = useState<Screen>('list');
  const [editingId,  setEditingId]  = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const { data: schedules = [], isLoading } = useQuery({
    queryKey: ['schedules', websiteId],
    queryFn: () => schedulesAPI.getByWebsite(websiteId).then(r => r.data.schedules as Schedule[]),
    staleTime: 30_000,
  });

  const editing = schedules.find(s => s.id === editingId);

  const createMutation = useMutation({
    mutationFn: (data: FormState) => schedulesAPI.create({ websiteId, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules', websiteId] });
      toast.success('Schedule created!');
      setScreen('list');
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to create'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FormState> & { isActive?: boolean } }) =>
      schedulesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules', websiteId] });
      toast.success('Updated!');
      setScreen('list');
      setEditingId(null);
      setTogglingId(null);
    },
    onError: (e: any) => { toast.error(e?.response?.data?.message || 'Failed'); setTogglingId(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => schedulesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules', websiteId] });
      toast.success('Deleted');
      setDeletingId(null);
    },
    onError: (e: any) => { toast.error(e?.response?.data?.message || 'Failed'); setDeletingId(null); },
  });

  const getEditInit = (s: Schedule): FormState => ({
    frequency: s.frequency, timeType: s.timeType, specificTime: s.specificTime ?? '09:00',
    dayOfWeek: s.dayOfWeek ?? 1, dayOfMonth: s.dayOfMonth ?? 1, quantity: s.quantity, timezone: s.timezone,
  });

  // Form screen
  if (screen === 'add' || (screen === 'edit' && editing)) {
    return (
      <AnimatePresence mode="wait">
        <motion.div key="form"
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22, ease: [0.25,0.1,0.25,1] }}
        >
          <ScheduleForm
            initial={screen === 'edit' && editing ? getEditInit(editing) : undefined}
            onSave={data =>
              screen === 'edit' && editingId
                ? updateMutation.mutate({ id: editingId, data })
                : createMutation.mutate(data)
            }
            onBack={() => { setScreen('list'); setEditingId(null); }}
            isSaving={createMutation.isPending || updateMutation.isPending}
            isEdit={screen === 'edit'}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  // List screen
  return (
    <AnimatePresence mode="wait">
      <motion.div key="list"
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.22, ease: [0.25,0.1,0.25,1] }}
      >
        <ListScreen
          schedules={schedules}
          isLoading={isLoading}
          onAdd={() => { setScreen('add'); setEditingId(null); }}
          onEdit={id => { setEditingId(id); setScreen('edit'); }}
          onDelete={id => { setDeletingId(id); deleteMutation.mutate(id); }}
          onToggle={(id, v) => { setTogglingId(id); updateMutation.mutate({ id, data: { isActive: v } }); }}
          deletingId={deletingId}
          togglingId={togglingId}
        />
      </motion.div>
    </AnimatePresence>
  );
}
