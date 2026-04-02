'use client';

import { X, CalendarDays } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SchedulePanel from './SchedulePanel';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  websiteId: string;
}

export default function ScheduleModal({ isOpen, onClose, websiteId }: ScheduleModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative bg-[#0a0a0a] rounded-2xl shadow-2xl border border-neutral-700 max-w-5xl w-full p-10"
            >
              {/* Header — matches GenerateContentModal exactly */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-neutral-700 to-neutral-800 rounded-xl shadow-md">
                    <CalendarDays size={26} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-neutral-100">Schedule Content</h2>
                    {/* <p className="text-sm text-neutral-400 mt-0.5">Auto-generate blogs on a recurring schedule</p> */}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2.5 hover:bg-[#262626] rounded-lg transition-colors"
                >
                  <X size={22} className="text-neutral-400" />
                </button>
              </div>

              {/* Panel */}
              <SchedulePanel websiteId={websiteId} />
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
