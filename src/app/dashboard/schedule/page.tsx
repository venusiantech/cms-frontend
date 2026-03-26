'use client';

import { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  ChevronLeft, ChevronRight, Loader2, MoreHorizontal, Trash2,
  ToggleLeft, ToggleRight, Edit3, Globe, CalendarDays, Repeat,
  ChevronDown, Check,
} from 'lucide-react';
import { schedulesAPI } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────

type Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY';
type ViewMode  = 'month' | 'week' | 'day';

interface Schedule {
  id: string;
  websiteId: string;
  domainName: string;
  frequency: Frequency;
  timeType: 'SPECIFIC' | 'RANDOM';
  specificTime: string | null;
  dayOfWeek: number | null;
  dayOfMonth: number | null;
  quantity: number;
  timezone: string;
  isActive: boolean;
  nextRunAt: string;
  lastRunAt: string | null;
  upcomingRuns: string[];
  runs: { id: string; ranAt: string; blogsCount: number; status: string }[];
}

interface CalEvent {
  iso: string;
  time: string;
  label: string;
  frequency: Frequency;
  isActive: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const SHORT_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const WEEKDAYS_SHORT = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

const FREQ_LABEL: Record<Frequency, string>  = { DAILY:'Daily', WEEKLY:'Weekly', MONTHLY:'Monthly' };
const FREQ_INIT:  Record<Frequency, string>  = { DAILY:'D', WEEKLY:'W', MONTHLY:'M' };
const FREQ_COLOR: Record<Frequency, { dot: string; chip: string; ring: string }> = {
  DAILY:   { dot:'bg-blue-400',   chip:'bg-blue-500/20 text-blue-300 border border-blue-500/30',   ring:'ring-blue-500/30' },
  WEEKLY:  { dot:'bg-purple-400', chip:'bg-purple-500/20 text-purple-300 border border-purple-500/30', ring:'ring-purple-500/30' },
  MONTHLY: { dot:'bg-amber-400',  chip:'bg-amber-500/20 text-amber-300 border border-amber-500/30',  ring:'ring-amber-500/30' },
};

const VIEW_OPTIONS: { id: ViewMode; label: string }[] = [
  { id: 'day',   label: 'Day view'   },
  { id: 'week',  label: 'Week view'  },
  { id: 'month', label: 'Month view' },
];

// ─── Time helpers ─────────────────────────────────────────────────────────────

function fmtTime24(t: string) {
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

function fmtRunTime(iso: string) {
  const d = new Date(iso);
  const h = d.getHours(), m = d.getMinutes();
  return `${h % 12 || 12}:${String(m).padStart(2,'0')}${h >= 12 ? 'PM' : 'AM'}`;
}

function fmtDateFull(iso: string, tz: string) {
  try {
    return new Date(iso).toLocaleString('en-US', {
      timeZone: tz, weekday:'short', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit',
    });
  } catch { return new Date(iso).toLocaleString(); }
}

function scheduleDesc(s: Schedule) {
  const p: string[] = [];
  if (s.frequency === 'WEEKLY'  && s.dayOfWeek  !== null) p.push(['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][s.dayOfWeek]);
  if (s.frequency === 'MONTHLY' && s.dayOfMonth !== null) p.push(`Day ${s.dayOfMonth}`);
  p.push(s.timeType === 'SPECIFIC' && s.specificTime ? fmtTime24(s.specificTime) : 'Random time');
  p.push(`${s.quantity} blog${s.quantity !== 1 ? 's' : ''}`);
  return p.join(' · ');
}

function getWeekStart(d: Date) {
  const c = new Date(d);
  const day = c.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday first
  c.setDate(c.getDate() + diff);
  c.setHours(0,0,0,0);
  return c;
}

function buildEventMap(schedules: Schedule[]): Map<string, CalEvent[]> {
  const map = new Map<string, CalEvent[]>();
  schedules.forEach(s => {
    (s.upcomingRuns ?? []).forEach(iso => {
      const d = new Date(iso);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const arr = map.get(key) ?? [];
      arr.push({ iso, time: fmtRunTime(iso), label: s.domainName, frequency: s.frequency, isActive: s.isActive });
      map.set(key, arr);
    });
  });
  return map;
}

function dayKey(d: Date) { return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; }

// ─── Animated view wrapper ────────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit:  (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
};

// ─── View Dropdown ────────────────────────────────────────────────────────────

function ViewDropdown({ view, onChange }: { view: ViewMode; onChange: (v: ViewMode) => void }) {
  const [open, setOpen] = useState(false);
  const current = VIEW_OPTIONS.find(o => o.id === view)!;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition-colors select-none"
      >
        {current.label}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={12} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -6 }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              className="absolute right-0 top-9 z-40 w-36 bg-[#1a1a1a] border border-neutral-700 rounded-xl shadow-2xl overflow-hidden py-1"
            >
              {VIEW_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => { onChange(opt.id); setOpen(false); }}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-xs transition-colors ${
                    view === opt.id
                      ? 'text-white bg-indigo-600/30 font-semibold'
                      : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  {opt.label}
                  {view === opt.id && <Check size={11} className="text-indigo-400" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Month View ───────────────────────────────────────────────────────────────

function MonthView({ cursor, dir, eventMap }: { cursor: Date; dir: number; eventMap: Map<string, CalEvent[]> }) {
  const today = new Date();
  const yr = cursor.getFullYear(), mo = cursor.getMonth();
  const firstDay = new Date(yr, mo, 1).getDay();
  const moOff = ((firstDay - 1) + 7) % 7;
  const daysInMonth = new Date(yr, mo + 1, 0).getDate();
  const prevDays = new Date(yr, mo, 0).getDate();

  const cells: { day: number; cur: boolean }[] = [
    ...Array.from({ length: moOff }, (_, i) => ({ day: prevDays - moOff + i + 1, cur: false })),
    ...Array.from({ length: daysInMonth }, (_, i) => ({ day: i + 1, cur: true })),
  ];
  while (cells.length % 7 !== 0) cells.push({ day: cells.length - daysInMonth - moOff + 1, cur: false });

  const isToday = (d: number) => d === today.getDate() && mo === today.getMonth() && yr === today.getFullYear();

  return (
    <motion.div
      key={`month-${yr}-${mo}`}
      custom={dir}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Weekday row */}
      <div className="grid grid-cols-7 border-b border-neutral-800">
        {WEEKDAYS_SHORT.map(d => (
          <div key={d} className="py-3 text-center text-xs font-semibold text-neutral-500 uppercase tracking-wider border-r border-neutral-800 last:border-r-0">{d}</div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7">
        {cells.map((cell, idx) => {
          const d = cell.cur ? new Date(yr, mo, cell.day) : null;
          const ev = d ? (eventMap.get(dayKey(d)) ?? []) : [];
          const tod = cell.cur && isToday(cell.day);

          return (
            <div key={idx}
              className={`min-h-[120px] border-r border-b border-neutral-800 p-2 flex flex-col gap-0.5
                ${idx % 7 === 6 ? 'border-r-0' : ''}
                ${!cell.cur ? 'bg-neutral-900/20' : ''}
              `}>
              <div className="mb-1">
                <span className={`w-7 h-7 inline-flex items-center justify-center text-sm font-semibold rounded-full transition-all ${
                  tod ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                      : cell.cur ? 'text-neutral-300' : 'text-neutral-700'
                }`}>
                  {cell.day}
                </span>
              </div>
              {ev.slice(0, 3).map((e, i) => (
                <div key={i} className={`flex items-center justify-between px-1.5 py-0.5 rounded text-[11px] truncate ${
                  e.isActive ? FREQ_COLOR[e.frequency].chip : 'bg-neutral-800/50 text-neutral-600 border border-neutral-700/30'
                }`}>
                  <span className="truncate font-medium">{e.label}</span>
                  <span className="ml-1 flex-shrink-0 opacity-70 text-[10px]">{e.time}</span>
                </div>
              ))}
              {ev.length > 3 && (
                <span className="text-[10px] text-neutral-600 px-1">+{ev.length - 3} more</span>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Week View ────────────────────────────────────────────────────────────────

function WeekView({ cursor, dir, eventMap }: { cursor: Date; dir: number; eventMap: Map<string, CalEvent[]> }) {
  const today = new Date();
  const weekStart = getWeekStart(cursor);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const isToday = (d: Date) =>
    d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();

  return (
    <motion.div
      key={`week-${weekStart.toISOString()}`}
      custom={dir}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-neutral-800">
        {days.map((d, i) => {
          const tod = isToday(d);
          return (
            <div key={i} className="py-3 flex flex-col items-center border-r border-neutral-800 last:border-r-0">
              <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                {WEEKDAYS_SHORT[i]}
              </span>
              <span className={`w-8 h-8 flex items-center justify-center text-sm font-bold rounded-full transition-all ${
                tod ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50' : 'text-neutral-300'
              }`}>
                {d.getDate()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Day columns */}
      <div className="grid grid-cols-7 min-h-[360px]">
        {days.map((d, i) => {
          const ev = eventMap.get(dayKey(d)) ?? [];
          const tod = isToday(d);
          return (
            <div key={i} className={`border-r border-neutral-800 last:border-r-0 p-2 flex flex-col gap-1.5 ${tod ? 'bg-indigo-900/5' : ''}`}>
              {ev.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-neutral-800 text-xs">—</span>
                </div>
              ) : ev.map((e, ei) => (
                <motion.div
                  key={ei}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: ei * 0.04 }}
                  className={`flex flex-col px-2 py-1.5 rounded-lg text-xs ${
                    e.isActive ? FREQ_COLOR[e.frequency].chip : 'bg-neutral-800/50 text-neutral-600 border border-neutral-700/30'
                  }`}
                >
                  <span className="font-semibold text-[11px] truncate">{e.time}</span>
                  <span className="opacity-70 truncate text-[10px]">{e.label}</span>
                </motion.div>
              ))}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Day View ─────────────────────────────────────────────────────────────────

function DayView({ cursor, dir, eventMap }: { cursor: Date; dir: number; eventMap: Map<string, CalEvent[]> }) {
  const today = new Date();
  const isToday = cursor.getDate() === today.getDate() && cursor.getMonth() === today.getMonth() && cursor.getFullYear() === today.getFullYear();
  const events = eventMap.get(dayKey(cursor)) ?? [];

  const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6AM–11PM

  function eventsForHour(h: number) {
    return events.filter(e => {
      const d = new Date(e.iso);
      return d.getHours() === h;
    });
  }

  return (
    <motion.div
      key={`day-${cursor.toDateString()}`}
      custom={dir}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
      className="min-h-[400px]"
    >
      {/* Day header */}
      <div className={`px-6 py-4 border-b border-neutral-800 flex items-center gap-3 ${isToday ? 'bg-indigo-900/8' : ''}`}>
        <span className={`w-10 h-10 flex items-center justify-center text-lg font-bold rounded-xl ${
          isToday ? 'bg-indigo-600 text-white shadow-md' : 'bg-neutral-800 text-neutral-300'
        }`}>
          {cursor.getDate()}
        </span>
        <div>
          <p className="text-sm font-bold text-white">
            {cursor.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-xs text-neutral-500">
            {events.length === 0 ? 'No scheduled generations' : `${events.length} scheduled generation${events.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* Time slots */}
      <div className="divide-y divide-neutral-800/50">
        {HOURS.map(h => {
          const hEvents = eventsForHour(h);
          const label = `${h % 12 || 12}:00 ${h >= 12 ? 'PM' : 'AM'}`;
          return (
            <div key={h} className={`flex gap-4 px-5 py-2 min-h-[44px] ${hEvents.length > 0 ? 'bg-neutral-900/30' : ''}`}>
              <span className="w-16 text-xs text-neutral-600 flex-shrink-0 pt-0.5 font-medium">{label}</span>
              <div className="flex-1 flex flex-col gap-1">
                {hEvents.map((e, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs ${
                      e.isActive ? FREQ_COLOR[e.frequency].chip : 'bg-neutral-800/50 text-neutral-600 border border-neutral-700/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        e.isActive ? FREQ_COLOR[e.frequency].dot : 'bg-neutral-600'
                      }`} />
                      <span className="font-semibold">{e.time}</span>
                      <span className="opacity-70">{e.label}</span>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/20`}>
                      {FREQ_LABEL[e.frequency]}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Schedule List Row ────────────────────────────────────────────────────────

function ScheduleRow({
  schedule, onToggle, onDelete, isDeleting, isToggling,
}: {
  schedule: Schedule; onToggle: (v: boolean) => void; onDelete: () => void;
  isDeleting: boolean; isToggling: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  function toggleMenu() {
    if (menuOpen) {
      setMenuOpen(false);
      return;
    }
    const rect = menuButtonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const menuWidth = 176;
    const menuHeight = 150;
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
    <div className={`flex items-center gap-4 px-5 py-4 hover:bg-white/2 transition-colors border-b border-neutral-800/50 last:border-0 ${!schedule.isActive ? 'opacity-50' : ''}`}>
      <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold ${FREQ_COLOR[schedule.frequency].chip}`}>
        {FREQ_INIT[schedule.frequency]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-semibold text-white">{FREQ_LABEL[schedule.frequency]} · {schedule.domainName}</span>
          {!schedule.isActive && <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-neutral-800 text-neutral-500 border border-neutral-700">Paused</span>}
        </div>
        <div className="text-xs text-neutral-500 flex items-center gap-1.5"><CalendarDays size={10} />{scheduleDesc(schedule)}</div>
        <div className="text-xs text-neutral-600 flex items-center gap-1.5 mt-0.5"><Repeat size={10} />Next: {schedule.nextRunAt ? fmtDateFull(schedule.nextRunAt, schedule.timezone) : '—'}</div>
      </div>
      <Link href={`/dashboard/editor/${schedule.websiteId}`}
        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-medium rounded-lg transition-colors flex-shrink-0">
        <Globe size={12} /> Open Editor
      </Link>
      <div className="relative flex-shrink-0">
        <button ref={menuButtonRef} onClick={toggleMenu} className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-600 hover:text-neutral-300 transition-colors">
          <MoreHorizontal size={16} />
        </button>
        <AnimatePresence>
          {menuOpen && menuPos && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }} transition={{ duration: 0.1 }}
                className="fixed z-[60] w-44 bg-[#1a1a1a] border border-neutral-700 rounded-xl shadow-2xl overflow-hidden py-1"
                style={{ top: menuPos.top, left: menuPos.left }}
              >
                <button onClick={() => { onToggle(!schedule.isActive); setMenuOpen(false); }} disabled={isToggling}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors disabled:opacity-50">
                  {isToggling ? <Loader2 size={13} className="animate-spin" /> : schedule.isActive ? <ToggleLeft size={13} /> : <ToggleRight size={13} />}
                  {schedule.isActive ? 'Pause' : 'Resume'}
                </button>
                <Link href={`/dashboard/editor/${schedule.websiteId}`} onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors">
                  <Edit3 size={13} /> Edit in Editor
                </Link>
                <div className="my-1 border-t border-neutral-800" />
                <button onClick={() => { onDelete(); setMenuOpen(false); }} disabled={isDeleting}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors disabled:opacity-50">
                  {isDeleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                  Delete
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SchedulePage() {
  const queryClient = useQueryClient();

  const today = new Date();
  const [view,    setView]    = useState<ViewMode>('month');
  const [cursor,  setCursor]  = useState<Date>(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  const [dir,     setDir]     = useState(1); // +1 forward, -1 backward
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const { data: schedules = [], isLoading } = useQuery({
    queryKey: ['all-schedules'],
    queryFn: () => schedulesAPI.getAll().then(r => r.data.schedules as Schedule[]),
    staleTime: 30_000,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { isActive: boolean } }) => schedulesAPI.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['all-schedules'] }); setTogglingId(null); },
    onError: (e: any) => { toast.error(e?.response?.data?.message || 'Failed'); setTogglingId(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => schedulesAPI.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['all-schedules'] }); toast.success('Deleted'); setDeletingId(null); },
    onError: (e: any) => { toast.error(e?.response?.data?.message || 'Failed'); setDeletingId(null); },
  });

  const eventMap = buildEventMap(schedules);
  const activeCount = schedules.filter(s => s.isActive).length;

  // Navigation
  function navigate(delta: number) {
    setDir(delta);
    setCursor(c => {
      const n = new Date(c);
      if (view === 'month') { n.setDate(1); n.setMonth(n.getMonth() + delta); }
      else if (view === 'week') n.setDate(n.getDate() + delta * 7);
      else n.setDate(n.getDate() + delta);
      return n;
    });
  }

  function goToday() {
    setDir(0);
    setCursor(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  }

  function switchView(v: ViewMode) {
    setDir(0);
    setView(v);
  }

  // Header label
  function headerLabel() {
    if (view === 'month') return `${MONTH_NAMES[cursor.getMonth()]} ${cursor.getFullYear()}`;
    if (view === 'week') {
      const ws = getWeekStart(cursor);
      const we = new Date(ws); we.setDate(we.getDate() + 6);
      const sameMonth = ws.getMonth() === we.getMonth();
      return sameMonth
        ? `${SHORT_MONTHS[ws.getMonth()]} ${ws.getDate()}–${we.getDate()}, ${ws.getFullYear()}`
        : `${SHORT_MONTHS[ws.getMonth()]} ${ws.getDate()} – ${SHORT_MONTHS[we.getMonth()]} ${we.getDate()}, ${ws.getFullYear()}`;
    }
    return cursor.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric', year:'numeric' });
  }

  return (
    <div className="px-4 sm:px-6 max-w-7xl mx-auto space-y-6 pb-12">

      {/* ── Calendar card ── */}
      <div className="bg-[#0d1117] border border-neutral-800 rounded-2xl overflow-visible">

        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <motion.h2
            key={headerLabel()}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-xl font-bold text-white"
          >
            {headerLabel()}
          </motion.h2>

          <div className="flex items-center gap-2">
            {/* <button onClick={() => navigate(-1)}
              className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors">
              <ChevronLeft size={18} />
            </button>
            <button onClick={goToday}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors border border-neutral-700">
              Today
            </button>
            <button onClick={() => navigate(1)}
              className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors">
              <ChevronRight size={18} />
            </button>
            <div className="w-px h-5 bg-neutral-700 mx-1" /> */}

            {/* View pills */}
            <div className="hidden sm:flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-lg p-1">
              {VIEW_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => switchView(opt.id)}
                  className={`relative px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                    view === opt.id ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {view === opt.id && (
                    <motion.span
                      layoutId="view-pill"
                      className="absolute inset-0 bg-indigo-600 rounded-md shadow-md"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{opt.label.replace(' view','')}</span>
                </button>
              ))}
            </div>

            {/* Mobile dropdown */}
            <div className="sm:hidden">
              <ViewDropdown view={view} onChange={switchView} />
            </div>
          </div>
        </div>

        {/* Calendar body */}
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 size={28} className="animate-spin text-neutral-600" />
          </div>
        ) : (
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={dir}>
              {view === 'month' && <MonthView key={`m-${cursor.getFullYear()}-${cursor.getMonth()}`} cursor={cursor} dir={dir} eventMap={eventMap} />}
              {view === 'week'  && <WeekView  key={`w-${getWeekStart(cursor).toDateString()}`} cursor={cursor} dir={dir} eventMap={eventMap} />}
              {view === 'day'   && <DayView   key={`d-${cursor.toDateString()}`} cursor={cursor} dir={dir} eventMap={eventMap} />}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── All Schedules list ── */}
      <div className="bg-[#0d1117] border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div>
            <h2 className="text-base font-bold text-white">All Schedules</h2>
            <p className="text-xs text-neutral-500 mt-0.5">{schedules.length} total · {activeCount} active</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              {(['DAILY','WEEKLY','MONTHLY'] as Frequency[]).map(f => (
                <div key={f} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${FREQ_COLOR[f].dot}`} />
                  <span className="text-xs text-neutral-500">{FREQ_LABEL[f]}</span>
                </div>
              ))}
            </div>
            <Link href="/dashboard/domains"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-all">
              + Add via Editor
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-neutral-600" /></div>
        ) : schedules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-14 h-14 rounded-2xl bg-neutral-800/60 flex items-center justify-center mb-4">
              <CalendarDays size={24} className="text-neutral-600" />
            </div>
            <p className="text-sm font-medium text-neutral-400">No schedules yet</p>
            <p className="text-xs text-neutral-600 mt-1 max-w-[260px]">Open any domain editor and click "Schedule" to get started.</p>
            <Link href="/dashboard/domains"
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all">
              <Globe size={14} /> Go to Domains
            </Link>
          </div>
        ) : (
          schedules.map(s => (
            <ScheduleRow key={s.id} schedule={s}
              onToggle={v => { setTogglingId(s.id); updateMutation.mutate({ id: s.id, data: { isActive: v } }); }}
              onDelete={() => { setDeletingId(s.id); deleteMutation.mutate(s.id); }}
              isDeleting={deletingId === s.id} isToggling={togglingId === s.id} />
          ))
        )}
      </div>
    </div>
  );
}
