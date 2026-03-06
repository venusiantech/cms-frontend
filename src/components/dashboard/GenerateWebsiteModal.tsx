'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle, Loader2, Maximize2, RefreshCw, Sparkles, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { websitesAPI } from '@/lib/dashboard';


const TEMPLATE_OPTIONS = [
  { key: 'modernNews' as const, label: 'Modern News', image: '/templateA/assets/images/modernNews.png' },
  { key: 'templateA' as const, label: 'Merinda Blog', image: '/templateA/assets/images/TemplateA.png' },
  { key: 'arclight' as const, label: 'Arclight Magazine', image: '/templateA/assets/images/Arclight.png' },
];

type TemplateKey = 'modernNews' | 'templateA' | 'arclight';
type Step = 'template' | 'titles';

export function GenerateWebsiteModal({ domainId, onClose, onJobStarted, setGlobalLoading }: any) {
  const [step, setStep] = useState<Step>('template');
  const [contactFormEnabled, setContactFormEnabled] = useState(true);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<TemplateKey>('modernNews');
  const [enlargedTemplateKey, setEnlargedTemplateKey] = useState<TemplateKey | null>(null);

  // Step 2 state
  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
  const [selectedTitles, setSelectedTitles] = useState<Set<number>>(new Set());

  // Fetch titles mutation (called on "Next")
  const suggestMutation = useMutation({
    mutationFn: () => websitesAPI.suggestTitles(domainId),
    onSuccess: (res) => {
      setSuggestedTitles(res.data.titles);
      setSelectedTitles(new Set());
      setStep('titles');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to fetch title suggestions');
    },
  });

  // Generate website mutation (called on final "Generate Website")
  const generateMutation = useMutation({
    mutationFn: () =>
      websitesAPI.generate(
        domainId,
        selectedTemplateKey,
        contactFormEnabled,
        [...selectedTitles].map((i) => suggestedTitles[i]),
      ),
    onSuccess: (response) => {
      const newJobId = response.data.jobId;
      toast.success('Website generation started! 🚀');
      onJobStarted(newJobId);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to start generation');
    },
  });

  const toggleTitle = (idx: number) => {
    setSelectedTitles((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else if (next.size < 3) {
        next.add(idx);
      }
      return next;
    });
  };

  const isPending = suggestMutation.isPending || generateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-2 sm:p-4">
      <div className="bg-[#0a0a0a] border border-neutral-700 rounded-xl p-4 sm:p-6 max-w-3xl w-full shadow-2xl relative z-[61] max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">

        {/* ── Step 1: Template + Contact Form ─────────────────────────── */}
        {step === 'template' && (
          <>
            <div className="mb-4 sm:mb-5">
              <h2 className="text-xl sm:text-2xl font-light text-neutral-100 mb-1">Generate Website</h2>
              <p className="text-xs text-neutral-500">Step 1 of 2 — Choose your template</p>
            </div>

            <div className="mb-4 sm:mb-5">
              <p className="text-xs sm:text-sm font-semibold text-neutral-200 mb-3 sm:mb-4">Choose template</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {TEMPLATE_OPTIONS.map((opt) => (
                  <div
                    key={opt.key}
                    className={`relative rounded-lg border overflow-hidden transition-all duration-200 flex flex-col ${
                      selectedTemplateKey === opt.key
                        ? 'border-white ring-2 ring-white ring-offset-2 ring-offset-neutral-900'
                        : 'border-neutral-700 hover:border-neutral-600'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedTemplateKey(opt.key)}
                      disabled={isPending}
                      className="text-left disabled:opacity-60 disabled:cursor-not-allowed flex flex-col flex-1 min-w-0"
                    >
                      <div className="w-full h-36 sm:h-44 bg-neutral-800 flex-shrink-0 relative">
                        <img src={opt.image} alt={opt.label} className="w-full h-full object-cover object-top" />
                        {selectedTemplateKey === opt.key && (
                          <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center">
                            <CheckCircle size={12} className="text-black sm:w-[14px] sm:h-[14px]" />
                          </div>
                        )}
                      </div>
                      <div className="p-2.5 sm:p-3 bg-neutral-800 border-t border-neutral-700 flex-shrink-0 flex items-center justify-between gap-2">
                        <span className="text-xs sm:text-sm font-light text-neutral-100">{opt.label}</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEnlargedTemplateKey(opt.key); }}
                      disabled={isPending}
                      className="absolute bottom-10 sm:bottom-12 right-1.5 sm:right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 flex items-center justify-center transition-colors disabled:opacity-50"
                      title="Preview full size"
                    >
                      <Maximize2 size={14} className="text-neutral-300 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Enlarged preview */}
            {enlargedTemplateKey && (() => {
              const opt = TEMPLATE_OPTIONS.find((o) => o.key === enlargedTemplateKey);
              if (!opt) return null;
              return (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-4 bg-black/80" onClick={() => setEnlargedTemplateKey(null)}>
                  <div className="relative bg-[#0a0a0a] border border-neutral-700 rounded-xl overflow-hidden shadow-2xl max-w-5xl w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-neutral-700 bg-neutral-800">
                      <span className="font-light text-sm sm:text-base text-neutral-100">{opt.label}</span>
                      <button type="button" onClick={() => setEnlargedTemplateKey(null)} className="p-1.5 sm:p-2 rounded-lg hover:bg-neutral-700 transition-colors">
                        <X size={18} className="text-neutral-400 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                    <div className="p-2 sm:p-4 overflow-auto flex-1 min-h-0 bg-neutral-800">
                      <img src={opt.image} alt={opt.label} className="w-full h-auto max-h-[75vh] object-contain object-top rounded-lg" />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 border-t border-neutral-700 bg-[#0a0a0a]">
                      <button type="button" onClick={() => setEnlargedTemplateKey(null)} className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg border border-neutral-600 text-neutral-300 text-xs sm:text-sm font-light hover:bg-neutral-800">Back</button>
                      <button type="button" onClick={() => { setSelectedTemplateKey(opt.key); setEnlargedTemplateKey(null); }} className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg bg-white text-black text-xs sm:text-sm font-light hover:bg-neutral-200">Use this template</button>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
              <label className="flex items-start gap-2.5 sm:gap-3 cursor-pointer">
                <span className="relative inline-block w-10 sm:w-11 h-6 align-middle select-none transition duration-200 ease-in flex-shrink-0">
                  <input type="checkbox" checked={contactFormEnabled} onChange={(e) => setContactFormEnabled(e.target.checked)} disabled={isPending} className="absolute w-0 h-0 opacity-0 peer" />
                  <span className="block rounded-full bg-neutral-600 peer-checked:bg-white h-6 transition-colors duration-200" />
                  <span className="absolute left-0 top-0 h-6 w-6 bg-neutral-200 border border-neutral-500 rounded-full shadow-sm transition-transform duration-200 ease-in-out peer-checked:translate-x-[18px] sm:peer-checked:translate-x-5 peer-checked:bg-white peer-checked:border-neutral-400" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-light text-neutral-100 text-xs sm:text-sm mb-1">Enable Contact Form</p>
                  <p className="text-xs text-neutral-400">Allow visitors to contact you through your website</p>
                </div>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button onClick={onClose} disabled={isPending} className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-md text-xs sm:text-sm font-light border border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                Cancel
              </button>
              <button onClick={() => suggestMutation.mutate()} disabled={isPending} className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 bg-white hover:bg-neutral-200 text-black rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm font-light flex items-center justify-center gap-2 transition-colors">
                {suggestMutation.isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin sm:w-4 sm:h-4" />
                    Saving...
                  </>
                ) : (
                  'Next →'
                )}
              </button>
            </div>
          </>
        )}

        {/* ── Step 2: Pick 3 titles ────────────────────────────────────── */}
        {step === 'titles' && (
          <>
            <div className="mb-4 sm:mb-5">
              <button onClick={() => setStep('template')} disabled={isPending} className="flex items-center gap-1.5 text-neutral-400 hover:text-neutral-200 text-xs mb-3 transition-colors disabled:opacity-40">
                <ArrowLeft size={13} /> Back to template
              </button>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-light text-neutral-100 mb-1">Choose Your Articles</h2>
                  <p className="text-xs text-neutral-500">Step 2 of 2 — Select exactly 3 topics to generate blogs for</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTitles(new Set());
                    suggestMutation.mutate();
                  }}
                  disabled={isPending}
                  title="Regenerate title suggestions"
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-1"
                >
                  <RefreshCw size={13} className={suggestMutation.isPending ? 'animate-spin' : ''} />
                  Refresh
                </button>
              </div>
            </div>

            {/* Counter badge */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs sm:text-sm text-neutral-400">
                {selectedTitles.size} / 3 selected
              </p>
              {selectedTitles.size > 0 && (
                <button onClick={() => setSelectedTitles(new Set())} className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">
                  Clear all
                </button>
              )}
            </div>

            <div className="space-y-2 mb-5 sm:mb-6">
              {suggestedTitles.map((title, idx) => {
                const isSelected = selectedTitles.has(idx);
                const isDisabled = !isSelected && selectedTitles.size >= 3;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleTitle(idx)}
                    disabled={isDisabled || isPending}
                    className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-lg border transition-all duration-150 ${
                      isSelected
                        ? 'border-white bg-white/5'
                        : isDisabled
                        ? 'border-neutral-800 bg-neutral-900/30 opacity-40 cursor-not-allowed'
                        : 'border-neutral-700 bg-neutral-900 hover:border-neutral-500 hover:bg-neutral-800 cursor-pointer'
                    }`}
                  >
                    {/* Checkbox indicator */}
                    <span className={`flex-shrink-0 mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                      isSelected ? 'bg-white border-white' : 'border-neutral-600'
                    }`}>
                      {isSelected && (
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                          <path d="M1 3.5L3.5 6L8 1" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className={`text-xs sm:text-sm font-light leading-relaxed ${isSelected ? 'text-neutral-100' : 'text-neutral-300'}`}>
                      {title}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button onClick={() => setStep('template')} disabled={isPending} className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-md text-xs sm:text-sm font-light border border-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                Back
              </button>
              <button
                onClick={() => generateMutation.mutate()}
                disabled={selectedTitles.size !== 3 || isPending}
                className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 bg-white hover:bg-neutral-200 text-black rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm font-light flex items-center justify-center gap-2 transition-colors"
              >
                {generateMutation.isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin sm:w-4 sm:h-4" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} className="sm:w-4 sm:h-4" />
                    {selectedTitles.size === 3
                      ? 'Generate Website'
                      : `Select ${3 - selectedTitles.size} more`}
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
